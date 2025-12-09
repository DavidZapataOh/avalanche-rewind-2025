'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AddressAvatar } from '@/components/AddressAvatar';
import { ShareButton } from '@/components/ShareButton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { formatAddress, formatUSD, generateShareUrl } from '@/lib/utils';
import { mintRewindNft, isMintingAvailable } from '@/lib/nft';
import { Sparkles, Download, Loader2, CheckCircle, AlertCircle, ExternalLink, Mountain } from 'lucide-react';
import type { AvalancheRewind } from '@/lib/types';

interface SummarySlideProps {
    rewind: AvalancheRewind;
    walletProvider?: unknown;
    isWalletConnected?: boolean;
}

export function SummarySlide({
    rewind,
    walletProvider,
    isWalletConnected = false
}: SummarySlideProps) {
    const [mintState, setMintState] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
    const [mintTxHash, setMintTxHash] = useState<string | null>(null);
    const [mintError, setMintError] = useState<string | null>(null);

    const shareUrl = generateShareUrl(rewind.address, rewind.year);
    const mintingAvailable: boolean = isMintingAvailable();
    const canMint: boolean = Boolean(isWalletConnected && walletProvider && mintingAvailable);

    const handleMint = async () => {
        if (!walletProvider) return;

        setMintState('minting');
        setMintError(null);

        try {
            const result = await mintRewindNft({
                provider: walletProvider,
                address: rewind.address as `0x${string}`,
                rewind,
            });

            if (result.success && result.txHash) {
                setMintState('success');
                setMintTxHash(result.txHash);
            } else {
                setMintState('error');
                setMintError(result.error || 'Failed to mint NFT');
            }
        } catch (err) {
            setMintState('error');
            setMintError(err instanceof Error ? err.message : 'Failed to mint NFT');
        }
    };

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto w-full px-4"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 text-avax-red mb-8"
                >
                    <Mountain className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-widest">
                        Summit Reached
                    </span>
                    <Mountain className="w-6 h-6" />
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full relative group perspective-1000"
                >
                    {/* Card background glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-avax-red/20 via-purple-500/10 to-blue-500/10 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />

                    <div className="relative bg-[#0D1224] p-8 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* Demo badge */}
                        {rewind.isDemoData && (
                            <div className="absolute top-6 right-6 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Demo Mode
                            </div>
                        )}

                        {/* Avatar and Year */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <AddressAvatar address={rewind.address} size={56} className="ring-2 ring-white/10" />
                                <div className="text-left">
                                    <div className="text-white font-bold">{formatAddress(rewind.address, 6)}</div>
                                    <div className="text-gray-400 text-xs uppercase tracking-wide">Avalanche Legend</div>
                                </div>
                            </div>
                            <div className="text-4xl font-black text-white/10">{rewind.year}</div>
                        </div>

                        {/* Persona Title - Centerpiece */}
                        <div className="text-center mb-8">
                            <div className="inline-block px-4 py-1 rounded-full bg-avax-red/10 text-avax-red text-sm font-bold uppercase tracking-wider mb-3">
                                Archetype
                            </div>
                            <h2 className="text-3xl font-black text-white leading-tight">
                                {rewind.persona.label}
                            </h2>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { label: "Transactions", value: rewind.totalTransactions },
                                { label: "Active Days", value: rewind.activeDays },
                                { label: "Volume USD", value: rewind.totalVolumeUSD, isCurrency: true },
                                { label: "Longest Streak", value: rewind.longestStreakDays, suffix: "Days" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#151B30] rounded-xl p-3 border border-white/5">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{stat.label}</div>
                                    <AnimatedNumber
                                        value={stat.value}
                                        formatFn={stat.isCurrency ? formatUSD : undefined}
                                        className="text-lg font-bold text-white block"
                                        suffix={stat.suffix ? ` ${stat.suffix}` : ''}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Footer Logo */}
                        <div className="flex items-center justify-center gap-2 text-white/20 text-sm font-semibold tracking-widest uppercase">
                            <Mountain className="w-4 h-4" />
                            Avalanche Rewind
                        </div>
                    </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8 w-full"
                >
                    <ShareButton
                        url={shareUrl}
                        title={`My Avalanche Rewind ${rewind.year}`}
                        text={`I'm a ${rewind.persona.label} on Avalanche! 🏔️ Check out my ${rewind.year} Rewind:`}
                        className="flex-1 btn-primary py-4 text-base font-bold bg-white text-black hover:bg-gray-100"
                    />

                    {canMint && mintState === 'idle' && (
                        <button
                            onClick={handleMint}
                            className="flex-1 btn-secondary py-4 text-base font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                <span>Mint Card</span>
                            </div>
                        </button>
                    )}

                    {mintState === 'minting' && (
                        <div className="flex-1 py-4 flex items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/10 text-white/50 cursor-wait">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Minting...</span>
                        </div>
                    )}
                </motion.div>

                {/* Mint Status Messages */}
                {mintState === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full mt-4 bg-green-500/10 text-green-400 rounded-xl p-4 flex items-center justify-between border border-green-500/20"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-bold">Minted Safely!</span>
                        </div>
                        {mintTxHash && (
                            <a
                                href={`https://snowtrace.io/tx/${mintTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-bold hover:underline uppercase tracking-wide"
                            >
                                View TX <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </motion.div>
                )}

                {mintState === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full mt-4 bg-red-500/10 text-red-400 rounded-xl p-4 flex items-center justify-between border border-red-500/20"
                    >
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-bold">Error Minting</span>
                        </div>
                        <button
                            onClick={() => setMintState('idle')}
                            className="text-xs font-bold underline uppercase tracking-wide"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
