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
  liveUrl: string
  imageUrl?: string
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
      'Designing resilient, high-throughput server systems with a focus on distributed patterns and operational clarity.',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'PostgreSQL', color: 'cyan' },
      { label: 'Redis',      color: 'amber' },
      { label: 'Docker',     color: 'violet' },
      { label: 'GraphQL',    color: 'cyan' },
    ],
  },
  {
    id: 'MOD-002',
    title: 'Interface Engineering',
    description:
      'Building precise, performant UIs with a systems-level understanding of the browser rendering pipeline.',
    chips: [
      { label: 'React',      color: 'cyan' },
      { label: 'TypeScript', color: 'cyan' },
      { label: 'CSS',        color: 'violet' },
      { label: 'Vite',       color: 'amber' },
      { label: 'WebGL',      color: 'violet' },
    ],
  },
  {
    id: 'MOD-003',
    title: 'Data & Systems',
    description:
      'Instrumenting data pipelines and analytics infrastructure to extract signal from operational noise.',
    chips: [
      { label: 'Python',       color: 'amber' },
      { label: 'Apache Kafka', color: 'cyan' },
      { label: 'ClickHouse',   color: 'violet' },
      { label: 'dbt',          color: 'amber' },
    ],
  },
]

export const roles: Role[] = [
  {
    dateRange: '2022 — PRESENT',
    title: 'Senior Full-Stack Engineer',
    company: 'Neural Dynamics',
    description:
      'Led architecture of a real-time telemetry platform processing 4M events/day. Reduced p99 API latency from 820ms to 140ms through query optimization and strategic caching layers.',
    status: 'ACTIVE',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'ClickHouse', color: 'violet' },
      { label: 'Kubernetes', color: 'amber' },
    ],
    metrics: [
      { label: 'EVENTS/DAY',        value: '4M+' },
      { label: 'LATENCY_REDUCTION', value: '83%' },
      { label: 'TENURE',            value: '3 YRS' },
    ],
  },
  {
    dateRange: '2019 — 2022',
    title: 'Full-Stack Engineer',
    company: 'Cyber Sys Inc.',
    description:
      'Built and maintained a multi-tenant SaaS platform serving 300+ enterprise clients. Owned the migration from a monolithic Rails app to a Node.js microservices architecture.',
    status: 'ARCHIVED',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'PostgreSQL', color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'AWS',        color: 'amber' },
    ],
    metrics: [
      { label: 'ENTERPRISE_CLIENTS', value: '300+' },
      { label: 'ARCH_MIGRATION',     value: '100%' },
      { label: 'TENURE',             value: '3 YRS' },
    ],
  },
  {
    dateRange: '2015 — 2019',
    title: 'Frontend Engineer',
    company: 'Axiom Labs',
    description:
      'Developed data visualization dashboards for financial analytics. Implemented a custom WebGL charting library reducing render time for 100k-point datasets from 3s to 180ms.',
    status: 'ARCHIVED',
    chips: [
      { label: 'JavaScript', color: 'amber' },
      { label: 'D3.js',      color: 'violet' },
      { label: 'WebGL',      color: 'violet' },
      { label: 'Python',     color: 'amber' },
    ],
    metrics: [
      { label: 'RENDER_TIME_DELTA', value: '−94%' },
      { label: 'DATASET_SIZE',      value: '100K PTS' },
      { label: 'TENURE',            value: '4 YRS' },
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
