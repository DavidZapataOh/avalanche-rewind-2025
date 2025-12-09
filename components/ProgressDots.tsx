'use client';

import { cn } from '@/lib/utils';

interface ProgressDotsProps {
    total: number;
    current: number;
    onDotClick?: (index: number) => void;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

/**
 * Progress indicator dots for slide navigation
 */
export function ProgressDots({
    total,
    current,
    onDotClick,
    orientation = 'vertical',
    className = '',
}: ProgressDotsProps) {
    return (
        <div
            className={cn(
                'flex gap-2',
                orientation === 'vertical' ? 'flex-col' : 'flex-row',
                className
            )}
        >
            {Array.from({ length: total }, (_, index) => (
                <button
                    key={index}
                    onClick={() => onDotClick?.(index)}
                    className={cn(
                        'progress-dot transition-all duration-300',
                        index === current && 'active scale-125',
                        onDotClick && 'cursor-pointer hover:scale-110'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === current ? 'step' : undefined}
                />
            ))}
        </div>
    );
}
