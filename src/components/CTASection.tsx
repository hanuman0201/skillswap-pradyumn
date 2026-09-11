import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CTASectionProps {
  onOpenAuth: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenAuth }) => {
  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-black text-white border-t border-white/5">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-70 pointer-events-none">
        <img
          src="https://framerusercontent.com/images/cnzd5LLL7NpZjKxNXGrkBU5b60.png"
          alt="SkillSwap Atmosphere"
          className="w-full h-full max-w-6xl object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1 text-xs text-[#3d9be9] mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Available Worldwide Today</span>
        </motion.div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 font-['Poppins',sans-serif]">
          SkillSpace is out now!
        </h2>

        <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-10 font-normal">
          Join thousands of learners, teachers, creators, and hobbyists exchanging knowledge without price tags.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#3d9be9] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#2a7dd7] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/40"
          >
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </section>
  );
};
