import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Copy,
  RotateCcw,
  Zap,
  Layers,
  MessageSquare,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Code2,
  Cpu,
  Palette,
  Languages,
  Music,
  Briefcase,
  Play,
  Send,
  Plus,
  Calendar,
  UserCheck,
  CheckCircle2,
  Video,
  Star,
  Users,
  GraduationCap,
  FileCode,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import {
  SkillBarterConfirmModal,
  BarterPeerInfo,
  FinalizedBarterSwap,
} from './SkillBarterConfirmModal';
import { WhatsAppMessenger } from './WhatsAppMessenger';

type TeachTabId =
  | 'studio'
  | 'overview'
  | 'curriculum'
  | 'sessions'
  | 'requests'
  | 'messages'
  | 'whiteboard';

interface LessonPlanResult {
  id: string;
  topic: string;
  originalText: string;
  hook: string;
  handsOnChallenge: {
    title: string;
    description: string;
    estimatedMinutes: number;
  };
  keyTakeaway: string;
  verificationPrompt: string;
  timestamp: string;
}

const SAMPLE_TEACH_TOPICS = [
  {
    title: 'Next.js Server Actions & Form Status',
    snippet:
      'Teaching how React 19 and Next.js 15 handle server actions using useActionState and useFormStatus. Many beginners struggle with optimistic UI updates and error boundary catching when submitting forms without client-side preventDefault.',
  },
  {
    title: 'Vector Search & Cosine Distance in RAG',
    snippet:
      'Explaining how token text turns into 1536-dimensional embeddings. The student needs to understand why dot product of normalized vectors equals cosine similarity and how top-k nearest neighbors retrieves relevant chunks.',
  },
  {
    title: 'Figma Auto-Layout & Design Tokens',
    snippet:
      'Hands-on session for a developer wanting to master Figma. We will cover hug vs fill constraints, responsive frame nesting, min/max widths, and binding semantic color variables to design tokens.',
  },
  {
    title: 'Japanese Pitch Accent (Heiban vs Atamadaka)',
    snippet:
      'Coaching intermediate learners on mora-timing and Tokyo pitch contour. Contrasting words that sound identical in romaji but differ in pitch drop, such as hashi (chopsticks vs bridge vs edge).',
  },
];

interface TeachPageProps {
  onBackToHome: () => void;
  onOpenLearn: () => void;
  onOpenProfile?: () => void;
  currentUser?: UserProfile | null;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const TeachPage: React.FC<TeachPageProps> = ({
  onBackToHome,
  onOpenLearn,
  onOpenProfile,
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<TeachTabId>('studio');

  // Dedicated Skill Barter Confirmation Modal state
  const [selectedBarterPeer, setSelectedBarterPeer] = useState<BarterPeerInfo | null>(null);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);

  // Lesson Studio State
  const [notesText, setNotesText] = useState('');
  const [isDeconstructing, setIsDeconstructing] = useState(false);
  const [planResult, setPlanResult] = useState<LessonPlanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedPlans, setSavedPlans] = useState<LessonPlanResult[]>([]);

  // Add Track Modal / State
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackCategory, setNewTrackCategory] = useState('Engineering');
  const [newTrackLevel, setNewTrackLevel] = useState('Intermediate');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [customTracks, setCustomTracks] = useState([
    {
      id: 'ct-1',
      title: 'Full-Stack Next.js 15 & Server Components',
      category: 'Engineering',
      students: 19,
      rating: 4.99,
      level: 'Expert',
      activeSwaps: 3,
    },
    {
      id: 'ct-2',
      title: 'Vector Embeddings & Hybrid RAG Architectures',
      category: 'AI & Data',
      students: 12,
      rating: 4.96,
      level: 'Advanced',
      activeSwaps: 2,
    },
    {
      id: 'ct-3',
      title: 'Type-Safe Distributed APIs with tRPC',
      category: 'Engineering',
      students: 7,
      rating: 5.0,
      level: 'Expert',
      activeSwaps: 1,
    },
  ]);

  // Whiteboard scratchpad state
  const [whiteboardContent, setWhiteboardContent] = useState(
    `// ✦ Lesson Scratchpad: Interactive Code & Visual Concept
// Topic: Next.js 15 Server Actions & Optimistic UI

'use client';
import { useOptimistic } from 'react';

export function CommentThread({ initialComments, addCommentAction }) {
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    initialComments,
    (current, newText) => [...current, { text: newText, pending: true }]
  );

  return (
    <div>
      {/* Student: Notice how the UI updates before the network returns! */}
    </div>
  );
}`
  );

  // Incoming Barter Proposals
  const [proposals, setProposals] = useState([
    {
      id: 'prop-1',
      studentName: 'Maya Tanaka',
      studentAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      wantsToLearn: 'Full-Stack Next.js 15 & Server Components',
      offersToTeach: 'Conversational Japanese & Pitch Accent',
      rating: 4.98,
      status: 'pending',
      proposedTime: 'Tomorrow at 4:00 PM EST',
    },
    {
      id: 'prop-2',
      studentName: 'Julian Rossi',
      studentAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      wantsToLearn: 'Vector Embeddings & RAG Architectures',
      offersToTeach: 'Analog Synthesizers & Sound Design',
      rating: 5.0,
      status: 'pending',
      proposedTime: 'Friday at 2:30 PM EST',
    },
  ]);

  const handleDeconstruct = () => {
    if (!notesText.trim()) return;
    setIsDeconstructing(true);

    setTimeout(() => {
      const clean = notesText.trim();
      const words = clean.split(/\s+/);
      const estimatedTopic = words.slice(0, 4).join(' ').replace(/[,.:;]/g, '');

      const result: LessonPlanResult = {
        id: `plan-${Date.now()}`,
        topic: estimatedTopic.length > 28 ? estimatedTopic.slice(0, 28) + '...' : estimatedTopic,
        originalText: clean,
        hook: `Start the session with a direct "broken" scenario: show them what fails before explaining why it happens. In the first 3 minutes, let them diagnose the bottleneck visually.`,
        handsOnChallenge: {
          title: `Build & Fix: The 15-Minute Isolation Sandbox`,
          description: `Hand the student an isolated repo or codesandbox with 1 missing mechanism. Have them implement the fix while you guide via screen-share without touching their keyboard.`,
          estimatedMinutes: 25,
        },
        keyTakeaway: `Mental model: Never teach the syntax before the reason for existence. Link the mechanism to latency, reliability, or developer velocity.`,
        verificationPrompt: `At minute 40, ask: "If your production service scaled 10x traffic right now, what would break first in this implementation?"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setPlanResult(result);
      setSavedPlans((prev) => [result, ...prev.slice(0, 3)]);
      setIsDeconstructing(false);
    }, 800);
  };

  const handleCopyPlan = () => {
    if (!planResult) return;
    const text = `TEACHING BLUEPRINT: ${planResult.topic}\n\n1. 5-MINUTE HOOK:\n${planResult.hook}\n\n2. HANDS-ON CHALLENGE:\n${planResult.handsOnChallenge.title} (${planResult.handsOnChallenge.estimatedMinutes} min)\n${planResult.handsOnChallenge.description}\n\n3. VERIFICATION QUESTION:\n${planResult.verificationPrompt}\n\nKEY TAKEAWAY:\n${planResult.keyTakeaway}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim()) return;
    setCustomTracks([
      {
        id: `ct-${Date.now()}`,
        title: newTrackTitle.trim(),
        category: newTrackCategory,
        students: 0,
        rating: 5.0,
        level: newTrackLevel,
        activeSwaps: 0,
      },
      ...customTracks,
    ]);
    setNewTrackTitle('');
    setShowAddTrackModal(false);
  };

  const handleOpenProposalReview = (prop: (typeof proposals)[0]) => {
    setActiveProposalId(prop.id);
    setSelectedBarterPeer({
      name: prop.studentName,
      avatar: prop.studentAvatar,
      role: 'SkillSpace Peer',
      canTeach: prop.offersToTeach,
      wantsToLearn: prop.wantsToLearn,
      rating: prop.rating,
      swaps: 14,
    });
    setIsBarterModalOpen(true);
  };

  const handleFinalizeBarterSuccess = (swap: FinalizedBarterSwap) => {
    if (activeProposalId) {
      setProposals((prev) =>
        prev.map((p) => (p.id === activeProposalId ? { ...p, status: 'accepted' } : p))
      );
    }

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

  const handleAcceptProposal = (id: string) => {
    const prop = proposals.find((p) => p.id === id);
    if (prop) {
      handleOpenProposalReview(prop);
    } else {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'accepted' } : p))
      );
    }
  };

  const userDisplayName = currentUser?.name || 'Alex Rivers';
  const userDisplayEmail = currentUser?.email || 'alex.rivers@skillspace.io';
  const userInitials = currentUser?.initials || 'AR';

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col md:flex-row antialiased selection:bg-white selection:text-black">
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR - Sleek Glass Navigation                   */}
      {/* ======================================================== */}
      <aside className="w-full md:w-64 lg:w-72 shrink-0 border-r border-white/10 bg-[#09090d]/90 backdrop-blur-2xl flex flex-col justify-between py-6 px-4 z-30">
        <div>
          {/* Logo & Brand matching Learn Page */}
          <div className="flex items-center justify-between px-2 mb-8">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              {/* App Icon: Blue-Cyan squircle for Teaching Studio */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3d9be9] to-[#1e70bf] flex items-center justify-center text-white shadow-lg shadow-[#3d9be9]/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight font-['Poppins',sans-serif] text-white block leading-none">
                  Skill<span className="text-[#3d9be9]">Space</span>
                </span>
                <span className="text-[10px] font-mono text-[#3d9be9] tracking-wider font-semibold">
                  TEACHING STUDIO
                </span>
              </div>
            </button>

            <button
              onClick={onBackToHome}
              title="Return to home landing page"
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] font-mono">Exit</span>
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="space-y-1.5 font-medium">
            {/* 1. Studio / Planner (Highlighted active tab) */}
            <button
              onClick={() => setActiveTab('studio')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-[#3d9be9]/20 to-white/10 text-white font-semibold border border-[#3d9be9]/40 shadow-[0_4px_20px_rgba(61,155,233,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  activeTab === 'studio'
                    ? 'bg-[#3d9be9] text-white shadow-sm'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">Lesson Studio</span>
            </button>

            {/* 2. Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'overview'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Teaching Overview</span>
            </button>

            {/* 3. My Teachable Tracks */}
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'curriculum'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span>My Offerings</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                  {customTracks.length}
                </span>
              </div>
            </button>

            {/* 4. Live Sessions & Schedule */}
            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'sessions'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Barter Schedule</span>
            </button>

            {/* 5. Swap Proposals */}
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'requests'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <div className="flex items-center justify-between w-full">
                <span>Swap Proposals</span>
                <span className="w-2 h-2 rounded-full bg-[#3d9be9] animate-pulse" />
              </div>
            </button>

            {/* 6. Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'messages'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Student Chat</span>
            </button>

            {/* 7. Interactive Whiteboard */}
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all text-left ${
                activeTab === 'whiteboard'
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Live Scratchpad</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Switch to Learn & Credit balance */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/50 mb-1 font-mono">
              <span>Teaching Hours</span>
              <span className="text-[#3d9be9] font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#3d9be9]" /> 38 Hours
              </span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#3d9be9] to-white h-full w-4/5" />
            </div>
          </div>

          <button
            onClick={onOpenLearn}
            className="w-full py-2.5 px-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 hover:border-white/30 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#3d9be9]" />
            <span>Switch to Learn Studio</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA - Black Sleek Glass UI               */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#0b0b10] to-[#050508] relative overflow-y-auto">
        {/* Ambient Glass Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[300px] bg-[#3d9be9]/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header Bar matching Learn Page */}
        <header className="px-6 lg:px-10 py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 backdrop-blur-xl bg-black/40">
          <div>
            {/* Eyebrow badge: "● YOUR TEACHING SPACE" */}
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#3d9be9] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d9be9] animate-pulse" />
              <span>YOUR TEACHING SPACE</span>
            </div>
            {/* Large display title */}
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-white font-bold">
              {activeTab === 'studio' && 'Lesson Studio'}
              {activeTab === 'overview' && 'Teaching Overview & Metrics'}
              {activeTab === 'curriculum' && 'My Teachable Offerings'}
              {activeTab === 'sessions' && 'Barter Schedule & Slots'}
              {activeTab === 'requests' && 'Incoming Swap Proposals'}
              {activeTab === 'messages' && 'Student Chat & Exchange'}
              {activeTab === 'whiteboard' && 'Live Code & Concept Scratchpad'}
            </h1>
          </div>

          {/* Right Header Controls: Profile shortcut, avatar, exit */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group text-left"
            >
              <div className="w-7 h-7 rounded-full bg-[#3d9be9] text-white flex items-center justify-center text-xs font-bold font-mono shadow-md shadow-[#3d9be9]/30">
                {userInitials}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-medium text-white block leading-none">
                  {userDisplayName}
                </span>
                <span className="text-[10px] text-amber-300 font-mono">
                  🪙 {currentUser?.coins ?? 180} &bull; {currentUser?.credits || 250} pts
                </span>
              </div>
            </button>

            <button
              onClick={onOpenLearn}
              className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white transition-all cursor-pointer font-mono hidden md:flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#3d9be9]" />
              <span>Learn Studio</span>
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
          {/* TAB 1: LESSON STUDIO (Analogous to Study Scanner)    */}
          {/* ==================================================== */}
          {activeTab === 'studio' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Two-Column Grid matching reference image layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Card: AI Lesson Deconstructor */}
                <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between transition-all duration-300">
                  <div>
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#3d9be9] mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3d9be9]" />
                      <span>AI LESSON DECONSTRUCTOR</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
                      Turn your expertise into an effortless lesson.
                    </h2>

                    {/* Subtext */}
                    <p className="text-xs sm:text-sm text-white/60 font-body mb-6">
                      Paste your rough knowledge notes, a code snippet, or the core skill you want to exchange.
                    </p>

                    {/* Big Textarea with dashed glass border */}
                    <div className="relative mb-4">
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Paste your teaching notes or topic outline here..."
                        rows={7}
                        className="w-full rounded-2xl border border-dashed border-white/25 focus:border-[#3d9be9] bg-black/40 p-4 sm:p-5 text-sm text-white placeholder-white/40 focus:outline-none backdrop-blur-md transition-colors resize-y leading-relaxed font-body"
                      />
                      {notesText && (
                        <button
                          onClick={() => setNotesText('')}
                          className="absolute top-3 right-3 text-[11px] font-mono text-white/40 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Sample Topics */}
                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">
                        Try with a sample topic:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_TEACH_TOPICS.map((sample) => (
                          <button
                            key={sample.title}
                            type="button"
                            onClick={() => setNotesText(sample.snippet)}
                            className="text-[11px] px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono transition-all cursor-pointer"
                          >
                            + {sample.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <button
                      onClick={handleDeconstruct}
                      disabled={isDeconstructing || !notesText.trim()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3d9be9] to-[#1e70bf] hover:from-[#4ea6ee] hover:to-[#2b7ecd] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#3d9be9]/30 transition-all cursor-pointer transform active:scale-95"
                    >
                      {isDeconstructing ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Structuring 45-Min Blueprint...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Deconstruct Lesson Plan</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] font-mono text-white/40">
                      {notesText.length} characters
                    </span>
                  </div>
                </div>

                {/* Right Card: Your Teaching Path */}
                <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col justify-between">
                  <div>
                    {/* Eyebrow */}
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#3d9be9] mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3d9be9]" />
                      <span>YOUR TEACHING PATH</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-3">
                      Teach 1 hour. Earn credits for your next mastery.
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-white/60 font-body leading-relaxed mb-8">
                      Turn deep intuitive knowledge into an engaging 45-minute exchange. No slides required — just high-leverage guidance.
                    </p>

                    {/* Three Bullet Features */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/90 font-medium">
                          Craft a 5-minute interactive hook
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/90 font-medium">
                          Design a live hands-on challenge
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/90 font-medium">
                          Formulate a self-testing verification prompt
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Footer on Right Card */}
                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>100% Reciprocal Barter &bull; 100 Pts / Hr</span>
                    <span className="text-[#3d9be9]">Ready to deconstruct</span>
                  </div>
                </div>
              </div>

              {/* Generated Plan Results Display */}
              <AnimatePresence>
                {planResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-3xl border border-white/20 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  >
                    {/* Header with Title and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#3d9be9] uppercase tracking-wider mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>LESSON BLUEPRINT READY &bull; {planResult.timestamp}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">
                          Session Topic: {planResult.topic}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyPlan}
                          className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                              <span>Copied Blueprint!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Blueprint</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setCustomTracks((prev) => [
                              {
                                id: `ct-${Date.now()}`,
                                title: planResult.topic,
                                category: 'Custom Track',
                                students: 0,
                                rating: 5.0,
                                level: 'Intermediate',
                                activeSwaps: 0,
                              },
                              ...prev,
                            ]);
                            setActiveTab('curriculum');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-semibold flex items-center gap-1.5 hover:bg-white/90 transition-all shadow-sm cursor-pointer"
                        >
                          <span>Save to My Offerings</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 3 Result Pillars matching the 3 promises */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* 1. Interactive 5-Minute Hook */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                          <Zap className="w-4 h-4 text-[#3d9be9]" />
                          <span>1. The 5-Minute Hook</span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed mb-3">
                          {planResult.hook}
                        </p>
                        <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-mono text-white/60">
                          <span className="text-[#3d9be9] font-bold">Goal: </span>
                          Spark curiosity before introducing any abstract rules.
                        </div>
                      </div>

                      {/* 2. Live Hands-On Challenge */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                          <Clock className="w-4 h-4 text-[#3d9be9]" />
                          <span>2. Hands-On Challenge ({planResult.handsOnChallenge.estimatedMinutes}m)</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">
                          {planResult.handsOnChallenge.title}
                        </h4>
                        <p className="text-xs text-white/80 leading-relaxed mb-3">
                          {planResult.handsOnChallenge.description}
                        </p>
                        <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-mono text-white/60">
                          <span className="text-[#3d9be9] font-bold">Mentor Role: </span>
                          Guide via questioning; do not write their code/notes.
                        </div>
                      </div>

                      {/* 3. Verification & Takeaway */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider mb-3">
                          <CheckCircle2 className="w-4 h-4 text-[#3d9be9]" />
                          <span>3. Verification &amp; Takeaway</span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed mb-3">
                          {planResult.verificationPrompt}
                        </p>
                        <div className="p-2.5 rounded-lg border border-[#3d9be9]/20 bg-[#3d9be9]/5 text-[11px] text-white/70">
                          <span className="font-semibold text-white">Rule of Thumb: </span>
                          {planResult.keyTakeaway}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent Deconstructed Plans Strip */}
              {savedPlans.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/40 block mb-3">
                    Recent Teaching Blueprints:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {savedPlans.map((saved) => (
                      <button
                        key={saved.id}
                        onClick={() => {
                          setPlanResult(saved);
                          setNotesText(saved.originalText);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/10 text-xs text-white/80 font-mono transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#3d9be9]" />
                        <span>{saved.topic}</span>
                        <span className="text-white/40 text-[10px]">({saved.timestamp})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: TEACHING OVERVIEW                             */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Total Hours Taught</div>
                  <div className="text-3xl font-serif font-bold text-white">38 Hours</div>
                  <div className="text-[11px] text-[#3d9be9] mt-1 font-mono">+4 this month</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Credits Accumulated</div>
                  <div className="text-3xl font-serif font-bold text-[#3d9be9]">+380 Pts</div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">100 pts per 60 min session</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Student Satisfaction</div>
                  <div className="text-3xl font-serif font-bold text-white flex items-center gap-1.5">
                    <span>4.98</span>
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
                  </div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">34 peer reviews</div>
                </div>
                <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl">
                  <div className="text-xs font-mono uppercase text-white/50 mb-1">Active Students</div>
                  <div className="text-3xl font-serif font-bold text-white">7 Peers</div>
                  <div className="text-[11px] text-white/40 mt-1 font-mono">2 sessions this week</div>
                </div>
              </div>

              {/* Next Teaching Barter Banner */}
              <div className="p-8 rounded-3xl border border-white/15 bg-gradient-to-r from-black via-white/[0.04] to-black backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] font-mono text-[#3d9be9] uppercase tracking-widest block mb-1">
                    NEXT SCHEDULED TEACHING SESSION
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Next.js 15 App Router &amp; Server Actions with Elena Rostova
                  </h3>
                  <p className="text-xs text-white/60 mt-1 font-body">
                    She will teach you: Subtractive Sound Design &bull; Friday 3:00 PM EST (60 min)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('whiteboard')}
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs cursor-pointer"
                  >
                    Open Scratchpad
                  </button>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-white/90 transition-all shrink-0 cursor-pointer"
                  >
                    Enter Live Room
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: MY TEACHABLE OFFERINGS                        */}
          {/* ==================================================== */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    My Teachable Tracks
                  </h3>
                  <p className="text-xs text-white/60 font-mono">
                    Peers browse these tracks when proposing skill exchanges with you.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTrackModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#3d9be9] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#2a7dd7] transition-all cursor-pointer shadow-md shadow-[#3d9be9]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Teachable Offering</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {customTracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 backdrop-blur-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/70">
                          {track.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3d9be9]/10 text-[#3d9be9] border border-[#3d9be9]/20">
                          {track.level}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-white mb-2 leading-snug">
                        {track.title}
                      </h4>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white/50" />
                        {track.students} taught
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {track.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Track Dialog */}
              {showAddTrackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                  <div className="w-full max-w-md p-6 rounded-2xl border border-white/20 bg-[#121314] text-white shadow-2xl">
                    <h4 className="text-xl font-bold font-serif mb-4">Add Teachable Offering</h4>
                    <form onSubmit={handleAddTrack} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">
                          Skill or Topic Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newTrackTitle}
                          onChange={(e) => setNewTrackTitle(e.target.value)}
                          placeholder="e.g. Distributed SQL with CockroachDB"
                          className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#3d9be9]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-white/70 mb-1">
                            Category
                          </label>
                          <select
                            value={newTrackCategory}
                            onChange={(e) => setNewTrackCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none"
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
                          <label className="block text-xs font-medium text-white/70 mb-1">
                            Proficiency Level
                          </label>
                          <select
                            value={newTrackLevel}
                            onChange={(e) => setNewTrackLevel(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#1e2025] border border-white/15 text-xs text-white focus:outline-none"
                          >
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddTrackModal(false)}
                          className="px-4 py-2 rounded-xl border border-white/10 text-xs text-white/70 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-xs font-semibold text-white"
                        >
                          Publish Track
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: BARTER SCHEDULE & SLOTS                       */}
          {/* ==================================================== */}
          {activeTab === 'sessions' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl">
                <h3 className="text-xl font-serif font-bold text-white mb-1">
                  Upcoming 1-on-1 Barter Sessions
                </h3>
                <p className="text-xs text-white/60 font-mono mb-6">
                  Every 60 minutes taught gives you 100 barter credits to spend learning any topic.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3d9be9]/20 border border-[#3d9be9]/40 flex items-center justify-center text-[#3d9be9] font-bold font-mono">
                        ER
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Elena Rostova</div>
                        <div className="text-xs text-white/60">
                          Topic: Next.js 15 App Router &bull; Friday at 3:00 PM EST
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/70 hover:text-white">
                        Reschedule
                      </button>
                      <button className="px-4 py-1.5 rounded-lg bg-[#3d9be9] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2a7dd7]">
                        <Video className="w-3.5 h-3.5" />
                        <span>Open Video Room</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold font-mono">
                        KS
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Kenji Sato</div>
                        <div className="text-xs text-white/60">
                          Topic: Vector Search &amp; Cosine Metric &bull; Sunday at 6:00 PM EST
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/70 hover:text-white">
                        Reschedule
                      </button>
                      <button className="px-4 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/20">
                        <Video className="w-3.5 h-3.5" />
                        <span>Room Opens in 2d</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: SWAP PROPOSALS                                */}
          {/* ==================================================== */}
          {activeTab === 'requests' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl">
                <h3 className="text-xl font-serif font-bold text-white mb-1">
                  Incoming Peer Barter Proposals
                </h3>
                <p className="text-xs text-white/60 font-mono mb-6">
                  Peers offering their skills in exchange for your teaching guidance. Zero dollars exchanged.
                </p>

                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={prop.studentAvatar}
                          alt={prop.studentName}
                          className="w-12 h-12 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white text-sm">
                              {prop.studentName}
                            </h4>
                            <span className="text-[11px] font-mono text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {prop.rating}
                            </span>
                          </div>
                          <div className="text-xs text-white/70 mt-1">
                            Wants to learn:{' '}
                            <span className="text-white font-medium">{prop.wantsToLearn}</span>
                          </div>
                          <div className="text-xs text-[#3d9be9] mt-0.5">
                            Offers in return:{' '}
                            <span className="font-medium text-white">{prop.offersToTeach}</span>
                          </div>
                          <div className="text-[11px] font-mono text-white/40 mt-1">
                            Proposed: {prop.proposedTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        {prop.status === 'accepted' ? (
                          <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted &bull; Session Scheduled</span>
                          </div>
                        ) : (
                          <>
                            <button className="px-3.5 py-2 rounded-xl border border-white/15 text-xs text-white/70 hover:text-white font-mono">
                              Counter Time
                            </button>
                            <button
                              onClick={() => handleAcceptProposal(prop.id)}
                              className="px-5 py-2 rounded-xl bg-[#3d9be9] hover:bg-[#2a7dd7] text-white text-xs font-semibold shadow-md shadow-[#3d9be9]/20"
                            >
                              Accept Barter
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: STUDENT CHAT                                  */}
          {/* ==================================================== */}
          {activeTab === 'messages' && (
            <div className="max-w-5xl mx-auto">
              <WhatsAppMessenger
                currentUser={currentUser}
                onUpdateUser={onUpdateUser}
                variant="full"
              />
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: LIVE SCRATCHPAD                               */}
          {/* ==================================================== */}
          {activeTab === 'whiteboard' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Live Teaching Scratchpad
                  </h3>
                  <p className="text-xs text-white/60 font-mono">
                    Share interactive syntax and conceptual breakdowns directly during your 1-on-1 calls.
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whiteboardContent);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono text-white flex items-center gap-1.5 hover:bg-white/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <textarea
                value={whiteboardContent}
                onChange={(e) => setWhiteboardContent(e.target.value)}
                rows={16}
                className="w-full rounded-2xl border border-white/20 bg-black/60 p-5 font-mono text-xs text-emerald-400 placeholder-white/40 focus:outline-none focus:border-[#3d9be9] backdrop-blur-xl leading-relaxed"
              />
            </div>
          )}
        </main>
      </div>

      {/* Dedicated Dual-Party Skill Barter Confirmation Modal */}
      <SkillBarterConfirmModal
        isOpen={isBarterModalOpen}
        onClose={() => {
          setIsBarterModalOpen(false);
          setSelectedBarterPeer(null);
          setActiveProposalId(null);
        }}
        currentUser={currentUser}
        peer={selectedBarterPeer}
        onFinalizeSuccess={handleFinalizeBarterSuccess}
      />
    </div>
  );
};
