import { Testimonial, MatchProfile, ChatMessage, SessionRequest, BadgeItem, ActivityTransaction } from '../types';

export const TESTIMONIALS_ROW_1: Testimonial[] = [
  {
    id: '1',
    name: 'Juno',
    avatar: 'https://framerusercontent.com/images/5TuytYWXpj4P7hxEzPCyohYiq0M.png',
    text: 'Taught Figma. Learned French. Gained a friend. 10/10.',
  },
  {
    id: '2',
    name: 'Sufyan',
    avatar: 'https://framerusercontent.com/images/IYcjgl5JyMAnUgaMp5Boeg5TgBo.png',
    text: 'It’s like Uber for learning, but without money involved. Just value.',
  },
  {
    id: '3',
    name: 'Clara',
    avatar: 'https://framerusercontent.com/images/SAEWzoM9VNnlgW97WwteffHs.png',
    text: 'The matching is scarily good. I was connected with someone who exactly fit what I needed.',
  },
  {
    id: '4',
    name: 'Daniel',
    avatar: 'https://framerusercontent.com/images/sA6bo4ODyux2Rl9Md8Mt1qtY8ro.png',
    text: 'I’ve been freelancing for years — now I finally have a space to give back and grow at the same time.',
  },
  {
    id: '5',
    name: 'Mika',
    avatar: 'https://framerusercontent.com/images/g0GILM1K38scKfYoi4O1eeFEo6c.png',
    text: "I swapped my guitar lessons for Japanese. That's SkillSwap for you.",
  },
  {
    id: '6',
    name: 'Louis',
    avatar: 'https://framerusercontent.com/images/tNSuGCqPjFNe9kBWMXIGnucW24.png',
    text: 'I didn’t expect to meet such passionate learners. It’s more than a platform — it’s a community.',
  },
  {
    id: '7',
    name: 'Ella',
    avatar: 'https://framerusercontent.com/images/CMS9ieEAoAOnW7OVWz0pztwc3Ls.png',
    text: 'No pressure. No deadlines. Just pure learning from real people.',
  },
  {
    id: '8',
    name: 'Kevin',
    avatar: 'https://framerusercontent.com/images/F2opdAIczoFZrp3pGIM2ZFrhZMg.png',
    text: 'It’s the only place where teaching actually feels like a two-way street.',
  },
  {
    id: '9',
    name: 'Anna',
    avatar: 'https://framerusercontent.com/images/JLT22ywq2GspZcCSEh5VvEJ2FE.png',
    text: 'Taught English, learned 3D modeling. Honestly felt like trading magic.',
  },
  {
    id: '10',
    name: 'Alex',
    avatar: 'https://framerusercontent.com/images/gq8rMF0RHFKCy65JlBiYn8Ho4I.png',
    text: 'I joined to learn video editing. I ended up teaching Photoshop too. That’s wild.',
  },
];

export const TESTIMONIALS_ROW_2: Testimonial[] = [
  {
    id: '11',
    name: 'Theo',
    avatar: 'https://framerusercontent.com/images/WJc5Zqg315ObzApQLgmq7j6neQ.png',
    text: 'SkillSwap makes you feel smart just for showing up.',
  },
  {
    id: '12',
    name: 'Jasmine',
    avatar: 'https://framerusercontent.com/images/BgSQXwUgiIbWfrIjFbzbiokQ.png',
    text: 'I’ve been on other platforms. This one actually respects your time.',
  },
  {
    id: '13',
    name: 'Leo',
    avatar: 'https://framerusercontent.com/images/ZzRTSz4BXNOvW3fNEqtfsfXjQ.png',
    text: 'This feels more human than any course or YouTube playlist ever did.',
  },
  {
    id: '14',
    name: 'Natalia',
    avatar: 'https://framerusercontent.com/images/JU5bLm4yrsi5oIEY9S62Nc7vhFw.png',
    text: 'Never thought I’d love teaching, but turns out — I just needed the right space.',
  },
  {
    id: '15',
    name: 'Omar',
    avatar: 'https://framerusercontent.com/images/Z6pJJqOuPunOz1YoYbscSw2RGg.png',
    text: 'Real-time messaging, instant scheduling, and no awkward pricing talks. Genius.',
  },
  {
    id: '16',
    name: 'Harper',
    avatar: 'https://framerusercontent.com/images/LYiz2bQ4Gk9IbOpc0inPS1rptU.png',
    text: 'It’s like mentoring meets learning meets social networking.',
  },
  {
    id: '17',
    name: 'Jae',
    avatar: 'https://framerusercontent.com/images/yy76ony7pqvX19HSWfzxF2dWDs.png',
    text: 'Teaching photography while learning marketing? That’s my SkillSwap flow.',
  },
  {
    id: '18',
    name: 'Noor',
    avatar: 'https://framerusercontent.com/images/JgMyws1VSpPbqu8R2Us84YAV3us.png',
    text: 'I don’t pay. I contribute. And that mindset shift is everything.',
  },
  {
    id: '19',
    name: 'Felix',
    avatar: 'https://framerusercontent.com/images/twlPskIFvCHRxhWuE50loaS9Ds.png',
    text: 'Gamified learning that doesn’t feel cheesy. Just the right amount of fun.',
  },
  {
    id: '20',
    name: 'Andre',
    avatar: 'https://framerusercontent.com/images/0cXJXaULK7L9kN2PaTCwMHWufM.png',
    text: 'This should’ve existed 10 years ago. I’m so in.',
  },
];

export const MATCH_PROFILES: MatchProfile[] = [
  {
    id: 'william',
    name: 'William',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    matchScore: 100,
    teachSkills: ['React', 'JavaScript', 'Python'],
    learnSkills: ['Public Speaking', 'Guitar'],
  },
  {
    id: 'robert',
    name: 'Robert',
    avatar: 'https://framerusercontent.com/images/0OsK7Zcytq4T6IfjT7WuCd63EI.png',
    matchScore: 89,
    teachSkills: ['Swift', 'Figma', 'UI Design'],
    learnSkills: ['Product Management'],
  },
  {
    id: 'dylan',
    name: 'Dylan',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    matchScore: 86,
    teachSkills: ['React', 'JavaScript'],
    learnSkills: ['UX Research', 'Python'],
  },
  {
    id: 'amina',
    name: 'Amina',
    avatar: 'https://framerusercontent.com/images/J4V6NtvEzzdIaoMonDGsZQRNE.png',
    matchScore: 86,
    teachSkills: ['UX Research', 'Python'],
    learnSkills: ['React', 'JavaScript'],
  },
  {
    id: 'emma',
    name: 'Emma',
    avatar: 'https://framerusercontent.com/images/J4V6NtvEzzdIaoMonDGsZQRNE.png',
    matchScore: 86,
    teachSkills: ['UX Research', 'Python'],
    learnSkills: ['Notion'],
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    name: 'Noor',
    avatar: 'https://framerusercontent.com/images/ktlwDnBdDy7e82bDH8fM8E3DP8.png',
    text: 'Hey! Could you help me set up a Notion dashboard for my freelance projects?',
    time: '14:02',
  },
  {
    id: 'm2',
    sender: 'partner',
    name: 'William',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    text: 'Sure thing — happy to! Are you free Sunday afternoon?',
    time: '14:05',
  },
  {
    id: 'm3',
    sender: 'user',
    name: 'Noor',
    avatar: 'https://framerusercontent.com/images/ktlwDnBdDy7e82bDH8fM8E3DP8.png',
    text: 'Mostly freelance gigs and content planning. I’d love tips on dashboards and databases!',
    time: '14:08',
  },
  {
    id: 'm4',
    sender: 'partner',
    name: 'William',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    text: 'Perfect, I’ll show you how to set up a client tracker and content board. Also… I noticed you teach guitar 👀',
    time: '14:11',
  },
  {
    id: 'm5',
    sender: 'user',
    name: 'Noor',
    avatar: 'https://framerusercontent.com/images/ktlwDnBdDy7e82bDH8fM8E3DP8.png',
    text: 'Haha, yes! Want to trade after the Notion session?',
    time: '14:13',
  },
  {
    id: 'm6',
    sender: 'partner',
    name: 'William',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    text: '100%! I’ve been stuck on barre chords forever 😅 Let’s book both?',
    time: '14:15',
  },
  {
    id: 'm7',
    sender: 'partner',
    name: 'William',
    avatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    text: 'William sent you a Session request: 17 June 14:00 (Notion Consulting)',
    time: '14:16',
    isSessionRequest: true,
    sessionData: {
      topic: 'Notion Dashboard Architecture',
      date: '17 June',
      time: '14:00',
    },
  },
];

export const SESSION_REQUESTS: SessionRequest[] = [
  {
    id: 'req1',
    partnerName: 'William',
    partnerAvatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    topic: 'Python Foundations',
    type: 'Learning',
    date: 'Today at 17:00',
    status: 'pending',
  },
  {
    id: 'req2',
    partnerName: 'William',
    partnerAvatar: 'https://framerusercontent.com/images/jYZcWolHIxpvAZUaqmToDEsdeE.png',
    topic: 'Acoustic Guitar Basics',
    type: 'Teaching',
    date: '14 June at 12:30',
    status: 'pending',
  },
  {
    id: 'req3',
    partnerName: 'Robert',
    partnerAvatar: 'https://framerusercontent.com/images/0OsK7Zcytq4T6IfjT7WuCd63EI.png',
    topic: 'Python Scripting Automation',
    type: 'Learning',
    date: '18 June at 19:00',
    status: 'pending',
  },
];

export const ACTIVITY_LOGS: ActivityTransaction[] = [
  {
    id: 'act1',
    title: 'Notion session (Teaching)',
    type: 'earn',
    points: 300,
    category: 'Productivity',
  },
  {
    id: 'act2',
    title: 'Python session (Learning)',
    type: 'spend',
    points: 350,
    category: 'Engineering',
  },
  {
    id: 'act3',
    title: 'Singing session (Teaching)',
    type: 'earn',
    points: 300,
    category: 'Creative Arts',
  },
  {
    id: 'act4',
    title: 'Guitar session (Learning)',
    type: 'spend',
    points: 350,
    category: 'Music',
  },
];

export const BADGES: BadgeItem[] = [
  {
    id: 'b1',
    title: 'Master Mentor',
    image: 'https://framerusercontent.com/images/bQTwuVzsgZyUFVLrX7yEVcRqXT4.png',
    description: 'Delivered 10+ high-rated teaching sessions',
    level: 'Tier III',
  },
  {
    id: 'b2',
    title: 'Polymath Learner',
    image: 'https://framerusercontent.com/images/LxFEbtMYr61mKfyhfrfhjI.png',
    description: 'Completed sessions across 3 diverse categories',
    level: 'Tier II',
  },
  {
    id: 'b3',
    title: 'Daily Streak Hero',
    image: 'https://framerusercontent.com/images/8EMJKQaSI26jLWBt788jp0LwUo.png',
    description: 'Active 7 consecutive days on SkillSwap',
    level: 'Tier I',
  },
  {
    id: 'b4',
    title: 'First Exchange',
    image: 'https://framerusercontent.com/images/2vZ8YoPcqPJQkkp98Svr978uyw.png',
    description: 'Completed your first 1-on-1 swap session',
    level: 'Tier I',
  },
  {
    id: 'b5',
    title: 'Community Champion',
    image: 'https://framerusercontent.com/images/tnIVQEp6hmPW3ihaoOdrPAe1tA.png',
    description: 'Received 5-star feedback from 5 peers',
    level: 'Tier II',
  },
  {
    id: 'b6',
    title: 'Knowledge Spark',
    image: 'https://framerusercontent.com/images/QuCLVnvk414iQzAZ8LNKgVm8.png',
    description: 'Initiated 15 collaborative discussions',
    level: 'Tier II',
  },
  {
    id: 'b7',
    title: 'Ambassador',
    image: 'https://framerusercontent.com/images/iIAigB6T4j2lt0fmR5tGA2lUuHU.png',
    description: 'Shared skills with global peers across timezones',
    level: 'Tier III',
  },
];
