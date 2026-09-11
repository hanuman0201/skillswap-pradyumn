import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Palette,
  Cpu,
  Languages,
  Music,
  Briefcase,
  Search,
  User,
  LogOut,
  Coins,
} from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenTeach: () => void;
  onSelectSkillToLearn: (skillName: string) => void;
  onOpenLearnPage: () => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onOpenCreateListing?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateSection,
  onOpenTeach,
  onSelectSkillToLearn,
  onOpenLearnPage,
  currentUser,
  onOpenProfile,
  onLogout,
  onOpenCreateListing,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLearnDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickTracks = [
    {
      title: 'Full-Stack Next.js 15',
      category: 'Engineering',
      mentors: '248 mentors',
      icon: <Code2 className="w-4 h-4 text-white" />,
    },
    {
      title: 'Minimalist 3D & Blender',
      category: 'Design & 3D',
      mentors: '184 mentors',
      icon: <Palette className="w-4 h-4 text-white" />,
    },
    {
      title: 'Applied LLMs & RAG',
      category: 'AI & Data',
      mentors: '165 mentors',
      icon: <Cpu className="w-4 h-4 text-white" />,
    },
    {
      title: 'Conversational Japanese',
      category: 'Languages',
      mentors: '312 mentors',
      icon: <Languages className="w-4 h-4 text-white" />,
    },
    {
      title: 'Sound Design & Synth',
      category: 'Music & Audio',
      mentors: '96 mentors',
      icon: <Music className="w-4 h-4 text-white" />,
    },
    {
      title: 'Venture Pitch Decks',
      category: 'Leadership',
      mentors: '142 mentors',
      icon: <Briefcase className="w-4 h-4 text-white" />,
    },
  ];

  const filteredTracks = quickTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const handleLearnClick = () => {
    onOpenLearnPage();
    setLearnDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleTeachClick = () => {
    onOpenTeach();
    setLearnDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-transparent py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group cursor-pointer focus:outline-none"
        >
          <Logo variant="full" />
        </a>

        {/* Desktop Navigation: Replaced Product, Company, Resources, Legal with Learn & Teach */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {/* Learn Nav with Black & White Glass UI Mega Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setLearnDropdownOpen(true)}
            onMouseLeave={() => setLearnDropdownOpen(false)}
          >
            <button
              onClick={handleLearnClick}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all rounded-xl cursor-pointer ${
                learnDropdownOpen
                  ? 'text-white bg-white/10 border border-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Learn</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 text-white/60 ${
                  learnDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {/* Black & White Glass UI Mega Dropdown */}
            <AnimatePresence>
              {learnDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-2 w-[440px] sm:w-[500px] rounded-2xl border border-white/20 bg-black/85 backdrop-blur-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] z-50 text-white"
                >
                  {/* Dropdown Header in Black & White Glass */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">Curriculum &amp; Skills</h4>
                        <p className="text-[11px] font-mono text-white/50">Black &amp; White Glass Directory</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLearnClick}
                      className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1 group"
                    >
                      <span>View All (240+)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* Glass Quick Filter Search Bar */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                    <input
                      type="text"
                      value={dropdownSearch}
                      onChange={(e) => setDropdownSearch(e.target.value)}
                      placeholder="Quick filter topics (Next.js, Blender, AI...)"
                      className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  {/* Quick Tracks Grid in Glass Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-4 max-h-56 overflow-y-auto pr-1">
                    {filteredTracks.map((track) => (
                      <button
                        key={track.title}
                        onClick={() => {
                          onOpenLearnPage();
                          setLearnDropdownOpen(false);
                        }}
                        className="group flex flex-col items-start p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/30 backdrop-blur-md text-left transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <div className="w-6 h-6 rounded-md border border-white/15 bg-white/5 flex items-center justify-center">
                            {track.icon}
                          </div>
                          <span className="text-[10px] font-mono text-white/40 group-hover:text-white transition-colors">
                            {track.category}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-white group-hover:text-white line-clamp-1">
                          {track.title}
                        </span>
                        <span className="text-[10px] font-mono text-white/50 mt-0.5">
                          {track.mentors}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Dropdown Footer Banner */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between backdrop-blur-md">
                    <div className="text-[11px] text-white/70">
                      <span className="font-semibold text-white">1:1 Barter Model</span> &bull; 0 fees, purely peer traded
                    </div>
                    <button
                      onClick={handleLearnClick}
                      className="px-3 py-1 rounded-lg bg-white text-black text-[11px] font-semibold hover:bg-white/90 transition-all cursor-pointer"
                    >
                      Open Full Catalog
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Teach Nav Item */}
          <button
            onClick={handleTeachClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white/70" />
            <span>Teach</span>
          </button>

          {/* Live Marketplace Nav Item */}
          <button
            onClick={() => onNavigateSection('live-marketplace')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#08f7bf] animate-pulse" />
            <span>Marketplace</span>
          </button>
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Post Listing shortcut button */}
          <button
            onClick={currentUser ? onOpenCreateListing : onOpenAuth}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08f7bf]/15 hover:bg-[#08f7bf]/25 border border-[#08f7bf]/40 text-[#08f7bf] text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(8,247,191,0.15)]"
          >
            <span className="text-sm leading-none">+</span>
            <span>Post Listing</span>
          </button>

          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer group shadow-md shadow-blue-500/10"
                aria-label="User Profile"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/30"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-semibold block leading-none text-white">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">
                    🪙 {currentUser.coins ?? 180} &bull; {currentUser.credits} pts
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/60 transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/20 bg-[#121318]/95 backdrop-blur-2xl p-2 shadow-2xl z-50 text-white"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                      <div className="text-[11px] font-mono text-white/50 truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-amber-300">
                        <span>SkillCoins:</span>
                        <span className="font-bold">🪙 {currentUser.coins ?? 180}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-[11px] font-mono text-[#3d9be9]">
                        <span>Barter Credits:</span>
                        <span className="font-bold">{currentUser.credits} Pts</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenCreateListing?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#08f7bf] hover:bg-[#08f7bf]/10 text-left transition-all cursor-pointer font-medium"
                    >
                      <span className="text-sm font-bold leading-none">+</span>
                      <span>Post New Listing</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 text-left transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#3d9be9]" />
                      <span>My Profile &amp; Skills</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenLearnPage();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 text-left transition-all cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Learn Studio</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenTeach();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 text-left transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#3d9be9]" />
                      <span>Teach Studio</span>
                    </button>

                    <div className="border-t border-white/10 my-1" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 text-left transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={onOpenAuth}
                className="rounded-full bg-[#3d9be9] hover:bg-[#2a7dd7] px-5 py-2 text-xs sm:text-sm font-medium text-white transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Get started
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <div className="border-b border-white/10 pb-4 space-y-2">
            <button
              onClick={handleLearnClick}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Learn (Black &amp; White Glass UI)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </button>

            <button
              onClick={handleTeachClick}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3d9be9]" />
                <span>Teach on SkillSpace</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/60" />
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile?.();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#3d9be9]/15 border border-[#3d9be9]/30 text-white font-medium text-sm"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#3d9be9]" />
                  <span>My Profile ({currentUser.name})</span>
                </div>
                <span className="text-xs font-mono text-amber-300">🪙 {currentUser.coins ?? 180} &bull; {currentUser.credits} pts</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            {currentUser ? (
              <button
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-full border border-red-500/30 bg-red-500/10 py-2.5 text-center text-sm font-medium text-red-300"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-full bg-[#3d9be9] py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-blue-500/20"
              >
                Get started now
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
