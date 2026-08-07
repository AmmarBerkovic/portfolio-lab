# Core Stack — Real CV Data

**Date:** 2026-08-07
**Status:** Approved
**Scope:** Replace the placeholder `domains` data in `src/data/content.ts` with three technology domains derived from Ammar Berkovi's CV and role history, and add a data-driven test suite for `CoreStack`.

## Background

The site was scaffolded from a Stitch design whose content is invented. The `domains` array (`src/data/content.ts:81-120`) describes three fictional domains whose chips include technologies Ammar has never listed — Python, Apache Kafka, ClickHouse, dbt, WebGL, GraphQL, Vite.

This is the second of three content sections to be made real. The Experience Logs section was completed first (branch `feat/experience-logs-real-data`, commits `16500c8`..`10613ab`); Active Projects follows in a separate cycle.

Sources of truth are `CV.pdf` at the repo root and the now-real `roles` array in the same file.

## Goals

- Core Stack reflects technologies Ammar actually works with.
- No chip appears on two cards, and no technology renders in two different colours anywhere on the site.
- `CoreStack` gains test coverage that survives future content edits.

## Non-goals

- No changes to `CoreStack.tsx` or `CoreStack.css`. Three cards keep the `repeat(3, 1fr)` desktop grid exactly full.
- No changes to `roles`, `projects`, `hero`, or `contact`.
- No new dependencies.
- The hero still says "SENIOR FULL-STACK ENGINEER" against the CV's "Full Stack Engineer". Still deliberately out of scope; belongs to the Command Center pass.

## Data shape

The `Domain` interface (`src/data/content.ts:20-25`) is **unchanged**:

```ts
export interface Domain {
  id: string
  title: string
  description: string
  chips: TechChip[]
}
```

Three entries, same count as now. `CoreStack.tsx:22` renders the card header as `{id} // {title.toUpperCase().replace(/ /g, '_')}`, so titles need no separate uppercase form — `Cloud & Observability` yields `MOD-003 // CLOUD_&_OBSERVABILITY`.

Descriptions stay within the existing density band. The current three run 98–112 characters; the replacements run 102–117, so no card grows disproportionately against its neighbours.

## The three domains

### MOD-001 — Backend Architecture

- `description`: "Multi-tenant services built for throughput — provider-agnostic adapters, rules engines, and reconciled billing paths."
- `chips`: Golang (cyan), Node.js (cyan), Spring Boot (cyan), PostgreSQL (cyan), MongoDB (amber), Redis (amber)

### MOD-002 — Interface Engineering

- `description`: "Enterprise content platforms for high-traffic publishers, tuned against Core Web Vitals to convert speed into reach."
- `chips`: Next.js (cyan), React (cyan), TypeScript (cyan), Angular (cyan), CSS (violet)

### MOD-003 — Cloud & Observability

- `description`: "Health monitoring, audit trails and caching strategies that hold peak-load performance — and prove it."
- `chips`: AWS (amber), Docker (violet), Grafana (violet), Sentry (violet)

## Provenance

Every chip traces to the CV's skills list, the CV's role narratives, or a chip the user placed on a `roles` record:

| Chip | Source |
|---|---|
| Golang | CV skills; Pickleball Inc record |
| Node.js | CV skills; Cape Ann record |
| Spring Boot | CV skills + profile summary ("Node.js, Golang, Spring Boot") |
| PostgreSQL | Pickleball Inc record |
| MongoDB | Cape Ann record (MEAN stack); covers the CV's "SQL & NoSQL" |
| Redis | Pickleball Inc record |
| Next.js | CV skills; Glide Tech record |
| React | CV skills; Glide Tech record |
| TypeScript | Glide Tech record |
| Angular | CV skills; Cape Ann record |
| CSS | Glide Tech record |
| AWS | CV skills; Pickleball and Glide Tech records |
| Docker | Pickleball Inc record |
| Grafana | CV skills; Pickleball and Glide Tech records |
| Sentry | Pickleball Inc record |

Spring Boot, MongoDB, and Angular appear in the CV but on no current role. The user explicitly chose to include all three, accepting that Spring Boot signals openness to JVM work and Angular to Angular work.

Descriptions draw on the CV's role narratives: "provider-agnostic adapter" and "Affiliations Rules Engine" and the Stripe/carrier reconciliation work from Pickleball Inc; "Core Web Vitals" and "organic visibility" from Glide Tech; "health monitoring, filtering comprehensive audit trails, utilizing data-access layer with advanced caching strategies" from Glide Tech.

## Chip colour rules

Two rules, in priority order:

1. **Cross-section consistency wins.** Any technology already appearing anywhere in `content.ts` keeps the colour it already has, so nothing renders as two different colours between Core Stack and Experience Logs. This fixes the colour for every chip above except Spring Boot.
2. **New chips follow the file convention:** cyan = mainstream core technologies and languages, amber = infrastructure/datastores/tooling, violet = specialty or single-purpose. Spring Boot is the only new label and takes **cyan** as a mainstream backend framework.

**No chip may appear on more than one card.** Docker is the case this constrains: it belongs on both Backend and Cloud by category, and is assigned to Cloud & Observability only. Backend leads with the language triad instead.

## Removed content

These fabricated chips disappear from the site entirely with this change: Python, Apache Kafka, ClickHouse, dbt (MOD-003), WebGL, Vite (MOD-002), GraphQL (MOD-001). Note that Python, ClickHouse, dbt, and Kafka still appear in the `projects` array, which remains fabricated until the Active Projects cycle.

## Testing

`CoreStack` has no test file today, unlike `ExperienceLogs`. This change adds `src/components/CoreStack.test.tsx`, following the pattern established for `ExperienceLogs.test.tsx`: **assertions derive from the imported `domains` array**, never from literal copy, so a future content edit cannot break the suite.

Tests:

1. Renders the section label `// ENGINEERING_DOMAINS`.
2. Renders one card per domain — card count equals `domains.length`, and the rendered titles equal `domains.map(d => d.title)` in order.
3. Each domain's description is rendered.
4. Each domain's chips are rendered, in order, within that domain's card.
5. Card header ids render in the `{id} // {TITLE_WITH_UNDERSCORES}` form the component builds — derived from the data, not hardcoded.

Like every component in this repo, `CoreStack` uses `useIntersection`, so the suite must stub `IntersectionObserver` globally in `beforeEach` (see `CommandCenter.test.tsx` and `ExperienceLogs.test.tsx`).

One structural note for the implementer: chips must be queried **scoped to their card**, not globally. `Grafana` is unique across the three cards, but that is a property of today's data, not a guarantee — a global text query would silently become ambiguous the first time a chip is duplicated. Query within each `.domain-card` element.

## Verification

1. `npm run test` — full suite green, including the new `CoreStack` tests.
2. `npx tsc -b` — exits 0. Catches any `color` outside `'cyan' | 'amber' | 'violet'`.
3. `npm run lint` — no new errors. One pre-existing `react-hooks/exhaustive-deps` warning at `src/components/CommandCenter.tsx:23` is expected and unrelated.

No browser verification step. Three cards in a three-column grid is the layout the section already has, chips already wrap (`CoreStack.css:79-83`), and the longest new chip label (`Spring Boot`, 11 chars) is shorter than `Apache Kafka` (12) which the cards render today. There is no plausible overflow to check, and the user has asked not to be shown routine frontend verification.

## Risks

- **Spring Boot and Angular are aspirational rather than current.** Neither appears on a role record. The user chose this knowingly; the risk is interview questions about recent JVM or Angular work. Not a code concern.
- **The page remains half-real after this change.** `projects` stays fabricated under a real name. Merging is fine; a public deploy should wait for the Active Projects cycle.
