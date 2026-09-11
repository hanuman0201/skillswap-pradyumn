import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight, BookOpen, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeachModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const TeachModal: React.FC<TeachModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [skillToTeach, setSkillToTeach] = useState('');
  const [category, setCategory] = useState('dev');
  const [skillToLearn, setSkillToLearn] = useState('');
  const [email, setEmail] = useState('');
  const [availability, setAvailability] = useState('1-2 hrs / week');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillToTeach || !email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSkillToTeach('');
    setSkillToLearn('');
    setEmail('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Black & White Glass Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative z-10 w-full max-w-xl rounded-2xl border border-white/20 bg-black/85 backdrop-blur-2xl p-6 sm:p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white backdrop-blur-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                  Mentor Profile Registered
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2 font-display">
                  You're registered to teach {skillToTeach}!
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto mb-6 font-body">
                  We've sent a verification link to <span className="text-white font-semibold">{email}</span>.
                  Once verified, learners searching for <span className="text-white font-medium">{skillToTeach}</span> will be able to propose trades with you.
                </p>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md max-w-md mx-auto mb-6 text-left">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-1">
                    <span>Initial Reward</span>
                    <span className="text-white font-bold">+100 Welcome Points</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span>Teaching Badge</span>
                    <span className="text-white font-bold">Verified Mentor LVL 1</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="rounded-full bg-white text-black px-8 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-white/90 transition-all shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div>
                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono uppercase tracking-wider text-white mb-3 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-white" />
                  Teach &amp; Earn Credits
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-display">
                  Teach what you know.
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-body mb-6">
                  Teach 1-on-1 sessions on your schedule. You set the topics, guidelines, and availability. No payment processing, pure skill barter.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Skill to Teach */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Skill or Topic You Want to Teach *
                    </label>
                    <input
                      type="text"
                      required
                      value={skillToTeach}
                      onChange={(e) => setSkillToTeach(e.target.value)}
                      placeholder="e.g. Figma UI Design, Next.js, Conversational Japanese, Guitar..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none backdrop-blur-md transition-colors"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dev', label: 'Engineering' },
                      { id: 'design', label: 'Design & 3D' },
                      { id: 'ai', label: 'AI & Data' },
                      { id: 'languages', label: 'Languages' },
                      { id: 'music', label: 'Music & Audio' },
                      { id: 'business', label: 'Leadership' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`py-2 px-2 text-xs font-mono rounded-lg border transition-all text-center ${
                          category === c.id
                            ? 'bg-white text-black font-semibold border-white'
                            : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  {/* Experience Level & Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                        Your Mastery Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs text-white focus:border-white/40 focus:outline-none backdrop-blur-md"
                      >
                        <option value="Beginner Friendly" className="bg-black text-white">Beginner Friendly</option>
                        <option value="Intermediate" className="bg-black text-white">Intermediate (2-4 yrs)</option>
                        <option value="Advanced / Staff" className="bg-black text-white">Advanced / Industry Pro (5+ yrs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                        Weekly Availability
                      </label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 text-xs text-white focus:border-white/40 focus:outline-none backdrop-blur-md"
                      >
                        <option value="1-2 hrs / week" className="bg-black text-white">1–2 hrs / week</option>
                        <option value="3-5 hrs / week" className="bg-black text-white">3–5 hrs / week</option>
                        <option value="Weekends Only" className="bg-black text-white">Weekends Only</option>
                        <option value="Flexible On-Demand" className="bg-black text-white">Flexible On-Demand</option>
                      </select>
                    </div>
                  </div>

                  {/* Desired Skill in Exchange */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      What would you like to learn in return? (Optional)
                    </label>
                    <input
                      type="text"
                      value={skillToLearn}
                      onChange={(e) => setSkillToLearn(e.target.value)}
                      placeholder="e.g. Python, Video Editing, Spanish, Public Speaking..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none backdrop-blur-md transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none backdrop-blur-md transition-colors"
                    />
                  </div>

                  {/* Verification note */}
                  <div className="flex items-center gap-2 text-[11px] text-white/50 pt-1">
                    <ShieldCheck className="w-4 h-4 text-white/70 shrink-0" />
                    <span>No credit card required. Free peer matchmaking and session encryption.</span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-white text-black py-3.5 text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
                    >
                      <span>Create Mentor Listing</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
