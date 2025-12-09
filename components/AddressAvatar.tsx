'use client';

import { useMemo } from 'react';

interface AddressAvatarProps {
    address: string;
    size?: number;
    className?: string;
}

/**
 * Generates a colorful avatar based on an Ethereum address
 * Similar to jazzicon/blockies but simpler
 */
export function AddressAvatar({ address, size = 48, className = '' }: AddressAvatarProps) {
    const colors = useMemo(() => {
        // Generate colors from the address
        const hash = address.toLowerCase().replace('0x', '');
        const colors: string[] = [];

        for (let i = 0; i < 5; i++) {
            const start = i * 8;
            const hex = hash.slice(start, start + 6);
            colors.push(`#${hex || 'E84142'}`);
        }

        return colors;
    }, [address]);

    const gradientId = `avatar-${address.slice(2, 10)}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            style={{ borderRadius: '50%' }}
        >
            <defs>
                <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="50%" stopColor={colors[1]} />
                    <stop offset="100%" stopColor={colors[2]} />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill={`url(#${gradientId})`} />
            <circle cx="30" cy="35" r="15" fill={colors[3]} opacity="0.7" />
            <circle cx="70" cy="65" r="20" fill={colors[4]} opacity="0.5" />
            <circle cx="55" cy="40" r="10" fill={colors[0]} opacity="0.6" />
        </svg>
    );
}
