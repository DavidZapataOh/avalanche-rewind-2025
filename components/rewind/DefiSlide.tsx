'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { formatUSD, formatAddress } from '@/lib/utils';
import {
    Zap,
    TrendingUp,
    Box,
    Landmark,
    BarChart2,
    ShoppingCart,
    Ghost,
    Droplets,
    Repeat,
    LucideIcon
} from 'lucide-react';
import type { DefiHighlight } from '@/lib/types';

interface DefiSlideProps {
    defiHighlights: DefiHighlight[];
}

export function DefiSlide({ defiHighlights }: DefiSlideProps) {
    const hasDefi = defiHighlights.length > 0;
    const topProtocols = defiHighlights.slice(0, 5);
    const totalVolume = defiHighlights.reduce((sum, d) => sum + d.volumeUSD, 0);
    const totalTxCount = defiHighlights.reduce((sum, d) => sum + d.txCount, 0);

    const getProtocolIcon = (name: string): LucideIcon => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('joe') || nameLower.includes('trader')) return ShoppingCart;
        if (nameLower.includes('benqi')) return Droplets;
        if (nameLower.includes('aave')) return Ghost;
        if (nameLower.includes('gmx')) return BarChart2;
        if (nameLower.includes('curve')) return Repeat;
        if (nameLower.includes('uniswap')) return Repeat;
        if (nameLower.includes('bank')) return Landmark;
        return Box;
    };

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
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
                    className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                    <Zap className="w-10 h-10 text-blue-400" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Financial Frontiers
                    </span>
                    <h2 className="text-4xl font-bold text-white mt-1">
                        DeFi Playground
                    </h2>
                </motion.div>

                {hasDefi ? (
                    <>
                        {/* Stats - Horizontal */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center gap-12 mb-10 w-full"
                        >
                            <div className="text-center">
                                <AnimatedNumber
                                    value={totalVolume}
                                    formatFn={(v) => formatUSD(v)}
                                    className="text-3xl font-bold text-white block mb-1"
                                />
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Volume</span>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="text-center">
                                <AnimatedNumber
                                    value={totalTxCount}
                                    className="text-3xl font-bold text-white block mb-1"
                                />
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Interactions</span>
                            </div>
                        </motion.div>

                        {/* Protocol list */}
                        <div className="w-full space-y-3">
                            {topProtocols.map((protocol, index) => {
                                const Icon = getProtocolIcon(protocol.protocolName);
                                return (
                                    <motion.div
                                        key={protocol.contractAddress}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                                        className="group bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-[#151B30] transition-all hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                                <Icon className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-white text-lg">
                                                    {protocol.protocolName}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    {formatAddress(protocol.contractAddress, 4)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">
                                                {protocol.txCount} <span className="text-gray-500 text-sm font-normal">tx</span>
                                            </div>
                                            {protocol.volumeUSD > 0 && (
                                                <div className="text-sm text-gray-400 font-mono">
                                                    {formatUSD(protocol.volumeUSD)}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-md"
                    >
                        <Landmark className="w-16 h-16 text-gray-600 mb-6 mx-auto" strokeWidth={1.5} />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            DeFi Awaits
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            No decentralized finance activity detected. The world of swaps, lending, and yield is ready when you are.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
