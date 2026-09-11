import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  Check,
  Zap,
  Layers,
  MessageSquare,
  TrendingUp,
  Flame,
  Star,
  ChevronRight,
  Code2,
  Cpu,
  Palette,
  Languages,
  Music,
  Briefcase,
  Send,
  Plus,
  Coins,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Users,
  GraduationCap,
  ArrowRightLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import {
  SkillBarterConfirmModal,
  BarterPeerInfo,
  FinalizedBarterSwap,
} from './SkillBarterConfirmModal';

export type LearnTabId =
  | 'overview'
  | 'cointrade'
  | 'skillswap'
  | 'courses'
  | 'messages';

export interface CoinTradeListing {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  type: 'teach' | 'learn'; // 'teach' = mentor charges coins; 'learn' = student offers coins
  skill: string;
  category: string;
  coins: number; // Coins requested to teach or offered to learn
  rating: number;
  completedSwaps: number;
  acceptsBarter: boolean;
  description: string;
  status: 'active' | 'in-session';
}

const INITIAL_COIN_LISTINGS: CoinTradeListing[] = [
  {
    id: 'cl-1',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    userRole: 'Staff ML Engineer',
    type: 'teach',
    skill: 'Applied LLM RAG & Hybrid Vector Retrieval',
    category: 'AI & Data',
    coins: 35,
    rating: 4.98,
    completedSwaps: 42,
    acceptsBarter: true,
    description: '1-on-1 architecture deep dive on chunking strategies, embeddings, rerankers, and LangGraph pipelines.',
    status: 'active',
  },
  {
    id: 'cl-2',
    userName: 'Kenji Sato',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userRole: 'Bilingual Tokyo Developer',
    type: 'teach',
    skill: 'Conversational Japanese & Natural Pitch Accent',
    category: 'Languages',
    coins: 25,
    rating: 5.0,
    completedSwaps: 88,
    acceptsBarter: true,
    description: 'Master Tokyo pitch accent (heiban vs atamadaka) and conversational fluency through real scenario roleplay.',
    status: 'active',
  },
  {
    id: 'cl-3',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    userRole: 'Design Systems Lead',
    type: 'teach',
    skill: 'Figma Auto-Layout & Design Tokens Architecture',
    category: 'Design & 3D',
    coins: 30,
    rating: 4.94,
    completedSwaps: 31,
    acceptsBarter: false,
    description: 'Building multi-brand token structures, responsive nested auto-layouts, and design system governance.',
    status: 'active',
  },
  {
    id: 'cl-4',
    userName: 'Maya Tanaka',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRole: 'Frontend Dev & UI Designer',
    type: 'learn',
    skill: 'Full-Stack Next.js 15 & Server Actions',
    category: 'Engineering',
    coins: 30,
    rating: 4.95,
    completedSwaps: 14,
    acceptsBarter: true,
    description: 'Looking for a senior mentor to guide me through cache tags, streaming SSR, and optimistic UI in Next.js 15.',
    status: 'active',
  },
  {
    id: 'cl-5',
    userName: 'Chloe Dubois',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    userRole: 'Sound Engineer & Synth Enthusiast',
    type: 'learn',
    skill: 'Modular Eurorack & Subtractive Synthesis',
    category: 'Audio',
    coins: 25,
    rating: 4.9,
    completedSwaps: 19,
    acceptsBarter: true,
    description: 'Willing to give 25 SkillCoins for hands-on patching guidance, FM synthesis routing, and filter resonance tricks.',
    status: 'active',
  },
  {
    id: 'cl-6',
    userName: 'Devon James',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    userRole: 'Startup Founder',
    type: 'learn',
    skill: 'Seed Pitch Decks & Venture Storytelling',
    category: 'Leadership',
    coins: 40,
    rating: 4.88,
    completedSwaps: 8,
    acceptsBarter: false,
    description: 'Offering 40 SkillCoins for 60 minutes of tough feedback on narrative structure, market sizing, and seed traction decks.',
    status: 'active',
  },
];

interface LearnPageProps {
  onBackToHome: () => void;
  onOpenTeach: () => void;
  onOpenProfile?: () => void;
  currentUser?: UserProfile | null;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  onBackToHome,
  onOpenTeach,
  onOpenProfile,
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<LearnTabId>('overview');

  // Coin Trading State
  const [coinListings, setCoinListings] = useState<CoinTradeListing[]>(INITIAL_COIN_LISTINGS);
  const [coinFilterType, setCoinFilterType] = useState<'all' | 'teach' | 'learn'>('all');
  const [coinCategory, setCoinCategory] = useState<string>('all');
  const [coinSearchQuery, setCoinSearchQuery] = useState('');
  const [showCreateCoinListingModal, setShowCreateCoinListingModal] = useState(false);

  // New Listing Form State
  const [newListingType, setNewListingType] = useState<'teach' | 'learn'>('teach');
  const [newListingSkill, setNewListingSkill] = useState('');
  const [newListingCategory, setNewListingCategory] = useState('Engineering');
  const [newListingCoins, setNewListingCoins] = useState(25);
  const [newListingBarterToo, setNewListingBarterToo] = useState(true);
  const [newListingDesc, setNewListingDesc] = useState('');

  // Active Trade / Booking Confirmation Notification State
  const [tradeSuccessToast, setTradeSuccessToast] = useState<string | null>(null);

  // Skill swap state
  const [swapSearch, setSwapSearch] = useState('');
  const [swapFilterMode, setSwapFilterMode] = useState<'all' | 'barter' | 'coins'>('all');
  const [proposedSkill, setProposedSkill] = useState<string | null>(null);

  // Dedicated Skill Barter Confirmation Dialog State (requires both users to accept swap terms)
  const [selectedBarterPeer, setSelectedBarterPeer] = useState<BarterPeerInfo | null>(null);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [finalizedBarterReceipt, setFinalizedBarterReceipt] = useState<FinalizedBarterSwap | null>(null);

  const handleOpenBarterModal = (peer: BarterPeerInfo) => {
    setSelectedBarterPeer(peer);
    setIsBarterModalOpen(true);
  };

  const handleFinalizeBarterSuccess = (swap: FinalizedBarterSwap) => {
    setFinalizedBarterReceipt(swap);
    setProposedSkill(null);

    // Synchronize to current user profile
    if (currentUser && onUpdateUser) {
      const newSession = {
        id: swap.txId,
        partnerName: swap.partnerName,
        partnerAvatar: swap.partnerAvatar,
        topic: `${swap.mySkill} ⇄ ${swap.partnerSkill}`,
        role: 'teaching' as const,
        date: swap.date,
        time: swap.time,
        status: 'confirmed' as const,
        tradeType: 'barter' as const,
      };

      onUpdateUser({
        ...currentUser,
        credits: (currentUser.credits || 250) + 50,
        upcomingSessions: [newSession, ...(currentUser.upcomingSessions || [])],
      });
    }
  };

  // User Coin Balance
  const userCoins = currentUser?.coins ?? 180;

  // Handle Publish Coin Listing
  const handlePublishCoinListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingSkill.trim()) return;

    const newListing: CoinTradeListing = {
      id: `cl-${Date.now()}`,
      userName: currentUser?.name || 'Alex Rivers',
      userAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: newListingType === 'teach' ? 'Verified Mentor' : 'Eager Learner',
      type: newListingType,
      skill: newListingSkill.trim(),
      category: newListingCategory,
      coins: Number(newListingCoins) || 20,
      rating: 5.0,
      completedSwaps: 0,
      acceptsBarter: newListingBarterToo,
      description:
        newListingDesc.trim() ||
        (newListingType === 'teach'
          ? `Offering 1-on-1 coaching for ${newListingCoins} SkillCoins/session.`
          : `Willing to give ${newListingCoins} SkillCoins for personalized mentorship.`),
      status: 'active',
    };

    setCoinListings((prev) => [newListing, ...prev]);

    // Update user profile skills to keep synchronized
    if (currentUser && onUpdateUser) {
      if (newListingType === 'teach') {
        const updated = {
          ...currentUser,
          skillsToTeach: [
            ...currentUser.skillsToTeach,
            {
              id: `t_${Date.now()}`,
              name: newListingSkill.trim(),
              level: 'Advanced',
              sessionsCount: 0,
              coinsWanted: Number(newListingCoins) || 25,
              tradeMode: newListingBarterToo ? ('both' as const) : ('coins' as const),
            },
          ],
        };
        onUpdateUser(updated);
      } else {
        const updated = {
          ...currentUser,
          skillsToLearn: [
            ...currentUser.skillsToLearn,
            {
              id: `l_${Date.now()}`,
              name: newListingSkill.trim(),
              target: 'Coin-traded mentorship session',
              progress: 10,
              coinsOffered: Number(newListingCoins) || 20,
              tradeMode: newListingBarterToo ? ('both' as const) : ('coins' as const),
            },
          ],
        };
        onUpdateUser(updated);
      }
    }

    setTradeSuccessToast(
      `Your coin listing for "${newListingSkill}" (${newListingCoins} SkillCoins) has been published to the SkillSpace Exchange!`
    );
    setShowCreateCoinListingModal(false);
    setNewListingSkill('');
    setNewListingDesc('');
    setTimeout(() => setTradeSuccessToast(null), 5000);
  };

  // Handle Book or Accept Trade
  const handleInitiateCoinTrade = (listing: CoinTradeListing) => {
    if (listing.type === 'teach') {
      if (userCoins < listing.coins) {
        setTradeSuccessToast(
          `Insufficient coins! You have ${userCoins} SkillCoins, but this session requires ${listing.coins} coins. Teach a skill to earn more coins!`
        );
        setTimeout(() => setTradeSuccessToast(null), 5000);
        return;
      }
      setTradeSuccessToast(
        `Trade initiated! Escrowed ${listing.coins} SkillCoins for 1-on-1 session on "${listing.skill}" with ${listing.userName}. Coins will be released after completion.`
      );
    } else {
      setTradeSuccessToast(
        `You accepted to teach "${listing.skill}" to ${listing.userName}! You will receive ${listing.coins} SkillCoins into your wallet upon session completion.`
      );
    }
    setTimeout(() => setTradeSuccessToast(null), 5000);
  };

  // Filtered Coin Listings
  const filteredCoinListings = coinListings.filter((item) => {
    const matchesType = coinFilterType === 'all' || item.type === coinFilterType;
    const matchesCategory = coinCategory === 'all' || item.category === coinCategory;
    const matchesSearch =
      item.skill.toLowerCase().includes(coinSearchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(coinSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(coinSearchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col md:flex-row antialiased selection:bg-white selection:text-black">
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR - Sleek Glass Navigation                   */}
      {/* ======================================================== */}
      <aside className="w-full md:w-64 lg:w-72 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Top Logo & Studio Switcher */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff5733] to-[#e63e15] flex items-center justify-center text-white shadow-md shadow-[#ff5733]/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block">SkillSpace</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff5733]">
                  Learn Studio
                </span>
              </div>
            </button>

            <button
              onClick={onOpenProfile}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              title="My Profile"
            >
              <GraduationCap className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>

            {/* Coin Trade Marketplace (Prominently highlighted) */}
            <button
              onClick={() => setActiveTab('cointrade')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === 'cointrade'
                  ? 'bg-gradient-to-r from-amber-500/20 to-white/10 text-white font-semibold border border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  activeTab === 'cointrade'
                    ? 'bg-amber-500 text-black shadow-sm font-bold'
                    : 'bg-white/10 text-amber-400'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">Coin Trade Hub</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NEW
                </span>
              </div>
            </button>

            {/* Skill swap */}
            <button
              onClick={() => setActiveTab('skillswap')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === 'skillswap'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Skill Barter</span>
            </button>

            {/* Courses */}
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curated Tracks</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span>Messages</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5733]" />
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Coin Wallet & Teach shortcut */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {/* SkillCoin Balance Widget */}
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-mono">
              <span className="flex items-center gap-1 text-amber-300">
                <Coins className="w-3.5 h-3.5" /> SkillCoins
              </span>
              <span className="text-amber-400 font-bold font-mono">
                🪙 {userCoins}
              </span>
            </div>
            <div className="text-[10px] text-white/40 font-mono">
              Earn by teaching &bull; Spend to learn
            </div>
          </div>

          <button
            onClick={onOpenTeach}
            className="w-full py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 hover:border-white/30 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff5733]" />
            <span>Teach &amp; Earn Coins</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA - Black Sleek Glass UI               */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#0b0b10] to-[#050508] relative overflow-y-auto">
        {/* Ambient Glass Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[300px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Global Toast Notification */}
        <AnimatePresence>
          {tradeSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl border border-amber-500/40 bg-[#16140f]/95 text-white backdrop-blur-2xl shadow-2xl flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <span className="font-bold text-amber-300 block mb-0.5">SkillSpace Coin Trade</span>
                <p className="text-white/80 leading-relaxed">{tradeSuccessToast}</p>
              </div>
              <button
                onClick={() => setTradeSuccessToast(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Bar */}
        <header className="px-6 lg:px-10 py-5 border-b border-white/10 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 bg-black/40">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ff5733] block mb-1">
              {activeTab === 'overview' && 'LEARNING HUB &bull; DASHBOARD'}
              {activeTab === 'cointrade' && 'SKILLCOIN EXCHANGE &bull; TRADE MARKET'}
              {activeTab === 'skillswap' && 'DIRECT 1:1 BARTER &bull; DIRECTORY'}
              {activeTab === 'courses' && 'CURATED CURRICULUM &bull; TRACKS'}
              {activeTab === 'messages' && 'COLLABORATION &bull; SESSIONS'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {activeTab === 'overview' && 'Learning Overview'}
              {activeTab === 'cointrade' && 'Coin Trade Exchange'}
              {activeTab === 'skillswap' && 'Peer Barter Directory'}
              {activeTab === 'courses' && 'Curated Pathways'}
              {activeTab === 'messages' && 'Session Messages'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* User Coin Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
              <Coins className="w-3.5 h-3.5" />
              <span className="font-bold">{userCoins} Coins</span>
            </div>

            {/* Profile Avatar */}
            {currentUser && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-medium text-white hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            )}

            <button
              onClick={onOpenTeach}
              className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white transition-all cursor-pointer font-mono hidden md:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5733]" />
              <span>Teach Studio</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/35 text-xs text-white/80 hover:text-white transition-all cursor-pointer font-mono"
            >
              Exit to Home
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-6 lg:p-10 flex-1 relative z-10">
          {/* ==================================================== */}
          {/* TAB 1: COIN TRADE EXCHANGE                           */}
          {/* ==================================================== */}
          {activeTab === 'cointrade' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Header Banner: Coin Trading Value Proposition */}
              <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/[0.08] via-white/[0.02] to-black backdrop-blur-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-2">
                      <Coins className="w-3.5 h-3.5" />
                      <span>THE SKILLCOIN MARKETPLACE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
                      Trade Skills with Community Coins
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-body leading-relaxed">
                      Don&apos;t have an immediate 1:1 barter match? List your teaching rate in coins or offer coins to learn directly from verified mentors. Full flexibility alongside peer barter.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                      onClick={() => setShowCreateCoinListingModal(true)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>List Skill for Coins</span>
                    </button>
                  </div>
                </div>

                {/* Quick Rates Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
                  <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                    <span className="text-white/60">Your Balance:</span>
                    <span className="text-amber-400 font-bold">🪙 {userCoins} Coins</span>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                    <span className="text-white/60">Your Teaching Rate:</span>
                    <span className="text-white font-semibold">🪙 30 Coins / hr</span>
                  </div>
                  <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                    <span className="text-white/60">Your Learning Bid:</span>
                    <span className="text-white font-semibold">🪙 25 Coins offered</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={coinSearchQuery}
                    onChange={(e) => setCoinSearchQuery(e.target.value)}
                    placeholder="Search by topic, mentor, or keyword (e.g. Next.js, RAG, Japanese)..."
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/15 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-xl bg-black/40 border border-white/10 p-0.5 text-xs font-mono">
                    <button
                      onClick={() => setCoinFilterType('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        coinFilterType === 'all'
                          ? 'bg-white text-black font-semibold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      All ({coinListings.length})
                    </button>
                    <button
                      onClick={() => setCoinFilterType('teach')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        coinFilterType === 'teach'
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Mentors (Spend Coins)
                    </button>
                    <button
                      onClick={() => setCoinFilterType('learn')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        coinFilterType === 'learn'
                          ? 'bg-emerald-400 text-black font-semibold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Learners (Earn Coins)
                    </button>
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={coinCategory}
                    onChange={(e) => setCoinCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white/80 focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="all">All Categories</option>
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Design & 3D">Design & 3D</option>
                    <option value="Languages">Languages</option>
                    <option value="Audio">Audio</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
              </div>

              {/* Coin Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCoinListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Role & Coins */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            item.type === 'teach'
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {item.type === 'teach' ? 'Mentor Offering' : 'Learner Seeking'}
                        </span>

                        <div className="flex items-center gap-1 font-mono text-sm font-bold text-amber-300">
                          <Coins className="w-4 h-4 text-amber-400" />
                          <span>
                            {item.coins} Coins
                            <span className="text-[10px] text-white/40 font-normal">
                              {item.type === 'teach' ? '/hr' : ' offered'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Skill Title */}
                      <h3 className="text-lg font-serif font-bold text-white mb-2 leading-snug">
                        {item.skill}
                      </h3>

                      <p className="text-xs text-white/65 font-body leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Barter Tag */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/60">
                          {item.category}
                        </span>
                        {item.acceptsBarter ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Also accepts 1:1 Barter
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-white/40">
                            Coin Trade Only
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: User & Action */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.userAvatar}
                            alt={item.userName}
                            className="w-7 h-7 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{item.userName}</div>
                            <div className="text-[10px] font-mono text-white/40">{item.userRole}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleInitiateCoinTrade(item)}
                          className={`w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            item.type === 'teach'
                              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/10'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>
                            {item.type === 'teach'
                              ? `Book Session for ${item.coins} Coins`
                              : `Teach & Earn ${item.coins} Coins`}
                          </span>
                        </button>

                        {item.acceptsBarter && (
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenBarterModal({
                                name: item.userName,
                                role: item.userRole,
                                avatar: item.userAvatar,
                                canTeach: item.type === 'teach' ? item.skill : '1-on-1 Mentorship',
                                wantsToLearn: item.type === 'learn' ? item.skill : 'Reciprocal Skill',
                                rating: item.rating,
                                swaps: item.completedSwaps,
                              })
                            }
                            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Propose 1:1 Skill Barter Instead</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCoinListings.length === 0 && (
                <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.01]">
                  <Coins className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
                  <h4 className="text-base font-serif font-bold text-white mb-1">No listings found</h4>
                  <p className="text-xs text-white/50 mb-4">
                    Try adjusting your search query or category filter.
                  </p>
                  <button
                    onClick={() => {
                      setCoinFilterType('all');
                      setCoinCategory('all');
                      setCoinSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs text-white hover:bg-white/20 font-mono"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: OVERVIEW                                      */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">SkillCoins Balance</div>
                  <div className="text-3xl font-serif font-bold text-amber-300">🪙 {userCoins}</div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">For peer coin trading</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Barter Credits</div>
                  <div className="text-3xl font-serif font-bold text-[#ff5733]">
                    {currentUser?.credits ?? 250} Pts
                  </div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">1:1 hour vouchers</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Hours Learned</div>
                  <div className="text-3xl font-serif font-bold text-white">
                    {currentUser?.hoursLearned ?? 24} hrs
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-mono">+6 this month</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Active Mentors</div>
                  <div className="text-3xl font-serif font-bold text-white">5 Peers</div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">Next session in 2 days</div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-r from-black via-white/[0.04] to-black backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
                    NEW FEATURE &bull; COIN TRADING LIVE
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    List skills you want to teach or are willing to give coins to learn
                  </h3>
                  <p className="text-xs text-white/60 mt-1 font-body">
                    Trade directly with community members even when an exact 1:1 mutual skill match isn&apos;t ready.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('cointrade')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                >
                  Explore Coin Trade Hub
                </button>
              </div>

              {/* Active Learning Goals with Coin Offers */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>My Active Learning Goals &amp; Coin Bids</span>
                  </h3>
                  <button
                    onClick={() => setShowCreateCoinListingModal(true)}
                    className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Offer Coins for Skill</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(currentUser?.skillsToLearn || [
                    { id: 'l1', name: 'Conversational Japanese', target: 'Pitch Accent', progress: 65, coinsOffered: 25 },
                    { id: 'l2', name: 'Sound Design & Synthesizers', target: 'Eurorack Patching', progress: 40, coinsOffered: 20 },
                    { id: 'l3', name: '3D Procedural Motion in Blender', target: 'Geometry Nodes', progress: 25, coinsOffered: 30 },
                  ]).map((item: any) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Learning
                          </span>
                          <span className="text-xs font-mono text-amber-400 font-bold">
                            🪙 {item.coinsOffered || 25} Coins offered
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">{item.name}</h4>
                        <p className="text-xs text-white/50 font-mono mb-3">Target: {item.target}</p>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: SKILL SWAP & BARTER DIRECTORY                 */}
          {/* ==================================================== */}
          {activeTab === 'skillswap' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      Peer Barter Directory
                    </h3>
                    <p className="text-xs text-white/60">
                      Direct 1:1 barter matchmaking &bull; Trade your expertise for theirs, or switch to Coin Trade
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('cointrade')}
                      className="px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Coin Trade Mode</span>
                    </button>
                    <button
                      onClick={onOpenTeach}
                      className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 transition-all shrink-0 cursor-pointer"
                    >
                      + List My Skills
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={swapSearch}
                      onChange={(e) => setSwapSearch(e.target.value)}
                      placeholder="Search mentor or topic to swap (e.g. Next.js, Blender, Japanese, AI...)"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/15 focus:border-[#ff5733] rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
                    />
                  </div>

                  <div className="flex rounded-xl bg-black/40 border border-white/10 p-0.5 text-xs font-mono">
                    <button
                      onClick={() => setSwapFilterMode('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        swapFilterMode === 'all' ? 'bg-white text-black font-semibold' : 'text-white/60'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSwapFilterMode('barter')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        swapFilterMode === 'barter' ? 'bg-white text-black font-semibold' : 'text-white/60'
                      }`}
                    >
                      Pure Barter
                    </button>
                    <button
                      onClick={() => setSwapFilterMode('coins')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        swapFilterMode === 'coins' ? 'bg-amber-500 text-black font-semibold' : 'text-white/60'
                      }`}
                    >
                      Accepts Coins (🪙)
                    </button>
                  </div>
                </div>
              </div>

              {/* Peers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Elena Rostova',
                    role: 'Staff ML Engineer',
                    canTeach: 'Applied LLMs, RAG & Vector DBs',
                    wantsToLearn: 'Minimalist 3D Motion / Blender',
                    swaps: 42,
                    rating: 4.98,
                    coinRate: 35,
                    acceptsCoins: true,
                  },
                  {
                    name: 'Tatsuo Mori',
                    role: 'Native Japanese Instructor',
                    canTeach: 'Conversational Japanese & Business Keigo',
                    wantsToLearn: 'Full-Stack Next.js 15',
                    swaps: 88,
                    rating: 5.0,
                    coinRate: 25,
                    acceptsCoins: true,
                  },
                  {
                    name: 'Marcus Vance',
                    role: 'Design Lead',
                    canTeach: 'Figma Design Tokens & Systems',
                    wantsToLearn: 'Rust Memory Management',
                    swaps: 31,
                    rating: 4.94,
                    coinRate: 30,
                    acceptsCoins: true,
                  },
                  {
                    name: 'Chloe Dubois',
                    role: 'Audio Producer',
                    canTeach: 'Analog Synthesizers & Spatial Audio',
                    wantsToLearn: 'Prompt Engineering',
                    swaps: 19,
                    rating: 4.89,
                    coinRate: 25,
                    acceptsCoins: true,
                  },
                ]
                  .filter((p) => {
                    if (swapFilterMode === 'coins') return p.acceptsCoins;
                    return true;
                  })
                  .map((peer, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/10 text-white font-mono text-xs flex items-center justify-center font-bold">
                              {peer.name[0]}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{peer.name}</h4>
                              <span className="text-[11px] font-mono text-white/50">{peer.role}</span>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-[#ff5733]">★ {peer.rating}</span>
                        </div>

                        <div className="space-y-1.5 my-3 text-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-mono uppercase text-white/40 shrink-0">
                              Teaches:
                            </span>
                            <span className="text-white/90 font-medium">{peer.canTeach}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-mono uppercase text-[#ff5733] shrink-0">
                              Wants:
                            </span>
                            <span className="text-white/70">{peer.wantsToLearn}</span>
                          </div>
                        </div>

                        {peer.acceptsCoins && (
                          <div className="mb-3 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[11px] font-mono text-amber-300">
                            <span>Alternative: Trade with Coins</span>
                            <span className="font-bold">🪙 {peer.coinRate} Coins/hr</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-white/40">
                          {peer.swaps} swaps completed
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleOpenBarterModal({
                                name: peer.name,
                                role: peer.role,
                                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                                canTeach: peer.canTeach,
                                wantsToLearn: peer.wantsToLearn,
                                swaps: peer.swaps,
                                rating: peer.rating,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-[#3d9be9]" />
                            <span>Propose Barter</span>
                          </button>
                          <button
                            onClick={() => {
                              handleInitiateCoinTrade({
                                id: `quick-${i}`,
                                userName: peer.name,
                                userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                                userRole: peer.role,
                                type: 'teach',
                                skill: peer.canTeach,
                                category: 'Engineering',
                                coins: peer.coinRate,
                                rating: peer.rating,
                                completedSwaps: peer.swaps,
                                acceptsBarter: true,
                                description: `1-on-1 session on ${peer.canTeach}`,
                                status: 'active',
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Coins className="w-3 h-3" />
                            <span>{peer.coinRate} Coins</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {finalizedBarterReceipt && (
                <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold flex items-center gap-2">
                        <span>Barter Transaction Finalized &bull; {finalizedBarterReceipt.txId}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          2/2 Signatures Verified
                        </span>
                      </div>
                      <div className="text-white/70 font-mono text-[11px] mt-0.5">
                        {finalizedBarterReceipt.mySkill} ⇄ {finalizedBarterReceipt.partnerSkill} with {finalizedBarterReceipt.partnerName} ({finalizedBarterReceipt.date})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onOpenProfile && (
                      <button
                        onClick={onOpenProfile}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
                      >
                        View in Schedule
                      </button>
                    )}
                    <button
                      onClick={() => setFinalizedBarterReceipt(null)}
                      className="text-white/50 hover:text-white text-xs font-mono px-2 py-1 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: COURSES                                       */}
          {/* ==================================================== */}
          {activeTab === 'courses' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60 font-mono">
                  Showing 6 curated tracks &bull; Available for peer barter or SkillCoins
                </p>
                <button
                  onClick={() => setActiveTab('cointrade')}
                  className="text-xs text-amber-400 hover:underline font-mono flex items-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>View Community Coin Rates</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Full-Stack Next.js 15 & Turbopack',
                    category: 'Engineering',
                    modules: '8 Modules &bull; 24 Lessons',
                    difficulty: 'Intermediate',
                    desc: 'Server components, streaming SSR, parallel routes, and cache tags.',
                    icon: <Code2 className="w-4 h-4 text-white" />,
                    coinPrice: 30,
                  },
                  {
                    title: 'Applied LLM RAG & Agents',
                    category: 'AI & Data',
                    modules: '6 Modules &bull; 18 Lessons',
                    difficulty: 'Advanced',
                    desc: 'Vector embeddings, chunking strategies, hybrid search, and LangGraph.',
                    icon: <Cpu className="w-4 h-4 text-white" />,
                    coinPrice: 35,
                  },
                  {
                    title: 'Minimalist 3D Motion in Blender',
                    category: 'Design & 3D',
                    modules: '7 Modules &bull; 21 Lessons',
                    difficulty: 'All Levels',
                    desc: 'Procedural geometry nodes, micro-loop physics, and cinematic lighting.',
                    icon: <Palette className="w-4 h-4 text-white" />,
                    coinPrice: 25,
                  },
                  {
                    title: 'Conversational Japanese (JLPT N3-N1)',
                    category: 'Languages',
                    modules: '10 Modules &bull; 30 Lessons',
                    difficulty: 'Intermediate',
                    desc: 'Natural pitch accent, real-life dialogue, business keigo, and idioms.',
                    icon: <Languages className="w-4 h-4 text-white" />,
                    coinPrice: 25,
                  },
                  {
                    title: 'Analog Synthesizers & Sound Design',
                    category: 'Audio',
                    modules: '5 Modules &bull; 15 Lessons',
                    difficulty: 'Beginner Friendly',
                    desc: 'Subtractive synthesis, frequency modulation, patch routing, and stereo space.',
                    icon: <Music className="w-4 h-4 text-white" />,
                    coinPrice: 20,
                  },
                  {
                    title: 'Venture Storytelling & Pitch Decks',
                    category: 'Leadership',
                    modules: '4 Modules &bull; 12 Lessons',
                    difficulty: 'Intermediate',
                    desc: 'Narrative arcs, financial traction modeling, seed milestone framing.',
                    icon: <Briefcase className="w-4 h-4 text-white" />,
                    coinPrice: 35,
                  },
                ].map((course, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center">
                          {course.icon}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300">
                            🪙 {course.coinPrice} Coins
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/70">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white mb-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-white/60 mb-4 font-body">{course.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-mono text-white/50 text-[11px]">{course.modules}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('skillswap');
                            setSwapSearch(course.title);
                          }}
                          className="text-white hover:text-white/80 font-mono text-xs cursor-pointer"
                        >
                          Find Barter Peer
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('cointrade');
                            setCoinSearchQuery(course.title);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Coins className="w-3 h-3" />
                          <span>Trade Coins</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: MESSAGES                                      */}
          {/* ==================================================== */}
          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 flex flex-col h-[520px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ff5733] text-white flex items-center justify-center font-bold text-xs font-mono">
                    TM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tatsuo Mori (Japanese &bull; Web Dev)</h4>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Now &bull; Pre-Session Chat
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> 25 Coins Escrowed
                  </span>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm max-w-md text-white/80">
                  Konnichiwa! Looking forward to our session on Friday. I have prepared the pitch accent charts for Tokyo dialect.
                </div>
                <div className="bg-[#ff5733]/20 border border-[#ff5733]/30 p-3 rounded-2xl rounded-tr-sm max-w-md ml-auto text-white">
                  Awesome! I also listed my Next.js 15 curriculum on the Coin Trade Exchange for 30 SkillCoins.
                </div>
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm max-w-md text-white/80">
                  Great! The 25 SkillCoins for our Japanese session are securely held in escrow until we finish the call.
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or proposal..."
                  className="flex-1 bg-black/50 border border-white/15 focus:border-[#ff5733] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                />
                <button className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1 hover:bg-white/90 transition-all cursor-pointer">
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: CREATE NEW COIN LISTING                           */}
      {/* ======================================================== */}
      {showCreateCoinListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/20 bg-[#101216] text-white shadow-2xl relative">
            <button
              onClick={() => setShowCreateCoinListingModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
              <Coins className="w-4 h-4" />
              <span>SkillSpace Coin Trade Hub</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              List Skill for Coins
            </h3>
            <p className="text-xs text-white/60 mb-6">
              Set the number of coins you want to charge to teach, or the coins you are willing to give to learn.
            </p>

            <form onSubmit={handlePublishCoinListing} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-medium text-white/80 mb-2">
                  What would you like to do?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewListingType('teach')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newListingType === 'teach'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>I Want to Teach (Charge Coins)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewListingType('learn')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newListingType === 'learn'
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>I Want to Learn (Give Coins)</span>
                  </button>
                </div>
              </div>

              {/* Skill Name */}
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Skill / Topic Name
                </label>
                <input
                  type="text"
                  required
                  value={newListingSkill}
                  onChange={(e) => setNewListingSkill(e.target.value)}
                  placeholder={
                    newListingType === 'teach'
                      ? 'e.g. Distributed SQL, Blender Geometry Nodes, Piano'
                      : 'e.g. Conversational Japanese, Next.js 15, Figma Tokens'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Category & Coins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Category
                  </label>
                  <select
                    value={newListingCategory}
                    onChange={(e) => setNewListingCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Design & 3D">Design & 3D</option>
                    <option value="Languages">Languages</option>
                    <option value="Audio">Audio</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    {newListingType === 'teach'
                      ? 'Coins you want to receive (/hr)'
                      : 'Coins you are willing to give'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="5"
                      max="500"
                      value={newListingCoins}
                      onChange={(e) => setNewListingCoins(Math.max(5, parseInt(e.target.value) || 0))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                    <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Brief description / what will be covered
                </label>
                <textarea
                  rows={3}
                  value={newListingDesc}
                  onChange={(e) => setNewListingDesc(e.target.value)}
                  placeholder="Explain what practical experience you bring, or what specific bottleneck you need help solving..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Also accept direct barter checkbox */}
              <label className="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/[0.02] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newListingBarterToo}
                  onChange={(e) => setNewListingBarterToo(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs text-white/80">
                  Also open to 1:1 Skill Barter (peer can swap another skill instead of paying coins)
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateCoinListingModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Publish Coin Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Dual-Party Skill Barter Confirmation Modal */}
      <SkillBarterConfirmModal
        isOpen={isBarterModalOpen}
        onClose={() => {
          setIsBarterModalOpen(false);
          setSelectedBarterPeer(null);
        }}
        currentUser={currentUser}
        peer={selectedBarterPeer}
        onFinalizeSuccess={handleFinalizeBarterSuccess}
      />
    </div>
  );
};
