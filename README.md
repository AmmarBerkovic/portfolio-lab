# portfolio-lab

Personal portfolio site for Ammar Berkovic — a single-page React application styled as a retro terminal / HUD console.

Five full-viewport sections (Command Center, Core Stack, Experience Logs, Active Projects, Contact Uplink) scroll-reveal as they enter the viewport. No router, no UI framework, no CSS-in-JS.

## Stack

- **React 19** with the [React Compiler](https://react.dev/learn/react-compiler) enabled, so manual `useMemo`/`useCallback` is generally unnecessary
- **TypeScript**, **Vite** (Rolldown), **plain CSS**
- **Vitest** + jsdom + React Testing Library
- **EmailJS** for the contact form — no backend

## Running it

```bash
npm install
npm run dev
```

The contact form needs EmailJS credentials in a `.env` file (not committed):

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

Everything else runs without configuration.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run test` | Run the suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint over the repo |
| `npm run preview` | Serve the production build locally |

## How it's put together

**Content is centralized; components are dumb.** Every piece of copy, every link, and all structured data — nav links, hero text, technology domains, work history, projects, contact details — lives in `src/data/content.ts` as typed constants. Components import from there rather than hardcoding text. To change what the site says, edit that one file.

**Scroll-reveal is one hook.** `useIntersection` (`src/hooks/useIntersection.ts`) reports when a section enters the viewport; the section then applies a `visible` class alongside `animate-entry` and CSS handles the transition.

**Styling is colocated plain CSS.** `ComponentName.css` sits next to `ComponentName.tsx`. Design tokens — colors, fonts, spacing — are CSS custom properties defined on `:root` in `src/index.css`. Shared layout lives in `App.css`.

**Tests are data-driven.** Section suites derive their expectations from the imported data rather than from literal copy, so editing content cannot break them. Because every section uses `useIntersection`, tests stub `IntersectionObserver` globally in `beforeEach`.
