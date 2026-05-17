# Portfolio SPA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build AMMAR_BERKOVIC // PORTFOLIO_V2.4 — a five-section SPA styled as a LAB_OS terminal command center using the Kinetic Lab System design tokens.

**Architecture:** Plain CSS custom properties map all design tokens from `DESIGN.md`; a single `useIntersection` hook drives scroll-triggered entry animations by toggling a `.visible` class; all placeholder content lives in `data/content.ts` for easy swapping; EmailJS handles contact form submission with no backend.

**Tech Stack:** React 19, TypeScript 6, Vite 8, plain CSS, `@emailjs/browser`, Vitest + @testing-library/react (hook + form logic tests only)

---

## File Map

| File | Role |
|---|---|
| `index.html` | Google Fonts link tags |
| `src/index.css` | CSS custom properties (all design tokens) + global resets + scrollbar + scanline |
| `src/App.css` | Layout shell (nav offset, section spacing) |
| `src/App.tsx` | Root composition — Nav + 5 section components |
| `src/hooks/useIntersection.ts` | IntersectionObserver hook → returns `[ref, isVisible]` |
| `src/data/content.ts` | All placeholder text, types, and structured data |
| `src/components/Nav.tsx` | Fixed glassmorphism nav, active-section tracking |
| `src/components/Nav.css` | Nav styles |
| `src/components/CommandCenter.tsx` | Hero section — name, title, status LEDs, CTAs |
| `src/components/CommandCenter.css` | Hero styles + glitch `@keyframes` |
| `src/components/CoreStack.tsx` | 3-domain card grid |
| `src/components/CoreStack.css` | Domain card styles |
| `src/components/ExperienceLogs.tsx` | Vertical timeline / audit log |
| `src/components/ExperienceLogs.css` | Timeline styles |
| `src/components/ActiveProjects.tsx` | 2-col project card grid |
| `src/components/ActiveProjects.css` | Project card styles + chamfered corners |
| `src/components/ContactUplink.tsx` | EmailJS form + sidebar links |
| `src/components/ContactUplink.css` | Form styles + bracket corners |
| `src/test-setup.ts` | Vitest global setup (`@testing-library/jest-dom`) |

---

## Task 1: Foundation — Google Fonts, CSS design tokens, global resets

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `src/App.css`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add Google Fonts to `index.html`**

Replace the `<head>` section so it reads:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <title>AMMAR_BERKOVIC // PORTFOLIO_V2.4</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace `src/index.css` with design tokens + global resets**

```css
:root {
  /* Colors */
  --color-bg:             #0b1326;
  --color-surface:        #171f33;
  --color-surface-high:   #222a3d;
  --color-border:         rgba(148, 163, 184, 0.2);
  --color-border-hover:   rgba(34, 211, 238, 0.6);
  --color-cyan:           #22d3ee;
  --color-amber:          #fbbf24;
  --color-violet:         #a78bfa;
  --color-green:          #4ade80;
  --color-red:            #f87171;
  --color-text:           #dae2fd;
  --color-text-muted:     #c3c7ca;

  /* Typography */
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;

  /* Spacing */
  --space-unit:       4px;
  --gutter:           24px;
  --margin-edge:      40px;
  --container-max:    1280px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Scanline overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: #94a3b8; }
::-webkit-scrollbar-thumb:hover { background: var(--color-cyan); }

/* Shared chip styles */
.chip {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border: 1px solid currentColor;
  text-transform: uppercase;
}
.chip--cyan   { color: var(--color-cyan);   background: rgba(34, 211, 238, 0.08); }
.chip--amber  { color: var(--color-amber);  background: rgba(251, 191, 36, 0.08); }
.chip--violet { color: var(--color-violet); background: rgba(167, 139, 250, 0.08); }

/* Shared section heading */
.section-label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-cyan);
  margin-bottom: 8px;
}

/* Shared terminal card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(34, 211, 238, 0.02);
}
.card-header__id {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  flex: 1;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot--green  { background: var(--color-green);  box-shadow: 0 0 6px var(--color-green); }
.status-dot--cyan   { background: var(--color-cyan);   box-shadow: 0 0 6px var(--color-cyan); }
.status-dot--amber  { background: var(--color-amber);  box-shadow: 0 0 6px var(--color-amber); }

@keyframes status-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* Shared ghost button */
.btn-ghost {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s;
  text-decoration: none;
  display: inline-block;
}
.btn-ghost:hover {
  color: var(--color-cyan);
  border-color: var(--color-border-hover);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.2);
}

/* Shared primary button */
.btn-primary {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000;
  background: var(--color-cyan);
  border: 1px solid var(--color-cyan);
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  text-decoration: none;
  display: inline-block;
}
.btn-primary:hover {
  background: #67e8f9;
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.4);
}

/* Entry animation base */
.animate-entry {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.animate-entry.visible {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 3: Clear `src/App.css` to layout shell only**

```css
main {
  padding-top: 64px;
}

.section-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 80px var(--margin-edge);
}

section {
  border-bottom: 1px solid var(--color-border);
}

section:last-child {
  border-bottom: none;
}
```

- [ ] **Step 4: Replace `src/App.tsx` with minimal shell**

```tsx
import './App.css'

function App() {
  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, background: 'var(--color-surface)', zIndex: 100 }} />
      <main>
        <section id="command-center"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>COMMAND_CENTER</p></div></section>
        <section id="core-stack"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CORE_STACK</p></div></section>
        <section id="experience-logs"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>EXPERIENCE_LOGS</p></div></section>
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 5: Run dev server and verify visually**

```
npm run dev
```

Expected: Dark navy background (`#0b1326`), JetBrains Mono renders in the section labels, scanlines faintly visible, thin cyan scrollbar.

- [ ] **Step 6: Commit**

```
git add index.html src/index.css src/App.css src/App.tsx
git commit -m "feat: add design tokens, global CSS, and app shell"
```

---

## Task 2: Vitest setup + useIntersection hook (TDD)

**Files:**
- Modify: `vite.config.ts`
- Create: `src/test-setup.ts`
- Create: `src/hooks/useIntersection.ts`
- Create: `src/hooks/useIntersection.test.ts`

- [ ] **Step 1: Install test dependencies**

```
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Update `vite.config.ts` to add Vitest config**

```ts
import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

- [ ] **Step 3: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add `test` script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write the failing test — create `src/hooks/useIntersection.test.ts`**

```ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIntersection } from './useIntersection'

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
let triggerIntersection: (isIntersecting: boolean) => void

beforeEach(() => {
  mockObserve.mockReset()
  mockDisconnect.mockReset()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((cb: IntersectionObserverCallback) => {
      triggerIntersection = (isIntersecting) =>
        cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
      return { observe: mockObserve, disconnect: mockDisconnect }
    }),
  )
})

describe('useIntersection', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useIntersection())
    expect(result.current[1]).toBe(false)
  })

  it('returns true when element intersects', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    expect(result.current[1]).toBe(true)
  })

  it('stays true after element leaves viewport', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    act(() => triggerIntersection(false))
    expect(result.current[1]).toBe(true)
  })

  it('disconnects the observer after first intersection', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    expect(mockDisconnect).toHaveBeenCalledOnce()
    void result.current
  })
})
```

- [ ] **Step 6: Run test — verify it fails**

```
npm test
```

Expected: FAIL — `Cannot find module './useIntersection'`

- [ ] **Step 7: Create `src/hooks/useIntersection.ts`**

```ts
import { useEffect, useRef, useState } from 'react'

export function useIntersection<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}
```

- [ ] **Step 8: Run test — verify it passes**

```
npm test
```

Expected: PASS — 4 tests passing

- [ ] **Step 9: Commit**

```
git add vite.config.ts src/test-setup.ts src/hooks/useIntersection.ts src/hooks/useIntersection.test.ts package.json
git commit -m "feat: add useIntersection hook with tests"
```

---

## Task 3: Content data layer

**Files:**
- Create: `src/data/content.ts`

- [ ] **Step 1: Create `src/data/content.ts` with all types and placeholder content**

```ts
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

export interface Role {
  dateRange: string
  title: string
  company: string
  description: string
  chips: TechChip[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  coordinates: string
  repoUrl: string
  liveUrl: string
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
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'ClickHouse', color: 'violet' },
      { label: 'Kubernetes', color: 'amber' },
    ],
  },
  {
    dateRange: '2019 — 2022',
    title: 'Full-Stack Engineer',
    company: 'Cyber Sys Inc.',
    description:
      'Built and maintained a multi-tenant SaaS platform serving 300+ enterprise clients. Owned the migration from a monolithic Rails app to a Node.js microservices architecture.',
    chips: [
      { label: 'Node.js',    color: 'cyan' },
      { label: 'PostgreSQL', color: 'cyan' },
      { label: 'React',      color: 'cyan' },
      { label: 'AWS',        color: 'amber' },
    ],
  },
  {
    dateRange: '2015 — 2019',
    title: 'Frontend Engineer',
    company: 'Axiom Labs',
    description:
      'Developed data visualization dashboards for financial analytics. Implemented a custom WebGL charting library reducing render time for 100k-point datasets from 3s to 180ms.',
    chips: [
      { label: 'JavaScript', color: 'amber' },
      { label: 'D3.js',      color: 'violet' },
      { label: 'WebGL',      color: 'violet' },
      { label: 'Python',     color: 'amber' },
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
  github:   'https://github.com/ammar',
  linkedin: 'https://linkedin.com/in/ammar',
  email:    'ammar@example.com',
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```
git add src/data/content.ts
git commit -m "feat: add content data layer with TypeScript types"
```

---

## Task 4: Nav component

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Nav.css`

- [ ] **Step 1: Create `src/components/Nav.css`**

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(23, 31, 51, 0.6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--margin-edge);
}

.nav__logo {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-text);
  text-decoration: none;
}

.nav__logo span {
  color: var(--color-cyan);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;
}

.nav__link {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;
  transition: color 0.2s;
}

.nav__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-cyan);
  box-shadow: 0 0 6px var(--color-cyan);
  transform: scaleX(0);
  transition: transform 0.2s;
}

.nav__link:hover,
.nav__link.active {
  color: var(--color-cyan);
}

.nav__link.active::after {
  transform: scaleX(1);
}

/* Hamburger */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav__hamburger span {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--color-text);
  transition: transform 0.2s, opacity 0.2s;
}

/* Mobile overlay */
.nav__overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  z-index: 99;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  list-style: none;
}

.nav__overlay .nav__link {
  font-size: 20px;
}

@media (max-width: 767px) {
  .nav__links { display: none; }
  .nav__hamburger { display: flex; }
  .nav__overlay.open { display: flex; }
}
```

- [ ] **Step 2: Create `src/components/Nav.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import './Nav.css'

const SECTION_IDS = ['command-center', 'core-stack', 'experience-logs', 'active-projects', 'contact-uplink']

export default function Nav() {
  const [activeId, setActiveId] = useState('command-center')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { threshold: 0.4 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <nav className="nav">
        <a href="#command-center" className="nav__logo">
          AMMAR<span>_BERKOVIC</span>
        </a>

        <ul className="nav__links">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={`nav__link${activeId === href.slice(1) ? ' active' : ''}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="nav__hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <ul className={`nav__overlay${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="nav__link" onClick={handleLinkClick}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
```

- [ ] **Step 3: Wire Nav into `src/App.tsx`**

```tsx
import Nav from './components/Nav'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <section id="command-center"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>COMMAND_CENTER</p></div></section>
        <section id="core-stack"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CORE_STACK</p></div></section>
        <section id="experience-logs"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>EXPERIENCE_LOGS</p></div></section>
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Run dev server and verify Nav visually**

```
npm run dev
```

Expected: Fixed glassmorphism nav at top, logo left, 5 links right. Scrolling updates the active link to cyan. On narrow viewport, links hide and hamburger appears.

- [ ] **Step 5: Commit**

```
git add src/components/Nav.tsx src/components/Nav.css src/App.tsx
git commit -m "feat: add Nav component with active-section tracking"
```

---

## Task 5: CommandCenter — Hero section

**Files:**
- Create: `src/components/CommandCenter.tsx`
- Create: `src/components/CommandCenter.css`

- [ ] **Step 1: Create `src/components/CommandCenter.css`**

```css
.command-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background:
    radial-gradient(ellipse 60% 50% at 40% 50%, rgba(22, 38, 46, 0.8) 0%, transparent 70%),
    var(--color-bg);
  position: relative;
  overflow: hidden;
}

/* Dot-grid background */
.command-center::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.command-center__inner {
  position: relative;
  z-index: 1;
}

.command-center__name {
  font-family: var(--font-mono);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
  opacity: 0;
}

.command-center__name.visible {
  animation: glitch-in 0.8s ease forwards;
}

@keyframes glitch-in {
  0%   { opacity: 0; transform: translate(-3px, 0); text-shadow: -3px 0 var(--color-cyan), 3px 0 var(--color-violet); }
  15%  { opacity: 0.7; transform: translate(3px, 0); text-shadow: 3px 0 var(--color-cyan), -3px 0 var(--color-violet); }
  30%  { opacity: 0.5; transform: translate(-2px, 1px); }
  45%  { opacity: 0.9; transform: translate(2px, -1px); }
  60%  { opacity: 0.8; transform: translate(-1px, 0); }
  75%  { opacity: 1; transform: translate(0.5px, 0); }
  100% { opacity: 1; transform: translate(0); text-shadow: 0 0 16px rgba(34, 211, 238, 0.3); }
}

.command-center__title {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-top: 12px;
}

.command-center__status {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.status-item .status-dot {
  animation: status-blink 2s ease-in-out infinite;
}

.status-item:nth-child(2) .status-dot { animation-delay: 0.4s; }
.status-item:nth-child(3) .status-dot { animation-delay: 0.8s; }

.command-center__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

@media (max-width: 767px) {
  .command-center__actions {
    flex-direction: column;
  }
  .command-center__actions .btn-primary,
  .command-center__actions .btn-ghost {
    text-align: center;
  }
}
```

- [ ] **Step 2: Create `src/components/CommandCenter.tsx`**

```tsx
import { useIntersection } from '../hooks/useIntersection'
import { hero } from '../data/content'
import './CommandCenter.css'

const STATUS_DOT_CLASS: Record<string, string> = {
  green: 'status-dot--green',
  cyan:  'status-dot--cyan',
  amber: 'status-dot--amber',
}

export default function CommandCenter() {
  const [ref, isVisible] = useIntersection<HTMLDivElement>(0.2)

  return (
    <section id="command-center" className="command-center">
      <div className="section-inner command-center__inner" ref={ref}>
        <p className="section-label">// PERSONNEL_IDENTIFICATION</p>

        <h1 className={`command-center__name${isVisible ? ' visible' : ''}`}>
          {hero.name}
        </h1>

        <p className="command-center__title">{hero.title}</p>

        <div className={`command-center__status animate-entry${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}>
          {hero.statusIndicators.map(({ label, color }) => (
            <div key={label} className="status-item">
              <span className={`status-dot ${STATUS_DOT_CLASS[color]}`} />
              {label}
            </div>
          ))}
        </div>

        <div className={`command-center__actions animate-entry${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.6s' }}>
          <a href={hero.primaryCta.href} className="btn-primary">
            {hero.primaryCta.label} &gt;&gt;
          </a>
          <a href={hero.secondaryCta.href} className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Replace the placeholder in `src/App.tsx`**

Replace the `<section id="command-center">` placeholder with:
```tsx
import CommandCenter from './components/CommandCenter'
// ... inside return:
<CommandCenter />
```

Full updated `src/App.tsx`:
```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <section id="core-stack"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CORE_STACK</p></div></section>
        <section id="experience-logs"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>EXPERIENCE_LOGS</p></div></section>
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify visually**

```
npm run dev
```

Expected: Full-viewport hero on load. Name glitch-animates in. Status LEDs blink sequentially. Two CTAs render. Dot-grid background visible.

- [ ] **Step 5: Commit**

```
git add src/components/CommandCenter.tsx src/components/CommandCenter.css src/App.tsx
git commit -m "feat: add CommandCenter hero with glitch animation"
```

---

## Task 6: CoreStack — Domain card grid

**Files:**
- Create: `src/components/CoreStack.tsx`
- Create: `src/components/CoreStack.css`

- [ ] **Step 1: Create `src/components/CoreStack.css`**

```css
.core-stack__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gutter);
  margin-top: 48px;
}

.domain-card {
  border: 1px solid var(--color-border);
  background: transparent;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.domain-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.08);
}

.domain-card__body {
  padding: 20px;
}

.domain-card__title {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text);
  margin-bottom: 12px;
}

.domain-card__desc {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.domain-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 1023px) {
  .core-stack__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 767px) {
  .core-stack__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `src/components/CoreStack.tsx`**

```tsx
import { useIntersection } from '../hooks/useIntersection'
import { domains } from '../data/content'
import './CoreStack.css'

export default function CoreStack() {
  const [ref, isVisible] = useIntersection<HTMLElement>()

  return (
    <section id="core-stack" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// ENGINEERING_DOMAINS</p>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
          Core Stack
        </h2>

        <div className="core-stack__grid">
          {domains.map((domain, i) => (
            <div
              key={domain.id}
              className={`domain-card animate-entry${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="card-header">
                <span className="card-header__id">{domain.id} // {domain.title.toUpperCase().replace(/ /g, '_')}</span>
                <span className="status-dot status-dot--green" style={{ animation: 'status-blink 2s ease-in-out infinite' }} />
              </div>
              <div className="domain-card__body">
                <h3 className="domain-card__title">{domain.title}</h3>
                <p className="domain-card__desc">{domain.description}</p>
                <div className="domain-card__chips">
                  {domain.chips.map((chip) => (
                    <span key={chip.label} className={`chip chip--${chip.color}`}>{chip.label}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add CoreStack to `src/App.tsx`**

```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <section id="experience-logs"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>EXPERIENCE_LOGS</p></div></section>
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify visually**

```
npm run dev
```

Expected: 3-col card grid below hero. Cards have terminal header with module ID + blinking green dot. Cards fade in on scroll. Hover adds cyan border glow.

- [ ] **Step 5: Commit**

```
git add src/components/CoreStack.tsx src/components/CoreStack.css src/App.tsx
git commit -m "feat: add CoreStack domain card grid"
```

---

## Task 7: ExperienceLogs — Timeline

**Files:**
- Create: `src/components/ExperienceLogs.tsx`
- Create: `src/components/ExperienceLogs.css`

- [ ] **Step 1: Create `src/components/ExperienceLogs.css`**

```css
.experience-logs__list {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 40px;
}

/* Vertical connector line */
.experience-logs__list::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(to bottom, var(--color-cyan), rgba(34, 211, 238, 0.1));
}

.role-entry {
  position: relative;
  padding: 0 0 48px 0;
}

.role-entry:last-child {
  padding-bottom: 0;
}

/* Glowing square marker */
.role-entry::before {
  content: '';
  position: absolute;
  left: -43px;
  top: 6px;
  width: 7px;
  height: 7px;
  background: var(--color-cyan);
  box-shadow: 0 0 8px var(--color-cyan);
}

.role-entry__date {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-cyan);
  margin-bottom: 8px;
}

.role-entry__title {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text);
}

.role-entry__company {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.role-entry__desc {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
  max-width: 640px;
}

.role-entry__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Slide-left entry animation override */
.role-entry.animate-entry {
  transform: translateX(-16px);
}

.role-entry.animate-entry.visible {
  transform: none;
}

@media (max-width: 767px) {
  .experience-logs__list {
    padding-left: 24px;
  }
  .role-entry::before {
    left: -27px;
  }
}
```

- [ ] **Step 2: Create `src/components/ExperienceLogs.tsx`**

```tsx
import { useIntersection } from '../hooks/useIntersection'
import { roles } from '../data/content'
import './ExperienceLogs.css'

export default function ExperienceLogs() {
  const [ref, isVisible] = useIntersection<HTMLElement>()

  return (
    <section id="experience-logs" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// SYSTEM_AUDIT_LOG</p>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
          Experience Logs
        </h2>

        <div className="experience-logs__list">
          {roles.map((role, i) => (
            <div
              key={role.company}
              className={`role-entry animate-entry${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <p className="role-entry__date">{role.dateRange}</p>
              <h3 className="role-entry__title">{role.title}</h3>
              <p className="role-entry__company">// {role.company}</p>
              <p className="role-entry__desc">{role.description}</p>
              <div className="role-entry__chips">
                {role.chips.map((chip) => (
                  <span key={chip.label} className={`chip chip--${chip.color}`}>{chip.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add ExperienceLogs to `src/App.tsx`**

```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <ExperienceLogs />
        <section id="active-projects"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>ACTIVE_PROJECTS</p></div></section>
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify visually**

```
npm run dev
```

Expected: Vertical timeline with cyan connector line and glowing square markers. Entries slide in from the left on scroll. Date ranges in cyan, role/company in mono.

- [ ] **Step 5: Commit**

```
git add src/components/ExperienceLogs.tsx src/components/ExperienceLogs.css src/App.tsx
git commit -m "feat: add ExperienceLogs timeline section"
```

---

## Task 8: ActiveProjects — Card grid

**Files:**
- Create: `src/components/ActiveProjects.tsx`
- Create: `src/components/ActiveProjects.css`

- [ ] **Step 1: Create `src/components/ActiveProjects.css`**

```css
.active-projects__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gutter);
  margin-top: 48px;
}

.project-card {
  border: 1px solid var(--color-border);
  background: transparent;
  position: relative;
  /* Chamfered top-right corner */
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  transition: border-color 0.25s, box-shadow 0.25s;
}

.project-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.08);
}

.project-card__body {
  padding: 20px;
  padding-bottom: 16px;
}

.project-card__name {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text);
  margin-bottom: 10px;
}

.project-card__desc {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.project-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
}

.project-card__coordinates {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  opacity: 0.6;
}

.project-card__actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 767px) {
  .active-projects__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `src/components/ActiveProjects.tsx`**

```tsx
import { useIntersection } from '../hooks/useIntersection'
import { projects } from '../data/content'
import './ActiveProjects.css'

const STATUS_DOT: Record<string, string> = {
  'active':      'status-dot--green',
  'in-progress': 'status-dot--amber',
}

export default function ActiveProjects() {
  const [ref, isVisible] = useIntersection<HTMLElement>()

  return (
    <section id="active-projects" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// PROJECT_ARCHIVE</p>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
          Active Projects
        </h2>

        <div className="active-projects__grid">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`project-card animate-entry${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="card-header">
                <span className="card-header__id">{project.id} // {project.name.toUpperCase().replace(/ /g, '_')}</span>
                <span className={`status-dot ${STATUS_DOT[project.status]}`} />
              </div>

              <div className="project-card__body">
                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__chips">
                  {project.chips.map((chip) => (
                    <span key={chip.label} className={`chip chip--${chip.color}`}>{chip.label}</span>
                  ))}
                </div>
              </div>

              <div className="project-card__footer">
                <span className="project-card__coordinates">{project.coordinates}</span>
                <div className="project-card__actions">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    VIEW_REPO
                  </a>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    LIVE_DEMO
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add ActiveProjects to `src/App.tsx`**

```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import ActiveProjects from './components/ActiveProjects'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <ExperienceLogs />
        <ActiveProjects />
        <section id="contact-uplink"><div className="section-inner"><p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>CONTACT_UPLINK</p></div></section>
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Verify visually**

```
npm run dev
```

Expected: 2-col project grid. Cards have chamfered top-right corner. Active status = green dot, in-progress = amber dot. Coordinate label bottom-left. Cards fade in on scroll.

- [ ] **Step 5: Commit**

```
git add src/components/ActiveProjects.tsx src/components/ActiveProjects.css src/App.tsx
git commit -m "feat: add ActiveProjects card grid with chamfered corners"
```

---

## Task 9: ContactUplink — EmailJS form

**Files:**
- Create: `.env`
- Create: `src/components/ContactUplink.tsx`
- Create: `src/components/ContactUplink.css`

**Prerequisites:** Create a free [EmailJS](https://www.emailjs.com) account, set up a service (e.g. Gmail), and create a template with variables `{{from_name}}`, `{{from_email}}`, `{{message}}`. Note your **Service ID**, **Template ID**, and **Public Key**.

- [ ] **Step 1: Install @emailjs/browser**

```
npm install @emailjs/browser
```

- [ ] **Step 2: Create `.env` with EmailJS credentials**

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Add `.env` to `.gitignore` (verify it's already there — Vite's default `.gitignore` includes it).

- [ ] **Step 3: Create `src/components/ContactUplink.css`**

```css
.contact-uplink__layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 64px;
  margin-top: 48px;
  align-items: start;
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* Bracket wrapper */
.field-wrapper {
  position: relative;
  padding: 2px;
}

.field-wrapper::before,
.field-wrapper::after,
.field-wrapper .bracket-bl,
.field-wrapper .bracket-br {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: rgba(148, 163, 184, 0.3);
  border-style: solid;
  transition: border-color 0.2s;
  pointer-events: none;
}

.field-wrapper::before { top: 0; left: 0;  border-width: 1px 0 0 1px; }
.field-wrapper::after  { top: 0; right: 0; border-width: 1px 1px 0 0; }
.field-wrapper .bracket-bl { bottom: 0; left: 0;  border-width: 0 0 1px 1px; }
.field-wrapper .bracket-br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

.field-wrapper:focus-within::before,
.field-wrapper:focus-within::after,
.field-wrapper:focus-within .bracket-bl,
.field-wrapper:focus-within .bracket-br {
  border-color: var(--color-cyan);
}

.field-input,
.field-textarea {
  width: 100%;
  background: rgba(23, 31, 51, 0.6);
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 10px 12px;
  outline: none;
  caret-color: var(--color-cyan);
  transition: border-color 0.2s;
}

.field-input:focus,
.field-textarea:focus {
  border-bottom-color: var(--color-cyan);
}

.field-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.submit-btn {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000;
  background: var(--color-cyan);
  border: 1px solid var(--color-cyan);
  padding: 14px 24px;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #67e8f9;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn--success {
  background: var(--color-green);
  border-color: var(--color-green);
  color: #000;
}

.submit-btn--error {
  background: var(--color-red);
  border-color: var(--color-red);
  color: #fff;
}

/* Sidebar */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-sidebar__heading {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.contact-link:hover {
  color: var(--color-cyan);
  border-color: var(--color-border-hover);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.1);
}

.contact-link__prefix {
  color: var(--color-cyan);
  opacity: 0.6;
}

@media (max-width: 1023px) {
  .contact-uplink__layout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Create `src/components/ContactUplink.tsx`**

```tsx
import { useState, useRef, FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { useIntersection } from '../hooks/useIntersection'
import { contact } from '../data/content'
import './ContactUplink.css'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

const BTN_LABEL: Record<SendStatus, string> = {
  idle:    'TRANSMIT_PACKET >>',
  sending: 'TRANSMITTING...',
  success: 'PACKET_DELIVERED',
  error:   'TRANSMISSION_FAILED — RETRY',
}

const BTN_CLASS: Record<SendStatus, string> = {
  idle:    '',
  sending: '',
  success: 'submit-btn--success',
  error:   'submit-btn--error',
}

export default function ContactUplink() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<SendStatus>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      setStatus('success')
      formRef.current?.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact-uplink" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// OPEN_CHANNEL</p>
        <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
          Contact Uplink
        </h2>

        <div className={`contact-uplink__layout animate-entry${isVisible ? ' visible' : ''}`}>
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="from_name">IDENTIFIER</label>
              <div className="field-wrapper">
                <input id="from_name" name="from_name" className="field-input" type="text" required autoComplete="name" />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="from_email">RELAY_ADDRESS</label>
              <div className="field-wrapper">
                <input id="from_email" name="from_email" className="field-input" type="email" required autoComplete="email" />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="message">MESSAGE_PACKET</label>
              <div className="field-wrapper">
                <textarea id="message" name="message" className="field-textarea" required />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <button
              type="submit"
              className={`submit-btn ${BTN_CLASS[status]}`}
              disabled={status === 'sending' || status === 'success'}
            >
              {BTN_LABEL[status]}
            </button>
          </form>

          <aside className="contact-sidebar">
            <p className="contact-sidebar__heading">// DIRECT_CHANNELS</p>
            <a href={contact.github} target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link__prefix">$</span> open github.com/ammar
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link__prefix">$</span> open linkedin.com/in/ammar
            </a>
            <a href={`mailto:${contact.email}`} className="contact-link">
              <span className="contact-link__prefix">$</span> send {contact.email}
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Add ContactUplink to `src/App.tsx`**

```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import ActiveProjects from './components/ActiveProjects'
import ContactUplink from './components/ContactUplink'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <ExperienceLogs />
        <ActiveProjects />
        <ContactUplink />
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 6: Verify visually**

```
npm run dev
```

Expected: Form with bracket corners on focus, cyan bottom border on active fields, full-width cyan submit button. Sidebar shows three terminal-style contact links with `$` prefix.

- [ ] **Step 7: Commit**

```
git add src/components/ContactUplink.tsx src/components/ContactUplink.css src/App.tsx
git commit -m "feat: add ContactUplink with EmailJS integration"
```

---

## Task 10: Final composition + responsive polish

**Files:**
- Modify: `src/App.tsx` (final)
- Modify: `src/index.css` (mobile type scale)
- Modify: `src/App.css` (mobile section padding)

- [ ] **Step 1: Add mobile type scale to `src/index.css`**

Append to `src/index.css`:

```css
@media (max-width: 767px) {
  .section-inner {
    padding: 60px 20px;
  }
}
```

- [ ] **Step 2: Tighten `src/App.css` section spacing on mobile**

Add to `src/App.css`:

```css
@media (max-width: 767px) {
  main {
    padding-top: 64px;
  }
}
```

- [ ] **Step 3: Verify `src/App.tsx` is the final clean version**

```tsx
import Nav from './components/Nav'
import CommandCenter from './components/CommandCenter'
import CoreStack from './components/CoreStack'
import ExperienceLogs from './components/ExperienceLogs'
import ActiveProjects from './components/ActiveProjects'
import ContactUplink from './components/ContactUplink'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
        <CommandCenter />
        <CoreStack />
        <ExperienceLogs />
        <ActiveProjects />
        <ContactUplink />
      </main>
    </>
  )
}

export default App
```

- [ ] **Step 4: Run full test suite**

```
npm test
```

Expected: All tests pass (useIntersection — 4 tests)

- [ ] **Step 5: Run TypeScript check**

```
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 6: Test on mobile viewport in browser**

```
npm run dev
```

Open DevTools → toggle device toolbar → test at 375px width. Verify:
- Nav collapses to hamburger, overlay menu opens/closes
- Hero text scales down
- CoreStack cards stack to 1 column
- ExperienceLogs timeline readable
- ActiveProjects stacks to 1 column
- ContactUplink form stacks above sidebar

- [ ] **Step 7: Final commit**

```
git add src/App.tsx src/index.css src/App.css
git commit -m "feat: responsive polish and final composition"
```

---

## EmailJS Setup (do before Task 9)

1. Go to [emailjs.com](https://www.emailjs.com) and create a free account
2. Add an **Email Service** (Gmail, Outlook, etc.) — note the **Service ID**
3. Create an **Email Template** with these variables: `{{from_name}}`, `{{from_email}}`, `{{message}}` — note the **Template ID**
4. Go to **Account → API Keys** — note the **Public Key**
5. Fill in `.env` with these three values before running Task 9
