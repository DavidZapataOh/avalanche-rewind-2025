import { createPublicClient, createWalletClient, custom, http, type PublicClient, type WalletClient } from 'viem';
import { avalanche } from 'viem/chains';

/**
 * Avalanche C-Chain Configuration
 * Chain ID: 43114
 * Using the official Avalanche RPC endpoint
 */

// RPC URL - can be overridden via environment variable
const AVALANCHE_RPC_URL = process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc';

/**
 * Public client for reading from Avalanche C-Chain
 * Use this for read-only operations like fetching balances, contract reads, etc.
 */
export const publicClient: PublicClient = createPublicClient({
  chain: avalanche,
  transport: http(AVALANCHE_RPC_URL),
});

/**
 * Create a wallet client from a Privy-connected wallet provider
 * Use this for write operations like contract calls, signing, etc.
 * 
 * @param provider - The EIP-1193 provider from Privy wallet
 * @returns WalletClient configured for Avalanche C-Chain
 */
export function createWalletClientFromProvider(provider: unknown): WalletClient {
  return createWalletClient({
    chain: avalanche,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transport: custom(provider as any),
  });
}

/**
 * Get a wallet client with a specific account
 * Useful when you need to specify the account for transactions
 * 
 * @param provider - The EIP-1193 provider from Privy wallet
 * @param account - The account address to use
 * @returns WalletClient configured with the specified account
 */
export function createWalletClientWithAccount(
  provider: unknown,
  account: `0x${string}`
): WalletClient {
  return createWalletClient({
    account,
    chain: avalanche,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transport: custom(provider as any),
  });
}

/**
 * Avalanche chain configuration exported for convenience
 */
export { avalanche };

/**
 * Chain ID for Avalanche C-Chain
 */
export const AVALANCHE_CHAIN_ID = 43114;

/**
 * Check if the connected wallet is on Avalanche mainnet
 */
export async function isOnAvalanche(provider: unknown): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chainId = await (provider as any).request({ method: 'eth_chainId' });
    return parseInt(chainId, 16) === AVALANCHE_CHAIN_ID;
  } catch {
    return false;
  }
}

/**
 * Request switch to Avalanche network
 */
export async function switchToAvalanche(provider: unknown): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (provider as any).request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${AVALANCHE_CHAIN_ID.toString(16)}` }],
    });
  } catch (error: unknown) {
    // If the chain hasn't been added to the wallet, add it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any)?.code === 4902) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (provider as any).request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${AVALANCHE_CHAIN_ID.toString(16)}`,
          chainName: 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18,
          },
          rpcUrls: [AVALANCHE_RPC_URL],
          blockExplorerUrls: ['https://snowtrace.io/'],
        }],
      });
    } else {
      throw error;
    }
  }
}
