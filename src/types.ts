export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
  role?: string;
  exchange?: string;
}

export interface MatchProfile {
  id: string;
  name: string;
  avatar: string;
  matchScore: number;
  teachSkills: string[];
  learnSkills: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'partner' | 'system';
  name: string;
  avatar?: string;
  text: string;
  time: string;
  isSessionRequest?: boolean;
  sessionData?: {
    topic: string;
    date: string;
    time: string;
  };
}

export interface SessionRequest {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  topic: string;
  type: 'Learning' | 'Teaching';
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface BadgeItem {
  id: string;
  title: string;
  image: string;
  description: string;
  level: string;
}

export interface ActivityTransaction {
  id: string;
  title: string;
  type: 'earn' | 'spend';
  points: number;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  bio: string;
  location: string;
  memberSince: string;
  credits: number;
  coins: number; // SkillCoins balance for coin trading
  hoursTaught: number;
  hoursLearned: number;
  rating: number;
  reviewCount: number;
  skillsToTeach: {
    id: string;
    name: string;
    level: string;
    sessionsCount: number;
    coinsWanted?: number; // Coins teacher asks to teach this skill (e.g. 25 coins)
    tradeMode?: 'barter' | 'coins' | 'both'; // Accepts barter, coins, or both
  }[];
  skillsToLearn: {
    id: string;
    name: string;
    target: string;
    progress: number;
    coinsOffered?: number; // Coins learner is willing to give/spend to learn (e.g. 20 coins)
    tradeMode?: 'barter' | 'coins' | 'both'; // Willing to barter, pay coins, or both
  }[];
  upcomingSessions: {
    id: string;
    partnerName: string;
    partnerAvatar: string;
    topic: string;
    role: 'teaching' | 'learning';
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
    tradeType?: 'barter' | 'coins';
    coinsExchanged?: number;
  }[];
  reviews: {
    id: string;
    reviewerName: string;
    reviewerAvatar: string;
    skill: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Rivers',
  email: 'alex.rivers@skillspace.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  initials: 'AR',
  bio: 'Senior Full-Stack Engineer & Generative AI enthusiast. Exchanging distributed systems architecture & Next.js for Japanese conversation & analog synth sound design.',
  location: 'San Francisco, CA & Remote',
  memberSince: 'March 2024',
  credits: 240, // Coins and barter credits are the same currency (240 SkillCoins / Barter Credits)
  coins: 240, // 40 coins to learn, 40 coins to teach in case of no double coincidence
  hoursTaught: 38,
  hoursLearned: 24,
  rating: 4.98,
  reviewCount: 34,
  skillsToTeach: [
    {
      id: 't1',
      name: 'Full-Stack Next.js 15 & Server Components',
      level: 'Expert',
      sessionsCount: 19,
      coinsWanted: 40,
      tradeMode: 'both',
    },
    {
      id: 't2',
      name: 'Vector Embeddings & RAG Architectures',
      level: 'Advanced',
      sessionsCount: 12,
      coinsWanted: 40,
      tradeMode: 'both',
    },
    {
      id: 't3',
      name: 'TypeScript & Type-Level Programming',
      level: 'Expert',
      sessionsCount: 7,
      coinsWanted: 40,
      tradeMode: 'coins',
    },
  ],
  skillsToLearn: [
    {
      id: 'l1',
      name: 'Conversational Japanese (JLPT N2)',
      target: 'Natural Pitch Accent',
      progress: 65,
      coinsOffered: 40,
      tradeMode: 'both',
    },
    {
      id: 'l2',
      name: 'Subtractive Sound Design & Synthesizers',
      target: 'Patching Eurorack',
      progress: 40,
      coinsOffered: 40,
      tradeMode: 'coins',
    },
    {
      id: 'l3',
      name: '3D Procedural Motion in Blender',
      target: 'Geometry Nodes',
      progress: 25,
      coinsOffered: 40,
      tradeMode: 'barter',
    },
  ],
  upcomingSessions: [
    {
      id: 'sess_1',
      partnerName: 'Kenji Sato',
      partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      topic: 'Japanese Pitch Accent & Casual Keigo',
      role: 'learning',
      date: 'Tomorrow',
      time: '5:00 PM EST',
      status: 'confirmed',
    },
    {
      id: 'sess_2',
      partnerName: 'Elena Rostova',
      partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      topic: 'Next.js 15 App Router & Server Actions',
      role: 'teaching',
      date: 'Friday',
      time: '3:00 PM EST',
      status: 'confirmed',
    },
  ],
  reviews: [
    {
      id: 'rev_1',
      reviewerName: 'Marcus Chen',
      reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      skill: 'Full-Stack Next.js 15',
      rating: 5,
      comment: 'Alex explained Server Components clearer in 45 minutes than days of docs. Super patient and gave practical tips for production caching.',
      date: '3 days ago',
    },
    {
      id: 'rev_2',
      reviewerName: 'Sophie Moreau',
      reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      skill: 'Vector Embeddings & RAG',
      rating: 5,
      comment: 'Incredible barter session. Swapped Figma design system coaching for vector search fundamentals. Fair and highly productive trade!',
      date: '1 week ago',
    },
  ],
};

export function createInitialUserProfile(
  id: string,
  email: string,
  name?: string,
  photoURL?: string,
  customSkillsToTeach?: UserProfile['skillsToTeach'],
  customSkillsToLearn?: UserProfile['skillsToLearn']
): UserProfile {
  const cleanName = name?.trim() || (email ? email.split('@')[0] : 'Community Member');
  const initials = (cleanName.slice(0, 2) || 'SS').toUpperCase();
  const avatar =
    photoURL ||
    `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`;

  return {
    id,
    name: cleanName,
    email: email || '',
    avatar,
    initials,
    bio: 'SkillSpace Community Member. Open to peer skill trades and coin mentorship sessions.',
    location: 'Remote / Global',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    credits: 240,
    coins: 240,
    hoursTaught: 0,
    hoursLearned: 0,
    rating: 5.0,
    reviewCount: 0,
    skillsToTeach: customSkillsToTeach && customSkillsToTeach.length > 0 ? customSkillsToTeach : [],
    skillsToLearn: customSkillsToLearn && customSkillsToLearn.length > 0 ? customSkillsToLearn : [],
    upcomingSessions: [],
    reviews: [],
  };
}

