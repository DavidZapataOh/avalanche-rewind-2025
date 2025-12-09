'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideNavigatorProps {
    currentSlide: number;
    totalSlides: number;
    onNext: () => void;
    onPrevious: () => void;
    onGoToSlide: (index: number) => void;
    className?: string;
}

/**
 * Slide navigator component with keyboard support
 */
export function SlideNavigator({
    currentSlide,
    totalSlides,
    onNext,
    onPrevious,
    onGoToSlide,
    className = '',
}: SlideNavigatorProps) {
    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            onNext();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onPrevious();
        } else if (e.key >= '1' && e.key <= '9') {
            const slideIndex = parseInt(e.key) - 1;
            if (slideIndex < totalSlides) {
                onGoToSlide(slideIndex);
            }
        }
    }, [onNext, onPrevious, onGoToSlide, totalSlides]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === totalSlides - 1;

    return (
        <div className={cn('fixed bottom-0 left-0 right-0 z-50', className)}>
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {/* Previous button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onPrevious}
                        disabled={isFirstSlide}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                            isFirstSlide
                                ? 'opacity-30 cursor-not-allowed'
                                : 'glass hover:bg-white/10'
                        )}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Previous</span>
                    </motion.button>

                    {/* Progress dots */}
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalSlides }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => onGoToSlide(index)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all duration-300',
                                    index === currentSlide
                                        ? 'bg-avax-red w-6'
                                        : 'bg-white/20 hover:bg-white/40'
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Next button */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onNext}
                        disabled={isLastSlide}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                            isLastSlide
                                ? 'opacity-30 cursor-not-allowed'
                                : 'btn-primary'
                        )}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Keyboard hint */}
                <div className="text-center mt-3 text-gray-600 text-xs hidden sm:block">
                    Use ← → arrow keys to navigate
                </div>
            </div>
        </div>
    );
}
