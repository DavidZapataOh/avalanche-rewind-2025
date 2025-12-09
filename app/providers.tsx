'use client';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * Dynamically import PrivyProvider to avoid SSR issues
 * Privy and WalletConnect have Node.js dependencies that don't work in SSR
 */
const PrivyProviderWrapper = dynamic(
    () => import('./PrivyWrapper').then((mod) => mod.PrivyWrapper),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-[#050816] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-avax-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        ),
    }
);

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Create a new QueryClient instance for each session
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Keep data fresh for 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Cache data for 30 minutes
                        gcTime: 30 * 60 * 1000,
                        // Retry failed requests once
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
        </QueryClientProvider>
    );
}
