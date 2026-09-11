import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight, LogIn, UserCheck, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DEFAULT_USER, createInitialUserProfile } from '../types';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  saveUserProfileToFirestore,
  fetchUserProfileFromFirestore,
} from '../lib/firebase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'access' | 'story' | 'features' | 'login';
  initialSkillToLearn?: string;
  onLoginSuccess?: (user: UserProfile) => void;
}

export const InteractiveModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  type = 'access',
  initialSkillToLearn = '',
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(type === 'login' ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [skillToTeach, setSkillToTeach] = useState('');
  const [teachCoinsWanted, setTeachCoinsWanted] = useState<number>(25);
  const [skillToLearn, setSkillToLearn] = useState(initialSkillToLearn);
  const [learnCoinsOffered, setLearnCoinsOffered] = useState<number>(20);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  React.useEffect(() => {
    if (initialSkillToLearn) {
      setSkillToLearn(initialSkillToLearn);
    }
  }, [initialSkillToLearn]);

  React.useEffect(() => {
    if (type === 'login') {
      setAuthMode('login');
    }
  }, [type]);

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setAuthError('');
    try {
      const user = await signInWithGoogle();
      if (onLoginSuccess && user) {
        const live = await fetchUserProfileFromFirestore(user.uid);
        const appUser: UserProfile = createInitialUserProfile(
          user.uid,
          user.email || '',
          live?.displayName || user.displayName || undefined,
          live?.photoURL || user.photoURL || undefined
        );
        if (live?.bio) appUser.bio = live.bio;
        if (live?.coins !== undefined) {
          appUser.coins = live.coins;
          appUser.credits = live.coins;
        }
        onLoginSuccess(appUser);
        onClose();
      }
    } catch (err: unknown) {
      console.error('Google Sign In failed:', err);
      setAuthError(
        err instanceof Error ? err.message : 'Google authentication failed. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const firebaseUser = await signInWithEmail(email.trim(), password);
        const live = await fetchUserProfileFromFirestore(firebaseUser.uid);
        const appUser = createInitialUserProfile(
          firebaseUser.uid,
          firebaseUser.email || email.trim(),
          live?.displayName || firebaseUser.displayName || undefined,
          live?.photoURL || firebaseUser.photoURL || undefined
        );
        if (live?.bio) appUser.bio = live.bio;
        if (live?.coins !== undefined) {
          appUser.coins = live.coins;
          appUser.credits = live.coins;
        }
        onLoginSuccess?.(appUser);
        onClose();
        return;
      } else {
        // Sign up flow
        const firebaseUser = await signUpWithEmail(
          email.trim(),
          password,
          name.trim() || email.split('@')[0]
        );

        const teachSkills = skillToTeach.trim()
          ? [
              {
                id: `t_${Date.now()}`,
                name: skillToTeach.trim(),
                level: 'Advanced',
                sessionsCount: 0,
                coinsWanted: Number(teachCoinsWanted) || 25,
                tradeMode: 'both' as const,
              },
            ]
          : [];

        const learnSkills = skillToLearn.trim()
          ? [
              {
                id: `l_${Date.now()}`,
                name: skillToLearn.trim(),
                target: 'Mastery through 1-on-1 swaps & coin sessions',
                progress: 10,
                coinsOffered: Number(learnCoinsOffered) || 20,
                tradeMode: 'both' as const,
              },
            ]
          : [];

        const appUser = createInitialUserProfile(
          firebaseUser.uid,
          email.trim(),
          name.trim() || undefined,
          undefined,
          teachSkills,
          learnSkills
        );

        onLoginSuccess?.(appUser);
        onClose();
        return;
      }
    } catch (err: unknown) {
      console.error('Email auth failed:', err);
      let msg = 'Authentication failed. Please check credentials.';
      if (err instanceof Error) {
        if (err.message.includes('invalid-credential') || err.message.includes('user-not-found')) {
          msg = 'Invalid email or password. If you don’t have an account, switch to "Sign Up" above.';
        } else if (err.message.includes('email-already-in-use')) {
          msg = 'This email already has an account. Please switch to "Log In" above.';
        } else if (err.message.includes('weak-password')) {
          msg = 'Password must be at least 6 characters.';
        } else {
          msg = err.message;
        }
      }
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = () => {
    if (onLoginSuccess) {
      onLoginSuccess(DEFAULT_USER);
      onClose();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail('');
    setName('');
    setPassword('');
    setSkillToTeach('');
    setSkillToLearn('');
    setAuthError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-[#121318] p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/10"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3d9be9]/20 text-[#3d9be9]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-serif tracking-tight mb-2">
                  Welcome to SkillSpace!
                </h3>
                <p className="text-sm text-white/70 max-w-sm mx-auto mb-6">
                  We've reserved your spot with <span className="text-white font-medium">{email}</span>. Your reciprocal barter account is active.
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-full bg-[#3d9be9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2a7dd7] transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Got it, thanks!
                </button>
              </div>
            ) : type === 'story' ? (
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#3d9be9] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Our Mission &amp; Genesis
                </div>
                <h3 className="text-2xl font-bold font-serif tracking-tight mb-3">{title}</h3>
                <div className="space-y-3 text-sm text-white/70 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    SkillSpace was created out of a simple observation: learning has become too commoditized and isolated behind expensive courses, while millions of passionate individuals have high-value skills they could teach right now.
                  </p>
                  <p>
                    Instead of paying high course fees for pre-recorded videos, SkillSpace connects you directly with peers worldwide. You teach 1 hour of what you know, earn points, and use those points to learn whatever you want next.
                  </p>
                  <p>
                    No credit cards, no subscriptions, and no gatekeeping. Pure knowledge reciprocity backed by our smart AI matching and real-time community reputation.
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="rounded-full bg-[#3d9be9] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2a7dd7] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[#3d9be9] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  SkillSpace Network
                </div>

                {/* Tab Switcher for Log in vs Sign Up */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#3d9be9] text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-[#3d9be9] text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Get Started / Sign Up
                  </button>
                </div>

                <h3 className="text-2xl font-serif font-bold tracking-tight mb-1">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Your SkillSpace Profile'}
                </h3>
                <p className="text-xs text-white/60 mb-5">
                  {authMode === 'login'
                    ? 'Access your barter balance, teaching sessions, and active learning tracks.'
                    : 'Join the global peer-to-peer exchange network. Skills are traded, not sold.'}
                </p>

                {authError && (
                  <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Real Firebase Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                  className="w-full mb-3 py-2.5 px-4 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                      />
                    </svg>
                  )}
                  <span>
                    {authMode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}
                  </span>
                </button>

                <div className="relative flex py-2 items-center mb-4">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    Or with email & password
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Elena Rostova"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none focus:ring-1 focus:ring-[#3d9be9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none focus:ring-1 focus:ring-[#3d9be9]"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-white/80 mb-1">
                            I can teach (Optional)
                          </label>
                          <input
                            type="text"
                            value={skillToTeach}
                            onChange={(e) => setSkillToTeach(e.target.value)}
                            placeholder="e.g. Python, Blender"
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">
                            Coins/hr
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="500"
                            value={teachCoinsWanted}
                            onChange={(e) => setTeachCoinsWanted(parseInt(e.target.value) || 25)}
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-white/80 mb-1">
                            I want to learn (Optional)
                          </label>
                          <input
                            type="text"
                            value={skillToLearn}
                            onChange={(e) => setSkillToLearn(e.target.value)}
                            placeholder="e.g. Spanish, Figma"
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white placeholder:text-white/40 focus:border-[#3d9be9] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1">
                            Coins bid
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="500"
                            value={learnCoinsOffered}
                            onChange={(e) => setLearnCoinsOffered(parseInt(e.target.value) || 20)}
                            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-amber-300 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || googleLoading}
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-full bg-[#3d9be9] py-3 text-sm font-medium text-white hover:bg-[#2a7dd7] transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>
                          {authMode === 'login' ? 'Log In & View Profile' : 'Create Account & Open Profile'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Optional Demo Preview */}
                <div className="mt-4 pt-3 border-t border-white/10 text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Developer Demo Preview:</span>
                    <span className="text-[#3d9be9] underline">Load Alex Rivers test profile</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
