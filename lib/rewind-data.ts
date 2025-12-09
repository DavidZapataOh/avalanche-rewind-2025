import type { AvalancheRewind, MonthlyActivity, TokenStats, NftStats, DefiHighlight, NftHighlight, BiggestDay, AggregatedNfts } from './types';
import { calculatePersona } from './persona';
import { resolveIpfsUrl } from './utils';

/**
 * Avalanche Data Client - REAL DATA ONLY
 * 
 * Fetches and aggregates on-chain data from the Glacier API (Avalanche Data API)
 * Documentation: https://glacier.docs.avacloud.io/
 * 
 * Required environment variables:
 * - GLACIER_API_KEY: Your API key from https://build.avax.network/console/utilities/data-api-keys
 */

const GLACIER_API_BASE = process.env.GLACIER_API_BASE_URL || 'https://glacier-api.avax.network';
const GLACIER_API_KEY = process.env.GLACIER_API_KEY;

// Avalanche C-Chain ID
const AVALANCHE_CHAIN_ID = '43114';

// Current AVAX price - fetch from API in production
const AVAX_USD_PRICE = 50;

/**
 * Parse timestamp from various formats (number, string, ISO date)
 */
function parseTimestamp(timestamp: unknown): Date {
  if (!timestamp) return new Date(0);
  
  // If it's already a number (Unix timestamp in seconds)
  if (typeof timestamp === 'number') {
    // Check if it's in milliseconds or seconds
    if (timestamp > 1e12) {
      return new Date(timestamp); // Already in ms
    }
    return new Date(timestamp * 1000); // Convert from seconds
  }
  
  // If it's a string
  if (typeof timestamp === 'string') {
    // Try parsing as ISO date first
    const isoDate = new Date(timestamp);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    // Try parsing as Unix timestamp string
    const numericTimestamp = parseInt(timestamp, 10);
    if (!isNaN(numericTimestamp)) {
      if (numericTimestamp > 1e12) {
        return new Date(numericTimestamp);
      }
      return new Date(numericTimestamp * 1000);
    }
  }
  
  console.warn('[Glacier] Invalid timestamp:', timestamp);
  return new Date(0);
}

// Interfaces matching Glacier API response structures
interface GlacierTransaction {
  txHash: string;
  blockNumber: string;
  blockTimestamp: number | string; // Can be number or ISO string
  from: { address: string };
  to: { address: string };
  value: string;
  gasUsed: string;
  gasPrice: string;
  txType?: string;
  txStatus?: string;
}

interface GlacierErc20Transfer {
  txHash: string;
  blockTimestamp: number;
  from: { address: string };
  to: { address: string };
  erc20Token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoUri?: string;
    price?: { value: number };
  };
  value: string;
}

interface GlacierNftTransfer {
  txHash: string;
  blockTimestamp: number;
  from: { address: string };
  to: { address: string };
  erc721Token?: {
    address: string;
    name: string;
    symbol: string;
    tokenId: string;
    tokenUri?: string;
    metadata?: {
      imageUri?: string;
    };
  };
  erc1155Token?: {
    address: string;
    name: string;
    symbol: string;
    tokenId: string;
    value: string;
  };
}

// Flexible response interface to handle various Glacier API response formats
interface GlacierListResponse<T> {
  // Different possible array keys in responses
  transactions?: T[];
  transfers?: T[];
  erc20Transfers?: T[];
  erc721Transfers?: T[];
  erc1155Transfers?: T[];
  nativeTransactions?: T[];
  nextPageToken?: string;
}

/**
 * Extract array from response regardless of key name
 */
function extractArrayFromResponse<T>(response: GlacierListResponse<T>): T[] {
  return response.transactions ||
         response.transfers ||
         response.erc20Transfers ||
         response.erc721Transfers ||
         response.erc1155Transfers ||
         response.nativeTransactions ||
         [];
}

/**
 * Make authenticated request to Glacier API
 */
async function glacierFetch<T>(endpoint: string): Promise<T> {
  if (!GLACIER_API_KEY) {
    throw new Error('GLACIER_API_KEY is required. Get one at https://build.avax.network/console/utilities/data-api-keys');
  }

  const url = `${GLACIER_API_BASE}${endpoint}`;
  console.log(`[Glacier] Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'x-glacier-api-key': GLACIER_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Glacier] Error ${response.status}: ${errorText}`);
    throw new Error(`Glacier API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// STRICT DATE BOUNDARIES
// Filter strictly from Jan 1 2025 to Dec 7 2025 (as requested by user) or Dec 31
const STRICT_START = Math.floor(new Date('2025-01-01T00:00:00Z').getTime() / 1000);
const STRICT_END = Math.floor(new Date('2025-12-10T23:59:59Z').getTime() / 1000); // Slightly buffered to Dec 10 to include Dec 7 fully

function isWithinRow(timestamp: number | string): boolean {
    const ts = typeof timestamp === 'string' ? parseTimestamp(timestamp).getTime() / 1000 : timestamp;
    return ts >= STRICT_START && ts <= STRICT_END;
}

/**
 * Fetch all transactions for an address in 2025
 */
async function fetchTransactions(address: string): Promise<GlacierTransaction[]> {
  const allTransactions: GlacierTransaction[] = [];
  let pageToken: string | undefined;
  
  do {
    const params = new URLSearchParams({
      startTimestamp: STRICT_START.toString(),
      endTimestamp: STRICT_END.toString(),
      pageSize: '100',
      sortOrder: 'asc',
    });
    
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await glacierFetch<GlacierListResponse<GlacierTransaction>>(
      `/v1/chains/${AVALANCHE_CHAIN_ID}/addresses/${address}/transactions?${params}`
    );
    
    const items = extractArrayFromResponse(response);
    if (items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validItems = items.map((item: any) => {
        return item.nativeTransaction ? item.nativeTransaction : item;
      }).filter(tx => isWithinRow(tx.blockTimestamp));
      
      allTransactions.push(...validItems);
    }
    
    pageToken = response.nextPageToken;
  } while (pageToken && allTransactions.length < 10000);

  console.log(`[Glacier] Found ${allTransactions.length} transactions for ${address} (2025 Only)`);
  return allTransactions;
}

/**
 * Fetch ERC-20 token transfers for an address in 2025
 */
async function fetchErc20Transfers(address: string): Promise<GlacierErc20Transfer[]> {
  const allTransfers: GlacierErc20Transfer[] = [];
  let pageToken: string | undefined;
  
  do {
    const params = new URLSearchParams({
      startTimestamp: STRICT_START.toString(),
      endTimestamp: STRICT_END.toString(),
      pageSize: '100',
      sortOrder: 'asc',
    });
    
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await glacierFetch<GlacierListResponse<GlacierErc20Transfer>>(
      `/v1/chains/${AVALANCHE_CHAIN_ID}/addresses/${address}/transactions:listErc20?${params}`
    );

    const items = extractArrayFromResponse(response);
    if (items.length > 0) {
      const validItems = items.filter(tx => isWithinRow(tx.blockTimestamp));
      allTransfers.push(...validItems);
    }
    
    pageToken = response.nextPageToken;
  } while (pageToken && allTransfers.length < 5000);

  console.log(`[Glacier] Found ${allTransfers.length} ERC-20 transfers for ${address} (2025 Only)`);
  return allTransfers;
}

/**
 * Fetch NFT transfers (ERC-721/ERC-1155) for an address in 2025
 */
async function fetchNftTransfers(address: string): Promise<GlacierNftTransfer[]> {
  const allTransfers: GlacierNftTransfer[] = [];
  let pageToken: string | undefined;
  
  do {
    const params = new URLSearchParams({
      startTimestamp: STRICT_START.toString(),
      endTimestamp: STRICT_END.toString(),
      pageSize: '100',
      sortOrder: 'asc',
    });
    
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    try {
      const response = await glacierFetch<GlacierListResponse<GlacierNftTransfer>>(
        `/v1/chains/${AVALANCHE_CHAIN_ID}/addresses/${address}/transactions:listErc721?${params}`
      );
      
      const items = extractArrayFromResponse(response);
      if (items.length > 0) {
        const validItems = items.filter(tx => isWithinRow(tx.blockTimestamp));
        allTransfers.push(...validItems);
      }
      
      pageToken = response.nextPageToken;
    } catch {
      console.warn('[Glacier] ERC-721 transfers endpoint not available');
      break;
    }
  } while (pageToken && allTransfers.length < 2000);

  console.log(`[Glacier] Found ${allTransfers.length} NFT transfers for ${address} (2025 Only)`);
  return allTransfers;
}

/**
 * Calculate activity metrics from transactions
 */
function calculateActivityMetrics(transactions: GlacierTransaction[]): {
  activeDays: number;
  longestStreakDays: number;
  biggestDay: BiggestDay | null;
  mostActiveMonths: MonthlyActivity[];
  dailyActivity: { date: string; count: number; level: number }[];
  firstTxDate?: string;
  lastTxDate?: string;
} {
  if (transactions.length === 0) {
    return {
      activeDays: 0,
      longestStreakDays: 0,
      biggestDay: null,
      mostActiveMonths: [],
      dailyActivity: [], // Empty for no transactions
    };
  }

  const txByDate = new Map<string, { count: number; volume: number }>();
  const txByMonth = new Map<number, { count: number; volume: number }>();

  let firstDate = parseTimestamp(transactions[0].blockTimestamp);
  let lastDate = parseTimestamp(transactions[0].blockTimestamp);

  for (const tx of transactions) {
    const date = parseTimestamp(tx.blockTimestamp);
    
    // Skip invalid dates
    if (date.getTime() === 0) continue;
    
    const dateKey = date.toISOString().split('T')[0];
    const month = date.getMonth() + 1;
    const valueInAVAX = parseFloat(tx.value || '0') / 1e18;
    const valueInUSD = valueInAVAX * AVAX_USD_PRICE;

    // Track by date
    const existing = txByDate.get(dateKey) || { count: 0, volume: 0 };
    txByDate.set(dateKey, {
      count: existing.count + 1,
      volume: existing.volume + valueInUSD,
    });

    // Track by month
    const monthData = txByMonth.get(month) || { count: 0, volume: 0 };
    txByMonth.set(month, {
      count: monthData.count + 1,
      volume: monthData.volume + valueInUSD,
    });

    if (date < firstDate) firstDate = date;
    if (date > lastDate) lastDate = date;
  }

  const activeDays = txByDate.size;

  // Calculate longest streak
  const sortedDates = Array.from(txByDate.keys()).sort();
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // Find biggest day
  let biggestDay: BiggestDay | null = null;
  for (const [date, data] of txByDate.entries()) {
    if (!biggestDay || data.count > biggestDay.txCount) {
      biggestDay = {
        date,
        txCount: data.count,
        volumeUSD: data.volume,
      };
    }
  }

  // Format monthly activity
  const mostActiveMonths: MonthlyActivity[] = Array.from({ length: 12 }, (_, i) => {
    const monthData = txByMonth.get(i + 1) || { count: 0, volume: 0 };
    return {
      month: i + 1,
      txCount: monthData.count,
      volumeUSD: monthData.volume,
    };
  });

  // Format daily activity for Heatmap
  // Level mapping (GitHub style): 0=None, 1=Low, 2=Med, 3=High, 4=Max
  // We'll approximate: 0=0, 1=1-2, 2=3-5, 3=6-10, 4=11+
  
  // Initialize full year with 0
  const fullYearMap = new Map<string, { count: number; level: number }>();
  const start = new Date('2025-01-01');
  const end = new Date('2025-12-31');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      fullYearMap.set(d.toISOString().split('T')[0], { count: 0, level: 0 });
  }

  // Overlay actual data
  for (const [date, data] of txByDate.entries()) {
      let level = 0;
      if (data.count === 0) level = 0;
      else if (data.count <= 2) level = 1;
      else if (data.count <= 5) level = 2;
      else if (data.count <= 10) level = 3;
      else level = 4;
      
      fullYearMap.set(date, { count: data.count, level });
  }

  const dailyActivity = Array.from(fullYearMap.entries())
    .map(([date, val]) => ({ date, count: val.count, level: val.level }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    activeDays,
    longestStreakDays: longestStreak,
    biggestDay,
    mostActiveMonths,
    dailyActivity,
    firstTxDate: firstDate.toISOString(),
    lastTxDate: lastDate.toISOString(),
  };
}

/**
 * Aggregate token statistics from ERC-20 transfers
 */
function aggregateTokenStats(transfers: GlacierErc20Transfer[]): TokenStats[] {
  const tokenMap = new Map<string, TokenStats>();

  for (const transfer of transfers) {
    const token = transfer.erc20Token;
    const existing = tokenMap.get(token.address) || {
      symbol: token.symbol || 'UNKNOWN',
      address: token.address,
      logoURI: token.logoUri,
      txCount: 0,
      volumeUSD: 0,
    };

    const amount = parseFloat(transfer.value) / Math.pow(10, token.decimals || 18);
    const price = token.price?.value || 1;

    existing.txCount++;
    existing.volumeUSD += amount * price;
    tokenMap.set(token.address, existing);
  }

  return Array.from(tokenMap.values())
    .sort((a, b) => b.volumeUSD - a.volumeUSD)
    .slice(0, 10);
}

/**
 * Aggregate NFT statistics
 */
/**
 * Aggregate NFT statistics
 * Converted to async to allow fetching missing metadata from tokenURIs
 */
async function aggregateNftStats(transfers: GlacierNftTransfer[], userAddress: string): Promise<AggregatedNfts> {
  const collectionMap = new Map<string, NftStats>();
  
  // Track ownership: "collection:tokenId" -> balance
  const ownershipMap = new Map<string, number>();
  // Track detailed history per collection for status determination
  const collectionHistory = new Map<string, { received: number; sent: number; burned: number }>();
  
  // Track missing metadata: "collectionAddress" -> tokenUri to fetch
  const missingMetadataMap = new Map<string, string>();

  const normalizedUser = userAddress.toLowerCase();
  const BURN_ADDRESSES = [
      '0x0000000000000000000000000000000000000000',
      '0x000000000000000000000000000000000000dead'
  ];

  for (const transfer of transfers) {
    const nft = transfer.erc721Token || transfer.erc1155Token;
    if (!nft) continue;

    const nftKey = `${nft.address}:${nft.tokenId}`;
    const from = transfer.from.address.toLowerCase();
    const to = transfer.to.address.toLowerCase();
    
    // Determine amount (ERC1155 has value, ERC721 implies 1)
    let amount = 1;
    if (transfer.erc1155Token) {
        amount = parseInt(transfer.erc1155Token.value || '1', 10);
    }
    if (isNaN(amount) || amount <= 0) amount = 1;

    // Update balances and history
    const history = collectionHistory.get(nft.address) || { received: 0, sent: 0, burned: 0 };
    const currentBal = ownershipMap.get(nftKey) || 0;

    if (to === normalizedUser) {
        // RECEIVED
        ownershipMap.set(nftKey, currentBal + amount);
        history.received += amount;
    } else if (from === normalizedUser) {
        // SENT or BURNED
        ownershipMap.set(nftKey, Math.max(0, currentBal - amount));
        
        if (BURN_ADDRESSES.includes(to)) {
            history.burned += amount;
        } else {
            history.sent += amount;
        }
    }
    collectionHistory.set(nft.address, history);

    // Collection Metadata extraction strategy:
    // 1. Glacier Metadata (Best)
    let candidateUri = (nft as any).metadata?.imageUri || (nft as any).metadata?.image;
    
    // 2. Fallback: Check if tokenUri ITSELF is the image (common for simple NFTs)
    if (!candidateUri && (nft as any).tokenUri) {
        const tUri = (nft as any).tokenUri.toLowerCase();
        const isIpfs = tUri.startsWith('ipfs://') || tUri.includes('/ipfs/');
        const hasImgExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm'].some(ext => tUri.endsWith(ext));
        
        // Only use tokenUri as direct image if it looks like one.
        // If it's likely a JSON metadata link, we SKIP it here and mark for fetching.
        if (isIpfs || hasImgExt) {
            candidateUri = (nft as any).tokenUri;
        } else if (!tUri.endsWith('.json') && !candidateUri) {
             // If uncertain (no ext, no metadata), we might want to fetch it.
        }
    }

    const resolvedImage = resolveIpfsUrl(candidateUri);

    const existing = collectionMap.get(nft.address) || {
      collectionName: nft.name || 'Unknown Collection',
      collectionAddress: nft.address,
      logoURI: resolvedImage, 
      nftCount: 0,
      txCount: 0,
      status: 'HELD', // Default, will refine
    };

    // If we found a better logo uri (non-empty), update it
    if (!existing.logoURI && resolvedImage) {
        existing.logoURI = resolvedImage;
    } 
    // If we STILL don't have an image, and we have a tokenUri, mark for fetching
    else if (!existing.logoURI && !resolvedImage && (nft as any).tokenUri) {
        // Only queue one valid tokenUri per collection to avoid spamming
        if (!missingMetadataMap.has(nft.address)) {
            missingMetadataMap.set(nft.address, (nft as any).tokenUri);
        }
    }

    existing.txCount++;
    collectionMap.set(nft.address, existing);
  }

  // --- Async Metadata Fetching Phase ---
  // For collections with NO image, try to fetch the tokenUri JSON manually
  const fetchPromises = Array.from(missingMetadataMap.entries()).map(async ([address, tokenUri]) => {
      try {
          // Resolve IPFS uri for fetching
          const fetchUrl = resolveIpfsUrl(tokenUri);
          if (!fetchUrl) return;

          console.log(`[Rewind] Fetching missing metadata for ${address}: ${fetchUrl}`);
          
          // Timeout significantly to avoid blocking render
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s max

          const res = await fetch(fetchUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
              const contentType = res.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                  const json = await res.json();
                  const foundImage = json.image || json.image_url || json.imageUrl; // Standard fields
                  if (foundImage) {
                      const resolvedFound = resolveIpfsUrl(foundImage);
                      if (resolvedFound) {
                          const collection = collectionMap.get(address);
                          if (collection) {
                              collection.logoURI = resolvedFound;
                              collectionMap.set(address, collection); // In-place update works due to ref, but being explicit
                          }
                      }
                  }
              }
          }
      } catch (err) {
          console.warn(`[Rewind] Failed to fetch metadata for ${address}:`, err);
      }
  });

  // Wait for all fetches to complete (or fail)
  if (fetchPromises.length > 0) {
      await Promise.all(fetchPromises);
  }


  // Recalculate status and held count per collection
  for (const [address, collection] of collectionMap.entries()) {
      const history = collectionHistory.get(address);
      if (!history) continue;

      // Net balance is approximate for 2025 window (assuming start=0)
      // For accurate status:
      // If Received > (Sent + Burned), assume HELD.
      // If Sent > 0 and Balance <= 0, assume SOLD.
      // If Burned > 0 and Balance <= 0, assume BURNED.
      
      const netBalance = history.received - (history.sent + history.burned);
      collection.nftCount = Math.max(0, netBalance);

      if (collection.nftCount > 0) {
          collection.status = 'HELD';
      } else if (history.burned > 0) {
          collection.status = 'BURNED';
      } else {
          collection.status = 'SOLD';
      }
  }

  const collections = Array.from(collectionMap.values())
    .sort((a, b) => b.txCount - a.txCount)
    .slice(0, 10);

  return {
    totalNfts: ownershipMap.size,
    totalTxCount: transfers.length,
    collections,
  };
}

/**
 * Known DeFi protocols on Avalanche
 */
const DEFI_PROTOCOLS: Record<string, string> = {
  // DEX Routers
  '0x60ae616a2155ee3d9a68541ba4544862310933d4': 'Trader Joe',
  '0x18556DA13313f3532c54711497A8FedAC273220E': 'Trader Joe v2.1',
  '0xe54ca86531e17ef3616d22ca28b0d458b6c89106': 'Pangolin',
  '0xE3Ffc583dc176575eEA7FD9dF2A7c65F7E23f4C3': 'Uniswap',
  '0x1b02dA8Cb0d0981bA75fED474Be186e30b310Db7': 'SushiSwap',
  '0x13aD51a666Db6135cd529F1CDB3a2685c28e2c70': '1inch',
  '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch V5',

  // Lending
  '0x5c0401e81bc07ca70fad469b451682c0d747ef1c': 'Benqi',
  '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4': 'Benqi',
  '0x794a61358d6845594f94dc1db02a252b5b4814ad': 'Aave V3',
  '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F587948': 'Aave V2',

  // Perps
  '0x5f719c2F1095F7B9fc68a68e35b51194f4b6abe8': 'GMX',
  '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064': 'GMX',

  // Tokens
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': 'WAVAX',
  '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7': 'USDT',
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': 'USDC',
  '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd': 'JOE Token',
  '0x152b9d0fdc40c096757f570a51e494bd4b943e50': 'GMX Token',
  '0x2b2c81e08f1Af8835a78Bb2A90AE924ACE0eA4bE': 'sAVAX',
  '0xb599c3590f42f8f995ecfa0f85d2980b76862fc1': 'USDbC',
};

/**
 * Extract DeFi highlights from transactions
 */
function extractDefiHighlights(transactions: GlacierTransaction[]): DefiHighlight[] {
  const protocolCounts = new Map<string, { protocolName: string; txCount: number; volumeUSD: number }>();

  for (const tx of transactions) {
    const toAddress = tx.to?.address?.toLowerCase();
    if (!toAddress) continue;

    const protocolName = DEFI_PROTOCOLS[toAddress];
    if (protocolName) {
      const existing = protocolCounts.get(toAddress) || {
        protocolName,
        txCount: 0,
        volumeUSD: 0,
      };
      
      const valueInAVAX = parseFloat(tx.value) / 1e18;
      existing.txCount++;
      existing.volumeUSD += valueInAVAX * AVAX_USD_PRICE;
      protocolCounts.set(toAddress, existing);
    }
  }

  return Array.from(protocolCounts.entries())
    .map(([address, data]) => ({
      protocolName: data.protocolName,
      contractAddress: address,
      volumeUSD: data.volumeUSD,
      txCount: data.txCount,
    }))
    .sort((a, b) => b.txCount - a.txCount)
    .slice(0, 5);
}

/**
 * Main function to fetch and compute user's 2025 Rewind data
 * 
 * @param address - The Ethereum address to analyze
 * @returns Complete AvalancheRewind data object
 */
export async function getUserRewindData(
  address: string,
  year: number = 2025
): Promise<AvalancheRewind> {
  console.log(`[Rewind] Fetching data for ${address} - Year: ${year}`);

  if (!GLACIER_API_KEY) {
    throw new Error('GLACIER_API_KEY environment variable is required. No demo data available.');
  }

  // Fetch all data in parallel
  const [transactions, erc20Transfers, nftTransfers] = await Promise.all([
    fetchTransactions(address),
    fetchErc20Transfers(address),
    fetchNftTransfers(address),
  ]);

  // Calculate metrics
  const activityMetrics = calculateActivityMetrics(transactions);
  const tokens = aggregateTokenStats(erc20Transfers);
  const nfts = await aggregateNftStats(nftTransfers, address);
  const defiHighlights = extractDefiHighlights(transactions);

  // Calculate totals
  let totalVolumeAVAX = 0;
  let totalGasAVAX = 0;

  for (const tx of transactions) {
    const value = parseFloat(tx.value) / 1e18;
    totalVolumeAVAX += value;

    const gasUsed = BigInt(tx.gasUsed || '0');
    const gasPrice = BigInt(tx.gasPrice || '0');
    const gasCost = Number(gasUsed * gasPrice) / 1e18;
    totalGasAVAX += gasCost;
  }

  // Build contract interactions for persona calculation
  const contractInteractions: { address: string; count: number }[] = [];
  const contractCounts = new Map<string, number>();
  
  for (const tx of transactions) {
    const toAddress = tx.to?.address?.toLowerCase();
    if (toAddress) {
      contractCounts.set(toAddress, (contractCounts.get(toAddress) || 0) + 1);
    }
  }
  
  for (const [addr, count] of contractCounts.entries()) {
    contractInteractions.push({ address: addr, count });
  }

  // Build partial data for persona
  const partialData = {
    address,
    year,
    totalTransactions: transactions.length,
    activeDays: activityMetrics.activeDays,
    longestStreakDays: activityMetrics.longestStreakDays,
    totalVolumeUSD: totalVolumeAVAX * AVAX_USD_PRICE,
    totalVolumeAVAX,
    totalGasSpentAVAX: totalGasAVAX,
    totalGasSpentUSD: totalGasAVAX * AVAX_USD_PRICE,
    tokens,
    nfts,
    defiHighlights,
  };

  const persona = calculatePersona(partialData, contractInteractions);

  // Build NFT highlights
  const nftHighlights: NftHighlight[] = nfts.collections.slice(0, 3).map(n => ({
    collectionName: n.collectionName,
    mostValuableNFT: undefined,
  }));

  const result: AvalancheRewind = {
    address,
    year,
    totalTransactions: transactions.length,
    activeDays: activityMetrics.activeDays,
    longestStreakDays: activityMetrics.longestStreakDays,
    totalVolumeUSD: totalVolumeAVAX * AVAX_USD_PRICE,
    totalVolumeAVAX,
    totalGasSpentAVAX: totalGasAVAX,
    totalGasSpentUSD: totalGasAVAX * AVAX_USD_PRICE,
    mostActiveMonths: activityMetrics.mostActiveMonths,
    dailyActivity: activityMetrics.dailyActivity,
    tokens,
    nfts,
    firstTxDate: activityMetrics.firstTxDate,
    lastTxDate: activityMetrics.lastTxDate,
    persona,
    defiHighlights,
    nftHighlights,
    biggestDay: activityMetrics.biggestDay,
    isDemoData: false,
  };

  console.log(`[Rewind] Complete! ${result.totalTransactions} transactions, ${result.activeDays} active days`);
  
  return result;
}
