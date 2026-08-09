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
    name: 'Telemetry Core',
    description:
      'Real-time event processing engine with sub-100ms latency, handling 4M events/day across distributed ingestion nodes.',
    status: 'active',
    coordinates: '[X:04, Y:12]',
    repoUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'Kafka',      color: 'cyan' },
      { label: 'ClickHouse', color: 'violet' },
    ],
  },
  {
    id: 'PROJ-002',
    name: 'Signal UI',
    description:
      'Component library and design system for high-density data interfaces. Zero runtime dependencies, full TypeScript coverage.',
    status: 'active',
    coordinates: '[X:11, Y:07]',
    repoUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    chips: [
      { label: 'React',      color: 'cyan' },
      { label: 'TypeScript', color: 'cyan' },
      { label: 'CSS',        color: 'violet' },
    ],
  },
  {
    id: 'PROJ-003',
    name: 'Vault API',
    description:
      'Zero-trust authentication gateway with per-request encryption, rate limiting, and full audit trail logging.',
    status: 'in-progress',
    coordinates: '[X:08, Y:19]',
    repoUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'PostgreSQL', color: 'cyan' },
      { label: 'Redis',      color: 'amber' },
    ],
  },
  {
    id: 'PROJ-004',
    name: 'DataStream',
    description:
      'Self-hosted analytics pipeline with SQL-based transformation layer, webhook routing, and live dashboard rendering.',
    status: 'in-progress',
    coordinates: '[X:15, Y:03]',
    repoUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    chips: [
      { label: 'Python',     color: 'amber' },
      { label: 'dbt',        color: 'amber' },
      { label: 'ClickHouse', color: 'violet' },
    ],
  },
]

export const contact: ContactInfo = {
  github:   'https://github.com/AmmarBerkovic',
  linkedin: 'https://www.linkedin.com/in/ammar-berkovic-8b6422247/',
  email:    'berkovicammar1@gmail.com',
}
