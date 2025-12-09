'use client';

import { motion } from 'framer-motion';
import { WolfiMascot } from '@/components/WolfiMascot';
import type { BiggestDay } from '@/lib/types';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

interface HighlightsSceneProps {
    longestStreakDays: number;
    biggestDay: BiggestDay | null;
    totalVolumeUSD: number;
    totalGasSpentAVAX: number;
}

export function HighlightsScene({
    longestStreakDays,
    biggestDay,
    totalVolumeUSD,
    totalGasSpentAVAX
}: HighlightsSceneProps) {

    // Format biggest day
    const dateStr = biggestDay ? new Date(biggestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A';

    // Animation variants
    const itemVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-6 relative">

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 text-center"
            >
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase transform -rotate-2 drop-shadow-[4px_4px_0_#E84142]">
                    Biggest Moves
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-end relative z-10">

                {/* 1. Streak - Stepping Stones */}
                <motion.div
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="bg-[#1a1a1a] p-6 rounded-3xl border-4 border-white/10 text-center w-full relative overflow-hidden group hover:border-avax-red transition-colors">
                        <div className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Longest Streak</div>
                        <div className="text-6xl font-black text-white mb-2">{longestStreakDays}</div>
                        <div className="text-avax-red font-bold uppercase">Days</div>

                        {/* Decorative stones bg */}
                        <div className="absolute -bottom-4 right-0 opacity-10 text-4xl">🪨</div>
                    </div>
                    <WolfiMascot expression="excited" scale={0.5} className="mt-4 -mb-8" />
                </motion.div>

                {/* 2. Biggest Day - Calendar Page */}
                <motion.div
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center transform -translate-y-8" // Slight emphasis
                >
                    <div className="relative bg-white text-black p-6 pb-12 w-full max-w-xs rotate-2 shadow-[8px_8px_0px_0px_#E84142] border-4 border-black">
                        {/* Calendar Holes */}
                        <div className="absolute top-2 left-0 w-full flex justify-between px-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-3 h-3 rounded-full bg-black/20" />)}
                        </div>

                        <div className="mt-4 text-center">
                            <div className="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Most Active Day</div>
                            <div className="text-5xl font-black mb-2">{dateStr.split(' ')[1]}</div>
                            <div className="text-3xl font-bold uppercase text-gray-800">{dateStr.split(' ')[0]}</div>

                            <div className="mt-6 pt-4 border-t-2 border-black/10 flex justify-between text-xs font-bold">
                                <div>{biggestDay?.txCount || 0} Txns</div>
                                <div>${Math.round(biggestDay?.volumeUSD || 0)} Vol</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Volume/Gas - Cartoon Bubbles */}
                <motion.div
                    variants={itemVariant}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                    className="space-y-6 w-full"
                >
                    {/* Volume Bubble */}
                    <div className="bg-[#0D1224] border-2 border-avax-red/50 p-4 rounded-full rounded-bl-none ml-4 relative">
                        <div className="text-xs text-gray-400 uppercase font-bold">Total Volume</div>
                        <div className="text-2xl font-black text-white">
                            ${(totalVolumeUSD / 1000).toFixed(1)}k+
                        </div>
                    </div>

                    {/* Gas Bubble */}
                    <div className="bg-[#0D1224] border-2 border-purple-500/50 p-4 rounded-full rounded-tr-none mr-4 relative text-right">
                        <div className="text-xs text-gray-400 uppercase font-bold">Gas Burned</div>
                        <div className="text-2xl font-black text-white">
                            {totalGasSpentAVAX.toFixed(2)} AVAX
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
