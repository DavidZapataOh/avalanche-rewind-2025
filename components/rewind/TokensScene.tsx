'use client';

import { motion } from 'framer-motion';
import { WolfiMascot } from '@/components/WolfiMascot';
import type { TokenStats } from '@/lib/types';

interface TokensSceneProps {
    tokens: TokenStats[];
}

export function TokensScene({ tokens }: TokensSceneProps) {
    // Show top 10 tokens by interaction count (user movements)
    const topTokens = tokens.sort((a, b) => b.txCount - a.txCount).slice(0, 10);
    const maxCount = Math.max(...topTokens.map(t => t.txCount), 1);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter uppercase text-center shrink-0">
                Flow of Value
            </h2>
            <p className="text-gray-400 font-mono text-sm mb-8 text-center shrink-0">
                Most interacted tokens by transaction count
            </p>

            <div className="w-full overflow-x-auto pb-4 px-6 no-scrollbar mask-gradient relative z-10 flex justify-start md:justify-center">
                <div className="flex gap-8 md:gap-12 items-end min-w-max mx-auto px-4">
                    {topTokens.map((token, idx) => (
                        <div key={token.symbol} className="flex flex-col items-center w-24 md:w-32">

                            {/* Falling Token Animation */}
                            <motion.div
                                initial={{ y: -300, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.2, type: "spring", bounce: 0.4 }}
                                className="mb-4"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(232,65,66,1)]">
                                    {token.symbol.substring(0, 4)}
                                </div>
                            </motion.div>

                            {/* Pipe/Bin Visual */}
                            <div className="relative w-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: Math.max(20, (token.txCount / maxCount) * 200) }}
                                    transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                                    className="w-full bg-gradient-to-t from-avax-red to-red-500 border-x-2 border-t-2 border-black rounded-t-xl mx-auto opacity-90"
                                />
                                {/* Bin Label */}
                                <div className="bg-black text-white font-mono text-center text-xs py-2 w-full rounded-b-lg border-2 border-white/20">
                                    {token.txCount} Txns
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {topTokens.length === 0 && (
                <div className="text-gray-500 font-mono">
                    No token data found used in the factory today!
                </div>
            )}

            {/* Gear/Factory Decoration */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute top-1/4 right-10 text-9xl opacity-5 pointer-events-none"
            >
                ⚙️
            </motion.div>
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute bottom-1/4 left-10 text-9xl opacity-5 pointer-events-none"
            >
                ⚙️
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10"
            >
                <WolfiMascot expression="defi" scale={0.6} />
            </motion.div>

        </div>
    );
}
