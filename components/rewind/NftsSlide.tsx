'use client';

import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Image, Palette, Sparkles, Award } from 'lucide-react';
import type { AggregatedNfts } from '@/lib/types';

interface NftsSlideProps {
    nfts: AggregatedNfts;
}

export function NftsSlide({ nfts }: NftsSlideProps) {
    const hasNfts = nfts.collections.length > 0;
    const topCollections = nfts.collections.slice(0, 5);

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full px-6"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10"
                >
                    <Palette className="w-12 h-12 text-purple-400" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 text-center"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Creative Footprint
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
                        Your Digital Gallery
                    </h2>
                </motion.div>

                {hasNfts ? (
                    <>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-300 mb-10 max-w-lg"
                        >
                            You curated works from <span className="text-purple-400 font-bold">{nfts.collections.length}</span> different collections.
                        </motion.p>

                        {/* Top Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-8 mb-10"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white font-mono">{nfts.totalNfts}</div>
                                <div className="text-sm text-gray-500">NFTs Collected</div>
                            </div>
                            <div className="w-px bg-white/10 h-10" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white font-mono">{nfts.totalTxCount}</div>
                                <div className="text-sm text-gray-500">Interactions</div>
                            </div>
                        </motion.div>

                        {/* Collections grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {topCollections.map((nft, index) => (
                                <motion.div
                                    key={nft.collectionAddress}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="bg-[#0D1224]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-[#151B30] transition-colors hover:scale-[1.02] duration-300"
                                >
                                    {/* Collection avatar */}
                                    <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 overflow-hidden">
                                        {nft.logoURI ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={nft.logoURI}
                                                alt={nft.collectionName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <Image className="w-6 h-6 text-purple-400" />
                                        )}
                                    </div>

                                    <div className="text-left flex-1 min-w-0">
                                        <div className="font-bold text-white text-lg truncate mb-1">
                                            {nft.collectionName}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="bg-white/5 px-2 py-0.5 rounded text-gray-300">{nft.nftCount} Items</span>
                                            <span>{nft.txCount} Actions</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Trophy Badge */}
                        {topCollections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20"
                            >
                                <Award className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-300">
                                    Your Top Pick: <span className="text-white font-bold">{topCollections[0].collectionName}</span>
                                </span>
                            </motion.div>
                        )}
                    </>
                ) : (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 p-10 rounded-3xl max-w-md"
                    >
                        <Image className="w-16 h-16 text-gray-600 mb-6 mx-auto" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            The Canvas is Blank
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            No NFT activity found this year. The art world of Avalanche awaits your discovery!
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
