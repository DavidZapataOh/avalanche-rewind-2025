'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { formatUSD } from '@/lib/utils';
import { Coins, ArrowRightLeft } from 'lucide-react';
import type { TokenStats } from '@/lib/types';

interface TokensSlideProps {
    tokens: TokenStats[];
}

export function TokensSlide({ tokens }: TokensSlideProps) {
    const topTokens = tokens.slice(0, 5);
    const maxVolume = topTokens.length > 0 ? Math.max(...topTokens.map(t => t.volumeUSD)) : 0;

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-avax-red/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full px-4"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="mb-6 bg-white/5 p-4 rounded-full border border-white/10"
                >
                    <Coins className="w-10 h-10 text-yellow-400" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 text-center"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Asset Movement
                    </span>
                    <h2 className="text-4xl font-bold text-white mt-1">
                        Your Token Flow
                    </h2>
                </motion.div>

                {/* Token list */}
                <div className="w-full space-y-4">
                    {topTokens.map((token, index) => {
                        const barWidth = maxVolume > 0 ? (token.volumeUSD / maxVolume) * 100 : 0;

                        return (
                            <motion.div
                                key={token.address}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                className="group relative bg-[#0D1224]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 overflow-hidden hover:bg-[#151B30] transition-colors"
                            >
                                {/* Background Progress Bar (Subtle) */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 1, ease: "circOut" }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/5 to-transparent opacity-30 group-hover:opacity-50 transition-opacity"
                                />

                                <div className="relative flex items-center justify-between z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/10 shadow-lg">
                                            {token.logoURI ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={token.logoURI}
                                                    alt={token.symbol}
                                                    className="w-full h-full object-cover rounded-full"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-lg font-bold text-avax-red">
                                                    {token.symbol ? token.symbol.charAt(0) : '?'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xl font-bold text-white">{token.symbol}</div>
                                            <div className="flex items-center gap-1 text-sm text-gray-400">
                                                <ArrowRightLeft className="w-3 h-3" />
                                                {token.txCount} transactions
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm text-gray-400 mb-0.5">Volume</div>
                                        <AnimatedNumber
                                            value={token.volumeUSD}
                                            formatFn={(v) => formatUSD(v)}
                                            className="text-xl font-bold text-white font-mono"
                                            duration={1500}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {topTokens.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8"
                    >
                        <p className="text-gray-300 text-lg">No token activity recorded.</p>
                        <p className="text-gray-500 text-sm mt-2">Your wallet was quiet on the token front this year.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
