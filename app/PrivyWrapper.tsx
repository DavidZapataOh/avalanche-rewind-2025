'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import type { ReactNode } from 'react';

/**
 * Privy Configuration
 * 
 * This is wrapped in a separate component to be dynamically imported
 * and avoid SSR issues with Privy and WalletConnect
 */

// Avalanche C-Chain configuration for Privy
const avalancheChain = {
    id: 43114,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: {
        decimals: 18,
        name: 'AVAX',
        symbol: 'AVAX',
    },
    rpcUrls: {
        default: {
            http: ['https://api.avax.network/ext/bc/C/rpc'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Snowtrace',
            url: 'https://snowtrace.io',
        },
    },
};

interface PrivyWrapperProps {
    children: ReactNode;
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
    // Get Privy App ID from environment
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

    if (!privyAppId) {
        console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
        // Return children without Privy if not configured
        return (
            <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                    <p className="text-gray-400">
                        Please set <code className="text-[#E84142]">NEXT_PUBLIC_PRIVY_APP_ID</code> in your environment variables.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <PrivyProvider
            appId={privyAppId}
            config={{
                // Appearance configuration
                appearance: {
                    theme: 'dark',
                    accentColor: '#E84142', // Avalanche red
                    logo: '/avalanche-logo.svg',
                    // Include detected wallets (Core, MetaMask, etc.) plus standard options
                    walletList: ['detected_wallets', 'metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect'],
                },
                // Login methods
                loginMethods: ['email', 'wallet', 'google', 'twitter'],
                // Default chain configuration
                defaultChain: avalancheChain,
                // Supported chains
                supportedChains: [avalancheChain],
                // Embedded wallet configuration
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
