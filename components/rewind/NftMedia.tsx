'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NftMediaProps {
    src?: string;
    alt: string;
    className?: string;
}

export function NftMedia({ src, alt, className }: NftMediaProps) {
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'error'>('image');
    const [isLoading, setIsLoading] = useState(true);

    // Detect if valid src is provided
    useEffect(() => {
        if (!src) {
            setMediaType('error');
            setIsLoading(false);
            return;
        }

        // Simple extension check to bias initial render
        const lowerSrc = src.toLowerCase();
        if (lowerSrc.endsWith('.mp4') || lowerSrc.endsWith('.webm') || lowerSrc.endsWith('.mov')) {
            setMediaType('video');
        } else {
            setMediaType('image');
        }
    }, [src]);

    const handleError = () => {
        // If image fails, and valid src exists, try loading as video
        if (mediaType === 'image' && src) {
            console.log('[NftMedia] Image failed, trying as video:', src);
            setMediaType('video');
            setIsLoading(true);
        } else {
            // If video also fails, then show error
            console.log('[NftMedia] Media failed to load:', src);
            setMediaType('error');
            setIsLoading(false);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (mediaType === 'error' || !src) {
        return (
            <div className={`flex items-center justify-center bg-gray-700 text-4xl ${className}`}>
                🖼️
            </div>
        );
    }

    if (mediaType === 'video') {
        return (
            <div className={`relative ${className}`}>
                <video
                    src={src}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={handleLoad}
                    onError={handleError}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse" />
                )}
            </div>
        );
    }

    // Default to Image (handles GIFs too)
    return (
        <div className={`relative ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={handleLoad}
                onError={handleError}
                referrerPolicy="no-referrer"
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse" />
            )}
        </div>
    );
}
