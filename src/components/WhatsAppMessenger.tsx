import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Mic,
  Check,
  CheckCheck,
  ArrowLeft,
  Coins,
  ArrowRightLeft,
  Calendar,
  Lock,
  X,
  FileText,
  Clock,
  Sparkles,
  Info,
  Archive,
  SquarePen,
  Download,
  ExternalLink,
  Heart,
  Camera,
  Image as ImageIcon,
  FileArchive,
  Minus,
  Square,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Filter,
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

export interface MessageReaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
}

export interface FileAttachment {
  name: string;
  size: string;
  type: string;
  extension: string;
}

export interface PhotoAttachment {
  url: string;
  caption?: string;
  aspectRatio?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'partner' | 'system';
  text?: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  fileAttachment?: FileAttachment;
  photoAttachment?: PhotoAttachment;
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
}

export interface WhatsAppContact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  isTyping?: boolean;
  lastSeenText?: string;
  tradeType: 'coins' | 'barter' | 'both';
  coinsRate: number;
  isArchived?: boolean;
  messages: WhatsAppMessage[];
}

// Initial contacts matching the user's desktop WhatsApp screenshot, plus SkillSpace community mentors
export const INITIAL_WHATSAPP_CONTACTS: WhatsAppContact[] = [
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
    lastSeenText: 'online',
    tradeType: 'both',
    coinsRate: 40,
    isArchived: false,
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
      },
      {
        id: 'a-4',
        sender: 'partner',
        time: '15:12',
        photoAttachment: {
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
          caption: 'So beautiful here!',
        },
        reactions: [
          { emoji: '❤️', count: 1, reactedByMe: true },
        ],
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
        text: 'By the way, ready to swap 1-on-1 mentorship for our 40 coins rule! Let me know if you want to dive into Cloud Architecture this weekend.',
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
    isArchived: false,
    messages: [
      {
        id: 'mk-1',
        sender: 'user',
        text: 'Hey Maryn! Did you check the design tokens for our SkillSpace theme?',
        time: '14:12',
        status: 'read',
      },
      {
        id: 'mk-2',
        sender: 'partner',
        text: 'Yes! OK',
        time: '14:14',
      },
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
    lastSeenText: 'online',
    tradeType: 'coins',
    coinsRate: 40,
    isArchived: false,
    messages: [
      {
        id: 'jb-1',
        sender: 'partner',
        text: 'Hey Alex, here is the recording from our SwiftUI navigation session!',
        time: '15:25',
      },
      {
        id: 'jb-2',
        sender: 'partner',
        text: '📹 Video session recorded',
        time: '15:26',
      },
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
    isArchived: false,
    messages: [
      {
        id: 'bc-1',
        sender: 'partner',
        text: 'Rebecca: @Chris R? Any sourdough starter left for the barter workshop?',
        time: '16:44',
      },
    ],
  },
  {
    id: 'soso',
    name: 'SoSo Benko',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    role: 'Music Producer & Sound Engineer',
    skills: 'Ableton Live, Mixing, Sound Design',
    lastMessage: 'Aww no problem',
    lastMessageTime: '13:36',
    unreadCount: 1,
    online: true,
    tradeType: 'barter',
    coinsRate: 40,
    isArchived: false,
    messages: [
      {
        id: 'sb-1',
        sender: 'user',
        text: 'Thanks for the quick bass mixing feedback!',
        time: '13:30',
        status: 'read',
      },
      {
        id: 'sb-2',
        sender: 'partner',
        text: 'Aww no problem, anytime! We can do a 1:1 swap anytime.',
        time: '13:36',
      },
    ],
  },
  {
    id: 'foodies',
    name: 'Family Foodies',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
    role: 'Peer Group',
    skills: 'Italian Cooking, Knife Skills',
    lastMessage: '📷 Dinner last night',
    lastMessageTime: '11:21',
    unreadCount: 0,
    online: false,
    tradeType: 'barter',
    coinsRate: 40,
    isArchived: false,
    messages: [
      {
        id: 'ff-1',
        sender: 'partner',
        text: '📷 Dinner last night was fantastic! Hand-made fettuccine.',
        time: '11:21',
      },
    ],
  },
  {
    id: 'mark',
    name: 'Mark Rogers',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'DevOps Specialist',
    skills: 'Kubernetes, Terraform, CI/CD',
    lastMessage: "Nope, I can't go unfortunately.",
    lastMessageTime: '09:02',
    unreadCount: 0,
    online: false,
    tradeType: 'coins',
    coinsRate: 40,
    isArchived: false,
    messages: [
      {
        id: 'mr-1',
        sender: 'user',
        text: 'Are you joining the Saturday Kubernetes meetup?',
        time: '08:50',
        status: 'read',
      },
      {
        id: 'mr-2',
        sender: 'partner',
        text: "Nope, I can't go unfortunately. Let's do a 40-coin session next Tuesday instead!",
        time: '09:02',
      },
    ],
  },
  {
    id: 'henry',
    name: 'Henry Strachan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Python & AI Engineer',
    skills: 'LangChain, FastApi, PyTorch',
    lastMessage: 'typing...',
    lastMessageTime: '10:20',
    unreadCount: 0,
    online: true,
    isTyping: true,
    tradeType: 'both',
    coinsRate: 40,
    isArchived: false,
    messages: [
      {
        id: 'hs-1',
        sender: 'user',
        text: 'Hi Henry, have you tried Gemini 2.5 Flash for multimodal parsing?',
        time: '10:18',
        status: 'read',
      },
    ],
  },
  {
    id: 'william',
    name: 'William Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'Full-Stack React & Python Mentor',
    skills: 'React, Python, TypeScript',
    lastMessage: 'Session proposal: 40 Coins for Next.js 15 & SSR architecture',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: true,
    lastSeenText: 'online',
    tradeType: 'both',
    coinsRate: 40,
    isArchived: true,
    messages: [
      {
        id: 'w-1',
        sender: 'user',
        text: 'Hey William! Ready to coordinate our Next.js session.',
        time: 'Yesterday 14:02',
        status: 'read',
      },
      {
        id: 'w-2',
        sender: 'partner',
        text: 'Session proposal: 40 Coins for Next.js 15 & SSR architecture',
        time: 'Yesterday 14:16',
      },
    ],
  },
  {
    id: 'tatsuo',
    name: 'Tatsuo Mori',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Bilingual Tokyo Developer',
    skills: 'Tokyo Pitch Accent, Conversational Japanese',
    lastMessage: 'Konnichiwa! I prepared the pitch accent charts for Tokyo dialect.',
    lastMessageTime: 'Sep 8',
    unreadCount: 0,
    online: false,
    tradeType: 'barter',
    coinsRate: 40,
    isArchived: true,
    messages: [
      {
        id: 't-1',
        sender: 'partner',
        text: 'Konnichiwa! I prepared the pitch accent charts for Tokyo dialect.',
        time: 'Sep 8 12:45',
      },
    ],
  },
];

interface WhatsAppMessengerProps {
  currentUser?: UserProfile | null;
  onUpdateUser?: (updated: UserProfile) => void;
  initialContactId?: string | null;
  className?: string;
  variant?: 'compact' | 'full';
  onNavigateToSchedule?: () => void;
}

export const WhatsAppMessenger: React.FC<WhatsAppMessengerProps> = ({
  currentUser,
  onUpdateUser,
  initialContactId = 'alice',
  className = '',
  variant = 'full',
  onNavigateToSchedule,
}) => {
  const [contacts, setContacts] = useState<WhatsAppContact[]>(INITIAL_WHATSAPP_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(initialContactId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'coins' | 'barter'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [activeCall, setActiveCall] = useState<{ type: 'audio' | 'video'; contact: WhatsAppContact; duration: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTypingNotification, setIsTypingNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Active contact
  const activeContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  // Unified balance (Spend 40 to learn, Earn 40 to teach)
  const currentCoins = currentUser?.coins ?? 240;

  // Show Toast
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContact?.messages]);

  // Sync with dedicated backend on mount
  useEffect(() => {
    let isMounted = true;
    api.getContacts().then((serverContacts) => {
      if (isMounted && Array.isArray(serverContacts) && serverContacts.length > 0) {
        // Merge server contacts with rich initial items to keep full asset fidelity
        setContacts((prev) => {
          const map = new Map<string, WhatsAppContact>(prev.map((c) => [c.id, c]));
          serverContacts.forEach((sc: WhatsAppContact) => {
            const existing = map.get(sc.id);
            if (existing) {
              map.set(sc.id, { ...existing, ...sc });
            } else {
              map.set(sc.id, sc);
            }
          });
          return Array.from(map.values());
        });
      }
    }).catch(() => {
      // Graceful fallback
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    let timer: any;
    if (activeCall) {
      timer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  // Filtered contacts
  const filteredContacts = contacts.filter((contact) => {
    if (showArchived) {
      return contact.isArchived;
    }
    if (contact.isArchived) return false;

    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'unread') return contact.unreadCount > 0;
    if (filterTab === 'coins') return contact.tradeType === 'coins' || contact.tradeType === 'both';
    if (filterTab === 'barter') return contact.tradeType === 'barter' || contact.tradeType === 'both';
    return true;
  });

  const archivedCount = contacts.filter((c) => c.isArchived).length;

  // Select contact
  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Helper: Format call duration
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Send Message function
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text || !selectedContactId) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: timeStr,
      status: 'sent',
    };

    // Update state immediately
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: timeStr,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (textToSend === undefined) {
      setInputMessage('');
    }
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    // Sync to dedicated Express backend
    api.sendMessage(selectedContactId, { text }).catch(() => {});

    // Transition delivery status: sent -> delivered -> read
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === selectedContactId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsg.id ? { ...m, status: 'read' } : m
              ),
            };
          }
          return c;
        })
      );
    }, 800);

    // Simulate smart partner typing and reply
    triggerPartnerReply(selectedContactId, text);
  };

  // Smart partner simulated reply
  const triggerPartnerReply = (contactId: string, userText: string) => {
    // Show typing status after 600ms
    setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, isTyping: true } : c))
      );
      setIsTypingNotification(true);
    }, 600);

    // Send reply after 1800ms
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let replyText = "Got it! That sounds awesome. Let's make sure our session is locked in with the 40 coins rule.";
      const lower = userText.toLowerCase();

      if (lower.includes('file') || lower.includes('zip') || lower.includes('download')) {
        replyText = "Thanks for sending those files over! I've extracted everything and reviewed the architecture notes. Looking forward to our walk-through.";
      } else if (lower.includes('photo') || lower.includes('picture') || lower.includes('view') || lower.includes('beautiful')) {
        replyText = 'Glad you liked the view! Best spot to code and brainstorm new ideas.';
      } else if (lower.includes('coin') || lower.includes('40') || lower.includes('credit')) {
        replyText = "Exactly! 40 coins to learn, 40 coins to teach. It's the cleanest way to exchange when there is no direct coincidence of wants.";
      } else if (lower.includes('barter') || lower.includes('swap')) {
        replyText = 'A direct 1-to-1 swap works great for me! Which track would you like to start with?';
      } else if (lower.includes('hello') || lower.includes('hey') || lower.includes('hi')) {
        replyText = `Hey there! Ready to collaborate whenever you are.`;
      }

      const partnerMsg: WhatsAppMessage = {
        id: `reply-${Date.now()}`,
        sender: 'partner',
        text: replyText,
        time: timeStr,
      };

      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === contactId) {
            return {
              ...c,
              isTyping: false,
              lastMessage: replyText,
              lastMessageTime: timeStr,
              messages: [...c.messages, partnerMsg],
            };
          }
          return c;
        })
      );
      setIsTypingNotification(false);
    }, 2200);
  };

  // Quick Action: Send Photo
  const handleSendPhoto = () => {
    if (!selectedContactId) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const photoMsg: WhatsAppMessage = {
      id: `photo-${Date.now()}`,
      sender: 'user',
      time: timeStr,
      status: 'read',
      photoAttachment: {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        caption: 'Reviewing our system architecture diagram & component hierarchy 💻',
      },
      reactions: [{ emoji: '🔥', count: 1, reactedByMe: false }],
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: '📷 Photo: System Architecture Diagram',
            lastMessageTime: timeStr,
            messages: [...c.messages, photoMsg],
          };
        }
        return c;
      })
    );

    setShowAttachMenu(false);
    showToast('Photo uploaded & sent to peer!');
    triggerPartnerReply(selectedContactId, 'Sent a photo diagram');
  };

  // Quick Action: Send Zip / Document Attachment
  const handleSendZipFile = () => {
    if (!selectedContactId) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const fileMsg: WhatsAppMessage = {
      id: `file-${Date.now()}`,
      sender: 'user',
      time: timeStr,
      status: 'read',
      fileAttachment: {
        name: 'SkillSpace-Curriculum-v2.zip',
        size: '14.8 MB',
        type: 'Compressed (zipped) folder',
        extension: 'zip',
      },
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: '📁 SkillSpace-Curriculum-v2.zip (14.8 MB)',
            lastMessageTime: timeStr,
            messages: [...c.messages, fileMsg],
          };
        }
        return c;
      })
    );

    setShowAttachMenu(false);
    showToast('Sent SkillSpace-Curriculum-v2.zip (14.8 MB)');
    triggerPartnerReply(selectedContactId, 'Sent a zip archive file');
  };

  // Quick Action: Send 40-Coin Session Proposal
  const handleSend40CoinProposal = () => {
    if (!selectedContactId || !activeContact) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const proposalMsg: WhatsAppMessage = {
      id: `prop-${Date.now()}`,
      sender: 'user',
      text: 'Session Proposal: 1-on-1 Mentorship (40 Coins Escrow)',
      time: timeStr,
      status: 'sent',
      isSessionProposal: true,
      sessionProposal: {
        id: `proposal-${Date.now()}`,
        topic: `${activeContact.skills.split(',')[0]} Deep Dive & Code Review`,
        date: 'This Sunday',
        time: '4:00 PM - 5:00 PM EST',
        coins: 40,
        tradeType: 'coins',
        status: 'pending',
      },
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            lastMessage: 'Proposed 1-on-1 session for 40 coins (Escrow guarantee)',
            lastMessageTime: timeStr,
            messages: [...c.messages, proposalMsg],
          };
        }
        return c;
      })
    );

    setShowAttachMenu(false);
    showToast('40-Coin Session Proposal created and sent!');

    api.proposeSession(selectedContactId, {
      topic: `${activeContact.skills.split(',')[0]} Deep Dive`,
      date: 'This Sunday, 4:00 PM EST',
      time: '4:00 PM EST',
      tradeType: 'coins',
    }).catch(() => {});
  };

  // Quick Action: React to message with emoji
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContactId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === msgId) {
                const existing = m.reactions?.find((r) => r.emoji === emoji);
                let nextReactions = m.reactions ? [...m.reactions] : [];

                if (existing) {
                  if (existing.reactedByMe) {
                    // Remove my reaction
                    nextReactions = nextReactions
                      .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r))
                      .filter((r) => r.count > 0);
                  } else {
                    // Add my reaction
                    nextReactions = nextReactions.map((r) =>
                      r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
                    );
                  }
                } else {
                  nextReactions.push({ emoji, count: 1, reactedByMe: true });
                }
                return { ...m, reactions: nextReactions };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );
  };

  // Handle Accept Session Proposal
  const handleProposalAction = (contactId: string, proposalId: string, action: 'accepted' | 'declined') => {
    api.handleProposalAction(proposalId, action, contactId).catch(() => {});

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.sessionProposal && m.sessionProposal.id === proposalId) {
                return {
                  ...m,
                  sessionProposal: {
                    ...m.sessionProposal,
                    status: action,
                  },
                };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );

    if (action === 'accepted' && currentUser && onUpdateUser) {
      const updatedCoins = Math.max(0, currentCoins - 40);
      const newUpcoming = {
        id: `sess-${Date.now()}`,
        partnerName: activeContact?.name || 'SkillSpace Peer',
        partnerAvatar: activeContact?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        topic: '1-on-1 Mentorship (40 Coins Escrow)',
        role: 'learning' as const,
        date: 'Scheduled via WhatsApp Chat',
        time: 'Upcoming',
        status: 'confirmed' as const,
        tradeType: 'coins' as const,
        coinsExchanged: 40,
      };

      onUpdateUser({
        ...currentUser,
        coins: updatedCoins,
        credits: updatedCoins,
        upcomingSessions: [newUpcoming, ...(currentUser.upcomingSessions || [])],
      });
      showToast('Terms accepted! 40 Coins escrowed and session confirmed.');
    } else if (action === 'declined') {
      showToast('Proposal declined.');
    }
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#090d16] text-[#e9edef] overflow-hidden shadow-2xl flex flex-col ${className}`}
      style={{ minHeight: variant === 'compact' ? '500px' : '620px' }}
    >
      {/* ==================================================== */}
      {/* 1. TOP WINDOW TITLEBAR (WhatsApp Desktop Aesthetic)  */}
      {/* ==================================================== */}
      <div className="h-9 px-3 bg-[#0c111a] border-b border-[#1b2535] flex items-center justify-between select-none shrink-0">
        {/* Left: Brand / App Icon & Title */}
        <div className="flex items-center gap-2">
          {/* SkillSpace Brand WhatsApp Glyph in #08f7bf */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#08f7bf] to-[#04a781] flex items-center justify-center text-[#090d16] shadow-sm shadow-[#08f7bf]/20">
            <MessageSquare className="w-3 h-3 text-[#090d16] fill-current" />
          </div>
          <span className="text-xs font-semibold text-white/90 tracking-wide font-sans">
            WhatsApp &bull; <span className="text-[#08f7bf]">SkillSpace Desktop</span>
          </span>
        </div>

        {/* Center: System Status Tag */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#08f7bf] bg-[#111927] px-2.5 py-0.5 rounded-full border border-[#08f7bf]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08f7bf] animate-pulse" />
          <span>Standard 40-Coin System Active</span>
        </div>

        {/* Right: Windows-style Titlebar Controls */}
        <div className="flex items-center">
          <button
            title="Minimize"
            onClick={() => showToast('Minimized to taskbar')}
            className="w-8 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            title="Maximize"
            onClick={() => showToast('Maximized window')}
            className="w-8 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            title="Close"
            onClick={() => showToast('Running in background')}
            className="w-8 h-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. MAIN APPLICATION CONTAINER                        */}
      {/* ==================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ==================================================== */}
        {/* LEFT SIDEBAR: Contacts & Search (WhatsApp Desktop)   */}
        {/* ==================================================== */}
        <div
          className={`${
            selectedContactId ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-[340px] flex-col border-r border-[#1b2535] bg-[#0c121d] shrink-0`}
        >
          {/* Left Top Header: Avatar, "Chats", New Chat icon, Menu */}
          <div className="h-16 px-4 bg-[#101725] flex items-center justify-between border-b border-[#1b2535]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    currentUser?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt="My Profile"
                  className="w-10 h-10 rounded-full object-cover border border-[#08f7bf]/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#08f7bf] border-2 border-[#101725]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Chats</h2>
            </div>

            <div className="flex items-center gap-1 text-white/70">
              {/* New Chat Button */}
              <button
                onClick={() => setShowNewChatModal(true)}
                title="Start new chat with a mentor"
                className="p-2 rounded-full hover:bg-white/10 hover:text-[#08f7bf] transition-colors cursor-pointer"
              >
                <SquarePen className="w-5 h-5" />
              </button>

              {/* More Menu */}
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                title="Options"
                className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar + Filter Icon */}
          <div className="p-2.5 bg-[#0c121d] border-b border-[#1b2535]">
            <div className="relative flex items-center bg-[#151d2d] rounded-xl px-3 py-2 text-xs text-white/80 focus-within:ring-1 focus-within:ring-[#08f7bf]/60 border border-white/5">
              <Search className="w-4 h-4 text-white/40 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-white placeholder-white/40"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Filter className="w-3.5 h-3.5 text-white/40" />
              )}
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-2 px-0.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                onClick={() => {
                  setFilterTab('all');
                  setShowArchived(false);
                }}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTab === 'all' && !showArchived
                    ? 'bg-[#08f7bf] text-[#090d16] font-bold shadow-sm'
                    : 'bg-[#151d2d] text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilterTab('unread');
                  setShowArchived(false);
                }}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTab === 'unread' && !showArchived
                    ? 'bg-[#08f7bf] text-[#090d16] font-bold'
                    : 'bg-[#151d2d] text-white/60 hover:text-white'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => {
                  setFilterTab('coins');
                  setShowArchived(false);
                }}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTab === 'coins' && !showArchived
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[#151d2d] text-white/60 hover:text-white'
                }`}
              >
                🪙 40-Coins
              </button>
              <button
                onClick={() => {
                  setFilterTab('barter');
                  setShowArchived(false);
                }}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTab === 'barter' && !showArchived
                    ? 'bg-[#3d9be9] text-white font-bold'
                    : 'bg-[#151d2d] text-white/60 hover:text-white'
                }`}
              >
                ⇄ 1:1 Barter
              </button>
            </div>
          </div>

          {/* "Archived" Row (As seen in the WhatsApp Desktop screenshot) */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2.5 flex items-center justify-between border-b border-[#1b2535] text-xs transition-colors cursor-pointer ${
              showArchived ? 'bg-[#1a2538] text-[#08f7bf]' : 'hover:bg-[#151d2d] text-white/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <Archive className="w-4 h-4 text-[#08f7bf]" />
              <span className="font-semibold">Archived</span>
            </div>
            <span className="text-[11px] font-mono text-[#08f7bf] font-bold">
              {archivedCount}
            </span>
          </button>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#1b2535]/40">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-xs text-white/50">
                No conversations found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = contact.id === selectedContactId;
                return (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`w-full p-3 flex items-start gap-3 transition-colors text-left cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#162134] text-white border-l-3 border-[#08f7bf]'
                        : 'hover:bg-[#121927]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0 mt-0.5">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover border border-white/10"
                      />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#08f7bf] border-2 border-[#0c121d]" />
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">
                          {contact.name}
                        </span>
                        <span className="text-[11px] text-white/40 font-mono shrink-0 ml-2">
                          {contact.lastMessageTime}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#08f7bf] truncate mb-0.5">
                        {contact.skills}
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs text-white/60 truncate flex items-center gap-1">
                          {contact.isTyping ? (
                            <span className="text-[#08f7bf] font-medium animate-pulse">
                              typing...
                            </span>
                          ) : (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-[#08f7bf] shrink-0" />
                              <span className="truncate">{contact.lastMessage}</span>
                            </>
                          )}
                        </p>

                        <div className="flex items-center gap-1 shrink-0">
                          {contact.tradeType === 'coins' && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              40 🪙
                            </span>
                          )}
                          {contact.tradeType === 'barter' && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#3d9be9]/20 text-[#3d9be9] border border-[#3d9be9]/30">
                              ⇄ Swap
                            </span>
                          )}
                          {contact.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#08f7bf] text-[#090d16] font-bold text-[10px] flex items-center justify-center">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANE: Chat Messages Stream & Interactive Bar   */}
        {/* ==================================================== */}
        <div
          className={`${
            selectedContactId ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col bg-[#080c14] relative overflow-hidden`}
        >
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 bg-[#0f1624] flex items-center justify-between border-b border-[#1b2535] z-10">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedContactId(null)}
                    className="md:hidden text-white/60 hover:text-white p-1 -ml-1 cursor-pointer"
                    aria-label="Back to contacts"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={activeContact.avatar}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#08f7bf]/30"
                    />
                    {activeContact.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#08f7bf] border-2 border-[#0f1624]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate flex items-center gap-2">
                      <span>{activeContact.name}</span>
                      <span className="hidden sm:inline text-[11px] font-normal text-white/50">
                        &bull; {activeContact.role}
                      </span>
                    </h3>
                    <div className="text-[11px] text-[#08f7bf] truncate flex items-center gap-1.5">
                      {activeContact.isTyping || isTypingNotification ? (
                        <span className="font-semibold animate-pulse text-[#08f7bf]">
                          typing...
                        </span>
                      ) : (
                        <span>{activeContact.online ? 'online' : activeContact.lastSeenText}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Call & Video Action Icons */}
                <div className="flex items-center gap-2 text-white/70">
                  <div className="hidden sm:flex items-center gap-1 mr-2 px-2.5 py-1 rounded-full bg-[#151d2d] border border-amber-500/20 text-xs font-mono text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>40 Coins Escrow</span>
                  </div>

                  {/* Audio Call */}
                  <button
                    title="Audio Call"
                    onClick={() => setActiveCall({ type: 'audio', contact: activeContact, duration: 0 })}
                    className="p-2 rounded-full hover:bg-white/10 hover:text-[#08f7bf] transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  {/* Video Call */}
                  <button
                    title="Video Call"
                    onClick={() => setActiveCall({ type: 'video', contact: activeContact, duration: 0 })}
                    className="p-2 rounded-full hover:bg-white/10 hover:text-[#08f7bf] transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  {/* Divider */}
                  <div className="w-px h-5 bg-white/10 mx-1" />

                  {/* Search in chat */}
                  <button
                    title="Search chat"
                    onClick={() => showToast(`Search in conversation with ${activeContact.name}`)}
                    className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Thread Canvas */}
              <div
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 relative"
                style={{
                  backgroundColor: '#090d16',
                  backgroundImage:
                    'radial-gradient(#151e2f 1px, transparent 1px), radial-gradient(#151e2f 1px, #090d16 1px)',
                  backgroundSize: '32px 32px',
                  backgroundPosition: '0 0, 16px 16px',
                }}
              >
                {/* Centered Date Badge (Matching "Today" from screenshot) */}
                <div className="flex justify-center my-2">
                  <span className="px-3.5 py-1 rounded-lg bg-[#141b29] border border-white/10 text-[11px] font-medium text-white/70 shadow-sm">
                    Today
                  </span>
                </div>

                {/* Encryption Disclaimer Bar */}
                <div className="max-w-md mx-auto p-2 rounded-xl bg-[#111927]/90 border border-white/5 text-[11px] text-amber-300/90 text-center flex items-center justify-center gap-1.5 shadow-sm">
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>
                    Direct peer encryption. Spend 40 coins to learn, earn 40 to teach.
                  </span>
                </div>

                {/* Message Bubbles Stream */}
                {activeContact.messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div
                        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed shadow-lg ${
                          isUser
                            ? 'bg-[#0f3840] border border-[#08f7bf]/20 text-white rounded-tr-xs'
                            : 'bg-[#151e2d] border border-white/10 text-[#e9edef] rounded-tl-xs'
                        }`}
                      >
                        {/* 1. Standard Text Message */}
                        {msg.text && !msg.isSessionProposal && (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        )}

                        {/* 2. File Attachment Card (Exact replica of All-files.zip from screenshot!) */}
                        {msg.fileAttachment && (
                          <div className="mt-1 p-3 rounded-xl bg-[#0c1420] border border-white/10 flex flex-col gap-2.5">
                            <div className="flex items-center gap-3">
                              {/* Amber/Yellow Compressed Folder Icon */}
                              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                <FileArchive className="w-5 h-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white truncate">
                                  {msg.fileAttachment.name}
                                </div>
                                <div className="text-[11px] text-white/50">
                                  {msg.fileAttachment.size} &bull; {msg.fileAttachment.type}
                                </div>
                              </div>
                            </div>

                            {/* "Open" and "Save as..." Action Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                              <button
                                onClick={() => showToast(`Opening ${msg.fileAttachment?.name}...`)}
                                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-[#08f7bf]" />
                                <span>Open</span>
                              </button>
                              <button
                                onClick={() => showToast(`Downloading ${msg.fileAttachment?.name}...`)}
                                className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-amber-400" />
                                <span>Save as...</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 3. Photo Attachment Card (Exact replica of landscape mountain photo from screenshot!) */}
                        {msg.photoAttachment && (
                          <div className="mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#0c1420]">
                            <img
                              src={msg.photoAttachment.url}
                              alt="Attached photo"
                              className="w-full max-h-72 object-cover rounded-t-xl"
                            />
                            {msg.photoAttachment.caption && (
                              <div className="p-2.5 text-xs text-white font-medium">
                                {msg.photoAttachment.caption}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 4. Session Proposal Card (SkillSpace 40-Coin Escrow) */}
                        {msg.isSessionProposal && msg.sessionProposal && (
                          <div className="mt-2 p-3 rounded-xl bg-[#0a111b] border border-[#08f7bf]/30 space-y-2.5 shadow-md">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span>{msg.sessionProposal.coins} Coins Held in Escrow</span>
                              </span>
                              <span className="text-[#08f7bf] font-semibold">1-Hour Session</span>
                            </div>

                            <div className="text-xs font-bold text-white">
                              {msg.sessionProposal.topic}
                            </div>
                            <div className="text-[11px] text-white/70 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#3d9be9]" />
                              <span>{msg.sessionProposal.date} &bull; {msg.sessionProposal.time}</span>
                            </div>

                            <div className="pt-2 border-t border-white/10">
                              {msg.sessionProposal.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleProposalAction(
                                        activeContact.id,
                                        msg.sessionProposal!.id,
                                        'accepted'
                                      )
                                    }
                                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#08f7bf] hover:bg-[#06d4a3] text-[#090d16] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-[#08f7bf]/20"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept (40 Coins)</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleProposalAction(
                                        activeContact.id,
                                        msg.sessionProposal!.id,
                                        'declined'
                                      )
                                    }
                                    className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                                  >
                                    Decline
                                  </button>
                                </div>
                              ) : msg.sessionProposal.status === 'accepted' ? (
                                <div className="p-2 rounded-lg bg-[#08f7bf]/20 text-[#08f7bf] border border-[#08f7bf]/30 text-[11px] font-mono flex items-center justify-between">
                                  <span>✓ Session confirmed! 40 Coins in escrow.</span>
                                  {onNavigateToSchedule && (
                                    <button
                                      onClick={onNavigateToSchedule}
                                      className="underline hover:text-white cursor-pointer"
                                    >
                                      View in Calendar
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[11px] text-red-400 font-mono">
                                  ✗ Session proposal was declined.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Message Reactions Row (Matching Heart ❤️ reaction from screenshot) */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {msg.reactions.map((r, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleToggleReaction(msg.id, r.emoji)}
                                className={`px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 border transition-all cursor-pointer ${
                                  r.reactedByMe
                                    ? 'bg-[#08f7bf]/20 border-[#08f7bf]/40 text-[#08f7bf]'
                                    : 'bg-white/10 border-white/10 text-white/80'
                                }`}
                              >
                                <span>{r.emoji}</span>
                                {r.count > 1 && <span className="font-mono text-[10px]">{r.count}</span>}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp & Read Receipt Checkmarks in #08f7bf */}
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/50">
                          <span>{msg.time}</span>
                          {isUser && (
                            <CheckCheck
                              className={`w-3.5 h-3.5 ${
                                msg.status === 'read' ? 'text-[#08f7bf]' : 'text-white/40'
                              }`}
                            />
                          )}
                        </div>

                        {/* Quick Hover Reaction Trigger */}
                        <div className="hidden group-hover:flex absolute -bottom-3 right-2 bg-[#121a28] border border-white/20 rounded-full px-1.5 py-0.5 shadow-lg items-center gap-1 text-xs">
                          {['❤️', '👍', '🔥'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="hover:scale-125 transition-transform p-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker Tray */}
              {showEmojiPicker && (
                <div className="px-4 py-2.5 bg-[#101725] border-t border-[#1b2535] flex items-center gap-3 overflow-x-auto shadow-inner">
                  {['👍', '❤️', '🔥', '👏', '🎉', '😊', '💡', '🚀', '🎯', '🪙', '✨', '🙌'].map(
                    (emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setInputMessage((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl hover:scale-125 transition-transform cursor-pointer p-1"
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              )}

              {/* Attachment Picker Popover */}
              {showAttachMenu && (
                <div className="p-3 bg-[#101725] border-t border-[#1b2535] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    onClick={handleSendZipFile}
                    className="p-2.5 rounded-xl bg-[#151e2d] hover:bg-[#1b273b] border border-amber-500/30 text-amber-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FileArchive className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-left">Send ZIP Files</span>
                  </button>
                  <button
                    onClick={handleSendPhoto}
                    className="p-2.5 rounded-xl bg-[#151e2d] hover:bg-[#1b273b] border border-[#08f7bf]/30 text-[#08f7bf] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#08f7bf] shrink-0" />
                    <span className="font-semibold text-left">Send Photo</span>
                  </button>
                  <button
                    onClick={handleSend40CoinProposal}
                    className="p-2.5 rounded-xl bg-[#151e2d] hover:bg-[#1b273b] border border-amber-500/30 text-amber-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-left">Propose 40 Coins</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputMessage('Would you like to do a direct 1:1 skill barter? (0 Coins)');
                      setShowAttachMenu(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#151e2d] hover:bg-[#1b273b] border border-[#3d9be9]/30 text-[#3d9be9] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-[#3d9be9] shrink-0" />
                    <span className="font-semibold text-left">Propose 1:1 Barter</span>
                  </button>
                </div>
              )}

              {/* Chat Input Bottom Bar (Matching screenshot layout) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="h-16 px-4 bg-[#101725] flex items-center gap-2 border-t border-[#1b2535]"
              >
                {/* Smile / Emoji Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachMenu(false);
                  }}
                  className="text-white/60 hover:text-[#08f7bf] p-2 rounded-full cursor-pointer transition-colors"
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* Paperclip / Attachment Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(!showAttachMenu);
                    setShowEmojiPicker(false);
                  }}
                  className="text-white/60 hover:text-[#08f7bf] p-2 rounded-full cursor-pointer transition-colors"
                  title="Attach file, photo or 40-coin proposal"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  placeholder="Type a message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#162030] border border-white/5 outline-none focus:border-[#08f7bf]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/40 transition-colors"
                />

                {/* Send / Microphone Button */}
                {inputMessage.trim() ? (
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#08f7bf] hover:bg-[#06d4a3] text-[#090d16] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-md shadow-[#08f7bf]/20"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleSendMessage('🎙️ [Voice Note 0:15] Discussing our 40-coin mentorship plan!');
                    }}
                    className="text-white/60 hover:text-[#08f7bf] p-2 rounded-full cursor-pointer shrink-0 transition-colors"
                    title="Send Voice Note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#080c14]">
              <div className="w-16 h-16 rounded-full bg-[#111927] border border-[#08f7bf]/30 flex items-center justify-center text-[#08f7bf] mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp for SkillSpace</h3>
              <p className="text-xs text-white/50 max-w-sm">
                Select a chat from the sidebar to message peers, share files, or exchange skills with the 40 coins rule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. SIMULATED VOICE / VIDEO CALL MODAL                */}
      {/* ==================================================== */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#101725] rounded-3xl border border-[#08f7bf]/30 p-6 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative mb-4">
              <img
                src={activeCall.contact.avatar}
                alt={activeCall.contact.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#08f7bf]/40 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#08f7bf] border-2 border-[#101725] flex items-center justify-center text-black">
                {activeCall.type === 'video' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{activeCall.contact.name}</h3>
            <div className="text-xs text-[#08f7bf] font-mono mb-6">
              Connected &bull; {formatDuration(activeCall.duration)}
            </div>

            {/* Video preview simulated box */}
            {activeCall.type === 'video' && (
              <div className="w-full h-40 bg-[#0c121d] rounded-2xl border border-white/10 mb-6 flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                  alt="Video feed"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-[#08f7bf] border border-[#08f7bf]/30">
                  HD 1080p Encrypted
                </div>
              </div>
            )}

            {/* Call Action Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => showToast('Microphone toggled')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Mute"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveCall(null)}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-red-500/30"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                onClick={() => showToast('Video feed toggled')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Camera"
              >
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. NEW CHAT MODAL                                    */}
      {/* ==================================================== */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#101725] rounded-3xl border border-[#1b2535] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <SquarePen className="w-5 h-5 text-[#08f7bf]" />
                <h3 className="text-lg font-bold text-white">Start New Chat</h3>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    handleSelectContact(c.id);
                    setShowNewChatModal(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#162030] hover:bg-[#1c293d] flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[11px] text-[#08f7bf]">{c.skills}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/70">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-[#121d2d] border border-[#08f7bf]/40 text-xs text-white shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-[#08f7bf]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
