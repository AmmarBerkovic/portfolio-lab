# Experience Logs — Split Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the vertical timeline in ExperienceLogs with a full-viewport Split Terminal layout — left panel shows a role list, right panel shows the expanded detail of the active role, with click-to-switch and hover brightness effects.

**Architecture:** Single-section `100vh` layout using CSS flexbox. `activeRole` index state drives right-panel content. Role exit/enter transitions use CSS keyframe animations triggered by an `exiting` boolean state and `onAnimationEnd` callback. A `useRef` holds the pending next-role index during the exit animation so no content swap happens prematurely.

**Tech Stack:** React 19, TypeScript, Vitest + Testing Library, CSS custom properties (existing `--color-cyan`, `--font-mono`, `--font-sans`, `--color-bg`, `--color-text`, `--color-text-muted`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/data/content.ts` | Modify | Add `RoleMetric` interface + `metrics[]` to `Role`, populate all three roles |
| `src/components/ExperienceLogs.tsx` | Rewrite | Split terminal JSX, `activeRole` / `exiting` state, transition logic |
| `src/components/ExperienceLogs.css` | Rewrite | 100vh layout, left/right panels, hover effect, scan-line, corners, mobile |
| `src/components/ExperienceLogs.test.tsx` | Create | Render, default active role, click interaction, metrics display |

---

## Task 1: Add `RoleMetric` type and `metrics` data to `content.ts`

**Files:**
- Modify: `src/data/content.ts`

- [ ] **Step 1: Add `RoleMetric` interface and update `Role`**

Open `src/data/content.ts`. After the existing `Role` interface, insert `RoleMetric` and add `metrics` to `Role`:

```ts
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
```

- [ ] **Step 2: Populate `metrics` on each role in `roles[]`**

Replace the existing `roles` array with:

```ts
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/content.ts
git commit -m "feat: add RoleMetric type and metrics data to roles"
```

---

## Task 2: Write failing tests for ExperienceLogs

**Files:**
- Create: `src/components/ExperienceLogs.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceLogs from './ExperienceLogs'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

describe('ExperienceLogs', () => {
  test('renders section audit label', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(/SYSTEM_AUDIT_LOG/)).toBeInTheDocument()
  })

  test('renders all three role entries in the left panel', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText('Senior Full-Stack Engineer')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
  })

  test('first role is active by default — its title appears in the detail panel', () => {
    render(<ExperienceLogs />)
    // The right panel shows the large role title
    const headings = screen.getAllByText('Senior Full-Stack Engineer')
    // One in the left list, one as the large heading in the detail panel
    expect(headings.length).toBeGreaterThanOrEqual(2)
  })

  test('clicking a role entry changes the active detail content', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const frontendBtn = screen.getByRole('button', { name: /Frontend Engineer/ })
    await user.click(frontendBtn)

    // After click + animation, Axiom Labs content should be visible
    expect(await screen.findByText(/Axiom Labs/, { selector: '.experience-logs__role-company' })).toBeInTheDocument()
  })

  test('metrics for the active role are displayed', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText('4M+')).toBeInTheDocument()
    expect(screen.getByText('83%')).toBeInTheDocument()
    expect(screen.getByText('3 YRS')).toBeInTheDocument()
  })

  test('clicking same role twice does not break state', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const srBtn = screen.getByRole('button', { name: /Senior Full-Stack Engineer/ })
    await user.click(srBtn)
    await user.click(srBtn)

    // Should still show first role
    expect(screen.getByText('4M+')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Install `@testing-library/user-event` if not present**

```bash
npm ls @testing-library/user-event
```

If not listed, run:
```bash
npm install --save-dev @testing-library/user-event
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npx vitest run src/components/ExperienceLogs.test.tsx
```

Expected: tests fail (component doesn't have the new structure yet). If they pass, the component already has matching markup — re-read the current TSX before proceeding.

---

## Task 3: Rewrite `ExperienceLogs.tsx`

**Files:**
- Modify: `src/components/ExperienceLogs.tsx`

- [ ] **Step 1: Replace the entire file contents**

```tsx
import { useState, useRef } from 'react'
import { useIntersection } from '../hooks/useIntersection'
import { roles } from '../data/content'
import './ExperienceLogs.css'

export default function ExperienceLogs() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const [activeRole, setActiveRole] = useState(0)
  const [exiting, setExiting] = useState(false)
  const nextRole = useRef(0)

  function handleRoleSelect(index: number) {
    if (index === activeRole || exiting) return
    nextRole.current = index
    setExiting(true)
  }

  function handleExitEnd() {
    setActiveRole(nextRole.current)
    setExiting(false)
  }

  const role = roles[activeRole]

  return (
    <section
      id="experience-logs"
      ref={ref}
      className={`experience-logs${isVisible ? ' experience-logs--visible' : ''}`}
    >
      <div className="experience-logs__grid">

        {/* ── Left panel ── */}
        <div className="experience-logs__left">
          <div className="experience-logs__left-header">
            <span>// SYSTEM_AUDIT_LOG</span>
            <span>{roles.length} ENTRIES</span>
          </div>

          <div className="experience-logs__list">
            <div className="experience-logs__connector" aria-hidden="true" />
            {roles.map((r, i) => (
              <button
                key={`${r.company}-${r.dateRange}`}
                className={`role-entry${i === activeRole ? ' role-entry--active' : ''}`}
                onClick={() => handleRoleSelect(i)}
                aria-pressed={i === activeRole}
              >
                <span className="role-entry__marker" aria-hidden="true" />
                <span className="role-entry__meta">
                  <span className="role-entry__date">{r.dateRange}</span>
                  <span className="role-entry__title">{r.title}</span>
                  <span className="role-entry__company">// {r.company}</span>
                </span>
                <span className={`role-entry__badge role-entry__badge--${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </button>
            ))}
          </div>

          <div className="experience-logs__left-footer">CLICK_ENTRY_TO_EXPAND</div>
        </div>

        {/* ── Right panel ── */}
        <div className="experience-logs__right">
          <div className="experience-logs__right-header">
            <div>
              <span className="experience-logs__proto">PERSONNEL_RECORD_SYS v2.4</span>
              <span className="experience-logs__record-id">
                LOG-00{activeRole + 1} // RECORD_{role.status}
              </span>
            </div>
            <div className="experience-logs__live">
              <span className="experience-logs__live-dot" aria-hidden="true" />
              LIVE_VIEW
            </div>
          </div>

          <div
            key={activeRole}
            className={`experience-logs__detail${exiting ? ' experience-logs__detail--exiting' : ''}`}
            onAnimationEnd={exiting ? handleExitEnd : undefined}
          >
            <span className="experience-logs__ghost-id" aria-hidden="true">
              00{activeRole + 1}
            </span>

            <p className="experience-logs__role-date">{role.dateRange}</p>
            <h2 className="experience-logs__role-title">{role.title}</h2>
            <p className="experience-logs__role-company">// {role.company}</p>
            <p className="experience-logs__role-desc">{role.description}</p>

            <div className="experience-logs__chips">
              {role.chips.map((chip) => (
                <span key={chip.label} className={`chip chip--${chip.color}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div className="experience-logs__right-footer">
            <div className="experience-logs__metrics">
              {role.metrics.map((m) => (
                <div key={m.label} className="experience-logs__metric">
                  <span className="experience-logs__metric-label">{m.label}</span>
                  <span className="experience-logs__metric-value">{m.value}</span>
                </div>
              ))}
            </div>
            <span className="experience-logs__nav-hint">← → NAVIGATE_RECORDS</span>
          </div>

          {/* HUD corners */}
          <span className="experience-logs__corner experience-logs__corner--tl" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--tr" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--bl" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--br" aria-hidden="true" />

          <div className="experience-logs__scan-line" aria-hidden="true" />
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run the tests**

```bash
npx vitest run src/components/ExperienceLogs.test.tsx
```

Expected: all 6 tests pass. If a test fails, read its error and fix the JSX — do not modify the test.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperienceLogs.tsx src/components/ExperienceLogs.test.tsx
git commit -m "feat: rewrite ExperienceLogs with split terminal layout and click interaction"
```

---

## Task 4: Rewrite `ExperienceLogs.css`

**Files:**
- Modify: `src/components/ExperienceLogs.css`

- [ ] **Step 1: Replace the entire file contents**

```css
/* ── Section shell ── */
#experience-logs {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 60% at 80% 40%, rgba(22, 38, 46, 0.85) 0%, transparent 70%),
    var(--color-bg);
}

#experience-logs::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

.experience-logs__grid {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════
   LEFT PANEL
══════════════════════════════════ */
.experience-logs__left {
  width: 38%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(34, 211, 238, 0.15);
}

.experience-logs__left-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.12);
  background: rgba(34, 211, 238, 0.04);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.experience-logs__left-header span:first-child {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--color-cyan);
}

.experience-logs__left-header span:last-child {
  font-size: 9px;
  color: var(--color-text-muted);
  opacity: 0.5;
}

.experience-logs__list {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.experience-logs__connector {
  position: absolute;
  left: 42px;
  top: 24px;
  bottom: 24px;
  width: 1px;
  background: linear-gradient(to bottom, var(--color-cyan), rgba(34, 211, 238, 0.04));
  pointer-events: none;
}

/* Role entry buttons */
.role-entry {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 28px;
  border: none;
  border-bottom: 1px solid rgba(30, 41, 59, 0.8);
  border-left: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: var(--font-mono);
  color: inherit;
  opacity: 0.45;
  transition: filter 0.15s ease, background 0.15s ease, border-left-color 0.15s ease, opacity 0.15s ease;
}

.role-entry:hover:not(.role-entry--active) {
  filter: brightness(1.4);
  background: rgba(34, 211, 238, 0.04);
  border-left-color: rgba(34, 211, 238, 0.3);
}

.role-entry--active {
  opacity: 1;
  border-left-color: var(--color-cyan);
  background: rgba(34, 211, 238, 0.06);
  cursor: default;
}

.role-entry__marker {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  background: var(--color-text-muted);
  margin-top: 4px;
  transition: background 0.15s, box-shadow 0.15s;
}

.role-entry--active .role-entry__marker {
  background: var(--color-cyan);
  box-shadow: 0 0 8px var(--color-cyan);
}

.role-entry__meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.role-entry__date {
  font-size: 8px;
  letter-spacing: 2px;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.role-entry--active .role-entry__date {
  color: var(--color-cyan);
}

.role-entry__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-entry--active .role-entry__title {
  color: var(--color-text);
}

.role-entry__company {
  font-size: 9px;
  color: var(--color-text-muted);
  opacity: 0.5;
}

.role-entry__badge {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 3px;
  font-size: 7px;
  letter-spacing: 1px;
  padding: 2px 7px;
  border: 1px solid rgba(51, 65, 85, 0.5);
  color: var(--color-text-muted);
  opacity: 0.5;
}

.role-entry--active .role-entry__badge--active {
  border-color: rgba(34, 211, 238, 0.4);
  color: var(--color-cyan);
  opacity: 1;
}

.experience-logs__left-footer {
  padding: 12px 28px;
  border-top: 1px solid rgba(30, 41, 59, 0.8);
  font-family: var(--font-mono);
  font-size: 7px;
  letter-spacing: 2px;
  color: rgba(71, 85, 105, 0.4);
  flex-shrink: 0;
}

/* ══════════════════════════════════
   RIGHT PANEL
══════════════════════════════════ */
.experience-logs__right {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.experience-logs__right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.12);
  background: rgba(34, 211, 238, 0.03);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.experience-logs__right-header > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.experience-logs__proto {
  font-size: 8px;
  letter-spacing: 2px;
  color: rgba(34, 211, 238, 0.45);
}

.experience-logs__record-id {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--color-cyan);
}

.experience-logs__live {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 2px;
  color: var(--color-cyan);
}

.experience-logs__live-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-cyan);
  animation: live-pulse 1.5s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Detail area — animated on mount and exit */
.experience-logs__detail {
  flex: 1;
  padding: 52px 56px 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: detail-enter 0.2s ease both;
}

.experience-logs__detail--exiting {
  animation: detail-exit 0.1s ease forwards;
}

@keyframes detail-enter {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes detail-exit {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(8px); }
}

/* Ghost log number */
.experience-logs__ghost-id {
  position: absolute;
  right: -20px;
  top: -10px;
  font-family: var(--font-mono);
  font-size: 210px;
  font-weight: 900;
  color: var(--color-cyan);
  opacity: 0.03;
  letter-spacing: -8px;
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

.experience-logs__role-date {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--color-cyan);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.experience-logs__role-title {
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.12;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.experience-logs__role-company {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

.experience-logs__role-desc {
  font-family: var(--font-sans);
  font-size: 14px;
  color: rgba(148, 163, 184, 0.85);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 28px;
}

.experience-logs__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Metrics footer */
.experience-logs__right-footer {
  padding: 16px 40px;
  border-top: 1px solid rgba(30, 41, 59, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.experience-logs__metrics {
  display: flex;
  gap: 32px;
}

.experience-logs__metric {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.experience-logs__metric-label {
  font-size: 7px;
  letter-spacing: 2px;
  color: rgba(51, 65, 85, 0.7);
  text-transform: uppercase;
}

.experience-logs__metric-value {
  font-size: 11px;
  color: var(--color-cyan);
}

.experience-logs__nav-hint {
  font-size: 8px;
  letter-spacing: 1px;
  color: rgba(51, 65, 85, 0.5);
}

/* HUD corner brackets */
.experience-logs__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
}

.experience-logs__corner--tl {
  top: 0;
  left: 0;
  border-top: 1px solid var(--color-cyan);
  border-left: 1px solid var(--color-cyan);
}

.experience-logs__corner--tr {
  top: 0;
  right: 0;
  border-top: 1px solid var(--color-cyan);
  border-right: 1px solid var(--color-cyan);
}

.experience-logs__corner--bl {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid var(--color-cyan);
  border-left: 1px solid var(--color-cyan);
}

.experience-logs__corner--br {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid var(--color-cyan);
  border-right: 1px solid var(--color-cyan);
}

/* Scan line */
.experience-logs__scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.35), transparent);
  animation: scan-sweep 4s linear infinite;
  pointer-events: none;
}

@keyframes scan-sweep {
  0%   { top: 0%;   opacity: 0; }
  5%   { opacity: 1; }
  95%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* ══════════════════════════════════
   MOBILE  (max-width: 767px)
══════════════════════════════════ */
@media (max-width: 767px) {
  #experience-logs {
    height: auto;
    min-height: 100svh;
  }

  .experience-logs__grid {
    flex-direction: column;
  }

  .experience-logs__left {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  }

  .experience-logs__list {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .experience-logs__list::-webkit-scrollbar {
    display: none;
  }

  .experience-logs__connector {
    display: none;
  }

  .role-entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 14px 20px;
    border-bottom: none;
    border-left: none;
    border-bottom: 2px solid transparent;
    flex-shrink: 0;
    white-space: nowrap;
    opacity: 0.5;
  }

  .role-entry--active {
    border-left-color: transparent;
    border-bottom-color: var(--color-cyan);
    background: rgba(34, 211, 238, 0.04);
    opacity: 1;
  }

  .role-entry__badge,
  .role-entry__company,
  .role-entry__marker {
    display: none;
  }

  .experience-logs__left-footer {
    display: none;
  }

  .experience-logs__detail {
    padding: 32px 28px 24px;
    justify-content: flex-start;
  }

  .experience-logs__role-title {
    font-size: 22px;
  }

  .experience-logs__ghost-id {
    font-size: 120px;
  }

  .experience-logs__metrics {
    gap: 20px;
    flex-wrap: wrap;
  }

  .experience-logs__right-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 28px;
  }

  .experience-logs__nav-hint {
    display: none;
  }
}
```

- [ ] **Step 2: Run all tests to confirm nothing is broken**

```bash
npx vitest run
```

Expected: all tests pass. If `CommandCenter` tests fail unrelated to this task, investigate before proceeding.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperienceLogs.css
git commit -m "feat: full-viewport split terminal styles for experience logs"
```

---

## Task 5: Verify in browser

**Files:** none

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open the app and navigate to the experience section**

Open `http://localhost:5173` (or whatever port Vite prints). Scroll to the Experience Logs section (nav link: `LOGS`).

- [ ] **Step 3: Check the golden path**

Verify each of the following:

| Check | Expected |
|---|---|
| Section fills viewport | No overflow above/below the section boundary |
| Left panel shows 3 entries | Neural Dynamics active (glowing marker), other two dimmed |
| Hover inactive entry | Entry visibly brightens, left border brightens — no layout shift |
| Click "Full-Stack Engineer" | Right panel fades out → slides right → fades in with Cyber Sys content |
| Metrics update | Footer shows `300+`, `100%`, `3 YRS` after switching |
| Click "Frontend Engineer" | Right panel transitions to Axiom Labs content |
| Ghost number | Large `002`/`003` barely visible in the background |
| Scan line | Thin cyan line sweeps top→bottom on the right panel every ~4s |
| Corner brackets | Visible on right panel corners |
| Record ID in header | Updates to `LOG-002`, `LOG-003` as you switch |

- [ ] **Step 4: Check mobile**

Resize the browser to < 768px width. Verify:
- Role list becomes a horizontal scroll row at the top
- Active role has a cyan underline instead of left border
- Detail content fills the remaining height
- Metrics wrap if needed

- [ ] **Step 5: Final test run**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: experience logs split terminal — complete"
```
