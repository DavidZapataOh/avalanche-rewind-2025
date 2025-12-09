'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Play, Wallet, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WolfiMascot } from '@/components/WolfiMascot';
import Link from 'next/link';

// The year for this Rewind - 2025
const REWIND_YEAR = 2025;

export default function HomePage() {
  const router = useRouter();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [isGenerating, setIsGenerating] = useState(false);
  const [submittingStub, setSubmittingStub] = useState(false); // Visual stub for "analyzing" state

  // Get the primary wallet address
  const primaryWallet = wallets?.[0];
  const walletAddress = primaryWallet?.address;

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGenerateRewind = async () => {
    if (!walletAddress) return;

    setSubmittingStub(true);

    // Simulate "Wolfi decoding data" for a moment before routing
    setTimeout(() => {
      setIsGenerating(true);
      router.push(`/rewind/${walletAddress}/${REWIND_YEAR}`);
    }, 2500);
  };

  // Loading "Analyzing" Screen
  if (submittingStub) {
    return (
      <main className="min-h-screen bg-[#050816] flex flex-col items-center justify-center relative overflow-hidden text-white font-sans p-4">
        {/* Background Noise/Grain Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        <div className="flex flex-col items-center max-w-lg text-center z-10">
          <WolfiMascot expression="thinking" scale={1.2} className="mb-8" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-black text-white tracking-tight">
              Wolfi is decoding your year...
            </h2>
            <div className="flex justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-2xl"
              >
                ⚙️
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                className="text-2xl"
              >
                📜
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                className="text-2xl"
              >
                🔺
              </motion.div>
            </div>
            <p className="text-gray-400 font-mono text-sm">
              Analyzing transactions from {REWIND_YEAR}...
            </p>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050816] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Cartoon Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Stylized Mountains */}
        <svg className="absolute bottom-0 left-0 w-full h-[50vh] opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#E84142" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

        {/* Old Film Grain Overlay (Simulated with noise pattern URL or CSS) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full px-6">

        {/* Title Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }} // Bouncy enter
          className="mb-8"
        >
          <div className="inline-block relative">
            {/* Decorative 'The' */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xl text-gray-400 uppercase tracking-[0.3em] font-bold">
              The <span className="text-xs">un</span>Official
            </span>

            <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter drop-shadow-[0_4px_0_rgba(232,65,66,1)]">
              AVALANCHE
            </h1>
            <h2 className="text-5xl md:text-8xl font-black text-avax-red leading-none tracking-tighter -mt-2 md:-mt-4 italic transform -rotate-2">
              REWIND
            </h2>

            {/* Year Badge */}
            <div className="absolute -right-4 -bottom-4 bg-white text-black font-black text-xl px-3 py-1 rounded-full transform rotate-12 border-4 border-black box-border">
              {REWIND_YEAR}
            </div>
          </div>
        </motion.div>

        {/* Mascot Centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <WolfiMascot expression="happy" scale={1.5} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-300 font-medium mb-10 max-w-md mx-auto"
        >
          Starring <span className="text-white font-bold">You</span> in a spectacular journey through your on-chain year.
        </motion.p>

        {/* Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm mx-auto"
        >
          {!ready ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-8 h-8 text-avax-red animate-spin" />
            </div>
          ) : !authenticated ? (
            <button
              onClick={handleConnect}
              className="w-full group relative bg-white text-black font-black text-xl py-4 px-8 rounded-full border-4 border-black hover:scale-105 transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(232,65,66,1)] hover:shadow-[6px_6px_0px_0px_rgba(232,65,66,1)]"
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                CONNECT WALLET
              </span>
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Connected Badge */}
              <div className="bg-[#0D1224] border-2 border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-avax-red flex items-center justify-center border-2 border-white">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Connected as</div>
                    <div className="text-white font-bold font-mono">
                      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '...'}
                    </div>
                  </div>
                </div>
                <button onClick={logout} className="text-xs text-red-400 font-bold hover:underline">
                  EXIT
                </button>
              </div>

              {/* Start Button */}
              <button
                onClick={handleGenerateRewind}
                disabled={isGenerating}
                className="w-full group relative bg-avax-red text-white font-black text-xl py-4 px-8 rounded-full border-4 border-black hover:scale-105 transition-transform active:scale-95 shadow-[4px_4px_0px_0px_#FFF] hover:shadow-[6px_6px_0px_0px_#FFF] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    LOADING...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5 fill-current" />
                    START THE SHOW
                  </span>
                )}
              </button>
            </div>
          )}
        </motion.div>

      </div>

      {/* Footer Credits */}
      <div className="absolute bottom-4 text-center w-full text-white/20 text-xs font-bold uppercase tracking-widest">
        Avalanche Rewind © 2025 • By <Link href="https://x.com/DavidZapataOh" className="hover:text-[#E84142] underline" target="_blank">DavidZapataOh</Link>
      </div>
    </main>
  );
}
