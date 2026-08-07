# Experience Logs — Real CV Data

**Date:** 2026-08-07
**Status:** Approved
**Scope:** Replace the placeholder `roles` data in `src/data/content.ts` with Ammar Berkovi's actual employment and education history, and decouple `ExperienceLogs.test.tsx` from hardcoded copy.

## Background

The site was scaffolded from a Stitch design whose content is entirely invented. The `roles` array (`src/data/content.ts:122-180`) describes three fictional employers — Neural Dynamics, Cyber Sys Inc., Axiom Labs — with fabricated metrics. This is the first of three content sections to be replaced with real data; Core Stack and Active Projects follow in separate cycles.

Source of truth is `CV.pdf` at the repo root.

## Goals

- The Experience Logs section reflects real employment history.
- No fabricated metrics. Every metric value traces to a statement in the CV or is arithmetic on the dates.
- Tests survive future CV edits without needing to be rewritten.

## Non-goals

- No changes to `CoreStack`, `ActiveProjects`, `CommandCenter`, or `hero`. The hero currently says "SENIOR FULL-STACK ENGINEER" while the CV says "Full Stack Engineer" — noted, deliberately out of scope, to be resolved when the hero is addressed.
- No visual, layout, or CSS changes to `ExperienceLogs`.
- No new dependencies.

## Data shape

The `Role` interface (`src/data/content.ts:32-40`) is **unchanged**. All four records — including the education entry — map onto the existing fields without modification:

```ts
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

Two conventions change within the data itself:

1. **`dateRange` gains month precision** — `'APR 2025 — PRESENT'` rather than `'2025 — PRESENT'`. The section presents itself as a log, and month precision makes the deliberate overlap between the IPI Academy study period and the Glide Tech role read as intentional rather than as a data error. Em dash (`—`) separator, matching the existing format.
2. **The education record's third metric is labelled `DURATION`, not `TENURE`.** Every other record keeps `TENURE`.

Ordering is reverse-chronological by start date, so IPI Academy (Sep 2018) sorts last despite ending after Cape Ann Enterprises.

`ExperienceLogs.tsx` needs no changes. Its `LOG-00{n}` record id (line 79) and `00{n}` ghost id (line 94) are single-digit-padded and remain correct for four entries.

## The four records

### LOG-001 — Backend Developer // Pickleball Inc

- `dateRange`: `APR 2025 — PRESENT`
- `status`: `ACTIVE`
- `description`: "Rebuilt the multi-tenant messaging platform behind a provider-agnostic adapter — every email, SMS and push the product sends, with per-country routing that balances cost against fraud exposure. Designed the Affiliations Rules Engine and wired the Stripe billing paths it feeds."
- `chips`: Node.js (cyan), Golang (cyan), Stripe (violet), AWS (amber)
- `metrics`:
  - `DELIVERY_CHANNELS` → `EMAIL/SMS/PUSH`
  - `ARCHITECTURE` → `MULTI-TENANT`
  - `TENURE` → `1.3 YRS`

### LOG-002 — Full Stack Engineer // Glide Tech

- `dateRange`: `JUL 2021 — JAN 2025`
- `status`: `ARCHIVED`
- `description`: "Architected enterprise content models in CMS platforms for the London Stock Exchange, Daily Mail and Poker.org. Resolved Core Web Vitals bottlenecks across multi-tier applications and orchestrated AWS monitoring, audit trails and caching layers to hold performance at peak load."
- `chips`: Next.js (cyan), Angular (cyan), AWS (amber), Grafana (violet)
- `metrics`:
  - `ENTERPRISE_CLIENTS` → `LSE / DAILY MAIL`
  - `AVAILABILITY` → `99.9%`
  - `TENURE` → `3.5 YRS`

### LOG-003 — Intern Developer // Cape Ann Enterprises

- `dateRange`: `JUL 2019 — JUL 2020`
- `status`: `ARCHIVED`
- `description`: "Built the technical logic for a performance-management application on the MEAN stack — MongoDB, Express, Angular and Node.js unified behind a single data-driven layer. Contributed through rapid sprint cycles from initial design through to deployment."
- `chips`: MongoDB (amber), Express (violet), Angular (cyan), Node.js (cyan)
- `metrics`:
  - `STACK` → `MEAN`
  - `METHODOLOGY` → `AGILE`
  - `TENURE` → `1 YR`

### LOG-004 — Information Technology // IPI Academy

- `dateRange`: `SEP 2018 — MAR 2022`
- `status`: `ARCHIVED`
- `description`: "Studied the core pillars of object-oriented design, the practical implementation of fundamental data structures, and low-level operating system architecture — process management, memory allocation, and the hardware/software interface."
- `chips`: OOP (cyan), Data Structures (cyan), Operating Systems (amber), Algorithms (violet)
- `metrics`:
  - `FOCUS` → `SYSTEMS ARCH`
  - `DISCIPLINE` → `CS FUNDAMENTALS`
  - `DURATION` → `3.5 YRS`

## Provenance of every metric value

No value is invented. Each traces to the CV or to arithmetic on the dates:

| Value | Source |
|---|---|
| `EMAIL/SMS/PUSH` | "every email, SMS and push notification the product sends" |
| `MULTI-TENANT` | "multi-tenant infrastructure" |
| `1.3 YRS` | Apr 2025 → Aug 2026, 16 months |
| `LSE / DAILY MAIL` | "London Stock Exchange, Daily Mail, and Poker.org" |
| `99.9%` | "99.9% availability across high-traffic environments" (profile summary; attributed to the Glide Tech period, which is the high-traffic client work) |
| `3.5 YRS` (Glide) | Jul 2021 → Jan 2025, 42 months |
| `MEAN` | "MEAN Stack — MongoDB, Express, Angular, and Node.js" |
| `AGILE` | "Agile Workflow — Contributed to rapid sprint cycles" |
| `1 YR` | Jul 2019 → Jul 2020 |
| `SYSTEMS ARCH` | OOP / Operating Systems coursework |
| `CS FUNDAMENTALS` | OOP, Data Structures, Operating Systems |
| `3.5 YRS` (IPI) | Sep 2018 → Mar 2022, 42 months |

`1.3 YRS` is the only value that goes stale with time. It is accepted as a static string rather than computed, since a computed tenure would introduce date logic into a pure-data module for negligible benefit. Revisit if the record is still on the site in a year.

## Chip colour convention

Existing usage in `content.ts` is followed: **cyan** for mainstream core technologies and languages, **amber** for infrastructure, datastores and tooling, **violet** for specialty or single-purpose technologies. `MongoDB` takes amber to match `Redis`; `Node.js` and `Angular` stay cyan everywhere they appear.

## Testing

`ExperienceLogs.test.tsx` currently asserts against the placeholder copy — role titles at lines 25-27, employer name at line 43, metric values at lines 48-50 and 61. All of these break with this change.

Rather than swap one set of hardcoded strings for another, the tests will **import `roles` from `../data/content` and assert against it**. The behaviour under test is the component's rendering and selection logic, not the copy; deriving expectations from the data source means the next CV revision cannot break them.

Specifically:

- "renders all role entries in the left panel" — assert the rendered title list equals `roles.map(r => r.title)`, and that the button count equals `roles.length`. Drops the fixed count from the test name.
- "first role is active by default" — assert `roles[0].title` appears at least twice (once in the list, once in the detail heading).
- "clicking a role entry changes the active detail content" — click the button for `roles[roles.length - 1]` and assert that role's `company` appears in `.experience-logs__role-company`.
- "metrics for the active role are displayed" — assert each of `roles[0].metrics` has its `value` rendered.
- "clicking same role twice does not break state" — assert `roles[0].metrics[0].value` is still rendered.

One test will need a guard the current suite does not have: `roles[0].metrics` values must be looked up with `getAllByText` where a value could collide with other text on the page (`3.5 YRS` appears on two records, though only one is rendered at a time). Use exact-match queries scoped to `.experience-logs__metric-value` to avoid ambiguity.

`CommandCenter.test.tsx` does not touch `roles` and is unaffected.

## Verification

1. `npm run test` — full suite green.
2. `npm run build` — `tsc -b` passes, no type errors from the data change.
3. `npm run lint` — clean.
4. Manual: `npm run dev`, open `#experience-logs`, click through all four records, confirm the detail panel transitions and that the fourth record's metrics render without overflowing the footer row on both desktop and the ≤768px breakpoint.

Step 4 matters because `CV`-derived metric values (`EMAIL/SMS/PUSH`, `CS FUNDAMENTALS`) are longer than the placeholder values (`4M+`, `83%`) they replace, and `.experience-logs__metrics` is a `flex` row with a fixed `32px` gap (`ExperienceLogs.css:353-356`). If the row wraps badly, the fix is a CSS adjustment at that rule, not a shortening of the data.

## Risks

- **Metric text overflow.** Longest values are noticeably wider than the placeholders. Mitigated by verification step 4; contained to one CSS rule if it triggers.
- **Staleness of `1.3 YRS`.** Accepted, documented above.
- **`99.9%` attribution.** The CV states this as a career-wide claim, not a Glide Tech claim. Attributing it to one role is a narrowing, not an invention, and the user approved it. Worth being ready to speak to in an interview.
