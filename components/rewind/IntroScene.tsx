'use client';

import { motion } from 'framer-motion';
import { WolfiMascot } from '@/components/WolfiMascot';

interface IntroSceneProps {
    address: string;
    year: number;
}

export function IntroScene({ address, year }: IntroSceneProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full relative p-6">

            {/* Projector Beam Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">

                {/* Cinema Screen Container */}
                <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full aspect-video bg-[#1a1a1a] border-[12px] border-[#333] rounded-lg shadow-2xl flex items-center justify-center overflow-hidden mb-8"
                    style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                >
                    {/* Screen Content - "Flicker" Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 1] }} // Flicker effect
                        transition={{ duration: 0.5, delay: 1 }}
                        className="text-center p-8"
                    >
                        <h3 className="text-gray-400 font-mono tracking-widest uppercase mb-4 text-sm md:text-base">
                            Production No. {year}
                        </h3>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
                            YOUR YEAR ON
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-black text-avax-red tracking-tighter transform -rotate-2">
                            AVALANCHE
                        </h2>

                        <div className="mt-8 text-white/50 font-mono text-xs md:text-sm">
                            Starring: {address.slice(0, 6)}...{address.slice(-4)}
                        </div>
                    </motion.div>

                    {/* Old Film Grain / Scratches overlay inside the screen */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
                    <div className="absolute inset-0 pointer-events-none border-[2px] border-white/5 rounded-sm" />
                </motion.div>

                {/* Wolfi Presenter */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", delay: 1.2 }}
                    className="absolute -bottom-10 md:-bottom-20 -right-4 md:-right-20 transform rotate-12"
                >
                    <WolfiMascot expression="idle" scale={1.2} />
                </motion.div>

                {/* Text below */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-white/60 font-medium mt-4 text-center max-w-md"
                >
                    Grab your popcorn. It's showtime.
                </motion.p>
            </div>
        </div>
    );
}
