// Avalanche Rewind Types
// Strongly-typed interfaces for the entire rewind data schema

export interface MonthlyActivity {
  month: number; // 1-12
  txCount: number;
  volumeUSD: number;
}

export interface TokenStats {
  symbol: string;
  address: string;
  logoURI?: string;
  txCount: number;
  volumeUSD: number;
  volumeAVAX?: number;
}

export interface NftStats {
  collectionName: string;
  collectionAddress: string;
  logoURI?: string;
  nftCount: number; // distinct tokens
  txCount: number;  // buys/sells/transfers
  status: 'HELD' | 'SOLD' | 'BURNED';
}

export interface DefiHighlight {
  protocolName: string;
  contractAddress: string;
  volumeUSD: number;
  txCount: number;
}

export interface NftHighlight {
  collectionName: string;
  mostValuableNFT?: {
    tokenId: string;
    estimatedValueUSD?: number;
  };
}

export interface PersonaScoreBreakdown {
  builderScore: number;
  defiScore: number;
  nftScore: number;
  degenScore: number;
  bridgerScore: number;
}

export interface Persona {
  id: string;
  label: string;
  emoji: string;
  description: string;
  scoreBreakdown: PersonaScoreBreakdown;
}

export interface BiggestDay {
  date: string;
  txCount: number;
  volumeUSD: number;
}

export interface L1Activity {
  l1Name: string; // e.g. "C-Chain", other Avalanche L1s
  txCount: number;
}
export interface AggregatedNfts {
  totalNfts: number;
  totalTxCount: number;
  collections: NftStats[];
}

export interface AvalancheRewind {
  address: string;
  year: number;
  totalTransactions: number;
  activeDays: number;
  longestStreakDays: number;
  totalVolumeUSD: number;
  totalVolumeAVAX: number;
  totalGasSpentAVAX: number;
  totalGasSpentUSD: number;
  mostActiveMonths: MonthlyActivity[];
  dailyActivity: { date: string; count: number; level: number }[];
  tokens: TokenStats[];
  nfts: AggregatedNfts;
  firstTxDate?: string;
  lastTxDate?: string;
  persona: Persona;
  defiHighlights: DefiHighlight[];
  nftHighlights: NftHighlight[];
  biggestDay: BiggestDay | null;
  mostUsedL1s?: L1Activity[];
  isDemoData?: boolean;
}

// Persona type definitions for the fun, descriptive categorizations
export type PersonaId = 
  | 'summit-builder'
  | 'defi-trailblazer'
  | 'nft-peaks-explorer'
  | 'high-altitude-degen'
  | 'cross-chain-bridger'
  | 'avalanche-veteran'
  | 'casual-explorer';

export const PERSONA_DEFINITIONS: Record<PersonaId, { label: string; emoji: string; description: string }> = {
  'summit-builder': {
    label: 'Summit Builder',
    emoji: '🏗️',
    description: 'You deploy contracts and build on Avalanche. The ecosystem grows thanks to builders like you!'
  },
  'defi-trailblazer': {
    label: 'DeFi Trailblazer',
    emoji: '📈',
    description: 'Swaps, lending, liquidity pools — you navigate DeFi like a seasoned explorer blazing new trails.'
  },
  'nft-peaks-explorer': {
    label: 'NFT Peaks Explorer',
    emoji: '🎨',
    description: 'From rare collectibles to digital art, you scale the NFT peaks collecting treasures along the way.'
  },
  'high-altitude-degen': {
    label: 'High-Altitude Degen',
    emoji: '🎲',
    description: 'High activity, fast moves, and no fear! You live for the thrill of on-chain action.'
  },
  'cross-chain-bridger': {
    label: 'Cross-Chain Bridger',
    emoji: '🌉',
    description: 'Bridges are your highways. You connect worlds and move assets across chains with ease.'
  },
  'avalanche-veteran': {
    label: 'Avalanche Veteran',
    emoji: '🏔️',
    description: 'A true OG! You\'ve been here since the early days, weathering every storm on the mountain.'
  },
  'casual-explorer': {
    label: 'Casual Explorer',
    emoji: '🚶',
    description: 'Taking it easy on the slopes. Every journey starts with a single step — keep exploring!'
  }
};

// Slide types for the Wrapped experience
export type SlideType = 
  | 'intro'
  | 'persona'
  | 'activity'
  | 'tokens'
  | 'nfts'
  | 'defi'
  | 'gas-volume'
  | 'biggest-day'
  | 'summary';

export interface SlideConfig {
  type: SlideType;
  title: string;
  shouldShow: (data: AvalancheRewind) => boolean;
}

// NFT Metadata for minting (OpenSea standard)
export interface NftAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'date' | 'boost_number' | 'boost_percentage';
}

export interface RewindNFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: NftAttribute[];
}
