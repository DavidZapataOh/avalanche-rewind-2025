'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RewindProgressProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function RewindProgress({ currentStep, totalSteps, className }: RewindProgressProps) {
    return (
        <div className={cn("fixed top-6 left-0 right-0 z-50 flex justify-center", className)}>
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <motion.div
                            key={index}
                            className={cn(
                                "h-2 rounded-full transition-colors duration-300 border border-black",
                                isActive ? "w-8 bg-avax-red" : "w-2 bg-gray-800/50",
                                isCompleted && "bg-avax-red"
                            )}
                            animate={{
                                width: isActive ? 32 : 8,
                                backgroundColor: isActive || isCompleted ? '#E84142' : '#1f2937'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
