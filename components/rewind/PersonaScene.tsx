'use client';

import { motion } from 'framer-motion';
import { WolfiMascot, WolfiExpression } from '@/components/WolfiMascot';
import type { Persona } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface PersonaSceneProps {
    persona: Persona;
}

export function PersonaScene({ persona }: PersonaSceneProps) {
    // Map archetype to Wolfi expression and colors
    const { expression, color, secondaryColor } = useMemo(() => {
        const type = persona.id;

        // Exact matches for our key archetypes
        if (type === 'high-altitude-degen') return { expression: 'degen' as WolfiExpression, color: 'bg-purple-500', secondaryColor: 'bg-purple-900' };
        if (type === 'nft-peaks-explorer') return { expression: 'artist' as WolfiExpression, color: 'bg-pink-500', secondaryColor: 'bg-pink-900' };
        if (type === 'defi-trailblazer') return { expression: 'defi' as WolfiExpression, color: 'bg-blue-500', secondaryColor: 'bg-blue-900' };
        if (type === 'summit-builder') return { expression: 'builder' as WolfiExpression, color: 'bg-yellow-500', secondaryColor: 'bg-yellow-900' };

        // Secondary mappings
        if (type === 'avalanche-veteran') return { expression: 'cool' as WolfiExpression, color: 'bg-red-600', secondaryColor: 'bg-red-950' };
        if (type === 'cross-chain-bridger') return { expression: 'thinking' as WolfiExpression, color: 'bg-cyan-500', secondaryColor: 'bg-cyan-900' };

        // Default
        return { expression: 'happy' as WolfiExpression, color: 'bg-avax-red', secondaryColor: 'bg-red-900' };
    }, [persona.id]);

    // Simple manual chart data normalized 0-100
    const stats = [
        { label: 'Builder', value: persona.scoreBreakdown.builderScore },
        { label: 'DeFi', value: persona.scoreBreakdown.defiScore },
        { label: 'NFT', value: persona.scoreBreakdown.nftScore },
        { label: 'Degen', value: persona.scoreBreakdown.degenScore },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

                {/* Left: Wolfi Character */}
                <div className="order-2 md:order-1 flex justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1, bounce: 0.5 }}
                        className={cn("relative p-12 rounded-full", secondaryColor, "bg-opacity-20")}
                    >
                        <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-40", color)} />
                        <WolfiMascot expression={expression} scale={1.8} />
                    </motion.div>
                </div>

                {/* Right: Persona Card */}
                <div className="order-1 md:order-2">
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-xl text-gray-400 font-bold uppercase tracking-widest mb-2">
                            The Role You Played
                        </h2>
                        <h1 className={cn("text-5xl md:text-7xl font-black text-white mb-6 leading-none",
                            "drop-shadow-[0_4px_0_rgba(0,0,0,1)] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400")}
                        >
                            {persona.label}
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 border-l-4 border-avax-red pl-4 italic">
                            "{persona.description}"
                        </p>

                        {/* Hand-drawn style Barchart */}
                        <div className="space-y-4 max-w-md">
                            {stats.map((stat, idx) => (
                                <div key={stat.label} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold uppercase text-white/50">
                                        <span>{stat.label}</span>
                                        <span>{Math.round(stat.value)}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (idx * 0.1), ease: "easeOut" }}
                                            className={cn("h-full rounded-full relative", color)}
                                        >
                                            <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
