'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { AvalancheRewind } from '@/lib/types';
import { Mountain, Sparkles } from 'lucide-react';

// Slide components
import { IntroSlide } from '@/components/rewind/IntroSlide';
import { PersonaSlide } from '@/components/rewind/PersonaSlide';
import { ActivitySlide } from '@/components/rewind/ActivitySlide';
import { TokensSlide } from '@/components/rewind/TokensSlide';
import { NftsSlide } from '@/components/rewind/NftsSlide';
import { DefiSlide } from '@/components/rewind/DefiSlide';
import { GasAndVolumeSlide } from '@/components/rewind/GasAndVolumeSlide';
import { BiggestDaySlide } from '@/components/rewind/BiggestDaySlide';
import { SummarySlide } from '@/components/rewind/SummarySlide';
import { SlideNavigator } from '@/components/rewind/SlideNavigator';

interface ShareExperienceProps {
    rewind: AvalancheRewind;
}

// Slide configuration
const SLIDES = [
    { id: 'intro', component: IntroSlide },
    { id: 'persona', component: PersonaSlide },
    { id: 'activity', component: ActivitySlide },
    { id: 'tokens', component: TokensSlide },
    { id: 'nfts', component: NftsSlide },
    { id: 'defi', component: DefiSlide },
    { id: 'gas-volume', component: GasAndVolumeSlide },
    { id: 'biggest-day', component: BiggestDaySlide },
    { id: 'summary', component: SummarySlide },
] as const;

// Animation variants for slides
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

/**
 * Share Experience Component
 * 
 * Similar to RewindExperience but with a "Shared" badge
 * and no wallet connection features
 */
export function ShareExperience({ rewind }: ShareExperienceProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = useCallback(() => {
        if (currentSlide < SLIDES.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide]);

    const handlePrevious = useCallback(() => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    const handleGoToSlide = useCallback((index: number) => {
        if (index >= 0 && index < SLIDES.length) {
            setDirection(index > currentSlide ? 1 : -1);
            setCurrentSlide(index);
        }
    }, [currentSlide]);

    // Render the current slide
    const renderSlide = () => {
        const slideConfig = SLIDES[currentSlide];

        switch (slideConfig.id) {
            case 'intro':
                return <IntroSlide address={rewind.address} year={rewind.year} />;
            case 'persona':
                return <PersonaSlide persona={rewind.persona} />;
            case 'activity':
                return (
                    <ActivitySlide
                        activeDays={rewind.activeDays}
                        longestStreakDays={rewind.longestStreakDays}
                        mostActiveMonths={rewind.mostActiveMonths}
                        totalTransactions={rewind.totalTransactions}
                    />
                );
            case 'tokens':
                return <TokensSlide tokens={rewind.tokens} />;
            case 'nfts':
                return <NftsSlide nfts={rewind.nfts} />;
            case 'defi':
                return <DefiSlide defiHighlights={rewind.defiHighlights} />;
            case 'gas-volume':
                return (
                    <GasAndVolumeSlide
                        totalVolumeUSD={rewind.totalVolumeUSD}
                        totalVolumeAVAX={rewind.totalVolumeAVAX}
                        totalGasSpentAVAX={rewind.totalGasSpentAVAX}
                        totalGasSpentUSD={rewind.totalGasSpentUSD}
                    />
                );
            case 'biggest-day':
                return <BiggestDaySlide biggestDay={rewind.biggestDay} />;
            case 'summary':
                return (
                    <SummarySlide
                        rewind={rewind}
                        isWalletConnected={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Shared badge */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-2 rounded-full flex items-center gap-2">
                <Mountain className="w-4 h-4 text-avax-red" />
                <span className="text-sm text-gray-300">Shared Rewind</span>
            </div>

            {/* Demo data warning */}
            {rewind.isDemoData && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                    ⚠️ Demo Data
                </div>
            )}

            {/* CTA to create own */}
            <Link
                href="/"
                className="fixed top-4 right-4 z-50 glass hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
            >
                <Sparkles className="w-4 h-4 text-avax-red" />
                <span className="text-sm text-white">Create Yours</span>
            </Link>

            {/* Slides container */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="min-h-screen"
                >
                    {renderSlide()}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <SlideNavigator
                currentSlide={currentSlide}
                totalSlides={SLIDES.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onGoToSlide={handleGoToSlide}
            />
        </div>
    );
}
