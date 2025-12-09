'use client';

import { useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RewindProgress } from './RewindProgress';
import { cn } from '@/lib/utils';

interface SceneManagerProps {
    totalScenes: number;
    currentSceneIndex: number;
    onSceneChange: (index: number) => void;
    children: ReactNode;
}

export function SceneManager({
    totalScenes,
    currentSceneIndex,
    onSceneChange,
    children
}: SceneManagerProps) {
    const [direction, setDirection] = useState(0);

    const handleNext = useCallback(() => {
        if (currentSceneIndex < totalScenes - 1) {
            setDirection(1);
            onSceneChange(currentSceneIndex + 1);
        }
    }, [currentSceneIndex, totalScenes, onSceneChange]);

    const handlePrev = useCallback(() => {
        if (currentSceneIndex > 0) {
            setDirection(-1);
            onSceneChange(currentSceneIndex - 1);
        }
    }, [currentSceneIndex, onSceneChange]);

    // Keyboard navigation
    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key === 'ArrowRight') handleNext();
    //         if (e.key === 'ArrowLeft') handlePrev();
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, [handleNext, handlePrev]);

    const sceneVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1
        }),
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#050816]">
            {/* Background Ambience - Consistent across scenes */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
                {/* Grain */}
                <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
            </div>

            <RewindProgress
                currentStep={currentSceneIndex}
                totalSteps={totalScenes}
            />

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentSceneIndex}
                    custom={direction}
                    variants={sceneVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.4 }
                    }}
                    className="w-full h-full"
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-between px-8 md:px-12 pointer-events-none">
                <button
                    onClick={handlePrev}
                    disabled={currentSceneIndex === 0}
                    className={cn(
                        "pointer-events-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full p-3 transition-all",
                        currentSceneIndex === 0 ? "opacity-0" : "opacity-100"
                    )}
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentSceneIndex === totalScenes - 1}
                    className={cn(
                        "pointer-events-auto bg-avax-red border-2 border-black text-white rounded-full p-3 transition-all shadow-[4px_4px_0px_0px_#FFF] active:translate-y-1 active:shadow-none hover:scale-105",
                        currentSceneIndex === totalScenes - 1 ? "opacity-0" : "opacity-100"
                    )}
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
