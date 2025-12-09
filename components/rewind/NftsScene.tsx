'use client';

import { motion } from 'framer-motion';
import { WolfiMascot } from '@/components/WolfiMascot';
import { NftMedia } from '@/components/rewind/NftMedia';
import type { AggregatedNfts } from '@/lib/types';

interface NftsSceneProps {
    nfts: AggregatedNfts;
}

export function NftsScene({ nfts }: NftsSceneProps) {
    const hasNfts = nfts.totalNfts > 0;
    // Show top 10 collections
    const topCollections = nfts.collections.slice(0, 10);

    if (!hasNfts) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
                <WolfiMascot expression="thinking" scale={1.2} className="mb-8" />
                <h2 className="text-4xl font-black text-white mb-4 uppercase">
                    The Gallery is Empty...
                </h2>
                <p className="text-gray-400 font-mono text-xl max-w-md">
                    No NFTs collected this year. Maybe 2026 is your artistic era?
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-4 relative">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 text-center z-10"
            >
                <div className="bg-avax-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block border-2 border-black">
                    Your Digital Gallery
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase drop-shadow-md">
                    Masterpieces
                </h2>
            </motion.div>

            {/* Gallery Wall - Horizontal Scroll */}
            <div className="w-full overflow-x-auto pb-8 pt-4 no-scrollbar relative z-10 mt-10">
                <div className="flex items-center gap-8 md:gap-12 px-12 min-w-max mx-auto">
                    {topCollections.map((collection, idx) => {
                        // Slight variation in rotation for "cartoon crooked" look
                        const rotation = idx % 2 === 0 ? 3 : -3;

                        return (
                            <motion.div
                                key={collection.collectionAddress}
                                initial={{ rotate: rotation, y: -100, opacity: 0 }}
                                animate={{ rotate: rotation, y: 0, opacity: 1 }}
                                whileHover={{ scale: 1.05, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    delay: idx * 0.2,
                                    bounce: 0.5
                                }}
                                className="bg-[#1a1a1a] p-4 pb-8 border-8 border-[#8B4513] rounded-sm shadow-[10px_10px_20px_rgba(0,0,0,0.5)] w-64 md:w-72 relative"
                            >
                                {/* Hanging String Visual */}
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-white/20" />
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/50" />

                                {/* Frame Content */}
                                <div className="aspect-square bg-gray-800 mb-4 overflow-hidden border-4 border-[#5c2e0c] relative group">
                                    {/* Smart Media Component */}
                                    <NftMedia
                                        src={collection.logoURI}
                                        alt={collection.collectionName}
                                        className="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold">{collection.nftCount} items</span>
                                    </div>
                                </div>

                                <h3 className="text-white font-bold text-lg truncate mb-1 font-mono text-center w-56 mx-auto">
                                    {collection.collectionName || 'Unknown'}
                                </h3>
                                <div className="text-center text-xs text-gray-400 uppercase tracking-wider mb-2">
                                    {collection.txCount} Interactions
                                </div>

                                {/* Status Badge (Held/Sold/Burned) */}
                                <div className="flex justify-center gap-2">
                                    <span className={`
                                        text-[10px] font-bold px-2 py-0.5 rounded border 
                                        ${collection.status === 'HELD'
                                            ? 'bg-[#5c2e0c] text-[#f5d0a9] border-[#3e1e07]' // Held (Classic Brown)
                                            : collection.status === 'BURNED'
                                                ? 'bg-black text-white border-red-500' // Burned (Ash/Fire)
                                                : 'bg-gray-700 text-gray-300 border-gray-600' // Sold/Traded
                                        }
                                    `}>
                                        {collection.status}
                                    </span>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-10 md:left-20"
            >
                <WolfiMascot expression="artist" scale={0.9} />
            </motion.div>
        </div>
    );
}
