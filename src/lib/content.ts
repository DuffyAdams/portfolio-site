import { Braces, Bug, Cloud, Puzzle, Server, Sparkles } from 'lucide-svelte';

// All the site copy lives here so wording changes don't mean digging through components.

export const links = {
  email: 'mailto:duffyadams55@gmail.com',
  emailAddress: 'duffyadams55@gmail.com',
  github: 'https://github.com/DuffyAdams',
  linkedin: 'https://www.linkedin.com/in/duffyadams/',
  resume: '/assets/Resume_5_22_26.pdf',
  resumeFileName: 'Duffy-Adams-Resume.pdf',
  terminal: '/terminal/index.html'
};

export type Project = {
  title: string;
  hook: string;
  description: string;
  tech: string[];
  highlights: string[];
  demoHref?: string;
  demoLabel?: string;
  githubHref?: string;
  preview?: string;
  previewPoster?: string;
  previewFit?: 'cover' | 'contain';
  previewDemo?: 'volume-scroller';
  accent: string;
};

export const projects: Project[] = [
  {
    title: 'FLEX',
    hook: "I've trained for over ten years and every workout app I tried was almost right. So I built the one I actually wanted to use.",
    description:
      "A workout tracker for planning routines, logging sets fast, and seeing what's actually working. It works offline at the gym and syncs when you're back online. It's grown into a real app with its own site and a Pro plan.",
    highlights: [
      '1,273 built-in exercises, plus your own custom ones',
      'Offline-first logging with Dexie and IndexedDB, synced through Supabase',
      'AI planner that turns your goals and schedule into an editable program',
      'Built solo: design, web app, sync, subscriptions, tests, and docs'
    ],
    tech: ['Svelte 5', 'TypeScript', 'Dexie.js', 'Supabase', 'OpenRouter', 'Capacitor', 'Playwright', 'PWA'],
    demoHref: 'https://flexapp.dev/',
    demoLabel: 'flexapp.dev',
    preview: '/assets/flex-project-preview-202609.mp4',
    previewPoster: '/assets/flex-project-preview-202609.jpg',
    accent: 'linear-gradient(135deg, #dcfce7, #22c55e 50%, #111827)'
  },
  {
    title: 'San Diego Traffic Watch',
    hook: 'I got tired of sitting in traffic with no idea what was going on. Knowing why it stopped won\'t make it move, but it helps you decide what to do.',
    description:
      'A live feed and map of traffic and emergency incidents around San Diego County. It pulls from CHP, SDPD, and SDFD every 15 seconds and turns cryptic dispatch notes into plain-English summaries.',
    highlights: [
      'Flask backend with scrapers that run every 15 seconds and retire stale incidents',
      'Svelte frontend with MapLibre maps, live stats, likes, and comments',
      'I deploy and maintain it myself on a Linux VPS with NGINX and systemd'
    ],
    tech: ['Python', 'Flask', 'Svelte', 'SQLite', 'OpenRouter', 'MapLibre', 'NGINX'],
    demoHref: 'https://traffic-app.duffyadams.com/',
    demoLabel: 'Live app',
    githubHref: 'https://github.com/DuffyAdams/san-diego-traffic-watch',
    preview: '/assets/traffic-project-preview-202609.mp4',
    previewPoster: '/assets/traffic-project-preview-202609.jpg',
    accent: 'linear-gradient(135deg, #bae6fd, #38bdf8 48%, #0f172a)'
  },
  {
    title: 'FoodNotes',
    hook: 'A food journal where logging a meal is just taking a picture of it.',
    description:
      'Snap your plate and it saves right away, even with no signal. The calorie and macro estimate fills in on its own, and you can fix anything it gets wrong.',
    highlights: [
      'Meals save to IndexedDB first, then sync to Supabase in the background',
      'Private photo storage locked down per account with row-level security',
      'MyPantry for foods you eat all the time, plus searchable history and insights'
    ],
    tech: ['Svelte 5', 'TypeScript', 'Dexie.js', 'Supabase', 'OpenRouter', 'PWA'],
    demoHref: 'https://foodnotes.dev/',
    demoLabel: 'foodnotes.dev',
    preview: '/assets/foodnotes-project-preview-202609.mp4',
    previewPoster: '/assets/foodnotes-project-preview-202609.jpg',
    accent: 'linear-gradient(135deg, #f5efe3, #a9b99d 50%, #536c52)'
  },
  {
    title: 'DialDev',
    hook: 'A softphone made for testing phone systems, so you can see everything that happens on a call.',
    description:
      'Run a few SIP accounts side by side and get a timeline of every SIP message, DTMF digit, and transcribed prompt. It ships as a Mac app that updates itself.',
    highlights: [
      'Native SIP through Baresip, plus WebRTC accounts through SIP.js',
      'Activity log for SIP signaling, RFC 4733 DTMF, and live call captions',
      "Checks the download's SHA-256 and code signature before every update"
    ],
    tech: ['Electron', 'React', 'TypeScript', 'Baresip', 'SIP.js'],
    demoHref: 'https://github.com/DuffyAdams/DialDev/releases/latest',
    demoLabel: 'Download for Mac',
    githubHref: 'https://github.com/DuffyAdams/DialDev',
    preview: '/assets/dialdev-overview-202610.jpg',
    accent: 'linear-gradient(135deg, #e2e8f0, #94a3b8 50%, #1e293b)'
  }
];

export type SideProject = {
  title: string;
  kind: string;
  blurb: string;
  href?: string;
  hrefLabel?: string;
  githubHref?: string;
};

export const sideProjects: SideProject[] = [
  {
    title: 'SDSU RateMyProfessors',
    kind: 'Chrome extension',
    blurb: "Puts professor ratings right on SDSU's class search page, so you don't lose a seat while you go look them up.",
    href: 'https://chromewebstore.google.com/detail/sdsu-ratemyprofessor-inte/egenkkldeacjpnlcniegnahlgffehijl',
    hrefLabel: 'Web Store',
    githubHref: 'https://github.com/DuffyAdams/RMPIntegration-SDSU'
  },
  {
    title: 'Canvas File Grabber',
    kind: 'Chrome extension',
    blurb: 'Bulk downloads course files from Canvas. Clicking every file one at a time was driving me crazy.'
  },
  {
    title: 'Codex Usage Tracker',
    kind: 'Chrome extension',
    blurb: "Shows whether I'm burning through my Codex limit faster than the reset clock is ticking.",
    githubHref: 'https://github.com/DuffyAdams/codex-usage-tracker'
  },
  {
    title: 'Speed Reader',
    kind: 'Web app',
    blurb: 'Flashes a PDF at you one word at a time, anywhere from 100 to 1,000 words a minute.',
    githubHref: 'https://github.com/DuffyAdams/spead-reader'
  },
  {
    title: 'License Plate Reporter',
    kind: 'Web app',
    blurb: 'Community traffic-safety reports with plates, locations, and photos. Photo EXIF data gets stripped before upload.',
    githubHref: 'https://github.com/DuffyAdams/license-plate-reporter'
  },
  {
    title: 'Pourtocol Smart Fountain',
    kind: 'Team project',
    blurb: 'An ESP32 drink fountain with NFC IDs and cup detection. I helped with the distributed side: timeouts, safe relays, and making sure two pours never happen at once.'
  }
];

export const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL', 'Rust'];

export const skillGroups = [
  {
    title: 'Frontend',
    icon: Braces,
    note: 'Most of my web apps are Svelte. Some are React.',
    skills: ['Svelte', 'React', 'TypeScript', 'Tailwind', 'HTML/CSS', 'PWAs']
  },
  {
    title: 'Backend & data',
    icon: Server,
    note: 'APIs, scrapers, sync, and the databases behind them.',
    skills: ['Python', 'Flask', 'Node/Express', 'REST APIs', 'SQLite', 'Supabase/Postgres']
  },
  {
    title: 'AI in apps',
    icon: Sparkles,
    note: 'Only where it actually helps: incident summaries, meal photos, workout plans.',
    skills: ['OpenRouter', 'LLM summaries', 'Vision models', 'Structured output']
  },
  {
    title: 'Desktop & extensions',
    icon: Puzzle,
    note: 'Little tools that live outside a browser tab, or inside one.',
    skills: ['Tauri', 'Rust', 'Electron', 'Chrome extensions']
  },
  {
    title: 'Servers & deploys',
    icon: Cloud,
    note: 'I deploy and look after my own apps.',
    skills: ['Linux', 'NGINX', 'Docker', 'systemd', 'SSH', 'Proxmox']
  },
  {
    title: 'Testing & tickets',
    icon: Bug,
    note: 'The day job, and a habit in my side projects too.',
    skills: ['Playwright', 'Unit tests', 'Debugging', 'Jira', 'ServiceNow', 'Git']
  }
];

export type Job = {
  role: string;
  company: string;
  location: string;
  dates: string;
  current?: boolean;
  summary: string;
  bullets: string[];
};

export const jobs: Job[] = [
  {
    role: 'Associate QA Engineer',
    company: 'ICSolutions',
    location: 'San Diego, CA',
    dates: 'Sep 2026 – now',
    current: true,
    summary:
      'In September I moved from the field side over to the QA team. Same company, different side of the work, and a lot more time hunting bugs on purpose.',
    bullets: []
  },
  {
    role: 'Site Administrator',
    company: 'ICSolutions',
    location: 'San Diego, CA',
    dates: 'Dec 2021 – Sep 2026',
    summary:
      'I was the on-site tech person at a correctional facility for everything ICS runs there: inmate phones, tablets, kiosks, and the network gear behind them.',
    bullets: [
      'Fixed whatever broke (hardware, software, accounts, connectivity), swapped and configured devices myself, and worked with support teams, facility staff, and investigators to get it sorted.',
      'Kept tickets, grievances, and complaints moving in Jira and ServiceNow, and wrote the weekly reports on how everything was running.',
      "Led the facility-wide tablet rollout: setup, training staff, tracking issues, and supporting it after launch. It helped grow the facility's communication revenue a lot."
    ]
  },
  {
    role: 'Supervisor',
    company: 'Chick-fil-A',
    location: 'Chula Vista, CA',
    dates: 'Aug 2015 – Aug 2021',
    summary: 'Six years. I ran shifts, built schedules, trained a team of 15+, and handled the customer issues that got escalated.',
    bullets: []
  }
];

export const education = [
  { school: 'San Diego State University', degree: 'B.S. Computer Science', dates: 'May 2026' },
  { school: 'Southwestern College', degree: 'A.S. Computer Science', dates: 'May 2024' }
];
