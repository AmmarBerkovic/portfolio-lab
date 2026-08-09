# Core Stack Real CV Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fabricated `domains` data behind the Core Stack section with three technology domains drawn from the site owner's real CV and role history, covered by a test suite that future content edits cannot break.

**Architecture:** Two files change. `src/components/CoreStack.test.tsx` is created first and must pass against the *existing placeholder* data — that is what proves its assertions derive from the `domains` array rather than from literal copy. Only then is the array swapped in `src/data/content.ts`, and the same untouched test file must stay green. `CoreStack.tsx` and `CoreStack.css` are not modified.

**Tech Stack:** TypeScript, React 19, Vitest + jsdom + React Testing Library.

## Global Constraints

- No change to the `Domain` interface at `src/data/content.ts:20-25`.
- No change to `src/components/CoreStack.tsx` or `src/components/CoreStack.css`.
- No change to `roles`, `projects`, `hero`, or `contact` in `content.ts`.
- No new dependencies.
- Exactly three domain entries. Three cards keep the `repeat(3, 1fr)` desktop grid exactly full; a fourth would orphan onto a second row.
- Two description strings contain an em dash `—` (U+2014), NOT a hyphen `-` and NOT an en dash `–`. Check the character carefully; it is easy to corrupt.
- **No chip label may appear on more than one card.** Docker belongs to MOD-003 only.
- Chip colours are fixed by the spec and are not the implementer's choice. They follow cross-section consistency: every technology keeps the colour it already has elsewhere in `content.ts`.
- Tests must derive every expectation from the imported `domains` array. Never assert on a literal title, description, or chip label.
- Chips must be queried scoped to their own `.domain-card`, never by a global text query.

---

### Task 1: Add a data-driven CoreStack test suite

`CoreStack` has no test file today. Create one, and make it pass against the **existing placeholder** `domains` (Backend Architecture / Interface Engineering / Data & Systems, with chips like Python, Apache Kafka, ClickHouse). This task changes only the test file — do not touch `content.ts`. If the suite fails here, the assertions are still coupled to something they shouldn't be.

**Files:**
- Create: `src/components/CoreStack.test.tsx`

**Interfaces:**
- Consumes: `domains: Domain[]` from `../data/content`; the DOM class names `CoreStack.tsx` emits — `.domain-card`, `.domain-card__title`, `.domain-card__desc`, `.domain-card__chips`, `.chip`, `.card-header__id`.
- Produces: nothing later tasks import. Task 2 relies on this suite being data-driven.

- [ ] **Step 1: Write the test file**

Create `src/components/CoreStack.test.tsx` with exactly this content:

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoreStack from './CoreStack'
import { domains } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function cards(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.domain-card'))
}

describe('CoreStack', () => {
  test('renders the section label', () => {
    render(<CoreStack />)
    expect(screen.getByText('// ENGINEERING_DOMAINS')).toBeInTheDocument()
  })

  test('renders one card per domain, titles in order', () => {
    const { container } = render(<CoreStack />)
    const titles = cards(container).map(
      c => c.querySelector('.domain-card__title')?.textContent,
    )
    expect(titles).toEqual(domains.map(d => d.title))
  })

  test('renders each domain description', () => {
    const { container } = render(<CoreStack />)
    const descriptions = cards(container).map(
      c => c.querySelector('.domain-card__desc')?.textContent,
    )
    expect(descriptions).toEqual(domains.map(d => d.description))
  })

  test('renders each card chips in order, scoped to that card', () => {
    const { container } = render(<CoreStack />)
    const chipsPerCard = cards(container).map(c =>
      Array.from(c.querySelectorAll('.domain-card__chips .chip')).map(
        el => el.textContent,
      ),
    )
    expect(chipsPerCard).toEqual(domains.map(d => d.chips.map(chip => chip.label)))
  })

  test('renders each card header as its id followed by the underscored title', () => {
    const { container } = render(<CoreStack />)
    const headerIds = cards(container).map(
      c => c.querySelector('.card-header__id')?.textContent,
    )
    expect(headerIds).toEqual(
      domains.map(d => `${d.id} // ${d.title.toUpperCase().replace(/ /g, '_')}`),
    )
  })
})
```

Three notes on why this shape, so you don't "simplify" it into a trap:

- Chips are read via `c.querySelectorAll('.domain-card__chips .chip')` **within each card**, not `screen.getByText(label)`. Every chip label happens to be unique across the three cards today, but that is a property of the current data, not a guarantee — a global query would silently become ambiguous the first time a label repeats. Scoping also asserts which card each chip belongs to, and their order, for free.
- `cards()` is a shared helper because four tests need the same lookup. Do not inline it four times.
- Be aware of what the last test does and does not buy you: it restates the component's format string, so it will not catch a deliberate change to the ` // ` separator. Its value is catching the header disappearing, losing its id, or dropping the space-to-underscore transform. That is worth having; just don't mistake it for a stronger guarantee than it is.

- [ ] **Step 2: Run the suite against the UNCHANGED placeholder data**

Run: `npx vitest run src/components/CoreStack.test.tsx`

Expected: PASS, 5 tests. `src/data/content.ts` has not been touched, so this is passing against the fabricated Backend Architecture / Interface Engineering / Data & Systems domains.

This is the point of the task. If anything fails, the test still depends on something data-specific — fix the test, not the data.

- [ ] **Step 3: Run the full suite**

Run: `npm run test`

Expected: PASS, 18 tests across 4 files (13 existing + 5 new).

- [ ] **Step 4: Commit**

```bash
git add src/components/CoreStack.test.tsx
git commit -m "test: add data-driven CoreStack suite

Derives every expectation from the domains array and scopes chip
queries to their own card, so content edits cannot break it."
```

---

### Task 2: Replace placeholder domains with real CV-derived domains

Swap the three fabricated domains for three real ones. The test file from Task 1 is **not** touched — it must go green unchanged.

**Files:**
- Modify: `src/data/content.ts:81-120` (the `domains` array only)

**Interfaces:**
- Consumes: the `Domain` and `TechChip` interfaces already declared at `src/data/content.ts:10-25`. No signature changes.
- Produces: `domains: Domain[]` with `length === 3` and ids `MOD-001`, `MOD-002`, `MOD-003`.

- [ ] **Step 1: Replace the domains array**

Replace lines 81-120 of `src/data/content.ts` — the whole `export const domains: Domain[] = [...]` declaration — with:

```ts
export const domains: Domain[] = [
  {
    id: 'MOD-001',
    title: 'Backend Architecture',
    description:
      'Multi-tenant services built for throughput — provider-agnostic adapters, rules engines, and reconciled billing paths.',
    chips: [
      { label: 'Golang',      color: 'cyan' },
      { label: 'Node.js',     color: 'cyan' },
      { label: 'Spring Boot', color: 'cyan' },
      { label: 'PostgreSQL',  color: 'cyan' },
      { label: 'MongoDB',     color: 'amber' },
      { label: 'Redis',       color: 'amber' },
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
      { label: 'Angular',    color: 'cyan' },
      { label: 'CSS',        color: 'violet' },
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
```

The MOD-001 and MOD-003 descriptions each contain an em dash (`—`, U+2014). Verify both survived your edit as em dashes and did not become hyphens.

- [ ] **Step 2: Run the CoreStack suite, unchanged from Task 1**

Run: `npx vitest run src/components/CoreStack.test.tsx`

Expected: PASS, 5 tests. Do not edit the test file to make this pass. If a test fails, the bug is in the data — a typo, wrong order, wrong count — or the test genuinely wasn't decoupled, in which case fix Task 1's work properly rather than patching an assertion.

- [ ] **Step 3: Run the full suite**

Run: `npm run test`

Expected: PASS, 18 tests across 4 files.

- [ ] **Step 4: Typecheck**

Run: `npx tsc -b`

Expected: exits 0, no output. Catches any `color` value outside `'cyan' | 'amber' | 'violet'`.

- [ ] **Step 5: Lint**

Run: `npm run lint`

Expected: exits 0. One pre-existing warning is expected and unrelated to this work:
`src/components/CommandCenter.tsx:23 warning React Hook useEffect has a missing dependency: 'fmt'`.
Do not fix that warning — it is outside this plan's scope. Any *new* warning or any error is a failure.

- [ ] **Step 6: Confirm no chip label appears on two cards**

Run: `node -e "const s=require('fs').readFileSync('src/data/content.ts','utf8');const b=s.slice(s.indexOf('export const domains'),s.indexOf('export const roles'));const l=[...b.matchAll(/label: '([^']+)'/g)].map(m=>m[1]);const d=l.filter((x,i)=>l.indexOf(x)!==i);console.log(d.length?'DUPLICATE CHIPS: '+d.join(', '):'ok: '+l.length+' unique chips');"`

Expected: `ok: 15 unique chips`

If it reports duplicates, you have violated the no-duplicate-chip constraint — most likely by leaving Docker on both Backend Architecture and Cloud & Observability. Docker belongs on MOD-003 only.

- [ ] **Step 7: Commit**

```bash
git add src/data/content.ts
git commit -m "content: replace placeholder domains with real CV stack

Backend Architecture, Interface Engineering and Cloud & Observability.
Every chip traces to the CV skills list, a CV role narrative, or a chip
already on a roles record; colours reuse each technology's existing
colour elsewhere in the file."
```

---

## No browser verification

Deliberately omitted, with reasons — do not add it back:

- The layout is unchanged: three cards in the same three-column grid the section already renders.
- Chips already wrap (`src/components/CoreStack.css:79-83`), and card count is identical, so no new overflow surface exists.
- The longest new chip label, `Spring Boot` (11 chars), is shorter than `Apache Kafka` (12) which these cards render today.
- The site owner has explicitly asked not to be shown routine frontend verification for content changes.

## Out of scope

Recorded so they are not silently absorbed:

- `projects` (Active Projects) is still fabricated placeholder data — Telemetry Core, Signal UI, Vault API, DataStream. It gets its own spec, plan, and cycle. Note that Python, ClickHouse, dbt, and Kafka survive in `projects` even after this change removes them from `domains`.
- The hero (`src/data/content.ts:68-79`) says `SENIOR FULL-STACK ENGINEER` while the CV says "Full Stack Engineer" and the current role is Backend Developer. Belongs to the Command Center pass.
- The pre-existing `react-hooks/exhaustive-deps` warning in `CommandCenter.tsx`.
