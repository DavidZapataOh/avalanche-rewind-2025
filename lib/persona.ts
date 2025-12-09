import type { AvalancheRewind, PersonaScoreBreakdown, Persona, PersonaId } from './types';
import { PERSONA_DEFINITIONS } from './types';

/**
 * Persona Scoring Logic
 * 
 * Analyzes on-chain behavior to determine a user's "persona" based on:
 * - Transaction types and volumes
 * - DeFi vs NFT activity ratios
 * - Contract deployment activity
 * - Bridge usage
 * - Activity frequency and streaks
 */

// Known bridge contract addresses on Avalanche C-Chain
const BRIDGE_CONTRACTS = new Set([
  '0x8eb8a3b98659cce290402893d0123abb75e3ab28', // Avalanche Bridge
  '0x50Ff3B278fCC70ec7A9465063d68029AB460eA04', // Synapse Bridge
  '0xef4b763385838fff3e79b3e9da2d0bb3f6d3bd68', // Celer cBridge
  '0x4f4495243837681061C4743b74B3eEdf548D56A5', // Axelar Gateway
  '0x965B104e250648d01d4B3b72BaC751Cde809D29E', // LayerZero Endpoint
  '0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c', // Wormhole Token Bridge
  '0x0e082F06FFdb6d13AA955dd6cde5285fc57eB408', // Wormhole Core
  '0x9d1B1669c73b033DFe47ae5a0164Ab96df25B944', // Stargate Token Bridge
  '0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4', // Celer cBridge V2
  '0x152b9d0fdc40c096757f570a51e494bd4b943e50', // BTC.b Token (Bridged)
].map(addr => addr.toLowerCase()));

// Known DeFi protocol contract addresses
const DEFI_CONTRACTS = new Set([
  // DEX Routers
  '0x60ae616a2155ee3d9a68541ba4544862310933d4', // Trader Joe Router v2.0
  '0x18556DA13313f3532c54711497A8FedAC273220E', // Trader Joe Router v2.1
  '0xe54ca86531e17ef3616d22ca28b0d458b6c89106', // Pangolin Router
  '0xE3Ffc583dc176575eEA7FD9dF2A7c65F7E23f4C3', // Uniswap Universal Router
  '0x1b02dA8Cb0d0981bA75fED474Be186e30b310Db7', // SushiSwap Router
  '0x13aD51a666Db6135cd529F1CDB3a2685c28e2c70', // 1inch Router
  '0x1111111254fb6c44bac0bed2854e76f90643097d', // 1inch Aggregation Router V5

  // Lending & money markets
  '0x5c0401e81bc07ca70fad469b451682c0d747ef1c', // Benqi Comptroller
  '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4', // Benqi
  '0x794a61358d6845594f94dc1db02a252b5b4814ad', // Aave V3 Pool
  '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F587948', // Aave V2 Lending Pool

  // Derivatives / Perps
  '0x5f719c2F1095F7B9fc68a68e35b51194f4b6abe8', // GMX Router
  '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064', // GMX Position Router
  '0xB7e69749E3d2EDd90ea59A4932EFEa2D41E245d7', // GMX GM Pool ETH-USDC
  '0xFb02132333A79C8B5Bd0b64E3AbccA5f7fAf2937', // GMX GM Pool BTC-USDC

  // Tokens (often used in approvals/swaps)
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // WAVAX
  '0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE', // sAVAX
  '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5', // QI
].map(addr => addr.toLowerCase()));

interface ScoreFactors {
  totalTxCount: number;
  defiTxCount: number;
  nftTxCount: number;
  bridgeTxCount: number;
  contractDeployments: number;
  uniqueContractsInteracted: number;
  longestStreak: number;
  activeDays: number;
  totalVolume: number;
}

/**
 * Extract scoring factors from rewind data
 */
function extractScoreFactors(
  data: Partial<AvalancheRewind>,
  contractInteractions?: { address: string; count: number }[]
): ScoreFactors {
  const factors: ScoreFactors = {
    totalTxCount: data.totalTransactions || 0,
    defiTxCount: 0,
    nftTxCount: 0,
    bridgeTxCount: 0,
    contractDeployments: 0,
    uniqueContractsInteracted: 0,
    longestStreak: data.longestStreakDays || 0,
    activeDays: data.activeDays || 0,
    totalVolume: data.totalVolumeUSD || 0,
  };

  // Count DeFi, NFT, and Bridge transactions
  if (contractInteractions) {
    const uniqueContracts = new Set<string>();
    
    // Debug logging for interactions
    console.log(`[Persona] Analyzing ${contractInteractions.length} contract interactions`);
    
    for (const interaction of contractInteractions) {
      const addr = interaction.address.toLowerCase();
      uniqueContracts.add(addr);
      
      if (DEFI_CONTRACTS.has(addr)) {
        factors.defiTxCount += interaction.count;
      }
      if (BRIDGE_CONTRACTS.has(addr)) {
        factors.bridgeTxCount += interaction.count;
      }
    }
    
    factors.uniqueContractsInteracted = uniqueContracts.size;
  }

  // Estimate NFT transactions from NFT stats
  if (data.nfts) {
    factors.nftTxCount = data.nfts.totalTxCount;
    // Debug
    console.log(`[Persona] NFT Stats - Total Txs: ${data.nfts.totalTxCount}, Collections: ${data.nfts.collections.length}`);
  }

  // Estimate DeFi from defiHighlights if contractInteractions count is low
  // This helps catch interactions not in our hardcoded list
  if (data.defiHighlights) {
    const highlightedDeFiTx = data.defiHighlights.reduce((sum, h) => sum + h.txCount, 0);
    if (highlightedDeFiTx > factors.defiTxCount) {
      console.log(`[Persona] Using highlighted DeFi count (${highlightedDeFiTx}) instead of direct matches (${factors.defiTxCount})`);
      factors.defiTxCount = highlightedDeFiTx;
    }
  }

  console.log('[Persona] Score Factors:', factors);
  return factors;
}

/**
 * Calculate individual component scores (0-100)
 */
function calculateScoreBreakdown(factors: ScoreFactors): PersonaScoreBreakdown {
  const { totalTxCount, defiTxCount, nftTxCount, bridgeTxCount, 
          longestStreak, activeDays, uniqueContractsInteracted } = factors;

  // Builder Score: contract interactions, unique contracts
  const builderScore = Math.min(100, 
    (uniqueContractsInteracted / 30) * 40 + // 40 points for 30+ unique contracts
    (totalTxCount > 500 ? 30 : (totalTxCount / 500) * 30) +
    (factors.contractDeployments * 10)
  );

  // DeFi Score: DeFi transactions relative to total
  // Relaxed thresholds: even 5-10 DeFi txs is good activity
  const defiRatio = totalTxCount > 0 ? defiTxCount / totalTxCount : 0;
  const defiScore = Math.min(100,
    defiRatio * 60 +
    (defiTxCount > 20 ? 40 : (defiTxCount / 20) * 40) // 40 points for 20+ DeFi txs
  );

  // NFT Score: NFT activity
  // Relaxed thresholds
  const nftRatio = totalTxCount > 0 ? nftTxCount / totalTxCount : 0;
  const nftScore = Math.min(100,
    nftRatio * 60 + 
    (nftTxCount > 10 ? 40 : (nftTxCount / 10) * 40) // 40 points for 10+ NFT txs
  );

  // Degen Score: high frequency, long streaks, active days
  const degenScore = Math.min(100,
    (longestStreak / 30) * 40 + 
    (activeDays / 150) * 30 + 
    (totalTxCount > 500 ? 30 : (totalTxCount / 500) * 30)
  );

  // Bridger Score: bridge activity
  // Very relaxed: ANY bridge activity is significant
  const bridgerScore = Math.min(100,
    (bridgeTxCount > 0 ? 50 : 0) + // 50 points simply for having used a bridge
    (bridgeTxCount > 5 ? 50 : (bridgeTxCount / 5) * 50) // 50 points for >5 txs
  );

  return {
    builderScore: Math.round(builderScore),
    defiScore: Math.round(defiScore),
    nftScore: Math.round(nftScore),
    degenScore: Math.round(degenScore),
    bridgerScore: Math.round(bridgerScore),
  };
}

/**
 * Determine the primary persona based on score breakdown
 */
function determinePersonaId(scores: PersonaScoreBreakdown): PersonaId {
  const { builderScore, defiScore, nftScore, degenScore, bridgerScore } = scores;

  // Find the highest score
  const maxScore = Math.max(builderScore, defiScore, nftScore, degenScore, bridgerScore);

  // If all scores are low, they're a casual explorer
  if (maxScore < 20) {
    return 'casual-explorer';
  }

  // Determine primary persona based on highest score
  // In case of ties, priority order: defi > nft > builder > degen > bridger
  if (defiScore === maxScore && defiScore >= 40) {
    return 'defi-trailblazer';
  }
  if (nftScore === maxScore && nftScore >= 40) {
    return 'nft-peaks-explorer';
  }
  if (builderScore === maxScore && builderScore >= 40) {
    return 'summit-builder';
  }
  if (degenScore === maxScore && degenScore >= 40) {
    return 'high-altitude-degen';
  }
  if (bridgerScore === maxScore && bridgerScore >= 40) {
    return 'cross-chain-bridger';
  }

  // If they have moderate activity across the board, they're a veteran
  const avgScore = (builderScore + defiScore + nftScore + degenScore + bridgerScore) / 5;
  if (avgScore >= 25) {
    return 'avalanche-veteran';
  }

  return 'casual-explorer';
}

/**
 * Calculate the complete persona for a user based on their rewind data
 */
export function calculatePersona(
  data: Partial<AvalancheRewind>,
  contractInteractions?: { address: string; count: number }[]
): Persona {
  const factors = extractScoreFactors(data, contractInteractions);
  const scoreBreakdown = calculateScoreBreakdown(factors);
  const personaId = determinePersonaId(scoreBreakdown);
  const definition = PERSONA_DEFINITIONS[personaId];

  return {
    id: personaId,
    label: definition.label,
    emoji: definition.emoji,
    description: definition.description,
    scoreBreakdown,
  };
}

/**
 * Get a fun, shareable one-liner for the persona
 */
export function getPersonaOneLiner(personaId: PersonaId): string {
  const oneLiners: Record<PersonaId, string> = {
    'summit-builder': '🏔️ Building the future of Avalanche, one contract at a time',
    'defi-trailblazer': '📈 Navigating the DeFi wilderness like a true explorer',
    'nft-peaks-explorer': '🎨 Collecting digital treasures across the NFT peaks',
    'high-altitude-degen': '🚀 Living life on-chain at maximum velocity',
    'cross-chain-bridger': '🌉 Connecting worlds, one bridge at a time',
    'avalanche-veteran': '⛰️ A true OG of the Avalanche ecosystem',
    'casual-explorer': '🏕️ Just getting started on the Avalanche adventure',
  };
  return oneLiners[personaId];
}
