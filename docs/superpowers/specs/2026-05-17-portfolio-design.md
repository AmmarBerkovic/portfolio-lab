# Portfolio Design Spec — AMMAR_BERKOVIC // PORTFOLIO_V2.4

**Date:** 2026-05-17  
**Status:** Approved

---

## Overview

A single-page application portfolio for a Senior Full-Stack Engineer, styled as a "LAB_OS v2.4" terminal command center. The aesthetic is a hybrid of Minimalism and Glassmorphism with a rigid Technical Grid. Visual interest comes from glowing borders, translucency, and animated entry effects rather than heavy textures.

---

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| CSS strategy | Plain CSS + CSS custom properties | Maps directly to DESIGN.md tokens, zero dependencies |
| Animation | CSS `@keyframes` + `useIntersection` hook | No library needed; glitch/glow effects are CSS-native |
| Content | Centralized in `data/content.ts` | Single file to swap placeholder → real content |
| Contact form | EmailJS | Sends real email from browser, no backend required |
| Scope | All 5 sections in one pass | Full SPA |

---

## File Structure

```
src/
├── index.css                  # CSS custom properties (design tokens) + global resets
├── App.css                    # Layout shell styles
├── App.tsx                    # Root: nav + section composition
├── hooks/
│   └── useIntersection.ts     # IntersectionObserver hook for scroll-triggered entry animations
├── components/
│   ├── Nav.tsx                # Fixed floating nav with section anchors
│   ├── CommandCenter.tsx      # Hero section
│   ├── CoreStack.tsx          # Skills/tech domains
│   ├── ExperienceLogs.tsx     # Work history
│   ├── ActiveProjects.tsx     # Project cards
│   └── ContactUplink.tsx      # EmailJS contact form
└── data/
    └── content.ts             # All placeholder content in one place
```

---

## Design System (`index.css`)

All tokens from `DESIGN.md` mapped to CSS custom properties:

```css
:root {
  /* Colors */
  --color-bg:             #0b1326;
  --color-surface:        #171f33;
  --color-surface-high:   #222a3d;
  --color-border:         rgba(148, 163, 184, 0.2);
  --color-cyan:           #22d3ee;
  --color-amber:          #fbbf24;
  --color-violet:         #a78bfa;
  --color-text:           #dae2fd;
  --color-text-muted:     #c3c7ca;

  /* Typography */
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;

  /* Spacing */
  --space-unit:       4px;
  --gutter:           24px;
  --margin-edge:      40px;
  --container-max:    1280px;
}
```

Global resets include: `box-sizing: border-box`, custom 4px scrollbar (metallic blue → cyan on hover), `scroll-behavior: smooth`, scanline overlay as `body::before` pseudo-element.

Google Fonts: `JetBrains Mono` (400, 500, 700) + `Inter` (400, 600) imported in `index.html`.

---

## Animation Strategy

A single `useIntersection(ref, { threshold: 0.15 })` hook returns a boolean `isVisible`. Components add a `.visible` class when true. CSS handles the rest:

- **Glitch/flicker entry** (headline): `@keyframes glitch` with `clip-path` slices and translate jitter, triggered once on `.visible`
- **Fade + slide entry** (cards, timeline entries): `opacity: 0; transform: translateY(16px)` → `opacity: 1; transform: none` with `transition` on `.visible`
- **Border glow hover**: CSS `transition` on `border-color` + `box-shadow` — no JS involved
- **Status LED blink**: CSS `@keyframes` on the indicator dots, staggered with `animation-delay`

---

## Section Specs

### Nav
- Fixed top, `backdrop-filter: blur(12px)`, 60% opaque surface background
- Anchors: `CORE`, `STACK`, `LOGS`, `ARCHIVE`, `SIGNAL` — JetBrains Mono, all-caps, letter-spaced
- Active anchor: cyan color + subtle underline glow, updated by `useIntersection` watching each section
- Mobile: hamburger → full-screen overlay menu

### Command Center (Hero)
- Full viewport height
- `AMMAR_BERKOVIC` in `headline-xl` (48px, bold) with glitch entry animation + cyan `text-shadow`
- Subtitle: `SENIOR FULL-STACK ENGINEER // LAB_OS v2.4` in `label-md`
- Status row: three LED indicators (`SYSTEMS_ONLINE`, `AVAILABLE_FOR_HIRE`, `ENCRYPTION_ACTIVE`) with colored dots, blink on sequentially
- CTAs: `VIEW_ARCHIVE` (primary, solid cyan) + `OPEN_UPLINK` (secondary, ghost with glow hover)
- Background: radial gradient `#16262e` → `#0b1326` + subtle dot-grid overlay

### Core Stack
- 3-col desktop grid, 1-col mobile
- Three domains: **Backend Architecture**, **Interface Engineering**, **Data & Systems**
- Each card: Terminal header bar (`MOD-00X // DOMAIN_NAME` + green status dot), domain title, description, tech chips
- Tech chips: rectangular, color-coded (cyan/amber/violet), 10% bg opacity
- Hover: border → cyan + `0 0 8px` outer glow (CSS transition)

### Experience Logs
- Vertical timeline as system audit log
- Left column: date range in `label-md` all-caps
- Right column: role + company (`headline-lg`), description (`body-md`), tech chips
- 1px vertical cyan connector line + glowing square marker per entry
- Scroll-enter: fade + slide-left via `.visible` class (staggered `animation-delay` per entry)
- Three placeholder roles: 2015–present

### Active Projects
- 2-col desktop grid, 1-col mobile; four placeholder projects
- Card: Terminal header (`PROJECT_ID // PROJ-00X` + status dot), name, description, coordinate label (`[X:14, Y:92]`), tech chips, `VIEW_REPO` + `LIVE_DEMO` ghost buttons
- Chamfered corners via `clip-path: polygon(...)` (45° cut top-right)
- Hover: border glow

### Contact Uplink
- Fields: `IDENTIFIER`, `RELAY_ADDRESS`, `MESSAGE_PACKET` — bottom-border-only, bracket corner details, block caret on focus
- Submit: `TRANSMIT_PACKET >>` — solid cyan, full width
- Button states: idle → `TRANSMITTING...` → `PACKET_DELIVERED` (green) or `TRANSMISSION_FAILED` (red)
- EmailJS: `emailjs.send()` wired to submit handler; credentials stored in `.env` (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`)
- Sidebar: GitHub, LinkedIn, email as terminal command-style links

---

## Responsiveness

| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Full design as specified |
| Tablet (768–1023px) | 2-col cards, nav still visible |
| Mobile (≤767px) | 1-col everything, hamburger nav, `headline-lg-mobile` (24px) for headings |

---

## Out of Scope

- Real-time system telemetry
- 3D WebGL background shaders
- PGP-encrypted messaging
- Backend / server-side anything
