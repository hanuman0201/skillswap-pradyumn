import React, { useState } from 'react';
import {
  MessageSquare,
  Calendar,
  Coins,
  Award,
  Sparkles,
  Send,
  Check,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  MATCH_PROFILES,
  INITIAL_CHAT_MESSAGES,
  SESSION_REQUESTS,
  ACTIVITY_LOGS,
  BADGES,
} from '../data/mockData';

interface InteractiveFeaturesProps {
  onOpenAuth: () => void;
}

export const InteractiveFeatures: React.FC<InteractiveFeaturesProps> = ({ onOpenAuth }) => {
  // State for AI Matchmaking
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const activeProfile = MATCH_PROFILES[selectedProfileIndex];

  // State for Messenger interactive session request
  const [sessionActionTaken, setSessionActionTaken] = useState<'none' | 'accepted' | 'declined'>('none');
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [newMessageText, setNewMessageText] = useState('');

  // State for Calendar tab & requests
  const [calendarTab, setCalendarTab] = useState<'upcoming' | 'requests' | 'history'>('requests');
  const [selectedDay, setSelectedDay] = useState(17);
  const [requestsList, setRequestsList] = useState(SESSION_REQUESTS);

  // State for Points / Wallet
  const [walletBalance, setWalletBalance] = useState(1550);
  const [activityList, setActivityList] = useState(ACTIVITY_LOGS);

  // State for Selected Badge
  const [selectedBadge, setSelectedBadge] = useState(BADGES[0]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      name: 'Noor',
      avatar: 'https://framerusercontent.com/images/ktlwDnBdDy7e82bDH8fM8E3DP8.png',
      text: newMessageText,
      time: 'Just now',
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessageText('');
  };

  const handleRequestAction = (id: string, action: 'accepted' | 'declined') => {
    setRequestsList((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  const handleTopUpMock = () => {
    setWalletBalance((prev) => prev + 350);
    setActivityList((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Community Contribution Bonus',
        type: 'earn',
        points: 350,
        category: 'Incentive',
      },
      ...prev,
    ]);
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 bg-black text-white relative">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-[#3d9be9] font-medium mb-3">
            Powerful Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight font-['Poppins',sans-serif]">
            Designed for real learning. <br />
            Built for real people.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70">
            Everything you need to grow — powered by smart tech, human connection, and your time.
            SkillSwap makes every session simple, fun, and fair.
          </p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* FEATURE 1: AI-Powered Matchmaking */}
        {/* ---------------------------------------------------- */}
        <div id="ai-matchmaking" className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-[#3d9be9]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature 01</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#3d9be9]">
                  AI-Powered
                </span>{' '}
                Matchmaking
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-['General_Sans',sans-serif]">
                No more endless scrolling. Our smart algorithm{' '}
                <strong className="text-white font-medium">instantly matches</strong> you with people
                who can teach what you want — and want to learn what you can offer.
              </p>

              {/* Profile switcher tabs */}
              <div className="pt-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Browse Demo Matches:
                </div>
                <div className="flex flex-wrap gap-2">
                  {MATCH_PROFILES.map((prof, idx) => (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProfileIndex(idx)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedProfileIndex === idx
                          ? 'bg-[#3d9be9] text-white shadow-md shadow-blue-500/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{prof.name}</span>
                      <span className="opacity-80 text-[10px]">({prof.matchScore}%)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-gradient-to-b from-[#18191b] to-[#121314] p-6 shadow-2xl shadow-blue-500/10">
                {/* Profile Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={activeProfile.avatar}
                        alt={activeProfile.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-black" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{activeProfile.name}</h4>
                      <p className="text-xs text-white/50">Verified SkillSwapper</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-white/60">Match Score</span>
                    <span className="text-xl font-bold text-[#3d9be9]">{activeProfile.matchScore}%</span>
                  </div>
                </div>

                {/* Profile details */}
                <div className="py-4 space-y-4 text-xs">
                  <div>
                    <span className="text-white/50 block mb-1.5 font-medium">You can learn from {activeProfile.name}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProfile.teachSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#3d9be9]/15 border border-[#3d9be9]/30 px-2.5 py-1 text-white font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-white/50 block mb-1.5 font-medium">You can teach {activeProfile.name}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProfile.learnSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-white/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex gap-2 border-t border-white/10">
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 rounded-full bg-[#3d9be9] hover:bg-[#2a7dd7] py-2.5 text-xs font-medium text-white transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Start chat</span>
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 py-2.5 text-xs font-medium text-white/90 transition-all text-center"
                  >
                    View profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* FEATURE 2: Built-in Messenger */}
        {/* ---------------------------------------------------- */}
        <div id="messenger" className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Chat Window */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex justify-center w-full">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#141517] overflow-hidden flex flex-col h-[480px] shadow-2xl">
                {/* Chat Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1c1e21] border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png"
                      alt="William"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">William • React &amp; Python</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online now
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">100% Match</span>
                </div>

                {/* Messages feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={msg.avatar}
                            alt={msg.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                        )}

                        <div className="max-w-[78%]">
                          <div
                            className={`p-3 rounded-2xl leading-relaxed ${
                              isMe
                                ? 'bg-[#3d9be9] text-white rounded-br-xs'
                                : 'bg-white/10 text-white/90 rounded-bl-xs border border-white/5'
                            }`}
                          >
                            <p>{msg.text}</p>

                            {/* If session request card */}
                            {msg.isSessionRequest && (
                              <div className="mt-2.5 pt-2 border-t border-white/20 space-y-2">
                                <div className="text-[11px] font-semibold text-white">
                                  Proposed: {msg.sessionData?.date} at {msg.sessionData?.time}
                                </div>
                                {sessionActionTaken === 'none' ? (
                                  <div className="flex items-center gap-2 pt-1">
                                    <button
                                      onClick={() => setSessionActionTaken('accepted')}
                                      className="flex-1 rounded-full bg-white text-black font-semibold py-1 px-3 text-[11px] hover:bg-white/90 flex items-center justify-center gap-1"
                                    >
                                      <Check className="w-3 h-3" />
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => setSessionActionTaken('declined')}
                                      className="flex-1 rounded-full bg-white/15 text-white py-1 px-3 text-[11px] hover:bg-white/25 flex items-center justify-center gap-1"
                                    >
                                      <X className="w-3 h-3" />
                                      Decline
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-[11px] font-medium py-1 px-2.5 rounded-lg bg-black/30 inline-block text-white/90">
                                    {sessionActionTaken === 'accepted' ? '✓ Session Confirmed & Added to Calendar' : '✗ Request Declined'}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-white/40 mt-1 block px-1 text-right">
                            {msg.time}
                          </span>
                        </div>

                        {isMe && (
                          <img
                            src="https://framerusercontent.com/images/ktlwDnBdDy7e82bDH8fM8E3DP8.png"
                            alt="Noor"
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Chat input form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-[#18191c] border-t border-white/10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type a message or suggest a time..."
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-full bg-[#3d9be9] hover:bg-[#2a7dd7] flex items-center justify-center text-white shrink-0 transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-[#3d9be9]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Feature 02</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#3d9be9]">
                  Built-in Messenger
                </span>
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-['General_Sans',sans-serif]">
                Chat with your matches in <strong className="text-white font-medium">real time</strong>,
                send images, documents, and <strong className="text-white font-medium">schedule sessions</strong>{' '}
                — all in one smooth, built-in messenger.
              </p>
              <div className="pt-2 flex flex-col gap-2.5 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3d9be9]" />
                  <span>Direct 1-click calendar invites inside conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3d9be9]" />
                  <span>No external WhatsApp or Zoom link scrambling required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#3d9be9]" />
                  <span>Integrated peer review &amp; point release upon call completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* FEATURE 3: Your Calendar. Your Rules. */}
        {/* ---------------------------------------------------- */}
        <div id="calendar" className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-[#3d9be9]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Feature 03</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d9be9] to-white">
                  Your Calendar.
                </span>{' '}
                Your Rules.
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-['General_Sans',sans-serif]">
                Book sessions <strong className="text-white font-medium">whenever you’re available</strong>{' '}
                — with real-time syncing and automatic time zone handling so you{' '}
                <strong className="text-white font-medium">never miss</strong> a lesson.
              </p>

              {/* Status tabs */}
              <div className="pt-2 flex gap-1.5 rounded-xl bg-white/5 p-1 border border-white/10">
                {(['requests', 'upcoming', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCalendarTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                      calendarTab === tab
                        ? 'bg-[#3d9be9] text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Calendar Mockup */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-[#17181a] to-[#0f1011] p-5 shadow-2xl">
                {/* Month title */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">July 2025</span>
                    <span className="rounded-full bg-[#3d9be9]/20 text-[#3d9be9] text-[10px] px-2 py-0.5 font-medium">
                      Active Term
                    </span>
                  </div>
                  <span className="text-xs text-white/50">GMT-5 Timezone</span>
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-5">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <span key={i} className="text-white/40 text-[10px] font-semibold py-1">
                      {day}
                    </span>
                  ))}

                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isSelected = selectedDay === day;
                    const hasEvent = [14, 17, 18, 22].includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`relative rounded-lg py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#3d9be9] text-white shadow-md shadow-blue-500/30'
                            : hasEvent
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvent && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#3d9be9]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Session Requests / Upcoming details */}
                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                    <span>
                      {calendarTab === 'requests'
                        ? 'Pending Match Invitations'
                        : calendarTab === 'upcoming'
                        ? 'Upcoming Confirmed Lessons'
                        : 'Past Session Logs'}
                    </span>
                    <span className="text-[#3d9be9]">July {selectedDay}</span>
                  </div>

                  {requestsList.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.partnerAvatar}
                          alt={req.partnerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white">
                            {req.topic} with {req.partnerName}
                          </div>
                          <div className="text-[10px] text-white/50 flex items-center gap-2">
                            <span>Type: {req.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {req.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRequestAction(req.id, 'accepted')}
                            className="rounded-full bg-[#3d9be9] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#2a7dd7]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'declined')}
                            className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-400 capitalize">
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* FEATURE 4: Learn by Giving. Teach to Earn. */}
        {/* ---------------------------------------------------- */}
        <div id="points-system" className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Wallet Mockup */}
            <div className="lg:col-span-7 order-2 lg:order-1 flex justify-center w-full">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-[#18191b] to-[#101112] p-6 shadow-2xl relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3d9be9]/20 rounded-full blur-3xl pointer-events-none" />

                {/* Top Wallet Info */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#3d9be9]/20 border border-[#3d9be9]/40 flex items-center justify-center text-[#3d9be9]">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50 font-medium">SkillSwap Balance</div>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        {walletBalance.toLocaleString()} <span className="text-sm font-normal text-[#3d9be9]">Points</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTopUpMock}
                    className="rounded-full bg-[#3d9be9] hover:bg-[#2a7dd7] px-3.5 py-1.5 text-xs font-medium text-white transition-all shadow-sm"
                  >
                    + Add Bonus
                  </button>
                </div>

                <div className="mt-3 text-xs text-white/60 bg-white/5 rounded-xl p-2.5 flex items-center justify-between">
                  <span>Standard Exchange Rate:</span>
                  <span className="text-white font-medium">1 Session = 350 Points</span>
                </div>

                {/* Activity Feed */}
                <div className="mt-5 space-y-2.5">
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Recent Activity Logs
                  </div>

                  {activityList.slice(0, 4).map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            act.type === 'earn' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                        />
                        <div>
                          <div className="text-white font-medium">{act.title}</div>
                          <div className="text-[10px] text-white/40">{act.category}</div>
                        </div>
                      </div>

                      <span
                        className={`font-semibold ${
                          act.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {act.type === 'earn' ? `+${act.points}` : `-${act.points}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-white/50">Zero platform commissions</span>
                  <button
                    onClick={onOpenAuth}
                    className="text-[#3d9be9] hover:underline font-medium"
                  >
                    View ledger history →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Copy */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-[#3d9be9]">
                <Coins className="w-3.5 h-3.5" />
                <span>Feature 04</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Learn by Giving.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#3d9be9]">
                  Teach to Earn.
                </span>
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-['General_Sans',sans-serif]">
                Earn points <strong className="text-white font-medium">for every session</strong> you teach.
                Spend them to book sessions when you’re ready to learn —{' '}
                <strong className="text-white font-medium">no payment systems</strong>, just fair exchange.
              </p>
              <div className="pt-2 space-y-2 text-xs text-white/60">
                <p>• Every member starts with complimentary welcome credits to book their first session.</p>
                <p>• Verified teaching releases points immediately to unlock high-level mentors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* FEATURE 5: Streaks, Levels & Badges */}
        {/* ---------------------------------------------------- */}
        <div id="badges" className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs text-[#3d9be9]">
                <Award className="w-3.5 h-3.5" />
                <span>Feature 05</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d9be9] to-white">
                  Streaks, Levels &amp;
                </span>{' '}
                Badges
              </h3>
              <p className="text-base text-white/70 leading-relaxed font-['General_Sans',sans-serif]">
                Turn your growth into a <strong className="text-white font-medium">game</strong>.
                Earn badges, build streaks, and <strong className="text-white font-medium">level up</strong> your skills!
              </p>

              {/* Selected Badge Preview Box */}
              <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4 flex items-center gap-4">
                <img
                  src={selectedBadge.image}
                  alt={selectedBadge.title}
                  className="w-14 h-14 object-contain filter drop-shadow-[0_4px_12px_rgba(61,155,233,0.3)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{selectedBadge.title}</span>
                    <span className="rounded-full bg-[#3d9be9]/20 text-[#3d9be9] text-[10px] px-2 py-0.5 font-semibold">
                      {selectedBadge.level}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">{selectedBadge.description}</p>
                </div>
              </div>
            </div>

            {/* Right Badge Grid Showcase */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-[#17181b] to-[#0f1012] p-6 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-white/50 mb-4 border-b border-white/10 pb-3">
                  <span className="font-semibold text-white">SkillSwap Honors Hall</span>
                  <span>Click badge to view milestone</span>
                </div>

                {/* Badge icons grid matching Framer badges */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
                  {BADGES.map((badge) => {
                    const isSelected = selectedBadge.id === badge.id;
                    return (
                      <button
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={`group relative rounded-xl border p-3 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-[#3d9be9] bg-[#3d9be9]/10 shadow-lg shadow-blue-500/20 scale-105'
                            : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/5'
                        }`}
                      >
                        <img
                          src={badge.image}
                          alt={badge.title}
                          className="w-12 h-12 object-contain filter transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="text-[10px] font-medium text-white/80 text-center truncate w-full">
                          {badge.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Current Streak: 12 Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Level 4 Mentor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
