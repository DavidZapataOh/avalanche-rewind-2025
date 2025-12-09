'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { formatUSD, formatDate } from '@/lib/utils';
import { Calendar, Zap, TrendingUp, Award, Star } from 'lucide-react';
import type { BiggestDay } from '@/lib/types';

interface BiggestDaySlideProps {
    biggestDay: BiggestDay | null;
}

export function BiggestDaySlide({ biggestDay }: BiggestDaySlideProps) {
    if (!biggestDay) {
        return (
            <div className="slide-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10"
                >
                    <Calendar className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Steady as a Rock
                    </h2>
                    <p className="text-gray-400">
                        No single day stood out, but your consistent journey matters.
                    </p>
                </motion.div>
            </div>
        );
    }

    const formattedDate = formatDate(biggestDay.date);

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
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
                    className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400/20" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Record Breaker
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-1">
                        Peak Velocity
                    </h2>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-md bg-[#0D1224]/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 overflow-hidden group hover:border-avax-red/30 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar className="w-32 h-32 text-avax-red" />
                    </div>

                    <div className="relative z-10">
                        <div className="text-sm font-bold text-avax-red uppercase tracking-wider mb-2">The Date</div>
                        <div className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-6">
                            {formattedDate}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                <AnimatedNumber
                                    value={biggestDay.txCount}
                                    className="text-3xl font-black text-white block"
                                    duration={1500}
                                />
                                <div className="text-sm text-gray-400 mt-1">Transactions</div>
                            </div>

                            <div className="text-center relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/10 -ml-3" />
                                <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <AnimatedNumber
                                    value={biggestDay.volumeUSD}
                                    formatFn={(v) => formatUSD(v)}
                                    className="text-3xl font-black text-white block"
                                    duration={1500}
                                />
                                <div className="text-sm text-gray-400 mt-1">Volume</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Achievement Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-full"
                >
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-100 font-medium">
                        {biggestDay.txCount >= 50
                            ? 'Legendary Status Unlocked'
                            : biggestDay.txCount >= 20
                                ? 'Power User Achievement'
                                : 'Active Explorer Badge'}
                    </span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-gray-400 text-sm max-w-sm"
                >
                    Your most active 24 hours on the network.
                </motion.p>
            </motion.div>
        </div>
    );
}
