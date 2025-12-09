'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    formatFn?: (value: number) => string;
    className?: string;
    prefix?: string;
    suffix?: string;
}

/**
 * Animated number counter component
 * Counts up from 0 to the target value with easing
 */
export function AnimatedNumber({
    value,
    duration = 1500,
    formatFn = (v) => v.toLocaleString(),
    className = '',
    prefix = '',
    suffix = '',
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateValue();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasAnimated, value]);

    const animateValue = () => {
        const startTime = Date.now();
        const startValue = 0;
        const endValue = value;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <span ref={ref} className={cn('tabular-nums', className)}>
            {prefix}
            {formatFn(displayValue)}
            {suffix}
        </span>
    );
}
