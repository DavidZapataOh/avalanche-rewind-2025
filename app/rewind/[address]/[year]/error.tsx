'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Error state for rewind pages
 */
export default function RewindError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Rewind error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Error content */}
            <div className="flex flex-col items-center text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Oops! Something went wrong
                </h2>
                <p className="text-gray-400 mb-6">
                    We couldn&apos;t generate this Rewind. This might be due to an invalid address,
                    network issues, or the wallet having no activity.
                </p>

                {/* Error details (development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="w-full glass rounded-xl p-4 mb-6 text-left">
                        <p className="text-red-400 text-sm font-mono break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-gray-500 text-xs mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link href="/" className="btn-primary flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
