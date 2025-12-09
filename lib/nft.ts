/**
 * NFT Minting Utilities for Avalanche Rewind
 * 
 * Flow:
 * 1. Generate rewind card image via /api/generate-image
 * 2. Upload image to IPFS via Pinata
 * 3. Generate metadata JSON with image IPFS URL
 * 4. Upload metadata to IPFS via Pinata
 * 5. Call smart contract mint function with metadata URI
 */

import { createWalletClientFromProvider, avalanche } from './viem';
import { formatUSD } from './utils';
import type { AvalancheRewind, RewindNFTMetadata } from './types';

// Contract configuration - Update after deployment
const REWIND_NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REWIND_NFT_CONTRACT_ADDRESS as `0x${string}` | undefined;

// Minimal ABI for the mint function - 2025 only, no year param
const REWIND_NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    name: 'canMint',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'wallet', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

/**
 * Check if NFT minting is available (contract is configured)
 */
export function isMintingAvailable(): boolean {
  return Boolean(REWIND_NFT_CONTRACT_ADDRESS && REWIND_NFT_CONTRACT_ADDRESS !== '0x...');
}

/**
 * Generate the URL for the rewind card image
 */
export function generateImageUrl(rewind: AvalancheRewind, baseUrl: string): string {
  const params = new URLSearchParams({
    address: rewind.address,
    year: rewind.year.toString(),
    persona: rewind.persona.label,
    emoji: rewind.persona.emoji,
    transactions: rewind.totalTransactions.toString(),
    volume: formatUSD(rewind.totalVolumeUSD),
    nfts: rewind.nfts.totalNfts.toString(),
    activeDays: rewind.activeDays.toString(),
  });

  return `${baseUrl}/api/generate-image?${params.toString()}`;
}

/**
 * Generate NFT metadata following OpenSea/ERC-721 standards
 */
export function generateNftMetadata(
  rewind: AvalancheRewind,
  imageIpfsUrl: string
): RewindNFTMetadata {
  return {
    name: `Avalanche Rewind ${rewind.year} - ${rewind.persona.label}`,
    description: `${rewind.persona.description}\n\nThis Soulbound Token commemorates the on-chain journey of ${rewind.address} on Avalanche during ${rewind.year}.`,
    image: imageIpfsUrl,
    external_url: `https://avalanche-rewind.xyz/share/${rewind.address}/${rewind.year}`,
    attributes: [
      {
        trait_type: 'Year',
        value: rewind.year.toString(),
      },
      {
        trait_type: 'Persona',
        value: rewind.persona.label,
      },
      {
        trait_type: 'Persona Emoji',
        value: rewind.persona.emoji,
      },
      {
        trait_type: 'Total Transactions',
        value: rewind.totalTransactions,
        display_type: 'number',
      },
      {
        trait_type: 'Active Days',
        value: rewind.activeDays,
        display_type: 'number',
      },
      {
        trait_type: 'Longest Streak',
        value: rewind.longestStreakDays,
        display_type: 'number',
      },
      {
        trait_type: 'Total Volume (USD)',
        value: Math.round(rewind.totalVolumeUSD),
        display_type: 'number',
      },
      {
        trait_type: 'NFTs Collected',
        value: rewind.nfts.totalNfts,
        display_type: 'number',
      },
      {
        trait_type: 'Token Type',
        value: 'Soulbound',
      },
      {
        trait_type: 'Network',
        value: 'Avalanche C-Chain',
      },
    ],
  };
}

interface MintParams {
  provider: unknown;
  address: `0x${string}`;
  rewind: AvalancheRewind;
}

interface MintResult {
  success: boolean;
  txHash?: string;
  tokenId?: string;
  error?: string;
}

/**
 * Complete NFT minting flow:
 * 1. Generate image
 * 2. Upload image to IPFS
 * 3. Generate metadata
 * 4. Upload metadata to IPFS
 * 5. Mint NFT
 */
export async function mintRewindNft({
  provider,
  address,
  rewind,
}: MintParams): Promise<MintResult> {
  try {
    if (!isMintingAvailable()) {
      return {
        success: false,
        error: 'NFT contract not configured. Please set NEXT_PUBLIC_REWIND_NFT_CONTRACT_ADDRESS.',
      };
    }

    // Step 1: Call the upload-metadata API which handles the complete flow
    const response = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewind }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to prepare NFT metadata',
      };
    }

    const { metadataUri } = await response.json();

    // Step 2: Create wallet client with account and mint
    const { createWalletClientWithAccount } = await import('./viem');
    const walletClient = createWalletClientWithAccount(provider, address);

    // Step 3: Call the mint function (2025 only - no year param)
    const txHash = await walletClient.writeContract({
      chain: avalanche,
      account: address,
      address: REWIND_NFT_CONTRACT_ADDRESS!,
      abi: REWIND_NFT_ABI,
      functionName: 'mint',
      args: [address, metadataUri],
    });

    return {
      success: true,
      txHash,
    };
  } catch (error) {
    console.error('Mint error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('AlreadyMintedForYear')) {
        return {
          success: false,
          error: `You've already minted your ${rewind.year} Rewind!`,
        };
      }
      if (error.message.includes('SoulboundTokenCannotBeTransferred')) {
        return {
          success: false,
          error: 'This is a Soulbound Token and cannot be transferred.',
        };
      }
      if (error.message.includes('User rejected')) {
        return {
          success: false,
          error: 'Transaction was cancelled.',
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred while minting.',
    };
  }
}

/**
 * Check if user can mint (2025 only)
 */
export async function canUserMint(
  address: `0x${string}`
): Promise<boolean> {
  if (!isMintingAvailable()) return false;

  try {
    const { publicClient } = await import('./viem');
    
    const canMint = await publicClient.readContract({
      address: REWIND_NFT_CONTRACT_ADDRESS!,
      abi: REWIND_NFT_ABI,
      functionName: 'canMint',
      args: [address],
    });

    return canMint;
  } catch (error) {
    console.error('Error checking mint eligibility:', error);
    return false;
  }
}
