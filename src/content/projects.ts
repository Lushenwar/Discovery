// The single source of truth for what Vitrine shows. Adding a project is an
// edit here, on purpose — no CMS. Honesty rule (CLAUDE.md): every role, award,
// and detail below is verifiable; blurbs/details are drawn from the projects'
// public Devpost pages. Links are real.
export type ProjectTag = 'ml' | 'agents' | 'fullstack' | 'systems' | 'infra' | 'award';

export interface Project {
  slug: string;
  title: string;
  role: string;
  blurb: string; // ≤ 140 chars
  detail: string; // 2–4 sentences, plain
  stack: string[];
  year: number;
  tags: ProjectTag[];
  award?: string;
  links: { label: string; href: string }[];
  media: {
    thumb: string; // '' → procedurally generated placeholder tile (pending real screenshots)
    hero?: string;
    model?: string;
    accent: `#${string}`;
  };
}

export const projects: Project[] = [
  {
    slug: 'eco-pulse',
    title: 'Eco-Pulse',
    role: 'Team of 4',
    blurb: 'Mapping heat. Planting relief.',
    detail:
      'Turns urban thermal data into actionable green-infrastructure plans. Geospatial analysis and generative AI find critical heat zones, then generate intervention blueprints — tree canopies and green roofs with estimated temperature reductions and costs.',
    stack: ['Python', 'FastAPI', 'Gemini', 'Google Maps', 'Next.js', 'React', 'Tailwind', 'TypeScript'],
    year: 2026,
    tags: ['ml', 'fullstack', 'award'],
    award: '1st place — GenAI Genesis 2026',
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/eco-pulse-fpbo15' }],
    media: { thumb: '', accent: '#4ade80' },
  },
  {
    slug: 'locatr',
    title: 'LOCATR',
    role: 'Team of 4',
    blurb: 'Agentic-powered discovery to find your perfect venue.',
    detail:
      'AI-driven venue discovery weighing qualitative factors — architectural aesthetic, cost-to-value, real-time urban risk. A LangGraph multi-agent pipeline coordinates specialized agents across vibe, pricing, and safety, presenting results with transparent reasoning.',
    stack: ['Python', 'LangGraph', 'FastAPI', 'Auth0', 'Snowflake', 'Mapbox', 'Next.js', 'WebSockets'],
    year: 2026,
    tags: ['agents', 'fullstack', 'award'],
    award: 'Best Use of Auth0 — DeerHacks V 2026',
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/pathfinder-6h8y1v' }],
    media: { thumb: '', accent: '#60a5fa' },
  },
  {
    slug: 'ifyshop',
    title: 'ifyShop',
    role: 'Team of 4',
    blurb: 'Shop with confidence.',
    detail:
      'A visual shopping agent that identifies products from images and gives safety-focused buying guidance: scam detection, suspicious-review flags, eco-scores, and personalized recommendations via a multi-agent pipeline.',
    stack: ['Python', 'LangGraph', 'Gemini', 'Snowflake', 'FastAPI', 'React', 'Docker'],
    year: 2026,
    tags: ['agents', 'ml', 'award'],
    award: 'Best Use of Snowflake API — CxC 2026',
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/ifyshop' }],
    media: { thumb: '', accent: '#f59e0b' },
  },
  {
    slug: 'fixmyfeed',
    title: 'FixMyFeed',
    role: 'Team of 4',
    blurb: 'Fall in love with the world again.',
    detail:
      'A Chrome extension that pushes back on algorithmic manipulation. It intercepts TikTok and Reels video in real time, classifies it as toxic or valuable, blocks the junk, and applies grayscale friction to cut doomscrolling.',
    stack: ['TypeScript', 'React', 'FastAPI', 'scikit-learn', 'Supabase', 'Vite'],
    year: 2026,
    tags: ['ml', 'systems'],
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/fixmyfeed' }],
    media: { thumb: '', accent: '#f472b6' },
  },
  {
    slug: 'health-assistant',
    title: 'Health Assistant',
    role: 'Figma design + AI agent',
    blurb: 'Three microhacks across UI/UX, AI, and 3D modeling.',
    detail:
      'Built at Hack404: a website redesign in Figma, an AI assistant with reminders and mood tracking on the OpenAI API, and a functional multi-angle phone stand modeled in Fusion 360.',
    stack: ['Python', 'OpenAI API', 'Figma', 'Fusion 360'],
    year: 2026,
    tags: ['ml', 'award'],
    award: '3rd place, Beginner Stream — Hack404',
    links: [{ label: 'Devpost', href: 'https://devpost.com/software/beginner-track-portfolio' }],
    media: { thumb: '', accent: '#a78bfa' },
  },
];
