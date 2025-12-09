'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export type WolfiExpression = 'idle' | 'happy' | 'excited' | 'thinking' | 'cool' | 'builder' | 'artist' | 'defi' | 'degen';

interface WolfiMascotProps {
    expression?: WolfiExpression;
    className?: string;
    scale?: number;
}

const WOLFI_IMAGES: Record<WolfiExpression, string> = {
    idle: '/wolfie/wolfie-idle.png',
    happy: '/wolfie/wolfie-happy.png',
    excited: '/wolfie/wolfie-happy.png', // Fallback to happy if no explicit excited
    thinking: '/wolfie/wolfie-thinking.png',
    cool: '/wolfie/wolfie-cool.png',
    builder: '/wolfie/wolfie-builder.png',
    artist: '/wolfie/wolfie-artist.png',
    defi: '/wolfie/wolfie-defi.png',
    degen: '/wolfie/wolfie-degen.png',
};

/**
 * WolfiMascot - The guide for Avalanche Rewind.
 * 
 * Renders the official Wolfi PNG assets based on expression.
 */
export function WolfiMascot({ expression = 'idle', className, scale = 1 }: WolfiMascotProps) {

    // Animation variants for "rubber hose" feel (squash and stretch)
    const bounceVariant = {
        initial: { scale: 1, y: 0 },
        animate: {
            scale: [1, 1.05, 0.95, 1],
            y: [0, -5, 2, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.7, 1]
            } as any
        }
    };

    const imageSrc = WOLFI_IMAGES[expression] || WOLFI_IMAGES.idle;

    return (
        <motion.div
            className={cn("relative flex items-center justify-center pointer-events-none", className)}
            style={{ width: 200 * scale, height: 200 * scale }}
            variants={bounceVariant}
            initial="initial"
            animate="animate"
        >
            <Image
                src={imageSrc}
                alt={`Wolfi ${expression}`}
                width={1000}
                height={1000}
                className="w-full h-full object-contain drop-shadow-xl"
                priority
            />
        </motion.div>
    );
}
