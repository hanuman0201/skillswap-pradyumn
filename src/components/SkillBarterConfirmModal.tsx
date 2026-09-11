import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
  FileText,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Copy,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

export interface BarterPeerInfo {
  name: string;
  role?: string;
  avatar?: string;
  canTeach: string;
  wantsToLearn?: string;
  swaps?: number;
  rating?: number;
}

export interface FinalizedBarterSwap {
  txId: string;
  timestamp: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  mySkill: string;
  partnerSkill: string;
  date: string;
  time: string;
  duration: string;
  roomCode: string;
}

interface SkillBarterConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  peer: BarterPeerInfo | null;
  onFinalizeSuccess: (swap: FinalizedBarterSwap) => void;
}

export const SkillBarterConfirmModal: React.FC<SkillBarterConfirmModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  peer,
  onFinalizeSuccess,
}) => {
  // Step: 'review_and_sign' | 'finalized_receipt'
  const [step, setStep] = useState<'review_and_sign' | 'finalized_receipt'>('review_and_sign');

  // Skill swap terms configuration
  const [mySkillToTeach, setMySkillToTeach] = useState('');
  const [customMySkill, setCustomMySkill] = useState('');
  const [peerSkillToLearn, setPeerSkillToLearn] = useState('');
  const [sessionDate, setSessionDate] = useState('Tomorrow, 3:00 PM');
  const [sessionDuration, setSessionDuration] = useState('60 Minutes (30m each)');
  const [agendaNotes, setAgendaNotes] = useState('Hands-on reciprocal practice, code review, and feedback.');

  // Dual-Party Acceptance States
  const [party1Accepted, setParty1Accepted] = useState(false);
  const [party1Timestamp, setParty1Timestamp] = useState<string | null>(null);

  const [party2Accepted, setParty2Accepted] = useState(false);
  const [party2Timestamp, setParty2Timestamp] = useState<string | null>(null);
  const [simulatingPeerSign, setSimulatingPeerSign] = useState(false);

  // Finalized Receipt Data
  const [finalizedData, setFinalizedData] = useState<FinalizedBarterSwap | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset or initialize when modal opens or peer changes
  useEffect(() => {
    if (isOpen && peer) {
      setStep('review_and_sign');
      setParty1Accepted(false);
      setParty1Timestamp(null);
      setParty2Accepted(false);
      setParty2Timestamp(null);
      setFinalizedData(null);
      setCopiedLink(false);

      // Default my skill to the first available skill or peer's desired skill
      const defaultSkill =
        currentUser?.skillsToTeach?.[0]?.name ||
        peer.wantsToLearn ||
        'Full-Stack Web & TypeScript Architecture';
      setMySkillToTeach(defaultSkill);
      setCustomMySkill('');
      setPeerSkillToLearn(peer.canTeach || '1-on-1 Mentorship');
    }
  }, [isOpen, peer, currentUser]);

  if (!isOpen || !peer) return null;

  const myName = currentUser?.name || 'Alex Rivers';
  const myAvatar =
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const myRole = 'Proposer / Mentor';

  const effectiveMySkill = mySkillToTeach === 'custom' ? customMySkill || 'Custom Skill' : mySkillToTeach;
  const bothPartiesAccepted = party1Accepted && party2Accepted;

  // Handle User Acceptance Toggle
  const handleToggleParty1 = () => {
    if (!party1Accepted) {
      setParty1Accepted(true);
      const now = new Date();
      setParty1Timestamp(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } else {
      setParty1Accepted(false);
      setParty1Timestamp(null);
    }
  };

  // Handle Peer Acceptance Toggle (Simulated Peer Review & Sign-off)
  const handleSimulatePeerAcceptance = () => {
    if (party2Accepted) {
      setParty2Accepted(false);
      setParty2Timestamp(null);
      return;
    }

    setSimulatingPeerSign(true);
    setTimeout(() => {
      setParty2Accepted(true);
      const now = new Date();
      setParty2Timestamp(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setSimulatingPeerSign(false);
    }, 600);
  };

  // Finalize Transaction
  const handleFinalizeTransaction = () => {
    if (!bothPartiesAccepted) return;

    const randomTxNum = Math.floor(1000 + Math.random() * 9000);
    const roomCode = `SKILL-ROOM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newFinalized: FinalizedBarterSwap = {
      txId: `SWAP-TX-2026-${randomTxNum}`,
      timestamp: new Date().toLocaleString(),
      partnerName: peer.name,
      partnerRole: peer.role || 'Verified Mentor',
      partnerAvatar:
        peer.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      mySkill: effectiveMySkill,
      partnerSkill: peerSkillToLearn,
      date: sessionDate,
      time: '3:00 PM EST',
      duration: sessionDuration,
      roomCode: roomCode,
    };

    setFinalizedData(newFinalized);
    setStep('finalized_receipt');
    onFinalizeSuccess(newFinalized);
  };

  const handleCopyLink = () => {
    if (!finalizedData) return;
    const link = `https://skillspace.io/room/${finalizedData.roomCode}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-2xl my-auto rounded-3xl border border-white/20 bg-[#0d0e12] text-white shadow-2xl overflow-hidden"
      >
        {/* Modal Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3d9be9] via-emerald-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3d9be9]/20 to-emerald-400/20 border border-white/15 flex items-center justify-center shrink-0 text-[#3d9be9]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  1:1 Skill Barter Agreement
                </span>
                <span className="text-[10px] font-mono text-white/50">Zero Dollars Exchanged</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {step === 'review_and_sign' ? 'Confirm Barter Swap Terms' : 'Barter Transaction Finalized'}
              </h3>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                {step === 'review_and_sign'
                  ? 'Both users must accept the reciprocal terms before this swap transaction can be finalized.'
                  : 'Your mutual agreement has been verified and registered to the community ledger.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: REVIEW TERMS & DUAL-PARTY ACCEPTANCE             */}
        {/* ========================================================= */}
        {step === 'review_and_sign' && (
          <div className="p-5 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto custom-scrollbar">
            {/* 1. The Exchange Overview (Two Parties Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Party 1: Initiator (You) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  party1Accepted
                    ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                    : 'border-white/15 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={myAvatar}
                      alt={myName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{myName}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                          YOU
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/50">{myRole}</span>
                    </div>
                  </div>

                  {party1Accepted ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Signed
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block text-[11px] font-mono uppercase text-white/60">
                    Skill You Agree to Teach:
                  </label>
                  <select
                    value={mySkillToTeach}
                    onChange={(e) => setMySkillToTeach(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#3d9be9]"
                  >
                    {currentUser?.skillsToTeach?.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.level})
                      </option>
                    ))}
                    {peer.wantsToLearn && (
                      <option value={peer.wantsToLearn}>
                        {peer.wantsToLearn} (Peer's desired topic)
                      </option>
                    )}
                    <option value="custom">+ Specify custom teaching topic...</option>
                  </select>

                  {mySkillToTeach === 'custom' && (
                    <input
                      type="text"
                      value={customMySkill}
                      onChange={(e) => setCustomMySkill(e.target.value)}
                      placeholder="e.g. Modern Rust Concurrency"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-[#3d9be9]"
                    />
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-white/50 border-t border-white/10">
                    <span>Commitment:</span>
                    <span className="text-white font-medium">30m live teaching + guidance</span>
                  </div>
                </div>

                {/* Party 1 Sign Button / Checkbox */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleToggleParty1}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      party1Accepted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    {party1Accepted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Accepted by You ({party1Timestamp})</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-[#3d9be9]" />
                        <span>Accept &amp; Sign Terms (Party 1)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Party 2: Counterparty (Peer) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  party2Accepted
                    ? 'border-emerald-500/40 bg-emerald-500/[0.04]'
                    : 'border-white/15 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      {peer.avatar ? (
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 text-white font-mono text-xs flex items-center justify-center font-bold">
                          {peer.name[0]}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{peer.name}</span>
                        <span className="text-[9px] font-mono text-amber-400">
                          ★ {peer.rating || 5.0}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/50 truncate block max-w-[140px]">
                        {peer.role || 'Peer Barterer'}
                      </span>
                    </div>
                  </div>

                  {party2Accepted ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Signed
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block text-[11px] font-mono uppercase text-white/60">
                    Skill {peer.name.split(' ')[0]} Agrees to Teach:
                  </label>
                  <div className="p-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-medium flex items-center justify-between">
                    <span className="truncate">{peerSkillToLearn}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">Reciprocal</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-white/50 border-t border-white/10">
                    <span>Commitment:</span>
                    <span className="text-white font-medium">30m hands-on guidance</span>
                  </div>
                </div>

                {/* Party 2 Sign Button (Interactive Peer Verification) */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleSimulatePeerAcceptance}
                    disabled={simulatingPeerSign}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      party2Accepted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                    }`}
                  >
                    {simulatingPeerSign ? (
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Verifying counterparty acceptance...
                      </span>
                    ) : party2Accepted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Accepted by {peer.name.split(' ')[0]} ({party2Timestamp})</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{peer.name.split(' ')[0]}: Accept Terms (Party 2)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Session Parameters & Honor Code */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
              <span className="text-[11px] font-mono uppercase text-white/60 tracking-wider flex items-center gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#3d9be9]" />
                Proposed Session Parameters &amp; Format
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-white/50 text-[11px] font-mono mb-1">
                    Scheduled Target Time:
                  </label>
                  <input
                    type="text"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#3d9be9]"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-[11px] font-mono mb-1">
                    Duration Breakdown:
                  </label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none"
                  >
                    <option value="60 Minutes (30m each)">60 Minutes (30m each &bull; Recommended)</option>
                    <option value="90 Minutes (45m each)">90 Minutes (45m each &bull; Deep Dive)</option>
                    <option value="45 Minutes (Sprint)">45 Minutes (Quick Focus Swap)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-[11px] font-mono mb-1">
                  Exchange Agenda &amp; Deliverables:
                </label>
                <input
                  type="text"
                  value={agendaNotes}
                  onChange={(e) => setAgendaNotes(e.target.value)}
                  placeholder="e.g. 30m on LLM architecture, 30m on Next.js server components"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-[#3d9be9]"
                />
              </div>

              {/* Binding Rules Checklist */}
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100% Cashless &bull; Zero fees deducted &bull; Equal time reciprocity</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>12-hour rescheduling notice &bull; Honor Code attendance pledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive Audio/Video Live Room automatically created upon finalization</span>
                </div>
              </div>
            </div>

            {/* 3. Gatekeeper Status Banner */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                bothPartiesAccepted
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {bothPartiesAccepted ? (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Unlock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">
                    {bothPartiesAccepted
                      ? 'Terms Accepted by Both Users (2/2 Signed)'
                      : `Awaiting Both Signatures (${(party1Accepted ? 1 : 0) + (party2Accepted ? 1 : 0)}/2 Signed)`}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {bothPartiesAccepted
                      ? 'All mutual conditions verified. You can now finalize and record the barter transaction.'
                      : !party1Accepted && !party2Accepted
                      ? 'Please sign your agreement (Party 1) and have counterparty sign (Party 2).'
                      : !party1Accepted
                      ? 'Waiting for your signature (Party 1) to proceed.'
                      : `Waiting for ${peer.name.split(' ')[0]}'s signature (Party 2) to proceed.`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] font-bold">
                <span className={party1Accepted ? 'text-emerald-400' : 'text-white/40'}>
                  [You: {party1Accepted ? '✓' : '—'}]
                </span>
                <span className="text-white/30">&bull;</span>
                <span className={party2Accepted ? 'text-emerald-400' : 'text-white/40'}>
                  [{peer.name.split(' ')[0]}: {party2Accepted ? '✓' : '—'}]
                </span>
              </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer font-mono"
              >
                Cancel Proposal
              </button>

              <button
                type="button"
                onClick={handleFinalizeTransaction}
                disabled={!bothPartiesAccepted}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  bothPartiesAccepted
                    ? 'bg-gradient-to-r from-emerald-500 to-[#3d9be9] hover:from-emerald-400 hover:to-[#3d9be9] text-black font-bold shadow-lg shadow-emerald-500/20 cursor-pointer scale-100'
                    : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                }`}
              >
                {bothPartiesAccepted ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Finalize Swap Transaction (Both Signed)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white/40" />
                    <span>Finalize (Requires Both Signatures)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: FINALIZED TRANSACTION RECEIPT                    */}
        {/* ========================================================= */}
        {step === 'finalized_receipt' && finalizedData && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-white">
                Swap Transaction Finalized!
              </h4>
              <p className="text-xs text-white/60 font-mono">
                Transaction recorded into community escrow. Both parties have verified the swap terms.
              </p>
            </div>

            {/* Transaction Receipt Card */}
            <div className="p-5 rounded-2xl border border-white/15 bg-black/60 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-white/50 text-[11px] uppercase">Transaction Hash:</span>
                <span className="text-emerald-400 font-bold">{finalizedData.txId}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/10 text-[11px]">
                <div>
                  <span className="text-white/40 block mb-1">YOU TEACH:</span>
                  <span className="text-white font-semibold block">{finalizedData.mySkill}</span>
                  <span className="text-white/50">30 minutes</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-1">{finalizedData.partnerName.toUpperCase()} TEACHES:</span>
                  <span className="text-white font-semibold block">{finalizedData.partnerSkill}</span>
                  <span className="text-white/50">30 minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/10 text-[11px]">
                <div>
                  <span className="text-white/40 block mb-0.5">SCHEDULED FOR:</span>
                  <span className="text-white font-medium">{finalizedData.date}</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-0.5">TOTAL DURATION:</span>
                  <span className="text-white font-medium">{finalizedData.duration}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-white/40 text-[10px] block">LIVE ROOM ACCESS CODE:</span>
                  <span className="text-amber-300 font-bold tracking-wider">{finalizedData.roomCode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-1.5 text-[11px] transition-all cursor-pointer self-start sm:self-center"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white/60" />
                      <span>Copy Room Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#3d9be9]/10 border border-[#3d9be9]/30 text-xs text-[#3d9be9] flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                +50 Barter Points credited to your profile for scheduling a confirmed 1:1 barter session!
              </span>
            </div>

            {/* Receipt Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all cursor-pointer shadow-md"
              >
                Close &amp; View in Schedule
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
