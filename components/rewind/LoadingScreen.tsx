'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
    "Connecting to Avalanche C-Chain...",
    "Fetching 2025 block data...",
    "Analyzing contract interactions...",
    "Calculating DeFi scores...",
    "Identifying NFT collections...",
    "Generating your persona...",
    "Finalizing your Rewind..."
];

export function LoadingScreen() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-[#050816] flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E84142] opacity-5 blur-[120px] rounded-full animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-5 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Animated Avalanche Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-32 h-32 flex items-center justify-center"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(232,65,66,0.5)]">
                        {/* Left Triangle */}
                        <motion.path
                            d="M20 80 L50 20 L80 80 H20 Z"
                            fill="none"
                            stroke="#E84142"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                        {/* Inner Detail (Stylized) */}
                        <motion.path
                            d="M35 80 L50 50 L65 80"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2 h-16">
                    <motion.h2
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                    >
                        {LOADING_MESSAGES[messageIndex]}
                    </motion.h2>

                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                        <motion.div
                            className="h-full bg-[#E84142]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
