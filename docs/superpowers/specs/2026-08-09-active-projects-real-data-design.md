# Active Projects — Real Project Data

**Date:** 2026-08-09
**Status:** Approved
**Scope:** Replace the placeholder `projects` data in `src/data/content.ts` with real repositories, make `liveUrl` optional so the `LIVE_DEMO` button only renders for deployed projects, drop the unused `imageUrl` field, and add a data-driven test suite for `ActiveProjects`.

## Background

The site was scaffolded from a Stitch design whose content is invented. The `projects` array (`src/data/content.ts:208-269`) describes four fictional projects — Telemetry Core, Signal UI, Vault API, DataStream — with chips for technologies Ammar has never listed (Kafka, ClickHouse, dbt, Python) and links pointing at `https://github.com` and `https://example.com`.

This is the third and last of three content sections to be made real. Experience Logs was completed first (commits `16500c8`..`10613ab`), Core Stack second (commits `a0f8d12`..`cd09e30`).

**The CV is not a source here.** `CV.pdf` has no projects section — it is employment and education only. The source of truth is instead the user's public GitHub account, `github.com/AmmarBerkovic`, plus whatever the user supplies directly.

## Goals

- Every card describes a repository that exists, with a link that resolves.
- No card offers a `LIVE_DEMO` that does not lead to a live deployment.
- `ActiveProjects` gains test coverage that survives future content edits.
- The fabricated chips still on the page after the Core Stack cycle (Kafka, ClickHouse, dbt, Python) disappear.

## Non-goals

- No changes to `roles`, `domains`, `hero`, or `contact`.
- No new dependencies.
- No deploying of any project to create a live URL. Cards without a deployment simply omit the button.
- The hero still says "SENIOR FULL-STACK ENGINEER" against the CV's "Full Stack Engineer". Still out of scope; belongs to the Command Center pass.
- Remediating the committed `.env` in the `The-Movie-App` repository. Flagged to the user, tracked under Risks, not this branch's work.

## Data shape

The `Project` interface (`src/data/content.ts:42-52`) changes in two ways:

```ts
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  coordinates: string
  repoUrl: string
  liveUrl?: string      // was: liveUrl: string
  chips: TechChip[]
}                       // imageUrl?: string — removed
```

`liveUrl` becomes optional. `imageUrl` is deleted: it is declared today but set by none of the four projects, so the `{project.imageUrl && ...}` block in `ActiveProjects.tsx:31-35` is dead code. Removing the field forces the component block and the `.project-card__image` rules (`ActiveProjects.css:58-76`) to go with it.

`ProjectStatus` is **unchanged** — `'active' | 'in-progress'`. The user considered adding an `'archived'` state and chose to keep two values, applied honestly: `'active'` only for work still being touched, `'in-progress'` for anything unfinished.

`coordinates` stays as-is. It is HUD decoration in the `[X:04, Y:12]` form with no real meaning, and every slot keeps its existing value regardless of which project lands there: `[X:04, Y:12]`, `[X:11, Y:07]`, `[X:08, Y:19]`, `[X:15, Y:03]`.

**Four cards.** `.active-projects__grid` is `repeat(2, 1fr)` (`ActiveProjects.css:19-21`), so four cards fill the 2×2 desktop grid exactly. Three would leave a visible hole.

## Component change

`ActiveProjects.tsx` currently renders both action links unconditionally (lines 50-56). After this change `LIVE_DEMO` renders only when `project.liveUrl` is set:

```tsx
<div className="project-card__actions">
  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
    VIEW_REPO
  </a>
  {project.liveUrl && (
    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">
      LIVE_DEMO
    </a>
  )}
</div>
```

`.project-card__actions` uses flex, so a single remaining button needs no layout change.

This is the only component change in this cycle. Everything else is data.

## Roster

Two cards are confirmed. Two await the user, who asked to see the first two written up as a calibration sample before supplying the rest.

### PROJ-001 — The Movie App *(confirmed)*

- `description`: "Browses the full TMDB catalogue through a Redux-backed store — filtering, search and trailer playback held in one predictable state tree."
- `status`: `'active'` — pushed 2026-01-25, the most recent repository on the account
- `repoUrl`: `https://github.com/AmmarBerkovic/The-Movie-App`
- `liveUrl`: omitted — no deployment
- `chips`: React (cyan), TypeScript (cyan), Redux (violet)
- Verified stack: React 18.3, Redux Toolkit 2.2, TypeScript 4.9, `react-router-dom` 6.23, axios, `react-youtube`, Sass. Source: repository `package.json`.

### PROJ-002 — Go User API *(confirmed)*

- `description`: "RESTful user service on a layered Go architecture — Chi routing over GORM repositories, with paginated reads and Protobuf-generated models."
- `status`: `'in-progress'` — pushed 2025-03-24 and unfinished; not claimed as active
- `repoUrl`: `https://github.com/AmmarBerkovic/Go-User-API`
- `liveUrl`: omitted — a Go service cannot be statically hosted
- `chips`: Golang (cyan), MySQL (cyan), Protobuf (violet)
- Verified stack: Go with Chi routing, GORM, Viper config, MySQL, Protocol Buffers model generation, layered `config`/`db`/`internal` structure. Source: repository README.

### PROJ-003 — Mirror Client *(confirmed)*

- `description`: "Server-rendered Angular workspace for continuous activity tracking — Material-driven records, filters and progress views over the Mirror API."
- `status`: `'in-progress'` — pushed 2024-03-03, parked
- `repoUrl`: `https://github.com/AmmarBerkovic/MirrorFE`
- `liveUrl`: omitted — no deployment
- `chips`: Angular (cyan), TypeScript (cyan), RxJS (violet)
- Verified stack: Angular 17 with `@angular/ssr` and `platform-server`, Angular Material 17, Bootstrap 5.3, RxJS 7.8, TypeScript 5.2, Karma/Jasmine. Source: repository `package.json`.

### PROJ-004 — Mirror API *(confirmed)*

- `description`: "Express and Mongoose service behind Mirror — CRUD endpoints over MongoDB collections with query-driven filtering across records."
- `status`: `'in-progress'` — pushed 2024-03-10, parked
- `repoUrl`: `https://github.com/AmmarBerkovic/MirrorBE`
- `liveUrl`: omitted — no deployment
- `chips`: Node.js (cyan), Express (violet), MongoDB (amber)
- Verified stack: Express 4.18, Mongoose 8.0, dotenv. Source: repository `package.json`.

The display names deliberately differ from the repository names: `MirrorFE` and `MirrorBE` read as internal shorthand, and the card header renders `{name.toUpperCase().replace(/ /g, '_')}`, yielding the cleaner `MIRROR_CLIENT` and `MIRROR_API`. `repoUrl` makes the mapping unambiguous.

Splitting Mirror across two cards was the user's choice over combining it into one full-stack card. It costs a slot that could have gone to `Boilerplate-Express`, and buys each half its own repo link plus a visible frontend/backend pairing.

**Status distribution.** Only PROJ-001 carries a green `'active'` dot; the other three are amber `'in-progress'`. That is the honest reading — nothing but The Movie App has been touched in 2026 — and follows directly from the user's choice to label honestly rather than add an `'archived'` state.

## Chip colour rules

Identical to the Core Stack cycle, in priority order:

1. **Cross-section consistency wins.** Any technology already in `content.ts` keeps the colour it has, so nothing renders as two colours across sections. This fixes React, TypeScript, Golang, Angular, and Node.js as cyan; Express as violet; MongoDB as amber.
2. **New chips follow the file convention:** cyan = mainstream core technologies, languages, and relational datastores; amber = infrastructure and non-relational datastores; violet = specialty or single-purpose.

New labels introduced here: **MySQL** takes cyan, matching `PostgreSQL`. **Redux**, **Protobuf**, and **RxJS** take violet as single-purpose libraries, matching `Stripe` and `Express`.

Unlike Core Stack, a chip **may** repeat across cards. Core Stack's one-chip-one-card rule existed because its three cards partition a skill set; project cards describe independent artefacts that legitimately share technologies.

## Removed content

These fabricated projects disappear entirely: Telemetry Core, Signal UI, Vault API, DataStream. With them go the last fabricated chips on the site — Kafka, ClickHouse, dbt, Python — and the eight placeholder links to `https://github.com` and `https://example.com`.

After this change no invented content remains in `content.ts`.

## Testing

`ActiveProjects` has no test file today. This change adds `src/components/ActiveProjects.test.tsx` following the pattern of `CoreStack.test.tsx` and `ExperienceLogs.test.tsx`: **assertions derive from the imported `projects` array**, never from literal copy, so a content edit cannot break the suite.

Tests:

1. Renders the section label `// PROJECT_ARCHIVE`.
2. Renders one card per project — count equals `projects.length`, and rendered names equal `projects.map(p => p.name)` in order.
3. Each project's description is rendered.
4. Each project's chips render in order, **scoped to that project's card**.
5. Card header ids render in the `{id} // {NAME_WITH_UNDERSCORES}` form the component builds, derived from the data.
6. Every card links to its `repoUrl`.
7. **`LIVE_DEMO` renders exactly for the projects that have a `liveUrl`, and its href matches.** This is the test that protects the component change; it must fail if the conditional is removed.

`ActiveProjects` uses `useIntersection`, so the suite must stub `IntersectionObserver` globally in `beforeEach`.

Chips must be queried scoped to their card, not globally — chips may legitimately repeat across project cards, so a global query is ambiguous by design here.

### Ordering

The suite is written and committed **first**, and must pass against the current placeholder data before any content changes. That proves the assertions are genuinely derived rather than coincidentally matching. This ordering caught hardcoded copy in `ExperienceLogs.test.tsx` during the first cycle.

Test 7 is the exception: it cannot pass first, because `liveUrl` is required today and every placeholder sets it. It is written alongside the component change, in the same commit.

## Verification

1. `npm run test` — full suite green, including the new `ActiveProjects` tests.
2. `npx tsc -b` — exits 0. Catches any card that still sets `imageUrl`, and any `color` outside the union.
3. `npm run lint` — no new errors. One pre-existing `react-hooks/exhaustive-deps` warning at `src/components/CommandCenter.tsx:23` is expected and unrelated.

No browser verification step. Card structure is unchanged apart from a button that sometimes does not render, descriptions stay inside the existing length band, and chips already wrap. The user has asked not to be shown routine frontend verification.

## Risks

- **`The-Movie-App` has a committed `.env` at its repository root, public.** Linking to that repository from a portfolio drives traffic to it. If the file holds a live TMDB key, the key should be rotated and the file scrubbed from history. Flagged to the user; not this branch's work, and not a blocker for merging.
- **No card will have a live demo.** Neither confirmed project is deployed, and the survey found only one repository on the whole account with a homepage set (`PhoneBookPage`, 2019). A projects section where nothing is clickable beyond source code is weaker than one with demos — the honest fix is deploying something, which the user declined to scope here.
- **Three of four cards show an amber `'in-progress'` dot.** Honest, but a projects grid that is mostly amber reads as a stalled portfolio. The alternative the user declined was an `'archived'` status; the other fix is pushing a commit to something.
- **Two cards describe the same product.** Mirror Client and Mirror API halve the apparent breadth of the section compared to featuring `Boilerplate-Express` in one of those slots. The user chose this knowingly.
