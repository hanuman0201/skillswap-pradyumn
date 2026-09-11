import React from 'react';
import { ArrowRight, ChevronRight, UserCheck, Calendar, Award, Sparkles, Video, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface MasterFlowProps {
  onOpenAuth: () => void;
  onHowItWorks: () => void;
}

export const MasterFlow: React.FC<MasterFlowProps> = ({ onOpenAuth, onHowItWorks }) => {
  const cards = [
    {
      step: '01',
      title: 'Set Up Your Profile.',
      description: 'Tell us what you can teach and what you want to learn. Add a quick bio and your availability.',
      image: 'https://framerusercontent.com/images/7nJmBjVIOTP6Wl7r94HBQ2LcbJg.png',
      hasAction: true,
      actionText: 'Complete Profile',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Get Smart Matches Instantly.',
      description: 'Our AI pairs you with people who match your skills and learning interests—no complicated searching.',
      image: 'https://framerusercontent.com/images/hhnp8waXZfDtkU2RkfeUGpd4y0.png',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Connect & Schedule.',
      description: 'Start a chat directly from the match, agree on a time, and schedule your session—right in the app.',
      image: 'https://framerusercontent.com/images/QOrYpsJTQuaHXPMTkm9ugwnNt7I.png',
      icon: Calendar,
    },
    {
      step: '04',
      title: 'Exchange Skills in Real Time.',
      description: 'Join a video session and start learning or teaching immediately. No waiting, no lengthy onboarding.',
      image: 'https://framerusercontent.com/images/sNsNGCxnfwMsIlDhQ3pMp7UhiI.png',
      icon: Video,
    },
    {
      step: '05',
      title: 'Earn Points & Track Your Progress.',
      description: 'After every session, earn points, level up your profile, and unlock badges for achievements.',
      image: 'https://framerusercontent.com/images/l05zWYuhu0kjCNuJxKeI0v6JfY.png',
      icon: Award,
    },
    {
      step: '06',
      title: 'Grow Your Network & Opportunities.',
      description: 'Stay connected with your matches, discover new skills, and keep expanding your learning circle effortlessly.',
      image: 'https://framerusercontent.com/images/U2KFwrqJDk82cWcCCL6GL0x6k.png',
      icon: Users,
    },
  ];

  return (
    <section id="howitworks" className="py-24 px-4 sm:px-6 bg-black border-t border-white/5 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-['Poppins',sans-serif]">
            A learning experience <br className="hidden sm:inline" />
            built around you.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 font-normal">
            Everything you need to connect, grow, and unlock new skills—right at your fingertips.
          </p>
        </div>

        {/* 2-Column Responsive Grid matching the Framer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121314] flex flex-col justify-between p-6 sm:p-8 hover:border-white/25 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                {/* Top illustration container */}
                <div className="relative w-full h-56 sm:h-64 mb-6 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121314] via-transparent to-black/20" />
                  
                  {/* Step Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90">
                    <Icon className="w-3.5 h-3.5 text-[#3d9be9]" />
                    <span>Step {card.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-white/65 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {card.hasAction && (
                    <div className="mt-5 pt-3 border-t border-white/10">
                      <button
                        onClick={onOpenAuth}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3d9be9] hover:text-[#5db1f7] transition-colors"
                      >
                        <span>{card.actionText}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section bottom CTA */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={onHowItWorks}
            className="inline-flex items-center gap-2 rounded-full bg-[#3d9be9] px-7 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/20 hover:bg-[#2a7dd7] transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>How it works</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
