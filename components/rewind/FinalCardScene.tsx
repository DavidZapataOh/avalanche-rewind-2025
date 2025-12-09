'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { WolfiMascot, WolfiExpression } from '@/components/WolfiMascot';
import { Download, Share2, Mountain, Loader2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { AvalancheRewind } from '@/lib/types';
import { mintRewindNft, isMintingAvailable } from '@/lib/nft';
import { cn } from '@/lib/utils';
import { useWallets } from '@privy-io/react-auth';

interface FinalCardSceneProps {
    rewind: AvalancheRewind;
}

export function FinalCardScene({ rewind }: FinalCardSceneProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [mintState, setMintState] =
        useState<'idle' | 'minting' | 'success' | 'error'>('idle');
    const [mintTxHash, setMintTxHash] = useState<string | null>(null);

    const { wallets } = useWallets();
    const primaryWallet = wallets?.[0];

    const generateShareUrl = () => {
        const title = "Just unlocked my Avalanche year card 🔺";
        const text = `Take a look at my Avalanche Rewind ${rewind.year}!`;
        const image = "[Drop your card image here]"
        const url = window.location.href.replace('/rewind/', '/share/');
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title + "\n\n" + text + "\n\n" + image,
        )}`;
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `avalanche-rewind-${rewind.year}-${rewind.address.slice(
                0,
                6,
            )}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download card', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleMint = async () => {
        if (!primaryWallet || !isMintingAvailable()) return;

        setMintState('minting');
        try {
            const provider = await primaryWallet.getEthereumProvider();
            const result = await mintRewindNft({
                provider,
                address: rewind.address as `0x${string}`,
                rewind,
            });

            if (result.success && result.txHash) {
                setMintState('success');
                setMintTxHash(result.txHash);
            } else {
                setMintState('error');
            }
        } catch (e) {
            console.error(e);
            setMintState('error');
        }
    };

    const getMascotExpression = (id: string): WolfiExpression => {
        if (id === 'high-altitude-degen') return 'excited';
        if (id === 'nft-peaks-explorer') return 'artist';
        if (id === 'defi-trailblazer') return 'cool';
        if (id === 'summit-builder') return 'builder';
        if (id === 'avalanche-veteran') return 'cool';
        if (id === 'cross-chain-bridger') return 'thinking';
        return 'happy';
    };

    const shortAddress = `${rewind.address.slice(0, 6)}...${rewind.address.slice(
        -4,
    )}`;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-4 relative overflow-y-auto pt-10 pb-20">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* --- CARD MEJORADA, SOLO ESTA PARTE CAMBIA --- */}
                <div
                    ref={cardRef}
                    className="w-full max-w-sm text-black border-[6px] border-black rounded-2xl relative shadow-xl overflow-hidden"
                    style={{ aspectRatio: '3/4' }}
                >
                    {/* Marco exterior Avalanche rojo */}
                    <div className="absolute inset-0 bg-avax-red" />

                    {/* Marco interior crema tipo papel vintage */}
                    <div className="absolute inset-[10px] rounded-xl bg-[#FDF4E5] border-[4px] border-black overflow-hidden">
                        {/* Textura papel */}
                        <div className="absolute inset-0 opacity-15 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                        {/* HEADER: logo + título */}
                        <div className="relative flex justify-between items-center px-4 pt-3 pb-2 border-b-[3px] border-black bg-gradient-to-r from-avax-red to-[#F26666]">
                            <div className="flex items-center gap-3">
                                <div className="relative w-9 h-9 rounded-full bg-white border-[3px] border-black flex items-center justify-center">
                                    {/* Ajusta el src al path real del logo en /public */}
                                    <Image
                                        src="/avalanche-logo.svg"
                                        alt="Avalanche"
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                                <div className="leading-tight">
                                    <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-black/80">
                                        Avalanche
                                    </div>
                                    <div className="text-sm font-black uppercase tracking-[0.18em] text-black">
                                        Rewind
                                    </div>
                                </div>
                            </div>
                            <div className="bg-black text-[#FDF4E5] px-3 py-1 rounded-full border-[3px] border-[#FDF4E5] font-mono text-xs font-bold">
                                {rewind.year}
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="relative flex flex-col items-center h-full px-4 pt-3 pb-4 text-center">

                            {/* Wolfi central con halo rubber-hose (Moved up since starring badge is gone) */}
                            <div className="relative mt-4 mb-2">
                                <div className="absolute inset-0 translate-y-3 blur-xl rounded-full bg-avax-red/35" />
                                <div className="relative">
                                    <WolfiMascot
                                        expression={getMascotExpression(rewind.persona.id)}
                                        scale={0.85}
                                        className="drop-shadow-[0_6px_0_#000]"
                                    />
                                </div>
                            </div>

                            {/* Archetype */}
                            <div className="mb-3">
                                <div className="text-[9px] uppercase font-bold text-black/55 tracking-[0.2em]">
                                    Avalanche Archetype
                                </div>
                                <div className="text-lg font-black text-avax-red leading-tight">
                                    {rewind.persona.label}
                                </div>
                            </div>

                            {/* GRID DE STATS tipo cartoon */}
                            <div className="w-full grid grid-cols-2 gap-3 mt-1">
                                <div className="bg-white border-[3px] border-black rounded-xl px-2 py-2 transform -rotate-2 shadow-[3px_3px_0_0_#000]">
                                    <div className="text-[9px] uppercase font-bold text-black/50">
                                        Total Txns
                                    </div>
                                    <div className="text-lg font-black leading-none">
                                        {rewind.totalTransactions}
                                    </div>
                                </div>
                                <div className="bg-white border-[3px] border-black rounded-xl px-2 py-2 transform rotate-2 shadow-[3px_3px_0_0_#000]">
                                    <div className="text-[9px] uppercase font-bold text-black/50">
                                        Volume Moved
                                    </div>
                                    <div className="text-sm font-black leading-none">
                                        ${(rewind.totalVolumeUSD / 1000).toFixed(1)}k
                                    </div>
                                </div>
                                <div className="bg-white border-[3px] border-black rounded-xl px-2 py-2 transform rotate-1 shadow-[3px_3px_0_0_#000]">
                                    <div className="text-[9px] uppercase font-bold text-black/50">
                                        Longest Streak
                                    </div>
                                    <div className="text-sm font-black leading-none">
                                        {rewind.longestStreakDays} days
                                    </div>
                                </div>
                                <div className="bg-white border-[3px] border-black rounded-xl px-2 py-2 transform -rotate-1 shadow-[3px_3px_0_0_#000]">
                                    <div className="text-[9px] uppercase font-bold text-black/50">
                                        Top Token
                                    </div>
                                    <div className="text-xs font-black leading-tight truncate">
                                        {rewind.tokens?.[0]?.symbol ?? 'AVAX'}
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER pequeño tipo ticket */}
                            <div className="mt-auto pt-3 w-full text-center text-[8px] font-mono text-black/40 uppercase tracking-[0.2em]">
                                Avalanche · C-Chain · {rewind.year}
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- FIN CARD --- */}

                {/* Actions (NO TOCADAS) */}
                <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-md">
                    <a
                        href={generateShareUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] bg-[#1DA1F2] text-white border-2 border-black rounded-full py-3 px-4 flex items-center justify-center gap-2 font-black uppercase text-sm shadow-[4px_4px_0_black] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        <Share2 className="w-4 h-4" /> Share on X
                    </a>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 min-w-[140px] bg-white text-black border-2 border-black rounded-full py-3 px-4 flex items-center justify-center gap-2 font-black uppercase text-sm shadow-[4px_4px_0_black] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {isDownloading ? 'Saving...' : 'Download'}
                    </button>

                    <button
                        onClick={handleMint}
                        disabled={
                            mintState === 'minting' ||
                            mintState === 'success' ||
                            !isMintingAvailable()
                        }
                        className={cn(
                            'w-full bg-avax-red text-white border-2 border-black rounded-full py-4 px-6 flex items-center justify-center gap-2 font-black uppercase text-lg shadow-[4px_4px_0_black] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[4px_4px_0_black]',
                            mintState === 'success' && 'bg-green-500 border-green-700',
                        )}
                    >
                        {mintState === 'minting' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Minting NFT...
                            </>
                        ) : mintState === 'success' ? (
                            <>
                                <Check className="w-5 h-5" /> Minted!
                            </>
                        ) : (
                            <>
                                <Mountain className="w-5 h-5" /> Mint as NFT
                            </>
                        )}
                    </button>
                    {!isMintingAvailable() && (
                        <p className="text-xs text-gray-500 font-mono text-center w-full">
                            Switch to Avalanche C-Chain to mint.
                        </p>
                    )}

                    {mintTxHash && (
                        <p className="text-[11px] text-gray-400 font-mono text-center w-full break-all mt-1">
                            Tx: {mintTxHash}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
