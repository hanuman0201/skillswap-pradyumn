import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Zap, Scale } from 'lucide-react';

export const CommunityTrust: React.FC = () => {
  const pillars = [
    {
      icon: Scale,
      title: 'Contribution, Not Payment',
      desc: 'No price tags, paid subscriptions, or predatory upselling.',
    },
    {
      icon: HeartHandshake,
      title: 'Mutual Respect',
      desc: 'Everyone has something valuable to share regardless of formal degrees.',
    },
    {
      icon: ShieldCheck,
      title: 'Peer Verified Ratings',
      desc: 'Reputation builds organically through real session reviews and completed trades.',
    },
    {
      icon: Zap,
      title: 'Real-Time Momentum',
      desc: 'Teach today, earn points instantly, book your next lesson whenever inspiration strikes.',
    },
  ];

  return (
    <section
      id="whyus"
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0d0d 0%, #1b2bff 20%, #3c9be8 85%, #0d0d0d 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white mb-6">
          Community Trust &amp; Philosophy
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight font-['Poppins',sans-serif]">
          No money. No pressure. <br />
          Just real learning.
        </h2>

        {/* Main Philosophy Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-8 text-base sm:text-2xl font-light text-white leading-relaxed max-w-3xl space-y-4"
        >
          <p>
            SkillSwap runs on contribution, not payment. When you teach, you earn points. When you want to learn,
            you use those points. It’s a system built on <strong className="font-semibold text-white">fairness</strong> — not fees.
          </p>
          <p className="text-sm sm:text-lg text-white/85">
            There are no price tags, upsells, or subscriptions. Just people helping people grow. Every session is
            rated, so quality and trust grow naturally. You don’t need to be a pro to share what you know. You just
            need experience — and willingness to give.
          </p>
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-5 text-left flex flex-col justify-between"
              >
                <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{pillar.title}</h4>
                  <p className="text-xs text-white/70 leading-normal">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
