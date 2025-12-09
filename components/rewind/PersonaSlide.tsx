'use client';

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Persona } from '@/lib/types';
import {
    Hammer,
    TrendingUp,
    Palette,
    Zap,
    GitCompare,
    Shield,
    Compass,
    LucideIcon
} from 'lucide-react';

interface PersonaSlideProps {
    persona: Persona;
}

export function PersonaSlide({ persona }: PersonaSlideProps) {
    const chartData = [
        { trait: 'Builder', value: persona.scoreBreakdown.builderScore, fullMark: 100 },
        { trait: 'DeFi', value: persona.scoreBreakdown.defiScore, fullMark: 100 },
        { trait: 'NFT', value: persona.scoreBreakdown.nftScore, fullMark: 100 },
        { trait: 'Degen', value: persona.scoreBreakdown.degenScore, fullMark: 100 },
        { trait: 'Bridger', value: persona.scoreBreakdown.bridgerScore, fullMark: 100 },
    ];

    const getPersonaIcon = (id: string): LucideIcon => {
        const icons: Record<string, LucideIcon> = {
            'summit-builder': Hammer,
            'defi-trailblazer': TrendingUp,
            'nft-peaks-explorer': Palette,
            'high-altitude-degen': Zap,
            'cross-chain-bridger': GitCompare,
            'avalanche-veteran': Shield,
            'casual-explorer': Compass,
        };
        return icons[id] || Compass;
    };

    const PersonaIcon = getPersonaIcon(persona.id);

    return (
        <div className="slide-container">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center max-w-5xl mx-auto w-full px-4"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <span className="text-avax-red/80 uppercase tracking-widest text-sm font-semibold">
                        Your Identity
                    </span>
                    <h2 className="text-4xl font-bold mt-2">The Persona</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

                    {/* Left Column: Card */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-avax-red/20 blur-2xl rounded-full" />
                            <div className="relative p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0D1224] border border-white/10 rounded-2xl shadow-2xl">
                                <PersonaIcon className="w-16 h-16 text-avax-red" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {persona.label}
                        </h3>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                            {persona.description}
                        </p>
                    </motion.div>

                    {/* Right Column: Radar Chart */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative w-full aspect-square max-w-[500px]"
                    >
                        <div className="absolute inset-0 bg-avax-red/5 rounded-full blur-3xl -z-10" />
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis
                                    dataKey="trait"
                                    tick={{ fill: '#E84142', fontSize: 12, fontWeight: 600 }}
                                    tickLine={false}
                                />
                                <Radar
                                    name="Score"
                                    dataKey="value"
                                    stroke="#E84142"
                                    fill="#E84142"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Score breakdown metrics */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="grid grid-cols-5 gap-4 mt-12 w-full max-w-3xl"
                >
                    {chartData.map((item, index) => (
                        <div key={item.trait} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">{item.trait}</span>
                            <span className="text-xl font-bold text-white font-mono">{item.value}</span>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                                    className="h-full bg-avax-red"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
