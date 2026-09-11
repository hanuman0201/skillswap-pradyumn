import React, { useState } from 'react';
import {
  User,
  Star,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Plus,
  CheckCircle2,
  Calendar,
  LogOut,
  Edit3,
  MapPin,
  ShieldCheck,
  Video,
  X,
  Share2,
  Coins,
  TrendingUp,
  Flame,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenLearn: () => void;
  onOpenTeach: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onBackToHome,
  onOpenLearn,
  onOpenTeach,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teach' | 'learn' | 'sessions' | 'reviews'>('overview');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [nameInput, setNameInput] = useState(user.name);
  const [locationInput, setLocationInput] = useState(user.location);

  // Add Skill to Teach Modal
  const [showAddTeachModal, setShowAddTeachModal] = useState(false);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState('Advanced');
  const [newTeachCoins, setNewTeachCoins] = useState(25);
  const [newTeachTradeMode, setNewTeachTradeMode] = useState<'both' | 'coins' | 'barter'>('both');

  // Add Skill to Learn Modal
  const [showAddLearnModal, setShowAddLearnModal] = useState(false);
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnTarget, setNewLearnTarget] = useState('');
  const [newLearnCoins, setNewLearnCoins] = useState(20);
  const [newLearnTradeMode, setNewLearnTradeMode] = useState<'both' | 'coins' | 'barter'>('both');

  // Quick edit coin rate state
  const [editingCoinSkillId, setEditingCoinSkillId] = useState<string | null>(null);
  const [editingCoinAmount, setEditingCoinAmount] = useState<number>(25);

  // Quick Update Coin Rate for Teach or Learn
  const handleUpdateCoinRate = (skillId: string, isTeaching: boolean, newAmount: number) => {
    if (isTeaching) {
      const updated = {
        ...user,
        skillsToTeach: user.skillsToTeach.map((s) =>
          s.id === skillId ? { ...s, coinsWanted: newAmount } : s
        ),
      };
      onUpdateUser(updated);
    } else {
      const updated = {
        ...user,
        skillsToLearn: user.skillsToLearn.map((s) =>
          s.id === skillId ? { ...s, coinsOffered: newAmount } : s
        ),
      };
      onUpdateUser(updated);
    }
    setEditingCoinSkillId(null);
  };

  // Handle Profile Save
  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      bio: bioInput,
      name: nameInput,
      location: locationInput,
    });
    setIsEditingBio(false);
  };

  // Add Teach Skill
  const handleAddTeachSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeachSkill.trim()) return;
    const updated = {
      ...user,
      skillsToTeach: [
        ...user.skillsToTeach,
        {
          id: `t_${Date.now()}`,
          name: newTeachSkill.trim(),
          level: newTeachLevel,
          sessionsCount: 0,
          coinsWanted: Number(newTeachCoins) || 25,
          tradeMode: newTeachTradeMode,
        },
      ],
    };
    onUpdateUser(updated);
    setNewTeachSkill('');
    setNewTeachCoins(25);
    setShowAddTeachModal(false);
  };

  // Add Learn Skill
  const handleAddLearnSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnSkill.trim()) return;
    const updated = {
      ...user,
      skillsToLearn: [
        ...user.skillsToLearn,
        {
          id: `l_${Date.now()}`,
          name: newLearnSkill.trim(),
          target: newLearnTarget.trim() || 'Conversational fluency & hands-on projects',
          progress: 10,
          coinsOffered: Number(newLearnCoins) || 20,
          tradeMode: newLearnTradeMode,
        },
      ],
    };
    onUpdateUser(updated);
    setNewLearnSkill('');
    setNewLearnTarget('');
    setNewLearnCoins(20);
    setShowAddLearnModal(false);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col antialiased selection:bg-white selection:text-black">
      {/* Ambient background glass orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#3d9be9]/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[300px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="px-6 lg:px-12 py-4 border-b border-white/10 bg-black/60 backdrop-blur-2xl sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#3d9be9] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight font-['Poppins',sans-serif]">
              Skill<span className="text-[#3d9be9]">Space</span>
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-6">
            <button
              onClick={onOpenLearn}
              className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-white/70 hover:text-white transition-all flex items-center gap-1.5 font-medium"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learn Studio</span>
            </button>
            <button
              onClick={onOpenTeach}
              className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-white/70 hover:text-white transition-all flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3d9be9]" />
              <span>Teach Studio</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/80 hover:text-white transition-all"
          >
            Home
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-8">
        {/* Profile Card Header */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
                <span
                  title="Open to Swaps"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#070709] flex items-center justify-center"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full border border-[#3d9be9]/30 bg-[#3d9be9]/10 text-[#3d9be9] text-[11px] font-mono font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Peer Barterer
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/50 font-mono flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  <span>{user.email}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </span>
                  <span>Member since {user.memberSince}</span>
                </p>

                {/* Bio (Editable) */}
                {isEditingBio ? (
                  <div className="space-y-3 mt-3 w-full max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Full Name"
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Location"
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white"
                      />
                    </div>
                    <textarea
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-1.5 rounded-lg bg-[#3d9be9] text-white text-xs font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingBio(false)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/70"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-white/80 font-body max-w-2xl leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap sm:flex-col items-center gap-2.5 w-full sm:w-auto self-end md:self-auto">
              {!isEditingBio && (
                <button
                  onClick={() => {
                    setNameInput(user.name);
                    setLocationInput(user.location);
                    setBioInput(user.bio);
                    setIsEditingBio(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                onClick={onOpenTeach}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Teach Studio</span>
              </button>
            </div>
          </div>

          {/* 5 Quick Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
            {/* SkillCoins Balance */}
            <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                <Coins className="w-3.5 h-3.5" />
                <span>SkillCoins</span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                🪙 {user.coins ?? 180}
              </div>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                For coin trade exchange
              </div>
            </div>

            {/* Barter Credits */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#3d9be9] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Barter Credits</span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {user.credits} Pts
              </div>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                ≈ {Math.floor(user.credits / 100)} hrs of 1:1 learning
              </div>
            </div>

            {/* Hours Taught */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Hours Taught</span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {user.hoursTaught} hrs
              </div>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                Across 24 students
              </div>
            </div>

            {/* Hours Learned */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Hours Learned</span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {user.hoursLearned} hrs
              </div>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                Across 16 mentors
              </div>
            </div>

            {/* Peer Reputation */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Reputation</span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-1">
                <span>{user.rating}</span>
                <span className="text-xs text-amber-400 font-mono">★</span>
              </div>
              <div className="text-[10px] font-mono text-white/50 mt-1">
                {user.reviewCount} verified reviews
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teach')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'teach'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Skills I Teach</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {user.skillsToTeach.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'learn'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Skills I'm Learning</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {user.skillsToLearn.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Upcoming Swaps</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#3d9be9] text-white">
              {user.upcomingSessions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Peer Endorsements ({user.reviews.length})
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW                                            */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Skills at a Glance */}
            <div className="lg:col-span-7 space-y-6">
              {/* Teaching skills snapshot */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#3d9be9]" />
                    <span>Skills I Teach (Open to Barter)</span>
                  </h3>
                  <button
                    onClick={() => setShowAddTeachModal(true)}
                    className="text-xs font-mono text-[#3d9be9] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {user.skillsToTeach.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-white/50 mt-0.5">
                          <span>{skill.sessionsCount} sessions</span>
                          <span>&bull;</span>
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            <Coins className="w-3 h-3 text-amber-400 inline" />
                            {skill.coinsWanted ?? 25} Coins/hr
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-lg border border-[#3d9be9]/30 bg-[#3d9be9]/10 text-[#3d9be9]">
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning goals snapshot */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Skills I'm Learning &amp; Bids</span>
                  </h3>
                  <button
                    onClick={() => setShowAddLearnModal(true)}
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Goal</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {user.skillsToLearn.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{goal.name}</h4>
                          <span className="text-[11px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                            <Coins className="w-3 h-3 text-amber-400 inline" />
                            Offering {goal.coinsOffered ?? 20} Coins
                          </span>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{goal.progress}%</span>
                      </div>
                      <p className="text-xs text-white/60 font-mono">Target: {goal.target}</p>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-[#3d9be9] h-full rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Next Session & Quick Reciprocity */}
            <div className="lg:col-span-5 space-y-6">
              {/* SkillCoins Portfolio Quick Box */}
              <div className="p-6 rounded-3xl border border-amber-500/25 bg-amber-500/[0.03] backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    Coin Trade Portfolio
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    🪙 {user.coins ?? 180} Available
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mb-4 font-body">
                  Trade coins directly for mentorship or earn coins by teaching peers without reciprocal skill requirements.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/60">Teaching Listings:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {user.skillsToTeach.length} Active ({user.skillsToTeach.map(s => `🪙${s.coinsWanted ?? 25}`).join(', ')})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/60">Learning Bids:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {user.skillsToLearn.length} Active ({user.skillsToLearn.map(s => `🪙${s.coinsOffered ?? 20}`).join(', ')})
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenLearn}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Open Coin Trade Hub in Learn Studio</span>
                </button>
              </div>

              {/* Upcoming Session Card */}
              <div className="p-6 rounded-3xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-2xl">
                <span className="text-[11px] font-mono text-[#3d9be9] uppercase tracking-widest block mb-2">
                  NEXT CONFIRMED BARTER
                </span>
                {user.upcomingSessions[0] ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.upcomingSessions[0].partnerAvatar}
                        alt={user.upcomingSessions[0].partnerName}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {user.upcomingSessions[0].partnerName}
                        </div>
                        <div className="text-xs text-white/60 font-mono">
                          {user.upcomingSessions[0].date} &bull; {user.upcomingSessions[0].time}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs">
                      <span className="text-white/50 block mb-1">Exchange Topic:</span>
                      <span className="font-semibold text-white">
                        {user.upcomingSessions[0].topic}
                      </span>
                    </div>

                    <button className="w-full py-2.5 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md">
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Video Room</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-white/60">No upcoming sessions yet.</p>
                )}
              </div>

              {/* Reciprocal Barter Rules */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3d9be9]" />
                  <span>The SkillSpace Guarantee</span>
                </h4>
                <ul className="space-y-2 text-xs text-white/70 font-body leading-relaxed">
                  <li>&bull; 1 hour taught = 100 barter credits automatically earned.</li>
                  <li>&bull; Redeem credits with any verified peer mentor on the network.</li>
                  <li>&bull; Strict no-cancellation policy ensures respect for peer time.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SKILLS I TEACH                                     */}
        {/* ========================================================= */}
        {activeTab === 'teach' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">
                  Skills I Teach &amp; Coin Rates
                </h3>
                <p className="text-xs text-white/60 font-mono">
                  List the coins you want to receive to teach, or offer them for direct 1:1 barter.
                </p>
              </div>
              <button
                onClick={() => setShowAddTeachModal(true)}
                className="px-4 py-2 rounded-xl bg-[#3d9be9] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#2a7dd7] transition-all cursor-pointer shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill to Teach</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.skillsToTeach.map((skill) => (
                <div
                  key={skill.id}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3d9be9]/10 text-[#3d9be9] border border-[#3d9be9]/20">
                        {skill.level}
                      </span>
                      <span className="text-[11px] font-mono text-white/50">
                        {skill.sessionsCount} sessions
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-white mb-2">
                      {skill.name}
                    </h4>

                    {/* Coins Wanted to Teach Badge & Inline Quick Editor */}
                    <div className="my-3 p-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-white/60">Coins to Teach:</span>
                        {editingCoinSkillId === skill.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="5"
                              max="500"
                              value={editingCoinAmount}
                              onChange={(e) => setEditingCoinAmount(parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-0.5 rounded bg-black/60 border border-amber-400 text-xs font-mono font-bold text-amber-300 focus:outline-none"
                            />
                            <button
                              onClick={() => handleUpdateCoinRate(skill.id, true, editingCoinAmount)}
                              className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCoinSkillId(null)}
                              className="text-[10px] text-white/50 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-amber-300 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              {skill.coinsWanted ?? 25} Coins/hr
                            </span>
                            <button
                              onClick={() => {
                                setEditingCoinSkillId(skill.id);
                                setEditingCoinAmount(skill.coinsWanted ?? 25);
                              }}
                              className="text-[10px] font-mono text-white/50 hover:text-amber-300 underline"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                        <span>Trade Mode:</span>
                        <span className="text-emerald-400">
                          {skill.tradeMode === 'coins'
                            ? 'Coins Only'
                            : skill.tradeMode === 'barter'
                            ? 'Barter Only'
                            : 'Coins & Barter'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={onOpenTeach}
                      className="text-xs font-mono text-[#3d9be9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Teach Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={onOpenLearn}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Exchange</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SKILLS I'M LEARNING                                */}
        {/* ========================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">
                  Skills I'm Learning &amp; Coins Offered
                </h3>
                <p className="text-xs text-white/60 font-mono">
                  List the coins you are willing to give to learn from verified mentors, or offer direct skill swaps.
                </p>
              </div>
              <button
                onClick={() => setShowAddLearnModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Learning Goal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.skillsToLearn.map((goal) => (
                <div
                  key={goal.id}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        In Progress
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {goal.progress}%
                      </span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-white mb-1">
                      {goal.name}
                    </h4>
                    <p className="text-xs text-white/60 font-mono mb-3">
                      Target: {goal.target}
                    </p>

                    {/* Coins Offered to Learn Badge & Inline Quick Editor */}
                    <div className="my-3 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-white/60">Coins Offered:</span>
                        {editingCoinSkillId === goal.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="5"
                              max="500"
                              value={editingCoinAmount}
                              onChange={(e) => setEditingCoinAmount(parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-0.5 rounded bg-black/60 border border-emerald-400 text-xs font-mono font-bold text-emerald-300 focus:outline-none"
                            />
                            <button
                              onClick={() => handleUpdateCoinRate(goal.id, false, editingCoinAmount)}
                              className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCoinSkillId(null)}
                              className="text-[10px] text-white/50 hover:text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-amber-300 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              {goal.coinsOffered ?? 20} Coins
                            </span>
                            <button
                              onClick={() => {
                                setEditingCoinSkillId(goal.id);
                                setEditingCoinAmount(goal.coinsOffered ?? 20);
                              }}
                              className="text-[10px] font-mono text-white/50 hover:text-amber-300 underline"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                        <span>Trade Mode:</span>
                        <span className="text-amber-300">
                          {goal.tradeMode === 'coins'
                            ? 'Coins Only'
                            : goal.tradeMode === 'barter'
                            ? 'Barter Only'
                            : 'Coins & Barter'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <button
                      onClick={onOpenLearn}
                      className="w-full py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/90 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Find Mentors in Coin Trade Hub</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SESSIONS                                           */}
        {/* ========================================================= */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white mb-1">
              Confirmed Barter Sessions
            </h3>
            <div className="space-y-4">
              {user.upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={session.partnerAvatar}
                      alt={session.partnerName}
                      className="w-12 h-12 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">
                          {session.partnerName}
                        </h4>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            session.role === 'teaching'
                              ? 'bg-[#3d9be9]/10 text-[#3d9be9] border border-[#3d9be9]/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          You are {session.role}
                        </span>
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-0.5">
                        Topic: {session.topic}
                      </div>
                      <div className="text-[11px] font-mono text-white/50 mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{session.date} &bull; {session.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button className="px-3 py-1.5 rounded-xl border border-white/15 text-xs font-mono text-white/70 hover:text-white">
                      Reschedule
                    </button>
                    <button className="px-4 py-1.5 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20">
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PEER REVIEWS                                       */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white mb-1">
              Peer Endorsements ({user.reviews.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.reviewerAvatar}
                        alt={rev.reviewerName}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{rev.reviewerName}</h4>
                        <span className="text-[10px] font-mono text-white/50">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#3d9be9]">
                    Swapped: {rev.skill}
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed font-body">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Skill to Teach Modal */}
      {showAddTeachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 bg-[#121314] text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold font-serif">Add Skill to Teach</h4>
              <button
                onClick={() => setShowAddTeachModal(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTeachSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  placeholder="e.g. Distributed SQL with CockroachDB"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#3d9be9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Your Proficiency Level
                  </label>
                  <select
                    value={newTeachLevel}
                    onChange={(e) => setNewTeachLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none"
                  >
                    <option value="Beginner Friendly">Beginner Friendly</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Coins Wanted (/hr)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="5"
                      max="500"
                      value={newTeachCoins}
                      onChange={(e) => setNewTeachCoins(Math.max(5, parseInt(e.target.value) || 0))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                    <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Trading Mode
                </label>
                <select
                  value={newTeachTradeMode}
                  onChange={(e) => setNewTeachTradeMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none"
                >
                  <option value="both">Both 1:1 Skill Barter &amp; Coins</option>
                  <option value="coins">Coins Only (🪙)</option>
                  <option value="barter">Skill Barter Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeachModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-xs font-semibold text-white shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Add to Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Learning Goal Modal */}
      {showAddLearnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 bg-[#121314] text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold font-serif">Add Learning Goal &amp; Coin Bid</h4>
              <button
                onClick={() => setShowAddLearnModal(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddLearnSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  What do you want to learn?
                </label>
                <input
                  type="text"
                  required
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  placeholder="e.g. Conversational Italian (B1 level)"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Target Milestone
                  </label>
                  <input
                    type="text"
                    value={newLearnTarget}
                    onChange={(e) => setNewLearnTarget(e.target.value)}
                    placeholder="e.g. Daily conversation"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Coins Offered
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="5"
                      max="500"
                      value={newLearnCoins}
                      onChange={(e) => setNewLearnCoins(Math.max(5, parseInt(e.target.value) || 0))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Trading Mode
                </label>
                <select
                  value={newLearnTradeMode}
                  onChange={(e) => setNewLearnTradeMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none"
                >
                  <option value="both">Both 1:1 Skill Barter &amp; Coins</option>
                  <option value="coins">Coins Only (🪙)</option>
                  <option value="barter">Skill Barter Only</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLearnModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Add Learning Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
