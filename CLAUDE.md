# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck (`tsc -b`) then production build via Vite
- `npm run lint` — ESLint over the whole repo
- `npm run test` — run all tests once (Vitest)
- `npm run test:watch` — Vitest in watch mode
- Run a single test file: `npx vitest run src/components/ExperienceLogs.test.tsx`
- Run tests matching a name: `npx vitest run -t "renders system badge"`
- `npm run preview` — serve the production build locally

No dedicated typecheck script beyond `tsc -b` (run as part of `build`); there is no `test:coverage` script.

## Architecture

This is a single-page personal portfolio site (Vite + React 19 + TypeScript, no router). `App.tsx` renders `Nav` plus a fixed sequence of full-viewport `<section>` components in `main`, each with an `id` used for in-page anchor navigation: `CommandCenter` (hero), `CoreStack`, `ExperienceLogs`, `ActiveProjects`, `ContactUplink`.

**Content is centralized, components are dumb.** All copy, links, and structured data (nav links, hero text, tech domains, work history, projects, contact info) live in `src/data/content.ts` as typed constants/interfaces. Components import from there rather than hardcoding text — when changing site copy or adding a project/role, edit `content.ts`, not the component markup.

**Scroll-reveal animation pattern.** Nearly every section component uses the `useIntersection` hook (`src/hooks/useIntersection.ts`) to detect when it enters the viewport, then conditionally applies a `visible` class alongside a base reveal class to trigger CSS transitions. This pattern (`const [ref, isVisible] = useIntersection<HTMLElement>()` on the section root) is the standard way new sections should animate in. The observer fires once and disconnects, so `isVisible` latches true — anything that must keep tracking scroll needs its own hook, not this one.

Two reveal classes, both in `index.css`, and the choice matters:

- **`.animate-boot`** — a CRT power-on (`scaleY`) for the three card types: `.domain-card`, `.project-card`, `.entry`.
- **`.animate-entry`** — the original fade-and-rise, for everything that is *not* a card: the hero's status row and button row, and the contact layout. A power-on reads as a rendering glitch on those.

A `clip-path` wipe would be the better reveal, but `clip-path` is already spending itself on the notched top-right corner of the cards, which is why `.animate-boot` scales instead.

**Motion hooks.** Five hooks beyond `useIntersection` drive the site's animation, all in `src/hooks/`:

| Hook | Used by | Note |
|---|---|---|
| `useCountUp` | Experience Logs metrics | Splits a value into numeric runs and literal text, so `2,044 → 63` animates both figures, `3.5 YRS` keeps its decimal, and `MEAN` holds still. Lands on the authored string, never a reconstruction. |
| `useDecode` | All four section labels and headings | Resolves text out of glyph noise. Same length throughout, so monospaced headings cannot shift layout. |
| `useScrollProgress` | Nav scan readout | Returns a 0–1 ratio of the document. |
| `useParallax` | Hero grid (0.6×) and rings (0.3×) | Writes `transform` straight to the node inside rAF — deliberately *not* React state, which would re-render the hero every scroll frame. Needs raw pixels, which is why it does not reuse `useScrollProgress`. |
| `prefersReducedMotion` | `useCountUp`, `useDecode`, `useParallax` | Plain function, not a hook. |

**Reduced motion has two separate mechanisms, and missing either is a bug.** The global block in `index.css` collapses CSS animation and transition durations — but it cannot touch a `requestAnimationFrame` loop, which runs straight through it. **Any JS-driven animation must call `prefersReducedMotion()` itself.** Two rules follow:

- Every reveal class must resolve to its *finished* state in that block, never be skipped — a card left at `scaleY(0.04)` is invisible forever. Add new reveal classes to the existing selector list.
- Decoration resolves to nothing under reduced motion (`useParallax`); information stays live (`useScrollProgress` reports a position, so the nav readout keeps working).

**Decorative pseudo-elements must not carry `content` text.** CSS `content` counts toward the accessible name, and `opacity: 0` does not exclude it — a first pass at the ghost-button brackets made every project link announce itself as "[ VIEW_REPO ]". Draw such marks with borders instead (`.btn-ghost::before/::after`, `.section-label::after`, the hero corner brackets all do this).

**Styling.** Plain CSS per component (`ComponentName.css` colocated next to `ComponentName.tsx`), no CSS-in-JS or Tailwind. Global design tokens (colors, fonts, spacing) are CSS custom properties defined in `src/index.css` under `:root` — use these variables (`--color-cyan`, `--color-border`, `--space-unit`, etc.) instead of hardcoding values. The visual theme is a retro terminal/HUD aesthetic (scanline overlay, monospace labels, bracket-cornered fields, `TRANSMIT_PACKET >>`-style button copy) — match this tone when adding UI text or components. Shared layout classes like `.section-inner` and cross-cutting styles live in `App.css`.

**Contact form** (`ContactUplink.tsx`) sends mail client-side via `@emailjs/browser`, reading service/template/public key from `VITE_EMAILJS_*` env vars (`.env`, not committed). It tracks a `SendStatus` state machine (`idle` → `sending` → `success`/`error`) with an `isMounted` ref guard to avoid state updates after unmount.

**React Compiler** is enabled via `babel-plugin-react-compiler` (wired into `vite.config.ts` through `@rolldown/plugin-babel` and `reactCompilerPreset()`), so manual `useMemo`/`useCallback` optimization is generally unnecessary.

## Testing

Vitest + jsdom + React Testing Library. Setup file `src/test-setup.ts` just imports `@testing-library/jest-dom`. Tests colocate as `ComponentName.test.tsx` / `hookName.test.ts` next to the source file. Since most components use `useIntersection`, tests that render them typically stub `IntersectionObserver` globally in `beforeEach` (see `CommandCenter.test.tsx`) — otherwise the observer callback never fires and `visible` state never flips. To drive a reveal rather than suppress it, capture the observer callback and call it (see `ExperienceLogs.test.tsx`).

Three more stubs recur, none of which jsdom provides:

- **`matchMedia` does not exist in jsdom.** `prefersReducedMotion()` guards for that and returns `false`, so tests animate by default; stub it with `{ matches: true }` to exercise the reduced-motion path.
- **Scroll geometry must be defined by hand.** `Object.defineProperty` `scrollTop` / `scrollHeight` / `clientHeight` on `document.documentElement`, then dispatch a `scroll` event (see `useScrollProgress.test.ts`, `Nav.test.tsx`).
- **EmailJS is mocked** in `ContactUplink.test.tsx` via `vi.mock('@emailjs/browser')`. A send that never settles is how the in-flight state gets observed.

Animations driven by `requestAnimationFrame` settle asynchronously — assert where they *land* with `waitFor`, not what they show mid-flight.

## Content conventions

**`src/data/content.ts` is the only place site copy lives.** Two invariants are enforced by the
Vitest suite: a technology must keep one chip colour site-wide, and a technology must not repeat
across Core Stack cards.

**`src/data/content.previous.ts` holds superseded copy verbatim.** It is a record, not live
content — do not edit it when copy changes.

**`hero.cv.size` in `content.ts` states the byte size of `/CV.pdf`** (the CV rendered from the
`CV` repo's `index.html`). Update it in the same commit whenever the PDF is replaced.

**`docs/` is intentionally untracked and gitignored.** Thirteen spec and plan files were public
here and recorded superseded CV claims as approved decisions; they read worse than the claims
did. Kept locally only. Do not re-add planning docs to the tracked tree.

## Deploying

The default branch is **`master`** (not `main`), tracking `origin/master`. `npm run lint`,
`npm run build` and `npm run test` gate changes.

**Pushing does not deploy.** The Vercel project is not git-connected, so a push to GitHub
ships nothing — the CLI is the only path to production:

```
vercel --prod --archive=tgz --yes
```

`--archive=tgz` is not optional here: plain `vercel --prod` dies at the create-deployment
POST with `read ECONNRESET` on this machine. Production alias:
https://portfolio-lab-virid.vercel.app

One consequence: the tarball carries the working tree **without `.git`**, so the
`emit-sitemap` plugin in `vite.config.ts` cannot read a commit date and ships `sitemap.xml`
with `<loc>` and no `<lastmod>`. That is the plugin working as designed — omitting the date
beats guessing it — so do not chase the missing element as a bug. Restoring it would mean
passing the date in as a build-time env var rather than reading git.

The CV v3 alignment is merged and live: it removed the Glide title, the London Stock Exchange
client, PostgreSQL, Spring Boot and the 99.9% availability tile; added the real figures; swapped
invented hero telemetry for location, availability and languages; converted the hero to WebP with
declared dimensions (CLS 0.097 → 0.001, page weight 285 KB → 137 KB); and added a meta
description, Open Graph tags with a 1200×630 card at `public/og.jpg`, `robots.txt`, `sitemap.xml`
and reduced-motion handling.

The motion work is merged and live: metric count-up, decoding section headings, a blinking
caret on section labels, a nav scan readout with progress bar, the card boot reveal, a hover
scan sweep and chip cascade, a counter-rotating hero ring, bracketed ghost buttons, a contact
form that shows a send in progress, and hero parallax. It added ~2.2 KB gzipped and no
dependency; the bundle is 71.19 KB gzipped JS and 5.93 KB gzipped CSS.

## Known open items

- **Core Stack sits above Experience Logs**, and the six side projects outweigh the two real jobs
  by page area. Reordering and trimming are Ammar's call.
- **Client-rendered Vite SPA with a 1 KB document** — everything is in JS. Fine for indexing,
  awkward for a candidate selling technical SEO. Prerendering has not been attempted.
- **EmailJS contact form works.** Its public key is in the bundle by design, so the domain
  allowlist and captcha should be enabled in the EmailJS dashboard to keep the inbox clean.
- **The card boot reveal squashes content on the tall log entries**, which Ammar flagged as the
  one animation he might want reverted (`2001d1a`). Putting `.entry` back on `.animate-entry`
  in `ExperienceLogs.tsx` keeps the grid cards booting while the records go back to the fade.
- **The hero rings drift out of alignment with the photo frame.** They are concentric
  decoration around it, and parallax at 0.3× puts them ~120px off-centre by 400px of scroll.
  Deliberate and approved, but the rate is one number in `CommandCenter.tsx` if it grates.
