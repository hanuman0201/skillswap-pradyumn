import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StorySectionProps {
  onOpenStory: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onOpenStory }) => {
  return (
    <section id="ourstory" className="relative py-24 px-4 sm:px-6 bg-black border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Sub-label */}
        <div className="text-xs uppercase tracking-widest text-[#3d9be9] font-medium mb-4">
          Why SkillSwap Exists
        </div>

        {/* Major Headline */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-8 font-['Poppins',sans-serif]">
          We believe everyone has something valuable to teach.
        </h2>

        {/* Narrative Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-2xl font-light leading-relaxed text-white/80 max-w-3xl space-y-4 font-['Poppins',sans-serif]"
        >
          <p>
            Traditional learning platforms are expensive, rigid, and often one-sided. But what if learning was{' '}
            <span className="text-white font-medium">more personal</span>?{' '}
            <span className="text-white font-medium">More fair</span>?{' '}
            <span className="text-[#3d9be9] font-medium">More human</span>?
          </p>
          <p className="text-base sm:text-xl text-white/60">
            SkillSwap is a platform for peer-to-peer learning — where your experience matters. If you’ve ever figured something out on your own, you’re already a teacher. We’re not building another course site. We’re building a global network of skill-sharers — helping each other grow in real time.
          </p>
        </motion.div>

        {/* Button */}
        <div className="mt-10">
          <button
            onClick={onOpenStory}
            className="group inline-flex items-center gap-2 rounded-full bg-[#3d9be9] px-7 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/20 hover:bg-[#2a7dd7] transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Read our story</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
