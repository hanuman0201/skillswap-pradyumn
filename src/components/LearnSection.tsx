import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Code2,
  Palette,
  Languages,
  Cpu,
  Music,
  ArrowUpRight,
  Star,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LearnSkill {
  id: string;
  title: string;
  category: 'dev' | 'design' | 'ai' | 'languages' | 'music' | 'business';
  categoryLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  mentorsCount: number;
  rating: number;
  swapsCompleted: number;
  popularSwaps: string[];
  description: string;
  iconType: string;
  featured?: boolean;
}

const LEARN_SKILLS: LearnSkill[] = [
  {
    id: 'skill-1',
    title: 'Full-Stack Next.js 15 & TypeScript',
    category: 'dev',
    categoryLabel: 'Engineering',
    level: 'Intermediate',
    mentorsCount: 248,
    rating: 4.95,
    swapsCompleted: 1420,
    popularSwaps: ['Figma UI', 'Python / ML', 'Japanese'],
    description: 'Server components, Turbopack, App Router architecture and production deployment workflows.',
    iconType: 'code',
    featured: true,
  },
  {
    id: 'skill-2',
    title: 'Minimalist 3D Motion & Blender',
    category: 'design',
    categoryLabel: 'Design & 3D',
    level: 'All Levels',
    mentorsCount: 184,
    rating: 4.92,
    swapsCompleted: 890,
    popularSwaps: ['React', 'Video Editing', 'Spanish'],
    description: 'Procedural shading, lighting rigs, hard-surface topology and micro-loop physics simulation.',
    iconType: 'palette',
    featured: true,
  },
  {
    id: 'skill-3',
    title: 'Applied LLMs & Autonomous Agents',
    category: 'ai',
    categoryLabel: 'AI & Data',
    level: 'Advanced',
    mentorsCount: 165,
    rating: 4.98,
    swapsCompleted: 730,
    popularSwaps: ['Design Systems', 'Product Strategy', 'Mandarin'],
    description: 'Prompt engineering patterns, RAG pipelines, vector embedding indexing, and multi-agent coordination.',
    iconType: 'cpu',
    featured: true,
  },
  {
    id: 'skill-4',
    title: 'Conversational Japanese (JLPT N3-N1)',
    category: 'languages',
    categoryLabel: 'Languages',
    level: 'All Levels',
    mentorsCount: 312,
    rating: 4.97,
    swapsCompleted: 2150,
    popularSwaps: ['English Pronunciation', 'Web Dev', 'Piano'],
    description: 'Natural pitch accent, real-life dialogue, business keigo, and everyday colloquial idioms.',
    iconType: 'languages',
  },
  {
    id: 'skill-5',
    title: 'Design Systems & Token Architecture',
    category: 'design',
    categoryLabel: 'Design & 3D',
    level: 'Intermediate',
    mentorsCount: 205,
    rating: 4.93,
    swapsCompleted: 1140,
    popularSwaps: ['Tailwind CSS', 'Vue / React', 'Copywriting'],
    description: 'Atomic tokens, semantic color mappings, variable typography scales, and cross-team Figma governance.',
    iconType: 'palette',
  },
  {
    id: 'skill-6',
    title: 'Analog Synthesizers & Sound Design',
    category: 'music',
    categoryLabel: 'Music & Audio',
    level: 'Beginner',
    mentorsCount: 96,
    rating: 4.89,
    swapsCompleted: 480,
    popularSwaps: ['Graphic Design', 'Backend Node.js', 'French'],
    description: 'Subtractive synthesis, frequency modulation, patch routing, and spatial stereo imaging.',
    iconType: 'music',
  },
  {
    id: 'skill-7',
    title: 'Venture Storytelling & Pitch Decks',
    category: 'business',
    categoryLabel: 'Leadership & Ops',
    level: 'Intermediate',
    mentorsCount: 142,
    rating: 4.91,
    swapsCompleted: 620,
    popularSwaps: ['UI Prototyping', 'AI Workflows', 'German'],
    description: 'Narrative arcs, financial traction modeling, seed milestone framing, and investor Q&A rehearsals.',
    iconType: 'briefcase',
  },
  {
    id: 'skill-8',
    title: 'Rust Systems Programming & Memory',
    category: 'dev',
    categoryLabel: 'Engineering',
    level: 'Advanced',
    mentorsCount: 128,
    rating: 4.96,
    swapsCompleted: 580,
    popularSwaps: ['3D Modeling', 'DevOps', 'Spanish'],
    description: 'Ownership semantics, lifetimes, unsafe concurrency bounds, and low-latency network primitives.',
    iconType: 'code',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Fields' },
  { id: 'dev', label: 'Engineering' },
  { id: 'design', label: 'Design & 3D' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'languages', label: 'Languages' },
  { id: 'music', label: 'Music & Audio' },
  { id: 'business', label: 'Leadership' },
];

interface LearnSectionProps {
  onSelectSkillToLearn: (skillName: string) => void;
  onOpenTeach: () => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({
  onSelectSkillToLearn,
  onOpenTeach,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'catalog' | 'mechanics'>('catalog');

  const filteredSkills = useMemo(() => {
    return LEARN_SKILLS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'all' || item.level === selectedLevel;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.popularSwaps.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Code2 className="w-5 h-5 text-white" />;
      case 'palette':
        return <Palette className="w-5 h-5 text-white" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-white" />;
      case 'languages':
        return <Languages className="w-5 h-5 text-white" />;
      case 'music':
        return <Music className="w-5 h-5 text-white" />;
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section
      id="learn"
      className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Ambient Monochrome Glass Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-12 right-12 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[90px] pointer-events-none" />

      {/* Header Container - Black & White Glass aesthetic */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-xl mb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <GraduationCap className="w-4 h-4 text-white" />
          <span className="text-xs font-mono tracking-widest text-white/90 uppercase">
            Curriculum &bull; Black &amp; White Glass UI
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5 font-display">
          What do you want to learn?
        </h2>
        <p className="text-base sm:text-lg text-white/60 font-body leading-relaxed max-w-2xl mx-auto">
          Exchange 1 hour of what you already know for 1 hour of mastery from someone else.
          Zero money traded — just pure human intellect and mutual growth.
        </p>

        {/* Mode switcher pills */}
        <div className="mt-8 inline-flex items-center p-1 rounded-xl border border-white/15 bg-black/60 backdrop-blur-2xl shadow-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'catalog'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Explore 240+ Skills
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`px-5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              activeTab === 'mechanics'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            How Barter Learning Works
          </button>
        </div>
      </div>

      {activeTab === 'mechanics' ? (
        /* Mechanics view in Black and White Glass UI */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 max-w-4xl mx-auto mb-16 rounded-2xl border border-white/20 bg-white/[0.03] backdrop-blur-2xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg border border-white/25 bg-white/10 flex items-center justify-center text-white font-mono font-bold mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Find a Topic &amp; Peer</h3>
              <p className="text-xs text-white/60 leading-relaxed font-body">
                Search what you want to learn. Our matchmaking engine filters for peers whose learning desires match what you can teach.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg border border-white/25 bg-white/10 flex items-center justify-center text-white font-mono font-bold mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Propose the Barter</h3>
              <p className="text-xs text-white/60 leading-relaxed font-body">
                Send a 1:1 proposal with your mutual availability. Both members lock in their topics and receive prep notes before connecting.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg border border-white/25 bg-white/10 flex items-center justify-center text-white font-mono font-bold mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live 1-on-1 Studio</h3>
              <p className="text-xs text-white/60 leading-relaxed font-body">
                Meet in the built-in collaborative classroom with video, audio, syntax-highlighted code editor, and interactive whiteboard.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-white/80">
              <ShieldCheck className="w-5 h-5 text-white shrink-0" />
              <span>Verified profiles, mutual reviews, and anti-ghosting streak shields.</span>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 transition-all"
            >
              Browse Skills Now
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Search & Filter Controls - Black & White Glass UI */}
          <div className="relative z-10 max-w-5xl mx-auto mb-10">
            <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] space-y-4">
              {/* Search Bar Input */}
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any skill to learn (e.g. Next.js, 3D Blender, Japanese, Prompt Engineering, Rust...)"
                  className="w-full pl-12 pr-28 py-3.5 bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none backdrop-blur-md transition-colors"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 text-xs font-mono text-white/50 hover:text-white px-2 py-1 rounded bg-white/10"
                  >
                    Clear
                  </button>
                ) : (
                  <div className="absolute right-4 hidden sm:flex items-center gap-1 text-[11px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">
                    <span>240+ Topics</span>
                  </div>
                )}
              </div>

              {/* Category Pills and Level Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-white text-black shadow-sm font-semibold'
                          : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Level Dropdown / Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider hidden sm:inline">
                    Level:
                  </span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="bg-white/[0.05] border border-white/15 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/30 backdrop-blur-md"
                  >
                    <option value="all" className="bg-black text-white">All Levels</option>
                    <option value="Beginner" className="bg-black text-white">Beginner</option>
                    <option value="Intermediate" className="bg-black text-white">Intermediate</option>
                    <option value="Advanced" className="bg-black text-white">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Black & White Glass Skill Cards */}
          <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/40 backdrop-blur-2xl p-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Icon + Category + Level badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-transform">
                          {renderIcon(skill.iconType)}
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                            {skill.categoryLabel}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>{skill.mentorsCount} active mentors</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border border-white/20 bg-white/5 text-white/90">
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-white transition-colors mb-2 font-display">
                      {skill.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/60 leading-relaxed font-body mb-4">
                      {skill.description}
                    </p>

                    {/* Popular Exchange Trades */}
                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                        Mentors looking to swap for:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.popularSwaps.map((trade) => (
                          <span
                            key={trade}
                            className="text-[11px] px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-white/70 font-mono"
                          >
                            &bull; {trade}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span className="font-semibold text-white">{skill.rating}</span>
                      <span className="text-white/40 font-mono">({skill.swapsCompleted} swaps)</span>
                    </div>

                    <button
                      onClick={() => onSelectSkillToLearn(skill.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all shadow-sm group-hover:shadow-white/20"
                    >
                      <span>Request Swap</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-16 px-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl max-w-xl mx-auto mb-12">
              <BookOpen className="w-8 h-8 text-white/40 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">No exact match found</h4>
              <p className="text-xs text-white/60 mb-4">
                We have over 1,200 peer mentors on standby for custom topics.
              </p>
              <button
                onClick={() => onSelectSkillToLearn(searchQuery || 'Custom Topic')}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs"
              >
                Post Custom Learning Request
              </button>
            </div>
          )}
        </>
      )}

      {/* Footer Callout: Teach your skills */}
      <div className="relative z-10 max-w-5xl mx-auto rounded-2xl border border-white/15 bg-black/80 backdrop-blur-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase block mb-1">
            Have Knowledge to Share?
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
            Become a peer teacher &bull; Earn credits on your terms
          </h3>
          <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-lg font-body">
            Teaching 1 hour grants you 100 Swap Points to unlock any lesson in the curriculum.
          </p>
        </div>

        <button
          onClick={onOpenTeach}
          className="shrink-0 px-6 py-3 rounded-full border border-white/30 bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 hover:border-white transition-all shadow-lg shadow-white/5"
        >
          Teach on SkillSwap
        </button>
      </div>
    </section>
  );
};
