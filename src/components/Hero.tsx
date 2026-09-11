import React from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenAuth: () => void;
  onExploreFeatures: () => void;
  isLoggedIn?: boolean;
  onOpenProfile?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAuth,
  onExploreFeatures,
  isLoggedIn,
  onOpenProfile,
}) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Video Layer with Gradient Mask */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 filter brightness-75"
          poster="https://framerusercontent.com/images/7nJmBjVIOTP6Wl7r94HBQ2LcbJg.png"
        >
          <source
            src="https://framerusercontent.com/assets/DIxKdkWMeotCUZDGcvrTFMPqq8c.mp4"
            type="video/mp4"
          />
        </video>
        {/* Mask gradient matching Framer CSS mask: linear-gradient(#000 60%, transparent 100%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_85%)] pointer-events-none" />
      </div>

      {/* Floating subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/20 via-[#3d9be9]/25 to-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Micro badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs text-white/80 mb-6 shadow-inner"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#3d9be9] animate-pulse" />
          <span className="font-medium">The world’s first peer-to-peer skill exchange platform</span>
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="space-y-1 sm:space-y-2"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-['Poppins',sans-serif] leading-[1.1]">
            Learn anything.
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-['Poppins',sans-serif] leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#3d9be9]">
              Teach what you love.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed font-normal"
        >
          A global platform where people exchange skills instead of money. Real-time AI matching.
          No fees, no gatekeeping — just human connection and meaningful growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={isLoggedIn ? onOpenProfile : onOpenAuth}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#3d9be9] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-[#2a7dd7] hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{isLoggedIn ? 'Go to My Profile' : 'Get started'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/35"
          >
            <Compass className="w-4 h-4 text-[#3d9be9]" />
            <span>Explore features</span>
          </button>
        </motion.div>

        {/* Key indicators row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3d9be9]" />
            <span>Smart Match Algorithm</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-2">
            <span className="text-[#3d9be9] font-bold">1:1</span>
            <span>Live Video Sessions</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-2">
            <span className="text-[#3d9be9] font-bold">0%</span>
            <span>Transaction Fees</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
