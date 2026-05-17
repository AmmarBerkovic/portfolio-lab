# Design Polish — Gap Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close 5 visual gaps between the DESIGN.md spec and the current UI — hero two-column layout with HUD profile frame, radial gradient section backgrounds, domain card chamfered corners, card inner glow, and technical grid overlays.

**Architecture:** All changes are CSS/layout only — no logic, state, or data changes. The hero section gains a two-column grid layout with a new right-column frame component. The four non-hero sections each get a radial gradient background and a `::before` grid overlay. Domain cards and project cards gain chamfered corners (domain only — project cards already have them) and an inset luminescence glow.

**Tech Stack:** React 19, TypeScript, CSS custom properties, Vitest + @testing-library/react

---

## File Map

| File | Change |
|------|--------|
| `src/components/CommandCenter.tsx` | Add `heroImg` import; wrap existing content in `.command-center__left`; add `.command-center__right` with frame markup |
| `src/components/CommandCenter.css` | Extend `.command-center__inner` to 2-col grid; add 12 new rules for frame, photo, scanlines, coords, status bar; extend mobile breakpoint |
| `src/App.css` | Add `position: relative` to `section`; add `position: relative; z-index: 1` to `.section-inner` |
| `src/components/CoreStack.css` | Add `#core-stack` gradient + `::before` grid overlay; extend `.domain-card` with chamfer + inner glow; extend `.domain-card:hover` with merged shadow |
| `src/components/ExperienceLogs.css` | Add `#experience-logs` gradient + `::before` grid overlay |
| `src/components/ActiveProjects.css` | Add `#active-projects` gradient + `::before` grid overlay; extend `.project-card` with inner glow; extend `.project-card:hover` with merged shadow |
| `src/components/ContactUplink.css` | Add `#contact-uplink` gradient + `::before` grid overlay |
| `src/components/CommandCenter.test.tsx` | New — three rendering assertions for frame, photo, coords |

---

## Task 1: Write failing test for CommandCenter frame

**Files:**
- Create: `src/components/CommandCenter.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommandCenter from './CommandCenter'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

describe('CommandCenter', () => {
  test('renders HUD frame photo', () => {
    render(<CommandCenter />)
    const img = screen.getByAltText('Ammar Berkovic')
    expect(img).toBeInTheDocument()
    expect(img).toHaveClass('command-center__photo')
  })

  test('renders top-left coordinate label', () => {
    render(<CommandCenter />)
    expect(screen.getByText('PERS_ID: ABK-001')).toBeInTheDocument()
  })

  test('renders frame status bar', () => {
    render(<CommandCenter />)
    expect(screen.getByText(/IDENTITY_VERIFIED/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — confirm it FAILS**

```
npm test
```

Expected output: 3 failing tests — `Unable to find an element with the alt text: Ammar Berkovic`

---

## Task 2: Implement CommandCenter two-column layout

**Files:**
- Modify: `src/components/CommandCenter.tsx`
- Modify: `src/components/CommandCenter.css`

- [ ] **Step 1: Update CommandCenter.tsx**

Replace the entire file with:

```tsx
import heroImg from '../assets/hero.png'
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
        <div className="command-center__left">
          <p className="section-label">// PERSONNEL_IDENTIFICATION</p>

          <h1 className={`command-center__name${isVisible ? ' visible' : ''}`}>
            {hero.name}
          </h1>

          <p className="command-center__title">{hero.title}</p>

          <div
            className={`command-center__status animate-entry${isVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            {hero.statusIndicators.map(({ label, color }) => (
              <div key={label} className="status-item">
                <span className={`status-dot ${STATUS_DOT_CLASS[color]}`} />
                {label}
              </div>
            ))}
          </div>

          <div
            className={`command-center__actions animate-entry${isVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.6s' }}
          >
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label} &gt;&gt;
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="command-center__right">
          <div className="command-center__frame">
            <div className="command-center__frame-inner">
              <img
                src={heroImg}
                alt="Ammar Berkovic"
                className="command-center__photo"
              />
              <div className="command-center__scanlines" />
              <span className="command-center__coord command-center__coord--tl">
                PERS_ID: ABK-001
              </span>
              <span className="command-center__coord command-center__coord--br">
                [X:04, Y:12]
              </span>
            </div>
            <div className="command-center__frame-status">
              <span className="command-center__frame-label">▪ IDENTITY_VERIFIED</span>
              <span className="command-center__frame-id">SYS // 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update CommandCenter.css**

Find the existing `.command-center__inner` rule (currently `position: relative; z-index: 1;`) and replace it with:

```css
.command-center__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
```

Then append the following new rules at the end of the file (before any existing `@media` blocks):

```css
.command-center__right {
  display: flex;
  justify-content: center;
}

.command-center__frame {
  width: 100%;
  max-width: 320px;
}

.command-center__frame-inner {
  position: relative;
  border: 1px solid rgba(34, 211, 238, 0.35);
  clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px);
  overflow: hidden;
  background: rgba(34, 211, 238, 0.03);
}

.command-center__photo {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
  filter: grayscale(15%) contrast(1.05);
  opacity: 0.92;
}

.command-center__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.08) 3px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
}

.command-center__coord {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.08em;
  color: rgba(34, 211, 238, 0.7);
  background: rgba(11, 19, 38, 0.7);
  padding: 2px 5px;
  pointer-events: none;
}

.command-center__coord--tl { top: 8px;    left: 22px; }
.command-center__coord--br { bottom: 8px; right: 8px;  }

.command-center__frame-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  border-top: none;
}

.command-center__frame-label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-cyan);
}

.command-center__frame-id {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.08em;
  color: rgba(195, 199, 202, 0.6);
}
```

Then find the existing `@media (max-width: 767px)` block and add two rules inside it:

```css
@media (max-width: 767px) {
  /* existing rules stay unchanged */
  .command-center__actions { flex-direction: column; }
  .command-center__actions .btn-primary,
  .command-center__actions .btn-ghost { text-align: center; }

  /* add these: */
  .command-center__inner { grid-template-columns: 1fr; }
  .command-center__right { display: none; }
}
```

- [ ] **Step 3: Run test — confirm all 3 pass**

```
npm test
```

Expected: 3 passing, 0 failing

- [ ] **Step 4: Visual check — start dev server**

```
npm run dev
```

Open `http://localhost:5173`. Verify:
- Hero shows two columns: text left, photo right
- Frame has chamfered top-left corner
- Coordinate labels visible in frame corners
- Status bar `▪ IDENTITY_VERIFIED` sits below frame
- Scan-line overlay subtle but present on photo
- On mobile viewport (≤767px) right panel is hidden, layout single-column

- [ ] **Step 5: Commit**

```
git add src/components/CommandCenter.tsx src/components/CommandCenter.css src/components/CommandCenter.test.tsx
git commit -m "feat: add two-column hero layout with HUD profile frame"
```

---

## Task 3: Global section positioning foundation

**Files:**
- Modify: `src/App.css`

This is a prerequisite for all `::before` grid overlays in Tasks 4–6.

- [ ] **Step 1: Update App.css**

Find the `section` rule and add `position: relative`:

```css
section {
  border-bottom: 1px solid var(--color-border);
  position: relative;
}
```

Find the `.section-inner` rule and add `position: relative; z-index: 1`:

```css
.section-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 80px var(--margin-edge);
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 2: Visual check**

```
npm run dev
```

Verify no visual regressions — sections should look identical to before (no grid yet, just positioning set up).

- [ ] **Step 3: Commit**

```
git add src/App.css
git commit -m "feat: add section positioning for grid overlay support"
```

---

## Task 4: CoreStack — gradient, domain card chamfer + inner glow, grid overlay

**Files:**
- Modify: `src/components/CoreStack.css`

- [ ] **Step 1: Update CoreStack.css**

Prepend the following at the top of the file (before the existing `.core-stack__grid` rule):

```css
#core-stack {
  background:
    radial-gradient(ellipse 70% 60% at 20% 50%, rgba(22, 38, 46, 0.85) 0%, transparent 70%),
    var(--color-bg);
}

#core-stack::before {
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
```

Find the existing `.domain-card` rule and replace it with:

```css
.domain-card {
  border: 1px solid var(--color-border);
  background: transparent;
  transition: border-color 0.25s, box-shadow 0.25s;
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06);
}
```

Find the existing `.domain-card:hover` rule and replace it with:

```css
.domain-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06), 0 0 20px rgba(34, 211, 238, 0.08);
}
```

- [ ] **Step 2: Visual check**

```
npm run dev
```

Scroll to Core Stack section. Verify:
- Section has a faint teal radial glow from the left
- Subtle grid lines are visible in the background
- All 3 domain cards have a chamfered top-right corner
- Cards have a faint inset glow at rest; glow + border intensify on hover

- [ ] **Step 3: Commit**

```
git add src/components/CoreStack.css
git commit -m "feat: add gradient, chamfer, inner glow and grid overlay to CoreStack"
```

---

## Task 5: ExperienceLogs + ContactUplink — gradient + grid overlay

**Files:**
- Modify: `src/components/ExperienceLogs.css`
- Modify: `src/components/ContactUplink.css`

- [ ] **Step 1: Update ExperienceLogs.css**

Prepend at the top of the file (before the existing `.experience-logs__list` rule):

```css
#experience-logs {
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
```

- [ ] **Step 2: Update ContactUplink.css**

Prepend at the top of the file (before the existing `.contact-uplink__layout` rule):

```css
#contact-uplink {
  background:
    radial-gradient(ellipse 70% 60% at 70% 50%, rgba(22, 38, 46, 0.85) 0%, transparent 70%),
    var(--color-bg);
}

#contact-uplink::before {
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
```

- [ ] **Step 3: Visual check**

```
npm run dev
```

Scroll through Experience Logs and Contact Uplink sections. Verify:
- Each section has a faint radial glow from the side opposite the previous section (creating visual rhythm)
- Grid lines visible in the background behind content
- Timeline connector line and form elements remain fully visible and unaffected

- [ ] **Step 4: Commit**

```
git add src/components/ExperienceLogs.css src/components/ContactUplink.css
git commit -m "feat: add gradient and grid overlay to ExperienceLogs and ContactUplink"
```

---

## Task 6: ActiveProjects — gradient, project card inner glow, grid overlay

**Files:**
- Modify: `src/components/ActiveProjects.css`

- [ ] **Step 1: Update ActiveProjects.css**

Prepend at the top of the file (before the existing `.active-projects__grid` rule):

```css
#active-projects {
  background:
    radial-gradient(ellipse 70% 60% at 30% 60%, rgba(22, 38, 46, 0.85) 0%, transparent 70%),
    var(--color-bg);
}

#active-projects::before {
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
```

Find the existing `.project-card` rule and replace it with:

```css
.project-card {
  border: 1px solid var(--color-border);
  background: transparent;
  position: relative;
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06);
}
```

Find the existing `.project-card:hover` rule and replace it with:

```css
.project-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06), 0 0 20px rgba(34, 211, 238, 0.08);
}
```

- [ ] **Step 2: Visual check**

```
npm run dev
```

Scroll to Active Projects section. Verify:
- Section has radial glow from the left
- Grid lines visible behind the project cards
- Project cards show inset glow at rest; combined inner + outer glow on hover
- Chamfered top-right corner unchanged (was already present)

- [ ] **Step 3: Run full test suite**

```
npm test
```

Expected: all tests pass (3 CommandCenter + 4 useIntersection = 7 total)

- [ ] **Step 4: Run build to confirm no TypeScript errors**

```
npm run build
```

Expected: `✓ built in Xms` with no errors

- [ ] **Step 5: Commit**

```
git add src/components/ActiveProjects.css
git commit -m "feat: add gradient, inner glow and grid overlay to ActiveProjects"
```

---

## Task 7: Final visual pass

- [ ] **Step 1: Start dev server and review full page**

```
npm run dev
```

Scroll through the full page and check each section against the spec:

| Section | Check |
|---------|-------|
| Nav | Unchanged |
| Hero | Two columns, photo + HUD frame right, single-col on mobile |
| Core Stack | Gradient bg, grid lines, domain cards chamfered + glowing |
| Experience Logs | Gradient bg, grid lines, timeline unaffected |
| Active Projects | Gradient bg, grid lines, project cards glowing |
| Contact Uplink | Gradient bg, grid lines, form/sidebar unaffected |

- [ ] **Step 2: Test mobile layout at 375px**

In browser DevTools, set viewport to 375px width. Verify:
- Hero: single column, HUD frame hidden
- All section gradients and grid lines still visible
- No horizontal scrollbar
- All text and interactive elements accessible

- [ ] **Step 3: Lint check**

```
npm run lint
```

Expected: no errors

- [ ] **Step 4: Final commit**

```
git add .
git commit -m "chore: final visual pass — all 5 design gap fixes complete"
```
