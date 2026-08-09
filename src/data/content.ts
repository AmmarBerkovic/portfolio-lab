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
  status: 'ACTIVE' | 'ARCHIVED'
  chips: TechChip[]
  metrics: RoleMetric[]
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
  title: 'SENIOR FULL-STACK ENGINEER // LAB_OS v2.4',
  bio: 'Forging high-performance digital infrastructure. Senior developer specialized in distributed architectures and precision UI engineering.',
  statusIndicators: [
    { label: 'SYSTEMS_ONLINE',    color: 'green' },
    { label: 'AVAILABLE_FOR_HIRE', color: 'cyan' },
    { label: 'ENCRYPTION_ACTIVE', color: 'amber' },
  ] as StatusIndicator[],
  primaryCta:   { label: 'VIEW_ARCHIVE', href: '#active-projects' },
  secondaryCta: { label: 'OPEN_UPLINK',  href: '#contact-uplink' },
  cv: {
    label:    'EXPORT_CV.PDF',
    href:     '/CV.pdf',
    fileName: 'Ammar-Berkovic-CV.pdf', // what the browser saves it as
    size:     '[158KB]',               // update when replacing public/CV.pdf
  },
}

export const domains: Domain[] = [
  {
    id: 'MOD-001',
    title: 'Backend Architecture',
    description:
      'Multi-tenant services built for throughput — provider-agnostic adapters, rules engines, and reconciled billing paths.',
    chips: [
      { label: 'Golang',      color: 'cyan' },
      { label: 'PostgreSQL',  color: 'cyan' },
      { label: 'Redis',       color: 'amber' },
      { label: 'MongoDB',     color: 'amber' },
      { label: 'Node.js',     color: 'cyan' },
      { label: 'Spring Boot', color: 'cyan' },
    ],
  },
  {
    id: 'MOD-002',
    title: 'Interface Engineering',
    description:
      'Enterprise content platforms for high-traffic publishers, tuned against Core Web Vitals to convert speed into reach.',
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
      'Health monitoring, audit trails and caching strategies that hold peak-load performance — and prove it.',
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
    dateRange: 'APR 2025 — PRESENT',
    title: 'Backend Developer',
    company: 'Pickleball Inc',
    description:
      'Rebuilt the multi-tenant messaging platform behind a provider-agnostic adapter — every email, SMS and push the product sends, with per-country routing that balances cost against fraud exposure. Designed the Affiliations Rules Engine and wired the Stripe billing paths it feeds.',
    status: 'ACTIVE',
    chips: [
      { label: 'Golang',     color: 'cyan' },
      { label: 'PostgreSQL', color: 'cyan' },
      { label: 'Redis',      color: 'amber' },
      { label: 'Docker',     color: 'violet' },
      { label: 'Stripe',     color: 'violet' },
      { label: 'Grafana',    color: 'violet' },
      { label: 'Sentry',     color: 'violet' },
      { label: 'AWS',        color: 'amber' },
    ],
    metrics: [
      { label: 'DELIVERY_CHANNELS', value: 'EMAIL/SMS/PUSH' },
      { label: 'ARCHITECTURE',      value: 'MULTI-TENANT' },
      { label: 'TENURE',            value: '1.3 YRS' },
    ],
  },
  {
    dateRange: 'JUL 2021 — JAN 2025',
    title: 'Full Stack Engineer',
    company: 'Glide Tech',
    description:
      'Architected enterprise content models in CMS platforms for the London Stock Exchange, Daily Mail and Poker.org. Resolved Core Web Vitals bottlenecks across multi-tier applications and orchestrated AWS monitoring, audit trails and caching layers to hold performance at peak load.',
    status: 'ARCHIVED',
    chips: [
      { label: 'Next.js',    color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'TypeScript', color: 'cyan' },
      { label: 'CSS',        color: 'violet' },
      { label: 'AWS',        color: 'amber' },
      { label: 'Grafana',    color: 'violet' },
    ],
    metrics: [
      { label: 'ENTERPRISE_CLIENTS', value: 'LSE / DAILY MAIL' },
      { label: 'AVAILABILITY',       value: '99.9%' },
      { label: 'TENURE',             value: '3.5 YRS' },
    ],
  },
  {
    dateRange: 'JUL 2019 — JUL 2020',
    title: 'Intern Developer',
    company: 'Cape Ann Enterprises',
    description:
      'Built the technical logic for a performance-management application on the MEAN stack — MongoDB, Express, Angular and Node.js unified behind a single data-driven layer. Contributed through rapid sprint cycles from initial design through to deployment.',
    status: 'ARCHIVED',
    chips: [
      { label: 'MongoDB', color: 'amber' },
      { label: 'Express', color: 'violet' },
      { label: 'Angular', color: 'cyan' },
      { label: 'Node.js', color: 'cyan' },
    ],
    metrics: [
      { label: 'STACK',       value: 'MEAN' },
      { label: 'METHODOLOGY', value: 'AGILE' },
      { label: 'TENURE',      value: '1 YR' },
    ],
  },
  {
    dateRange: 'SEP 2018 — MAR 2022',
    title: 'Information Technology // EDUCATION',
    company: 'IPI Academy',
    description:
      'Studied the core pillars of object-oriented design, the practical implementation of fundamental data structures, and low-level operating system architecture — process management, memory allocation, and the hardware/software interface.',
    status: 'ARCHIVED',
    chips: [
      { label: 'OOP',               color: 'cyan' },
      { label: 'Data Structures',   color: 'cyan' },
      { label: 'Operating Systems', color: 'amber' },
      { label: 'Algorithms',        color: 'violet' },
    ],
    metrics: [
      { label: 'FOCUS',      value: 'SYSTEMS ARCH' },
      { label: 'DISCIPLINE', value: 'CS FUNDAMENTALS' },
      { label: 'DURATION',   value: '3.5 YRS' },
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'PROJ-001',
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
    id: 'PROJ-002',
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
    id: 'PROJ-003',
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
    id: 'PROJ-004',
    name: 'Go User API',
    description:
      'RESTful user service on a layered Go architecture — Chi routing over GORM repositories, with paginated reads and Protobuf-generated models.',
    status: 'in-progress',
    coordinates: '[X:15, Y:03]',
    repoUrl: 'https://github.com/AmmarBerkovic/Go-User-API',
    chips: [
      { label: 'Golang',   color: 'cyan'   },
      { label: 'MySQL',    color: 'cyan'   },
      { label: 'Protobuf', color: 'violet' },
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
  linkedin: 'https://www.linkedin.com/in/ammar-berkovic-8b6422247/',
  email:    'berkovicammar1@gmail.com',
}
