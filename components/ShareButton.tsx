'use client';

import { useState } from 'react';
import { Share2, Check, Copy, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
    url: string;
    title?: string;
    text?: string;
    className?: string;
}

/**
 * Share button component with native share API support
 */
export function ShareButton({
    url,
    title = 'My Avalanche Rewind',
    text = 'Check out my Avalanche Rewind!',
    className = '',
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const handleShare = async () => {
        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                return;
            } catch (err) {
                // User cancelled or error, fall back to options
                if ((err as Error).name === 'AbortError') return;
            }
        }

        // Show share options
        setShowOptions(true);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className={cn(
                    'flex items-center gap-2 btn-secondary',
                    className
                )}
            >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
            </button>

            {showOptions && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowOptions(false)}
                    />

                    {/* Options menu */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 glass rounded-xl p-2 min-w-[200px]">
                        <button
                            onClick={() => {
                                handleCopy();
                                setShowOptions(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <Copy className="w-5 h-5 text-gray-400" />
                            )}
                            <span>{copied ? 'Copied!' : 'Copy link'}</span>
                        </button>

                        <button
                            onClick={() => {
                                shareToTwitter();
                                setShowOptions(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                            <span>Share on X</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
