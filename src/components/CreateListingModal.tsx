import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Coins,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { saveListingToFirestore, LiveListing } from '../lib/firebase';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onListingCreated?: (listing: LiveListing) => void;
}

const CATEGORIES = [
  'Engineering & Web Development',
  'AI & Machine Learning',
  'Design, UI/UX & 3D',
  'Languages & Linguistics',
  'Music, Audio & Sound Design',
  'Business, Startups & Leadership',
  'Culinary Arts & Baking',
  'Photography & Video Editing',
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onListingCreated,
}) => {
  const [type, setType] = useState<'teach' | 'learn'>('teach');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [tradeType, setTradeType] = useState<'coins' | 'barter' | 'both'>('both');
  const [coinsRate, setCoinsRate] = useState<number>(40);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide a title and description for your listing.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const listingId = `listing_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newListing: LiveListing = {
        id: listingId,
        title: title.trim(),
        description: description.trim(),
        type,
        category,
        skillsOffered: skillsOffered.trim() || (type === 'teach' ? title.trim() : 'N/A'),
        skillsWanted: skillsWanted.trim() || (type === 'learn' ? title.trim() : 'Standard 40 Coins'),
        tradeType,
        coinsRate: Number(coinsRate) || 40,
        authorId: currentUser.id,
        authorName: currentUser.name || 'SkillSpace Member',
        authorAvatar: currentUser.avatar,
        authorEmail: currentUser.email,
        createdAt: new Date().toISOString(),
      };

      await saveListingToFirestore(newListing);
      setSuccess(true);
      if (onListingCreated) {
        onListingCreated(newListing);
      }

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setDescription('');
        setSkillsOffered('');
        setSkillsWanted('');
        onClose();
      }, 1500);
    } catch (err: unknown) {
      console.error('Failed to create listing:', err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not publish listing to database. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#08f7bf]/20 to-[#3d9be9]/20 border border-[#08f7bf]/40 flex items-center justify-center text-[#08f7bf]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#08f7bf]/10 text-[#08f7bf] border border-[#08f7bf]/30">
                  Cloud Database &bull; Live Globally
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white tracking-tight mt-0.5">
                Create a Skill Exchange Listing
              </h3>
              <p className="text-xs text-white/60">
                Published to Cloud Firestore so everyone on SkillSpace can discover and trade with you.
              </p>
            </div>
          </div>

          {!currentUser ? (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-4">
              <p className="text-sm text-white/80">
                You need to be signed in to create and publish listings to the global database.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#08f7bf] to-[#3d9be9] text-black font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
              >
                Sign In or Create Account
              </button>
            </div>
          ) : success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#08f7bf]/20 border border-[#08f7bf] text-[#08f7bf] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Listing Published Successfully!</h4>
              <p className="text-xs text-white/70">
                Your listing is now live in Cloud Firestore and visible to all users across the world.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mode Selector: Teach vs Learn */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('teach')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      type === 'teach'
                        ? 'bg-[#08f7bf]/15 border-[#08f7bf] text-[#08f7bf]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Teach a Skill (Earn 40 Coins / Barter)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('learn')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      type === 'learn'
                        ? 'bg-[#3d9be9]/15 border-[#3d9be9] text-[#3d9be9]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Learn a Skill (Spend 40 Coins / Barter)</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === 'teach'
                      ? 'e.g., Full-Stack Next.js 15 & Server Components Mentoring'
                      : 'e.g., Seeking Conversational Japanese (JLPT N2 Pitch Accent)'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#08f7bf] text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/15 focus:border-[#08f7bf] text-sm text-white focus:outline-none transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#141722] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills Offered & Wanted */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Skills You Offer
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={skillsOffered}
                    onChange={(e) => setSkillsOffered(e.target.value)}
                    placeholder="e.g., Next.js 15, React 19, TypeScript"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#08f7bf] text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Skills / Terms Desired
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={skillsWanted}
                    onChange={(e) => setSkillsWanted(e.target.value)}
                    placeholder="e.g., Japanese, UI Design, or 40 Coins"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 focus:border-[#08f7bf] text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Trade Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Exchange Model
                  </label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value as 'coins' | 'barter' | 'both')}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141722] border border-white/15 focus:border-[#08f7bf] text-xs text-white focus:outline-none"
                  >
                    <option value="both">Both (Flexible: 40 Coins or 1:1 Barter)</option>
                    <option value="coins">Coins/Credits Only (Standard 40)</option>
                    <option value="barter">Direct 1:1 Barter Only (0 Coins)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Coin Rate per Session
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      readOnly
                      value={coinsRate}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-amber-300 font-mono font-bold focus:outline-none cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/40">
                      Standard: 40 Coins
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what you will cover, your experience level, session availability, and what you're looking forward to swapping..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#08f7bf] text-xs text-white placeholder-white/30 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Author signature preview */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <span className="font-semibold text-white block leading-tight">
                      Publishing as: {currentUser.name}
                    </span>
                    <span className="text-[10px] font-mono text-white/50">{currentUser.email}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#08f7bf]">
                  🪙 {currentUser.coins ?? 240} Coins in Wallet
                </span>
              </div>

              {/* Submit button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#08f7bf] to-[#3d9be9] text-black font-semibold text-xs flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#08f7bf]/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Cloud Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Live Listing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
