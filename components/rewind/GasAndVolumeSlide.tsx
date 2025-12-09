'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { formatUSD, formatAVAX, calculatePercentage } from '@/lib/utils';
import { Fuel, TrendingUp, Gauge, ArrowUpRight } from 'lucide-react';

interface GasAndVolumeSlideProps {
    totalVolumeUSD: number;
    totalVolumeAVAX: number;
    totalGasSpentAVAX: number;
    totalGasSpentUSD: number;
}

export function GasAndVolumeSlide({
    totalVolumeUSD,
    totalVolumeAVAX,
    totalGasSpentAVAX,
    totalGasSpentUSD,
}: GasAndVolumeSlideProps) {
    const gasRatio = calculatePercentage(totalGasSpentUSD, totalVolumeUSD);
    const efficiencyScore = Math.max(0, 100 - (gasRatio * 100)); // Simplified efficiency score

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full px-6"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                    <ArrowUpRight className="w-10 h-10 text-green-400" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Impact & Cost
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-1">
                        Volume & Fuel
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
                    {/* Volume Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl overflow-hidden hover:bg-[#151B30] transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24 text-green-500" />
                        </div>

                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <span className="text-sm font-bold text-green-400 uppercase tracking-wider">Moved</span>
                            </div>
                            <AnimatedNumber
                                value={totalVolumeUSD}
                                formatFn={(v) => formatUSD(v)}
                                className="text-4xl font-black text-white block mb-2"
                            />
                            <div className="text-gray-400 font-mono text-sm">
                                {formatAVAX(totalVolumeAVAX)}
                            </div>
                        </div>
                    </motion.div>

                    {/* Gas Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group relative bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-8 rounded-3xl overflow-hidden hover:bg-[#151B30] transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Fuel className="w-24 h-24 text-orange-500" />
                        </div>

                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <Fuel className="w-5 h-5 text-orange-400" />
                                <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">Burned</span>
                            </div>
                            <AnimatedNumber
                                value={totalGasSpentAVAX}
                                formatFn={(v) => `${v.toFixed(3)} AVAX`}
                                className="text-4xl font-black text-white block mb-2"
                            />
                            <div className="text-gray-400 font-mono text-sm">
                                {formatUSD(totalGasSpentUSD)}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Efficiency Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-xl bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Gauge className="w-5 h-5" />
                            <span className="font-medium">Network Efficiency</span>
                        </div>
                        <span className="text-white font-bold">{Math.min(99.9, efficiencyScore).toFixed(1)}%</span>
                    </div>

                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                        {/* Markers */}
                        <div className="absolute top-0 left-[25%] h-full w-px bg-white/10" />
                        <div className="absolute top-0 left-[50%] h-full w-px bg-white/10" />
                        <div className="absolute top-0 left-[75%] h-full w-px bg-white/10" />

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, efficiencyScore)}%` }}
                            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-green-500"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        You spent only <span className="text-white font-bold">{gasRatio.toFixed(3)}%</span> of your volume on fees.
                    </p>
                </motion.div>

            </motion.div>
        </div>
    );
}
