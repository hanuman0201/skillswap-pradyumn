import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  MessageCircle,
  Trash2,
  Plus,
  Coins,
  ArrowRight,
  Database,
  Users,
  Check,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import {
  LiveListing,
  subscribeToListings,
  deleteListingFromFirestore,
  saveListingToFirestore,
} from '../lib/firebase';

interface LiveMarketplaceProps {
  currentUser: UserProfile | null;
  onOpenCreateListing: () => void;
  onOpenAuth: () => void;
  onOpenMessengerWithUser?: (contactName: string, initialMessage?: string) => void;
}

// Initial seed listings if Cloud Firestore is freshly initialized
const SEED_LISTINGS: LiveListing[] = [
  {
    id: 'seed_nextjs',
    title: 'Full-Stack Next.js 15 & Server Components Deep Dive',
    description:
      'Hands-on session debugging Server Actions, hydration bottlenecks, and setting up vector cache with pgvector. Happy to trade for Japanese conversation or standard 40 coins.',
    type: 'teach',
    category: 'Engineering & Web Development',
    skillsOffered: 'Next.js 15, React 19, TypeScript, Docker',
    skillsWanted: 'Japanese Conversation or 40 Coins',
    tradeType: 'both',
    coinsRate: 40,
    authorId: 'user_tatsuo_mentor',
    authorName: 'Noor Al-Mansoor',
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorEmail: 'noor@skillspace.dev',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'seed_japanese',
    title: 'Native Japanese Pitch Accent & Natural Keigo Practice',
    description:
      'Tokyo native offering 1-on-1 natural intonation training for JLPT N2/N1 and business communication. Exchanging for Next.js or 40 coins.',
    type: 'teach',
    category: 'Languages & Linguistics',
    skillsOffered: 'Japanese (Native), Pitch Accent, Keigo',
    skillsWanted: 'Web Development or 40 Coins',
    tradeType: 'both',
    coinsRate: 40,
    authorId: 'user_tatsuo',
    authorName: 'Tatsuo Takahashi',
    authorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorEmail: 'tatsuo@skillspace.dev',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'seed_synth',
    title: 'Seeking Eurorack Modular Patching & Subtractive Sound Design',
    description:
      'Looking for an electronic music producer to walk me through analog filter patch design and sound design in Ableton. Willing to offer 40 coins or UI prototyping.',
    type: 'learn',
    category: 'Music, Audio & Sound Design',
    skillsOffered: 'Figma UI/UX, Design Tokens, 40 Coins',
    skillsWanted: 'Eurorack Patching, Modular Synth, Ableton',
    tradeType: 'both',
    coinsRate: 40,
    authorId: 'user_maya',
    authorName: 'Maya Lin',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorEmail: 'maya@skillspace.dev',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'seed_cloud',
    title: 'Kubernetes Cluster Provisioning & Terraform on AWS/GCP',
    description:
      'Senior DevOps Engineer available to guide multi-region container deployments, ingress routing, and cost optimization for 40 SkillCoins.',
    type: 'teach',
    category: 'Engineering & Web Development',
    skillsOffered: 'Kubernetes, Terraform, AWS, Docker',
    skillsWanted: 'Standard 40 Coins / Barter Credits',
    tradeType: 'coins',
    coinsRate: 40,
    authorId: 'user_alice_whitron',
    authorName: 'Alice Whitron',
    authorAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    authorEmail: 'alice@skillspace.dev',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const LiveMarketplace: React.FC<LiveMarketplaceProps> = ({
  currentUser,
  onOpenCreateListing,
  onOpenAuth,
  onOpenMessengerWithUser,
}) => {
  const [listings, setListings] = useState<LiveListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'teach' | 'learn'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Real-time Cloud Firestore subscription
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToListings((liveItems) => {
      if (liveItems && liveItems.length > 0) {
        setListings(liveItems);
        setLoading(false);
      } else {
        // If the live collection is brand new and empty, seed initial community listings
        SEED_LISTINGS.forEach((seed) => {
          saveListingToFirestore(seed).catch(() => {});
        });
        setListings(SEED_LISTINGS);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing from the database?')) return;
    setDeletingId(listingId);
    try {
      await deleteListingFromFirestore(listingId);
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Could not delete listing. Please check permissions.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredListings = listings.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.skillsOffered.toLowerCase().includes(q) ||
        item.skillsWanted.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = Array.from(new Set(listings.map((l) => l.category)));

  return (
    <section id="live-marketplace" className="py-16 sm:py-24 bg-[#070709] border-t border-white/10 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#08f7bf]/10 via-[#3d9be9]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#08f7bf]/10 text-[#08f7bf] border border-[#08f7bf]/30 mb-3 shadow-[0_0_15px_rgba(8,247,191,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#08f7bf] animate-pulse" />
              <span>Cloud Firestore Database Active</span>
              <span className="text-white/40">&bull;</span>
              <span className="text-white/70">Real-Time Global Sync</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Community Skill Marketplace
            </h2>
            <p className="text-sm text-white/60 max-w-xl mt-2">
              Every listing created here is stored directly in Cloud Firestore, allowing anyone using
              SkillSpace to discover, propose barter swaps, or book 40-coin mentorship sessions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={currentUser ? onOpenCreateListing : onOpenAuth}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#08f7bf] to-[#3d9be9] text-black font-semibold text-xs flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#08f7bf]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings by title, skill, or mentor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#08f7bf] text-xs text-white placeholder-white/40 focus:outline-none transition-all"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setFilterType('teach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'teach'
                    ? 'bg-[#08f7bf] text-black font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Teaching</span>
              </button>
              <button
                onClick={() => setFilterType('learn')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'learn'
                    ? 'bg-[#3d9be9] text-white font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learning</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-white/40 font-mono text-[11px] shrink-0">Categories:</span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#08f7bf]/20 text-[#08f7bf] border border-[#08f7bf]/40'
                      : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#08f7bf] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-white/60">Connecting to Cloud Firestore...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 p-8">
            <Database className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No listings found</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto mb-4">
              Be the first to post a skill listing for other members to discover!
            </p>
            <button
              onClick={currentUser ? onOpenCreateListing : onOpenAuth}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Listing</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredListings.map((listing) => {
              const isMyListing = currentUser && currentUser.id === listing.authorId;
              return (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20 p-5 sm:p-6 transition-all flex flex-col justify-between group shadow-lg shadow-black/40"
                >
                  <div>
                    {/* Header: Type Pill, Category, Rate */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            listing.type === 'teach'
                              ? 'bg-[#08f7bf]/15 text-[#08f7bf] border border-[#08f7bf]/30'
                              : 'bg-[#3d9be9]/15 text-[#3d9be9] border border-[#3d9be9]/30'
                          }`}
                        >
                          {listing.type === 'teach' ? 'Offering to Teach' : 'Looking to Learn'}
                        </span>
                        <span className="text-[11px] font-mono text-white/50 line-clamp-1">
                          {listing.category}
                        </span>
                      </div>

                      {/* Trade Rate Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-mono font-semibold shrink-0">
                        <Coins className="w-3 h-3" />
                        <span>
                          {listing.tradeType === 'barter'
                            ? '1:1 Barter'
                            : `${listing.coinsRate || 40} Coins`}
                        </span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-[#08f7bf] transition-colors leading-snug mb-2">
                      {listing.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-3">
                      {listing.description}
                    </p>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 mb-4 text-[11px]">
                      <div>
                        <span className="text-white/40 block font-mono text-[10px] uppercase">
                          {listing.type === 'teach' ? 'Skills Taught:' : 'Offered in Return:'}
                        </span>
                        <span className="font-semibold text-white/90 truncate block">
                          {listing.skillsOffered || 'Flexible'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block font-mono text-[10px] uppercase">
                          {listing.type === 'teach' ? 'Desired Swap:' : 'Skills Wanted:'}
                        </span>
                        <span className="font-semibold text-[#08f7bf] truncate block">
                          {listing.skillsWanted || '40 Coins or Barter'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Author Info & Interactive Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          listing.authorAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={listing.authorName}
                        className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white block truncate">
                          {listing.authorName}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 block">
                          {new Date(listing.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isMyListing && (
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          disabled={deletingId === listing.id}
                          title="Delete this listing"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (onOpenMessengerWithUser) {
                            onOpenMessengerWithUser(
                              listing.authorName,
                              `Hi ${listing.authorName}, I saw your listing "${listing.title}" on SkillSpace and would love to exchange skills under the 40-coin rule!`
                            );
                          } else {
                            // Smooth scroll to chat or open learn
                            const el = document.getElementById('chat');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#08f7bf]/10 hover:bg-[#08f7bf]/20 border border-[#08f7bf]/30 text-[#08f7bf] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer group-hover:border-[#08f7bf]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat &amp; Swap</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
