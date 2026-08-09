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

**Scroll-reveal animation pattern.** Nearly every section component uses the `useIntersection` hook (`src/hooks/useIntersection.ts`) to detect when it enters the viewport, then conditionally applies a `visible` class alongside a base `animate-entry` class to trigger CSS transitions. This pattern (`const [ref, isVisible] = useIntersection<HTMLElement>()` on the section root) is the standard way new sections should animate in.

**Styling.** Plain CSS per component (`ComponentName.css` colocated next to `ComponentName.tsx`), no CSS-in-JS or Tailwind. Global design tokens (colors, fonts, spacing) are CSS custom properties defined in `src/index.css` under `:root` — use these variables (`--color-cyan`, `--color-border`, `--space-unit`, etc.) instead of hardcoding values. The visual theme is a retro terminal/HUD aesthetic (scanline overlay, monospace labels, bracket-cornered fields, `TRANSMIT_PACKET >>`-style button copy) — match this tone when adding UI text or components. Shared layout classes like `.section-inner` and cross-cutting styles live in `App.css`.

**Contact form** (`ContactUplink.tsx`) sends mail client-side via `@emailjs/browser`, reading service/template/public key from `VITE_EMAILJS_*` env vars (`.env`, not committed). It tracks a `SendStatus` state machine (`idle` → `sending` → `success`/`error`) with an `isMounted` ref guard to avoid state updates after unmount.

**React Compiler** is enabled via `babel-plugin-react-compiler` (wired into `vite.config.ts` through `@rolldown/plugin-babel` and `reactCompilerPreset()`), so manual `useMemo`/`useCallback` optimization is generally unnecessary.

## Testing

Vitest + jsdom + React Testing Library. Setup file `src/test-setup.ts` just imports `@testing-library/jest-dom`. Tests colocate as `ComponentName.test.tsx` / `hookName.test.ts` next to the source file. Since most components use `useIntersection`, tests that render them typically stub `IntersectionObserver` globally in `beforeEach` (see `CommandCenter.test.tsx`) — otherwise the observer callback never fires and `visible` state never flips.
