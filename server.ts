import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

// --- Server-Side Models & Types ---
interface ServerSkill {
  id: string;
  name: string;
  category: string;
  level: string;
  teacherName: string;
  teacherAvatar: string;
  tradeMode: 'coins' | 'barter' | 'both';
  coinsRate: number;
}

interface ServerContact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  lastSeenText?: string;
  tradeType: 'coins' | 'barter' | 'both';
  coinsRate: number; // Standard 40 coins
  messages: {
    id: string;
    sender: 'user' | 'partner' | 'system';
    text?: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
    reactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
    fileAttachment?: {
      name: string;
      size: string;
      type: string;
      extension: string;
    };
    photoAttachment?: {
      url: string;
      caption?: string;
    };
    isSessionProposal?: boolean;
    sessionProposal?: {
      id: string;
      topic: string;
      date: string;
      time: string;
      coins: number;
      tradeType: 'coins' | 'barter';
      status: 'pending' | 'accepted' | 'declined';
    };
  }[];
}

interface LedgerEntry {
  id: string;
  title: string;
  type: 'earn' | 'spend';
  coins: number;
  category: string;
  timestamp: string;
  partnerName?: string;
}

// --- In-Memory Database State ---
const userProfileState = {
  id: 'user-noor-1',
  name: 'Noor Al-Mansoor',
  title: 'Senior Systems Architect & Generative AI Builder',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Exchanging distributed systems & Next.js 15 for Japanese conversation & Eurorack synthesizer patching.',
  location: 'San Francisco, CA & Remote',
  memberSince: 'March 2024',
  credits: 240, // Coins and barter credits are identical
  coins: 240,
  hoursTaught: 38,
  hoursLearned: 24,
  rating: 4.98,
  reviewCount: 34,
  skillsToTeach: [
    { id: 't1', name: 'Full-Stack Next.js 15 & Server Components', level: 'Expert', sessionsCount: 19, coinsWanted: 40, tradeMode: 'both' },
    { id: 't2', name: 'Vector Embeddings & RAG Architectures', level: 'Advanced', sessionsCount: 12, coinsWanted: 40, tradeMode: 'both' },
    { id: 't3', name: 'TypeScript & Type-Level Programming', level: 'Expert', sessionsCount: 7, coinsWanted: 40, tradeMode: 'coins' },
  ],
  skillsToLearn: [
    { id: 'l1', name: 'Conversational Japanese (JLPT N2)', target: 'Natural Pitch Accent', progress: 65, coinsOffered: 40, tradeMode: 'both' },
    { id: 'l2', name: 'Subtractive Sound Design & Synthesizers', target: 'Patching Eurorack', progress: 40, coinsOffered: 40, tradeMode: 'coins' },
    { id: 'l3', name: '3D Procedural Motion in Blender', target: 'Geometry Nodes', progress: 25, coinsOffered: 40, tradeMode: 'barter' },
  ],
  upcomingSessions: [
    {
      id: 'sess-1',
      partnerName: 'Tatsuo Takahashi',
      partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      skillExchanged: 'Japanese Pitch Accent & Keigo Practice',
      date: 'Tomorrow, Oct 18',
      time: '18:00 UTC',
      mode: 'learning',
      coinsTransferred: 40,
      zoomLink: 'https://meet.skillspace.dev/sess-tatsuo-japanese',
    },
    {
      id: 'sess-2',
      partnerName: 'Maya Lin',
      partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      skillExchanged: 'Next.js 15 Server Actions & Vector Caching',
      date: 'Monday, Oct 21',
      time: '15:30 UTC',
      mode: 'teaching',
      coinsTransferred: 40,
      zoomLink: 'https://meet.skillspace.dev/sess-maya-nextjs',
    },
  ],
};

let ledgerLogs: LedgerEntry[] = [
  { id: 'l-1', title: 'Taught: Next.js 15 Server Actions', type: 'earn', coins: 40, category: '1-on-1 Teaching', timestamp: '2 hours ago', partnerName: 'William Chen' },
  { id: 'l-2', title: 'Learned: Japanese Pitch Accent Practice', type: 'spend', coins: 40, category: '1-on-1 Learning', timestamp: 'Yesterday', partnerName: 'Tatsuo Takahashi' },
  { id: 'l-3', title: 'Taught: Advanced TypeScript Generic Patterns', type: 'earn', coins: 40, category: '1-on-1 Teaching', timestamp: '3 days ago', partnerName: 'Robert Taylor' },
  { id: 'l-4', title: 'Direct Barter Swap: Python for UI Prototyping', type: 'earn', coins: 0, category: 'Double Coincidence Swap', timestamp: '5 days ago', partnerName: 'Maya Lin' },
];

let contactsState: ServerContact[] = [
  {
    id: 'alice',
    name: 'Alice Whitron',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Cloud Architect & React Lead',
    skills: 'Cloud Architecture, React, TypeScript',
    lastMessage: 'Wow! Have great time. Enjoy.',
    lastMessageTime: '15:13',
    unreadCount: 0,
    online: true,
    lastSeenText: 'Online',
    tradeType: 'both',
    coinsRate: 40,
    messages: [
      {
        id: 'a-1',
        sender: 'user',
        text: "Here are all the files. Let me know once you've had a look.",
        time: '15:10',
        status: 'read',
      },
      {
        id: 'a-2',
        sender: 'user',
        time: '15:11',
        status: 'read',
        fileAttachment: {
          name: 'All-files.zip',
          size: '22.5 MB',
          type: 'Compressed (zipped) folder',
          extension: 'zip',
        },
      },
      {
        id: 'a-3',
        sender: 'partner',
        text: 'Ok! 👍',
        time: '15:11',
        status: 'read',
      },
      {
        id: 'a-4',
        sender: 'partner',
        time: '15:12',
        status: 'read',
        photoAttachment: {
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
          caption: 'So beautiful here!',
        },
        reactions: [{ emoji: '❤️', count: 1, reactedByMe: true }],
      },
      {
        id: 'a-5',
        sender: 'user',
        text: 'Wow! Have great time. Enjoy.',
        time: '15:13',
        status: 'read',
      },
      {
        id: 'a-6',
        sender: 'partner',
        time: '15:14',
        text: 'Ready to swap 1-on-1 mentorship for our 40 coins rule! Let me know if you want to dive into Cloud Architecture this weekend.',
        isSessionProposal: true,
        sessionProposal: {
          id: 'prop-alice-1',
          topic: 'Cloud Native AWS/GCP Architecture & Docker',
          date: 'Saturday, 3:00 PM',
          time: '3:00 PM - 4:00 PM',
          coins: 40,
          tradeType: 'coins',
          status: 'pending',
        },
      },
    ],
  },
  {
    id: 'maryn',
    name: 'Maryn Kusuma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'UI/UX Designer',
    skills: 'Figma, Design Systems, Wireframing',
    lastMessage: 'Yes! OK',
    lastMessageTime: '14:14',
    unreadCount: 0,
    online: false,
    lastSeenText: 'last seen today at 14:20',
    tradeType: 'barter',
    coinsRate: 40,
    messages: [
      { id: 'mk-1', sender: 'user', text: 'Hey Maryn! Did you check the design tokens for our SkillSpace theme?', time: '14:12', status: 'read' },
      { id: 'mk-2', sender: 'partner', text: 'Yes! OK', time: '14:14', status: 'read' },
    ],
  },
  {
    id: 'jeen',
    name: 'Jeen Balmer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    role: 'Mobile iOS Specialist',
    skills: 'SwiftUI, iOS, CoreData',
    lastMessage: '📹 Video session recorded',
    lastMessageTime: '15:26',
    unreadCount: 1,
    online: true,
    lastSeenText: 'Online',
    tradeType: 'coins',
    coinsRate: 40,
    messages: [
      { id: 'jb-1', sender: 'partner', text: 'Hey Alex, here is the recording from our SwiftUI navigation session!', time: '15:25', status: 'read' },
      { id: 'jb-2', sender: 'partner', text: '📹 Video session recorded', time: '15:26', status: 'read' },
    ],
  },
  {
    id: 'baking',
    name: 'Baking Club & Culinary Arts',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    role: 'Community Exchange',
    skills: 'Sourdough, Pastry, Fermentation',
    lastMessage: 'Rebecca: @Chris R? Any sourdough starter left?',
    lastMessageTime: '16:44',
    unreadCount: 2,
    online: false,
    tradeType: 'both',
    coinsRate: 40,
    messages: [
      { id: 'bc-1', sender: 'partner', text: 'Rebecca: @Chris R? Any sourdough starter left for the barter workshop?', time: '16:44', status: 'read' },
    ],
  },
  {
    id: 'william',
    name: 'William Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Full-Stack React & Python Mentor',
    skills: 'React, Python, TypeScript',
    lastMessage: 'Session proposal: 40 Coins for Next.js 15 & SSR architecture',
    lastMessageTime: '14:16',
    unreadCount: 1,
    online: true,
    lastSeenText: 'Online',
    tradeType: 'both',
    coinsRate: 40,
    messages: [
      { id: 'w-1', sender: 'user', text: 'Hey William! I saw your profile on the exchange. Could you help me with Next.js 15 Server Actions and RAG caching?', time: '14:02', status: 'read' },
      { id: 'w-2', sender: 'partner', text: 'Hey Noor! Absolutely. I have 5+ years with React and would love to dive deep into Server Components.', time: '14:05', status: 'read' },
      { id: 'w-3', sender: 'user', text: 'Awesome! Since I do not currently have a mutual skill match for your Swift backlog, let us do the standard 40-coin exchange.', time: '14:10', status: 'read' },
      {
        id: 'w-4',
        sender: 'partner',
        text: 'That works perfectly! Here is the session proposal for 40 coins:',
        time: '14:15',
        status: 'read',
        isSessionProposal: true,
        sessionProposal: {
          id: 'prop-w1',
          topic: 'Next.js 15 Server Components & Vector Cache',
          date: 'Tomorrow, Oct 18',
          time: '16:00 UTC',
          coins: 40,
          tradeType: 'coins',
          status: 'pending',
        },
      },
    ],
  },
  {
    id: 'tatsuo',
    name: 'Tatsuo Takahashi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Native Japanese & Pitch Accent Coach',
    skills: 'Japanese (Native), Keigo, Calligraphy',
    lastMessage: 'Looking forward to our pitch accent session tomorrow at 18:00!',
    lastMessageTime: '11:42',
    unreadCount: 0,
    online: true,
    lastSeenText: 'Online',
    tradeType: 'both',
    coinsRate: 40,
    messages: [
      { id: 't-1', sender: 'user', text: 'Konnichiwa Tatsuo-san! Ready for our pitch accent drills tomorrow?', time: '11:30', status: 'read' },
      { id: 't-2', sender: 'partner', text: 'Hai! Looking forward to our pitch accent session tomorrow at 18:00!', time: '11:42', status: 'read' },
    ],
  },
  {
    id: 'maya',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Lead UX/UI Designer & Design Systems',
    skills: 'Figma, Design Systems, User Research',
    lastMessage: 'The design tokens documentation looks great. Thanks for the review!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
    lastSeenText: 'Yesterday at 20:14',
    tradeType: 'barter',
    coinsRate: 40,
    messages: [
      { id: 'm-1', sender: 'partner', text: 'Hey! Are you open to a direct 1:1 barter swap? Figma tokens for Next.js SSR?', time: 'Yesterday', status: 'read' },
      { id: 'm-2', sender: 'user', text: 'Yes! Direct double coincidence barter is 0 coins needed.', time: 'Yesterday', status: 'read' },
    ],
  },
  {
    id: 'robert',
    name: 'Robert Taylor',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Eurorack & Subtractive Sound Designer',
    skills: 'Modular Synthesizers, Sound Design, Ableton',
    lastMessage: 'Send over your audio stems whenever you want me to process them through the analog filter bank.',
    lastMessageTime: 'Oct 14',
    unreadCount: 0,
    online: false,
    lastSeenText: 'Oct 14 at 19:30',
    tradeType: 'coins',
    coinsRate: 40,
    messages: [
      { id: 'r-1', sender: 'user', text: 'Hey Robert, love your modular synth patches!', time: 'Oct 14', status: 'read' },
      { id: 'r-2', sender: 'partner', text: 'Send over your audio stems whenever you want me to process them through the analog filter bank.', time: 'Oct 14', status: 'read' },
    ],
  },
];

const availableSkillsCatalog: ServerSkill[] = [
  { id: 'sk-1', name: 'Next.js 15 App Router & Server Actions', category: 'Software & Code', level: 'Advanced', teacherName: 'William Chen', teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', tradeMode: 'both', coinsRate: 40 },
  { id: 'sk-2', name: 'Conversational Japanese & Pitch Accent', category: 'Languages', level: 'Native/Expert', teacherName: 'Tatsuo Takahashi', teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', tradeMode: 'both', coinsRate: 40 },
  { id: 'sk-3', name: 'Design Systems & Figma Variable Tokens', category: 'Design & Creative', level: 'Expert', teacherName: 'Maya Lin', teacherAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', tradeMode: 'barter', coinsRate: 40 },
  { id: 'sk-4', name: 'Modular Synthesizers & Sound Synthesis', category: 'Music & Audio', level: 'Master', teacherName: 'Robert Taylor', teacherAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', tradeMode: 'coins', coinsRate: 40 },
  { id: 'sk-5', name: 'Vector Embeddings & Semantic Search Pipelines', category: 'AI & Data Science', level: 'Advanced', teacherName: 'Amina Diallo', teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', tradeMode: 'both', coinsRate: 40 },
  { id: 'sk-6', name: '3D Character Sculpting & Rigging in Blender', category: '3D & Animation', level: 'Expert', teacherName: 'Chloe Vance', teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', tradeMode: 'both', coinsRate: 40 },
];

// --- Server Initialization ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Request Logging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // DEDICATED BACKEND REST API ROUTES
  // ==========================================

  // 1. Health & Status
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'SkillSpace Dedicated Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      currencyRule: {
        unit: 'SkillCoins / Barter Credits',
        rateToLearn: 40,
        rateToTeach: 40,
        reciprocalBarter: 0,
        doubleCoincidenceRule: '40 coins enable trades when mutual skill match does not exist',
      },
    });
  });

  // 2. User Profile: GET
  app.get('/api/user', (req: Request, res: Response) => {
    res.json(userProfileState);
  });

  // 3. User Profile: PUT (Update bio, skills, or settings)
  app.put('/api/user', (req: Request, res: Response) => {
    const updates = req.body;
    if (updates.name) userProfileState.name = updates.name;
    if (updates.title) userProfileState.title = updates.title;
    if (updates.bio) userProfileState.bio = updates.bio;
    if (updates.location) userProfileState.location = updates.location;
    if (typeof updates.coins === 'number') {
      userProfileState.coins = updates.coins;
      userProfileState.credits = updates.coins; // Keep coins & credits identical
    }
    if (updates.skillsToTeach) userProfileState.skillsToTeach = updates.skillsToTeach;
    if (updates.skillsToLearn) userProfileState.skillsToLearn = updates.skillsToLearn;

    res.json({ success: true, user: userProfileState });
  });

  // 4. Contacts: GET All Barter Contacts
  app.get('/api/contacts', (req: Request, res: Response) => {
    res.json(contactsState);
  });

  // 5. Contacts: GET Single Contact & Messages
  app.get('/api/contacts/:id', (req: Request, res: Response) => {
    const contact = contactsState.find((c) => c.id === req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  });

  // 6. Messages: POST New Message to a Contact
  app.post('/api/contacts/:id/messages', (req: Request, res: Response) => {
    const contact = contactsState.find((c) => c.id === req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const { text, isSessionProposal, sessionProposal } = req.body;
    if (!text && !sessionProposal) {
      return res.status(400).json({ error: 'Message text or sessionProposal required' });
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: text || 'Session Proposal Sent',
      time: timeStr,
      status: 'delivered' as const,
      isSessionProposal: !!isSessionProposal,
      sessionProposal: isSessionProposal && sessionProposal ? {
        id: `prop-${Date.now()}`,
        topic: sessionProposal.topic || 'Skill Exchange Session',
        date: sessionProposal.date || 'Next available',
        time: sessionProposal.time || '15:00 UTC',
        coins: 40, // standard 40 coins
        tradeType: sessionProposal.tradeType || 'coins',
        status: 'pending' as const,
      } : undefined,
    };

    contact.messages.push(newMsg);
    contact.lastMessage = text || 'Session proposal: 40 Coins';
    contact.lastMessageTime = timeStr;

    // Simulate an automatic smart peer reply after 1.5s if not a proposal
    if (!isSessionProposal) {
      setTimeout(() => {
        const replyTime = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
        const autoReplies = [
          `Sounds great! I'm ready to coordinate our 40-coin session or direct barter swap.`,
          `Got it! Let me know what specific topics you want to prioritize in our session.`,
          `Thanks for reaching out! I am available this week. Shall we confirm the 40-coin terms?`,
          `Perfect. I have verified your profile on SkillSpace and look forward to trading!`,
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        contact.messages.push({
          id: `reply-${Date.now()}`,
          sender: 'partner',
          text: randomReply,
          time: replyTime,
          status: 'read',
        });
        contact.lastMessage = randomReply;
        contact.lastMessageTime = replyTime;
      }, 1500);
    }

    res.status(201).json({ success: true, message: newMsg, contact });
  });

  // 7. Sessions: POST Propose Session
  app.post('/api/sessions/propose', (req: Request, res: Response) => {
    const { contactId, topic, date, time, tradeType } = req.body;
    const contact = contactsState.find((c) => c.id === contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const proposalId = `prop-${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const proposalMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: `Proposed ${tradeType === 'coins' ? '40-Coin' : 'Direct Barter'} Session: ${topic}`,
      time: timeStr,
      status: 'delivered' as const,
      isSessionProposal: true,
      sessionProposal: {
        id: proposalId,
        topic: topic || 'Skill Exchange Session',
        date: date || 'Tomorrow, 16:00 UTC',
        time: time || '16:00 UTC',
        coins: 40,
        tradeType: tradeType || 'coins',
        status: 'pending' as const,
      },
    };

    contact.messages.push(proposalMsg);
    contact.lastMessage = `Session proposal: ${tradeType === 'coins' ? '40 Coins' : 'Direct Barter'}`;
    contact.lastMessageTime = timeStr;

    res.status(201).json({ success: true, proposal: proposalMsg.sessionProposal, message: proposalMsg });
  });

  // 8. Sessions: POST Action (Accept / Decline Terms)
  app.post('/api/sessions/:proposalId/action', (req: Request, res: Response) => {
    const { proposalId } = req.params;
    const { action, contactId } = req.body; // action: 'accepted' | 'declined'

    if (action !== 'accepted' && action !== 'declined') {
      return res.status(400).json({ error: "Action must be 'accepted' or 'declined'" });
    }

    let foundMessage: any = null;
    let targetContact: ServerContact | null = null;

    for (const c of contactsState) {
      const msg = c.messages.find((m) => m.sessionProposal?.id === proposalId);
      if (msg) {
        foundMessage = msg;
        targetContact = c;
        break;
      }
    }

    if (!foundMessage || !foundMessage.sessionProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    foundMessage.sessionProposal.status = action;

    if (action === 'accepted') {
      const isCoinTrade = foundMessage.sessionProposal.tradeType === 'coins';
      const coinCost = isCoinTrade ? 40 : 0;

      // Check balance if learning
      if (coinCost > 0 && userProfileState.coins < coinCost) {
        return res.status(400).json({
          error: `Insufficient SkillCoins. You need 40 coins to book a session without a double coincidence of wants. Current balance: ${userProfileState.coins}`,
        });
      }

      // Deduct coins & credits
      if (coinCost > 0) {
        userProfileState.coins -= coinCost;
        userProfileState.credits -= coinCost;
      }

      // Add to upcoming sessions
      const newSession = {
        id: `sess-${Date.now()}`,
        partnerName: targetContact ? targetContact.name : 'Peer Partner',
        partnerAvatar: targetContact ? targetContact.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        skillExchanged: foundMessage.sessionProposal.topic,
        date: foundMessage.sessionProposal.date,
        time: foundMessage.sessionProposal.time,
        mode: 'learning',
        coinsTransferred: coinCost,
        zoomLink: `https://meet.skillspace.dev/${foundMessage.sessionProposal.id}`,
      };

      userProfileState.upcomingSessions.unshift(newSession);

      // Add ledger transaction
      ledgerLogs.unshift({
        id: `ledger-${Date.now()}`,
        title: `Booked: ${foundMessage.sessionProposal.topic}`,
        type: isCoinTrade ? 'spend' : 'earn',
        coins: coinCost,
        category: isCoinTrade ? '1-on-1 Learning' : 'Double Coincidence Swap',
        timestamp: 'Just now',
        partnerName: targetContact?.name,
      });

      // Append confirmation message in chat
      targetContact?.messages.push({
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `✓ Session confirmed! ${coinCost > 0 ? '40 SkillCoins moved to escrow' : 'Direct barter swap confirmed (0 coins)'}. Added to your Calendar.`,
        time: 'Just now',
      });
    }

    res.json({
      success: true,
      proposalStatus: action,
      currentBalance: userProfileState.coins,
      upcomingSessions: userProfileState.upcomingSessions,
    });
  });

  // 9. Wallet & Ledger: GET
  app.get('/api/wallet/ledger', (req: Request, res: Response) => {
    res.json({
      balance: userProfileState.coins,
      credits: userProfileState.credits,
      currency: 'SkillCoins / Barter Credits',
      rule: '40 to learn, 40 to teach (double coincidence solver)',
      logs: ledgerLogs,
    });
  });

  // 10. Wallet Faucet / Teaching Reward: POST
  app.post('/api/wallet/faucet', (req: Request, res: Response) => {
    const { amount = 40, reason = 'Teaching Session Completed' } = req.body;
    userProfileState.coins += amount;
    userProfileState.credits += amount;
    userProfileState.hoursTaught += 1;

    const newLog: LedgerEntry = {
      id: `ledger-${Date.now()}`,
      title: reason,
      type: 'earn',
      coins: amount,
      category: 'Peer Teaching Reward',
      timestamp: 'Just now',
    };
    ledgerLogs.unshift(newLog);

    res.json({
      success: true,
      newBalance: userProfileState.coins,
      earned: amount,
      ledgerEntry: newLog,
    });
  });

  // 11. Skills Directory: GET
  app.get('/api/skills/explore', (req: Request, res: Response) => {
    const { category, search, tradeMode } = req.query;
    let filtered = [...availableSkillsCatalog];

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    if (tradeMode && typeof tradeMode === 'string') {
      filtered = filtered.filter((s) => s.tradeMode === tradeMode || s.tradeMode === 'both');
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) => s.name.toLowerCase().includes(q) || s.teacherName.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  });

  // 12. Smart AI Matchmaking: POST
  app.post('/api/matchmake', (req: Request, res: Response) => {
    const { skillsToTeach, skillsToLearn } = req.body;
    // Identifies matches with double coincidence (barter) vs coin-based exchange (40 coins)
    const matches = availableSkillsCatalog.map((catalogSkill) => {
      // Check if user teaches something this person might want
      const isDoubleCoincidence = Math.random() > 0.5;
      return {
        ...catalogSkill,
        matchScore: Math.floor(85 + Math.random() * 15),
        tradeType: isDoubleCoincidence ? 'barter' : 'coins',
        costInCoins: isDoubleCoincidence ? 0 : 40,
        explanation: isDoubleCoincidence
          ? 'Double Coincidence of Wants: Direct 1:1 barter trade with 0 coin cost!'
          : 'Standard 40-Coin Swap: Spend 40 coins to learn this skill without needing a mutual barter match.',
      };
    });

    res.json({ matches });
  });

  // ==========================================
  // VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] SkillSpace dedicated backend listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});
