export interface NavLink {
  label: string
  href: string
}

export type ChipColor = 'cyan' | 'amber' | 'violet'
export type StatusColor = 'green' | 'cyan' | 'amber'
export type ProjectStatus = 'active' | 'in-progress'

export interface TechChip {
  label: string
  color: ChipColor
}

export interface StatusIndicator {
  label: string
  color: StatusColor
}

export interface Domain {
  id: string
  title: string
  description: string
  chips: TechChip[]
}

export interface RoleMetric {
  label: string
  value: string
}

export interface Role {
  dateRange: string
  title: string
  company: string
  description: string
  status: 'ACTIVE' | 'ARCHIVED' | 'EDUCATION'
  chips: TechChip[]
  /** Omitted for education, which renders compressed — no metrics strip. */
  metrics?: RoleMetric[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  coordinates: string
  repoUrl: string
  liveUrl?: string
  chips: TechChip[]
}

export interface ContactInfo {
  github: string
  linkedin: string
  email: string
}

export const navLinks: NavLink[] = [
  { label: 'CORE',    href: '#command-center' },
  { label: 'STACK',   href: '#core-stack' },
  { label: 'LOGS',    href: '#experience-logs' },
  { label: 'ARCHIVE', href: '#active-projects' },
  { label: 'SIGNAL',  href: '#contact-uplink' },
]

export const hero = {
  name: 'AMMAR_BERKOVIC',
  title: 'FULL STACK ENGINEER // PUBLISHING_&_PERFORMANCE',
  bio: "Full stack engineer, five years on high-traffic publishing sites where organic search is the business. At Glide Tech I owned client publishers' live websites — React and Next.js front ends, Node and AWS behind them. Most recently backend in Go and MySQL, on a platform serving 836,000 registered users.",
  statusIndicators: [
    { label: 'AVAILABLE_FOR_HIRE', color: 'cyan' },
    { label: 'REMOTE_WORLDWIDE',   color: 'green' },
    { label: 'TUZLA // UTC+1',     color: 'amber' },
  ] as StatusIndicator[],
  primaryCta:   { label: 'VIEW_ARCHIVE', href: '#active-projects' },
  secondaryCta: { label: 'OPEN_UPLINK',  href: '#contact-uplink' },
  cv: {
    label:    'EXPORT_CV.PDF',
    href:     '/CV.pdf',
    fileName: 'Ammar-Berkovic-CV.pdf', // what the browser saves it as
    size:     '[233KB]',               // update when replacing public/CV.pdf
  },
}

export const domains: Domain[] = [
  {
    id: 'MOD-001',
    title: 'Backend Architecture',
    description:
      'Multi-tenant services built for throughput — provider-agnostic adapters, a greenfield rules engine, and billing paths reconciled against what the carrier actually charged.',
    chips: [
      { label: 'Golang',  color: 'cyan'  },
      { label: 'MySQL',   color: 'cyan'  },
      { label: 'Node.js', color: 'cyan'  },
      { label: 'Redis',   color: 'amber' },
      { label: 'MongoDB', color: 'amber' },
    ],
  },
  {
    id: 'MOD-002',
    title: 'Interface Engineering',
    description:
      'Publisher front ends where organic search is the revenue — article pages tuned against Core Web Vitals, with multi-facet filtering and behavioural analytics built on top.',
    chips: [
      { label: 'Next.js',    color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'TypeScript', color: 'cyan' },
      { label: 'CSS',        color: 'violet' },
      { label: 'Angular',    color: 'cyan' },
    ],
  },
  {
    id: 'MOD-003',
    title: 'Cloud & Observability',
    description:
      'Lambda and DynamoDB behind scheduled exports, CloudFront and S3 in front of publisher traffic, with Grafana and Sentry watching what production actually does.',
    chips: [
      { label: 'AWS',     color: 'amber' },
      { label: 'Docker',  color: 'violet' },
      { label: 'Grafana', color: 'violet' },
      { label: 'Sentry',  color: 'violet' },
    ],
  },
]

export const roles: Role[] = [
  {
    dateRange: 'APR 2025 — SEP 2026',
    title: 'Backend Developer',
    company: 'Pickleball Inc',
    description:
      "Rebuilt the messaging platform — multi-tenant infrastructure behind every email, SMS and push the product sends: 150,000 emails and 250,000 SMS a month, worldwide, with delivery behind a provider-agnostic adapter and customer-supplied provider accounts. Shut down an SMS pumping attack — fraudsters farming termination fees on high-cost destinations — with an allowed-destinations list, registration rate limiting and IP-to-phone geolocation matching. Designed the Affiliations Rules Engine, the product's first model of how organizations relate to one another, and wired the billing paths so a club joining or leaving a hierarchy never interrupts its members' payments.",
    status: 'ARCHIVED',
    chips: [
      { label: 'Golang',  color: 'cyan'   },
      { label: 'MySQL',   color: 'cyan'   },
      { label: 'Redis',   color: 'amber'  },
      { label: 'Docker',  color: 'violet' },
      { label: 'Stripe',  color: 'violet' },
      { label: 'Grafana', color: 'violet' },
      { label: 'Sentry',  color: 'violet' },
      { label: 'AWS',     color: 'amber'  },
    ],
    metrics: [
      { label: 'MESSAGING_VOLUME',  value: '250K SMS/MO' },
      { label: 'PLATFORM_SCALE',    value: '836K USERS' },
      { label: 'LARGEST_HIERARCHY', value: '247 CLUBS' },
    ],
  },
  {
    dateRange: 'JUL 2021 — JAN 2025',
    title: 'Software Engineer',
    company: 'Glide Tech',
    description:
      "Owned client publishers' live websites — IFR (International Financing Review, LSEG's capital markets publication), MailPlus, PokerOrg and AltChar — one-to-one with each client, no account layer between. Server-rendered templates from the Glide Publishing Platform with React and Next.js front ends; raised PokerOrg from the ground up as its most senior engineer. Proved Core Web Vitals work on the sites I owned, then took it to roughly fifteen client sites across the company: deferring render-blocking third-party scripts ended 29 consecutive months of failure on MailPlus, and code splitting took AltChar's mobile home page from 2,044 requests to 63.",
    status: 'ARCHIVED',
    chips: [
      { label: 'Next.js',    color: 'cyan'   },
      { label: 'React',      color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'Node.js',    color: 'cyan'   },
      { label: 'CSS',        color: 'violet' },
      { label: 'AWS',        color: 'amber'  },
    ],
    metrics: [
      { label: 'PERFORMANCE_REMIT', value: '15 CLIENT SITES' },
      { label: 'ALTCHAR_REQUESTS',  value: '2,044 → 63' },
      { label: 'TENURE',            value: '3.5 YRS' },
    ],
  },
  {
    dateRange: 'JUL 2019 — JUL 2020',
    title: 'Intern Developer',
    company: 'Cape Ann Enterprises',
    description:
      'Built a performance-management application on the MEAN stack — MongoDB, Express, Angular and Node.js — over a twelve-month placement that ran inside my degree.',
    status: 'ARCHIVED',
    chips: [
      { label: 'MongoDB', color: 'amber'  },
      { label: 'Express', color: 'violet' },
      { label: 'Angular', color: 'cyan'   },
      { label: 'Node.js', color: 'cyan'   },
    ],
    metrics: [
      { label: 'STACK',   value: 'MEAN' },
      { label: 'CONTEXT', value: 'DURING_DEGREE' },
      { label: 'TENURE',  value: '12 MONTHS' },
    ],
  },
  {
    dateRange: 'SEP 2018 — MAR 2022',
    // The status badge now says EDUCATION, so the title no longer has to.
    title: 'Information Technology',
    company: 'IPI Academy',
    description:
      "Bachelor's degree in Information Technology, completed while working full time — the Cape Ann placement ran inside the degree, and its final year overlapped my first months at Glide.",
    status: 'EDUCATION',
    chips: [
      { label: "Bachelor's Degree",      color: 'violet' },
      { label: 'Information Technology', color: 'cyan'   },
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'PROJ-001',
    name: 'Wallet',
    description:
      "Withdrawal service that stays correct when the payment provider doesn't — holds taken under a row lock, a transactional outbox to Kafka, and a timeout stored as unknown, not failed.",
    status: 'active',
    coordinates: '[X:06, Y:15]',
    repoUrl: 'https://github.com/AmmarBerkovic/wallet',
    chips: [
      { label: 'Golang', color: 'cyan'  },
      { label: 'MySQL',  color: 'cyan'  },
      { label: 'Kafka',  color: 'amber' },
    ],
  },
  {
    id: 'PROJ-002',
    name: 'Taggz',
    description:
      'Standalone tagging and filtering engine — JWT-guarded NestJS API over Prisma and Postgres, with content-addressed file storage isolated per business.',
    status: 'active',
    coordinates: '[X:04, Y:12]',
    repoUrl: 'https://github.com/AmmarBerkovic/taggz',
    chips: [
      { label: 'NestJS',     color: 'cyan'   },
      { label: 'PostgreSQL', color: 'cyan'   },
      { label: 'Prisma',     color: 'violet' },
    ],
  },
  {
    id: 'PROJ-003',
    name: 'Portfolio Lab',
    description:
      'This site — a React 19 single-page portfolio on Vite, with scroll-reveal sections and a retro terminal HUD built from plain colocated CSS.',
    status: 'active',
    coordinates: '[X:11, Y:07]',
    repoUrl: 'https://github.com/AmmarBerkovic/portfolio-lab',
    chips: [
      { label: 'React',      color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'Vite',       color: 'violet' },
    ],
  },
  {
    id: 'PROJ-004',
    name: 'The Movie App',
    description:
      'Browses the full TMDB catalogue through a Redux-backed store — filtering, search and trailer playback held in one predictable state tree.',
    status: 'active',
    coordinates: '[X:08, Y:19]',
    repoUrl: 'https://github.com/AmmarBerkovic/The-Movie-App',
    liveUrl: 'https://the-movie-app-silk.vercel.app',
    chips: [
      { label: 'React',      color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'Redux',      color: 'violet' },
    ],
  },
  {
    id: 'PROJ-005',
    name: 'Mirror Client',
    description:
      'Server-rendered Angular workspace for continuous activity tracking — Material-driven records, filters and progress views over the Mirror API.',
    status: 'in-progress',
    coordinates: '[X:02, Y:21]',
    repoUrl: 'https://github.com/AmmarBerkovic/MirrorFE',
    chips: [
      { label: 'Angular',    color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'RxJS',       color: 'violet' },
    ],
  },
  {
    id: 'PROJ-006',
    name: 'Mirror API',
    description:
      'Express and Mongoose service behind Mirror — CRUD endpoints over MongoDB collections with query-driven filtering across records.',
    status: 'in-progress',
    coordinates: '[X:19, Y:09]',
    repoUrl: 'https://github.com/AmmarBerkovic/MirrorBE',
    chips: [
      { label: 'Node.js', color: 'cyan'   },
      { label: 'Express', color: 'violet' },
      { label: 'MongoDB', color: 'amber'  },
    ],
  },
]

export const contact: ContactInfo = {
  github:   'https://github.com/AmmarBerkovic',
  linkedin: 'https://www.linkedin.com/in/ammar-berkovic/',
  email:    'berkovicammar1@gmail.com',
}
