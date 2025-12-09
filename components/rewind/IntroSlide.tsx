'use client';

import { motion } from 'framer-motion';
import { AddressAvatar } from '@/components/AddressAvatar';
import { formatAddress } from '@/lib/utils';
import { Mountain, ChevronRight } from 'lucide-react';

interface IntroSlideProps {
    address: string;
    year: number;
}

export function IntroSlide({ address, year }: IntroSlideProps) {
    return (
        <div className="slide-container overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-avax-red/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-6"
            >
                {/* Year Indicator */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex items-center gap-2 mb-12"
                >
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-avax-red" />
                    <span className="text-avax-red font-bold tracking-[0.2em] text-sm uppercase">
                        Avalanche Rewind
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-avax-red" />
                </motion.div>

                {/* Main Year Display */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1, type: "spring", bounce: 0.5 }}
                    className="relative mb-12"
                >
                    <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                        {year}
                    </h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="absolute -top-4 -right-4"
                    >
                        <Mountain className="w-12 h-12 text-avax-red rotate-12" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                {/* User Identity */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-avax-red to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                        <div className="relative p-1 bg-[#1A1A1A] rounded-full ring-1 ring-white/10">
                            <AddressAvatar address={address} size={84} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Your On-Chain Legacy
                        </h2>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <code className="text-gray-300 font-mono tracking-wide">
                                {formatAddress(address)}
                            </code>
                        </div>
                    </div>
                </motion.div>

                {/* Footer / Navigation Hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 flex flex-col items-center gap-2 opacity-50"
                >
                    <p className="text-xs uppercase tracking-widest font-medium">Start the Journey</p>
                    <ChevronRight className="w-6 h-6 animate-bounce" />
                </motion.div>
            </motion.div>
        </div>
    );
}
