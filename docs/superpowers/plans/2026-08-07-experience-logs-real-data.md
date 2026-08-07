# Experience Logs Real CV Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fabricated `roles` data in the Experience Logs section with Ammar Berkovi's real employment and education history, without breaking the section's tests on this or any future CV revision.

**Architecture:** Two files change. `src/components/ExperienceLogs.test.tsx` is rewritten first to derive its expectations from the `roles` array instead of hardcoded strings — it must stay green against the *old* placeholder data, which is what proves the decoupling actually worked. Only then is `src/data/content.ts` swapped to the real records, and the same untouched tests must stay green. The `Role` interface and `ExperienceLogs.tsx` are not modified at all.

**Tech Stack:** TypeScript, React 19, Vitest + jsdom + React Testing Library.

## Global Constraints

- No change to the `Role` interface at `src/data/content.ts:32-40`.
- No change to `src/components/ExperienceLogs.tsx`.
- No change to `src/components/ExperienceLogs.css` unless Task 3's manual check finds the metrics footer wrapping badly.
- No new dependencies.
- Every metric value must trace to `CV.pdf` or to arithmetic on the role's dates. Do not invent figures.
- `dateRange` uses month precision and an em dash: `'APR 2025 — PRESENT'`. The em dash is `—` (U+2014), not a hyphen.
- Records are ordered reverse-chronologically **by start date**, so IPI Academy sorts last even though it ended after Cape Ann Enterprises.
- The education record's third metric is labelled `DURATION`. All other records use `TENURE`.
- Chip colours follow existing `content.ts` convention: **cyan** = mainstream core technologies and languages, **amber** = infrastructure/datastores/tooling, **violet** = specialty or single-purpose technologies.

---

### Task 1: Decouple ExperienceLogs tests from hardcoded copy

The current suite asserts against placeholder strings (`'Senior Full-Stack Engineer'` at line 25, `'Axiom Labs'` at line 43, `'4M+'` at line 48). Rewrite it to derive every expectation from the imported `roles` array. The component's behaviour — rendering the list, defaulting to the first record, swapping on click — is what's under test; the copy is not.

Critically, this task changes **only the test file**. The suite must pass against the existing placeholder data. If it fails here, the tests are still coupled to something they shouldn't be.

**Files:**
- Modify: `src/components/ExperienceLogs.test.tsx` (full rewrite, 63 lines → new content below)

**Interfaces:**
- Consumes: `roles: Role[]` from `../data/content`; the existing DOM class names emitted by `ExperienceLogs.tsx` — `.role-entry__title`, `.experience-logs__role-company`, `.experience-logs__metric-value`.
- Produces: nothing consumed by later tasks. Task 2 relies on this suite being data-driven.

- [ ] **Step 1: Rewrite the test file**

Replace the entire contents of `src/components/ExperienceLogs.test.tsx` with:

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceLogs from './ExperienceLogs'
import { roles } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function metricValues(container: HTMLElement): (string | null)[] {
  return Array.from(
    container.querySelectorAll('.experience-logs__metric-value'),
  ).map(el => el.textContent)
}

describe('ExperienceLogs', () => {
  test('renders section audit label', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(/SYSTEM_AUDIT_LOG/)).toBeInTheDocument()
  })

  test('renders one left-panel entry per role, in order', () => {
    render(<ExperienceLogs />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(roles.length)

    const titles = buttons.map(b => b.querySelector('.role-entry__title')?.textContent)
    expect(titles).toEqual(roles.map(r => r.title))
  })

  test('first role is active by default — its title appears in the detail panel', () => {
    render(<ExperienceLogs />)
    expect(screen.getAllByText(roles[0].title).length).toBeGreaterThanOrEqual(2)
  })

  test('clicking a role entry changes the active detail content', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const last = roles[roles.length - 1]
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[buttons.length - 1])

    expect(
      await screen.findByText(`// ${last.company}`, {
        selector: '.experience-logs__role-company',
      }),
    ).toBeInTheDocument()
  })

  test('metrics for the active role are displayed, in order', () => {
    const { container } = render(<ExperienceLogs />)
    expect(metricValues(container)).toEqual(roles[0].metrics.map(m => m.value))
  })

  test('clicking same role twice does not break state', async () => {
    const user = userEvent.setup()
    const { container } = render(<ExperienceLogs />)

    const first = screen.getAllByRole('button')[0]
    await user.click(first)
    await user.click(first)

    expect(metricValues(container)).toEqual(roles[0].metrics.map(m => m.value))
  })
})
```

Two notes on why this shape, so you don't "simplify" it back into a trap:

- Buttons are clicked **by index**, not by accessible name. The accessible name of a `.role-entry` button concatenates its date, title, company, and status badge, so a name-based regex would need escaping and could match more than one entry once real data lands.
- Metric values are read via `container.querySelectorAll('.experience-logs__metric-value')` rather than `screen.getByText(value)`. Real metric values repeat across records (`3.5 YRS` appears on two), and a text query would be ambiguous the moment someone renders more than one record. Reading the scoped nodes in order also asserts ordering for free.

- [ ] **Step 2: Run the suite against the UNCHANGED placeholder data**

Run: `npx vitest run src/components/ExperienceLogs.test.tsx`

Expected: PASS, 6 tests. `src/data/content.ts` has not been touched yet, so this is passing against Neural Dynamics / Cyber Sys / Axiom Labs.

This is the whole point of the task. If anything fails, the test still depends on something data-specific — fix the test, not the data.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperienceLogs.test.tsx
git commit -m "test: derive ExperienceLogs expectations from roles data

Tests asserted against placeholder copy, so any content change broke
them. Read titles, company and metric values from the imported roles
array instead."
```

---

### Task 2: Replace placeholder roles with real CV records

Swap the three fictional roles for four real records. The test file from Task 1 is **not** touched — it must go green unchanged.

**Files:**
- Modify: `src/data/content.ts:122-180` (the `roles` array only)

**Interfaces:**
- Consumes: the `Role`, `TechChip`, and `RoleMetric` interfaces already declared at `src/data/content.ts:10-40`. No signature changes.
- Produces: `roles: Role[]` with `length === 4`, `roles[0].status === 'ACTIVE'`, all others `'ARCHIVED'`.

- [ ] **Step 1: Replace the roles array**

Replace lines 122-180 of `src/data/content.ts` — the whole `export const roles: Role[] = [...]` declaration — with:

```ts
export const roles: Role[] = [
  {
    dateRange: 'APR 2025 — PRESENT',
    title: 'Backend Developer',
    company: 'Pickleball Inc',
    description:
      'Rebuilt the multi-tenant messaging platform behind a provider-agnostic adapter — every email, SMS and push the product sends, with per-country routing that balances cost against fraud exposure. Designed the Affiliations Rules Engine and wired the Stripe billing paths it feeds.',
    status: 'ACTIVE',
    chips: [
      { label: 'Node.js', color: 'cyan' },
      { label: 'Golang',  color: 'cyan' },
      { label: 'Stripe',  color: 'violet' },
      { label: 'AWS',     color: 'amber' },
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
      { label: 'Next.js', color: 'cyan' },
      { label: 'Angular', color: 'cyan' },
      { label: 'AWS',     color: 'amber' },
      { label: 'Grafana', color: 'violet' },
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
    title: 'Information Technology',
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
```

- [ ] **Step 2: Run the ExperienceLogs suite, unchanged from Task 1**

Run: `npx vitest run src/components/ExperienceLogs.test.tsx`

Expected: PASS, 6 tests. Do not edit the test file to make this pass. If a test fails, the bug is in the data (a typo, wrong ordering, wrong count) or the test genuinely wasn't decoupled — in which case go back and fix Task 1's work properly rather than patching an assertion.

- [ ] **Step 3: Run the full suite**

Run: `npm run test`

Expected: PASS. `CommandCenter.test.tsx` does not reference `roles` and should be unaffected.

- [ ] **Step 4: Typecheck**

Run: `npx tsc -b`

Expected: exits 0, no output. Catches any `color` value outside `'cyan' | 'amber' | 'violet'` or `status` outside `'ACTIVE' | 'ARCHIVED'`.

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts
git commit -m "content: replace placeholder roles with real CV history

Four records from CV.pdf — Pickleball Inc, Glide Tech, Cape Ann
Enterprises, IPI Academy. Every metric value traces to a CV statement
or to arithmetic on the role dates."
```

---

### Task 3: Verify rendering and fix metrics-footer overflow if it occurs

The real metric values are substantially wider than the ones they replace — `EMAIL/SMS/PUSH` and `CS FUNDAMENTALS` against `4M+` and `83%`. `.experience-logs__metrics` is a `display: flex` row with a fixed `gap: 32px` and no wrapping at desktop width (`src/components/ExperienceLogs.css:353-356`); the ≤768px breakpoint drops the gap to `20px` and adds `flex-wrap: wrap` (lines 507-510). Desktop is where this can break.

This task is a check with a conditional fix, not a guaranteed edit. If the footer renders cleanly, record that and skip to the commit.

**Files:**
- Modify (only if the check fails): `src/components/ExperienceLogs.css:353-356`

**Interfaces:**
- Consumes: `roles` from Task 2.
- Produces: nothing.

- [ ] **Step 1: Lint**

Run: `npm run lint`

Expected: clean, no errors or warnings.

- [ ] **Step 2: Production build**

Run: `npm run build`

Expected: `tsc -b` passes, Vite build succeeds.

- [ ] **Step 3: Start the dev server and inspect the section**

Run: `npm run dev`

Open the printed localhost URL and navigate to `#experience-logs` (or click `LOGS` in the nav).

Check, at a desktop viewport width of ~1440px:
1. The left panel lists exactly four entries, top to bottom: Backend Developer, Full Stack Engineer, Intern Developer, Information Technology.
2. The header reads `4 ENTRIES`.
3. The first record is expanded on load, its badge reads `ACTIVE`, and the right-panel header reads `LOG-001 // RECORD_ACTIVE`.
4. Clicking each of the other three transitions the detail panel and updates the ghost id to `002` / `003` / `004`.
5. **The metrics footer on each record renders as a single row that does not wrap, overlap the `← → NAVIGATE_RECORDS` hint, or overflow the panel.** Record LOG-001 (`EMAIL/SMS/PUSH`) and LOG-004 (`CS FUNDAMENTALS`) are the widest — check those two specifically.

Then narrow the browser to 375px and confirm the footer stacks without horizontal overflow.

- [ ] **Step 4: Apply the CSS fix ONLY if step 3.5 failed**

If and only if the metrics row overflowed or collided with the nav hint, change the rule at `src/components/ExperienceLogs.css:353-356` from:

```css
.experience-logs__metrics {
  display: flex;
  gap: 32px;
}
```

to:

```css
.experience-logs__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  min-width: 0;
}
```

Do not shorten the metric values in `content.ts` to dodge this — the content is correct, the layout accommodates it. Re-run step 3 after the change.

- [ ] **Step 5: Stop the dev server and commit**

If step 4 was not needed, there is nothing to commit and this task ends here — note that in your report.

If step 4 applied the CSS fix:

```bash
git add src/components/ExperienceLogs.css
git commit -m "style: let experience-log metrics footer wrap

Real metric values are wider than the placeholders they replaced and
overflowed the fixed-gap flex row at desktop width."
```

---

## Out of scope

Recorded here so they are not silently absorbed into this work:

- The hero (`src/data/content.ts:68-79`) says `SENIOR FULL-STACK ENGINEER` while the CV says `Full Stack Engineer`. Deliberately untouched — belongs to the Command Center pass.
- `domains` (Core Stack) and `projects` (Active Projects) are still placeholder data. Each gets its own spec, plan, and cycle.
