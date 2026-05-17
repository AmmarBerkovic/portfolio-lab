# Design Polish — Gap Fixes

**Date:** 2026-05-17  
**Scope:** Close 5 visual gaps between DESIGN.md spec and current UI  
**Approach:** Option A — all 5 gaps in one pass, CSS/layout only, no logic changes

---

## Background

A gap analysis comparing the DESIGN.md spec against the built UI identified 5 differences. All are purely visual. The original DESIGN.md was committed and removed from the repo (commit `3bd15d0` / `32c2f52`); it is recoverable via git. Two attempts at a hero right panel were made and reverted; this spec resolves that with a final, approved design.

---

## Fix 1 — Hero: two-column layout with HUD profile frame

**Files:** `src/components/CommandCenter.tsx`, `src/components/CommandCenter.css`

**Layout:** The hero section becomes a two-column CSS grid (50/50) on desktop, collapsing to single column (stacked) on mobile (≤767px). On mobile the frame is hidden.

**Left column:** No changes to existing JSX or styles.

**Right column — `.command-center__frame`:**
- New `<div className="command-center__frame">` wrapping an `<img>` pointing to `src/assets/hero.png` (imported as `heroImg`)
- Frame border: `1px solid rgba(34, 211, 238, 0.35)`, chamfered **top-left** corner via `clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)`
- Photo: `width: 100%`, `aspect-ratio: 3/4`, `object-fit: cover`, `filter: grayscale(15%) contrast(1.05)`, `opacity: 0.92`
- Scan-line overlay: `::after` pseudo-element with `repeating-linear-gradient` horizontal lines at 4px pitch, `rgba(0,0,0,0.08)` opacity
- Coordinate label top-left: `PERS_ID: ABK-001` — absolute-positioned `<span>`, `font-size: 8px`, cyan at 70% opacity
- Coordinate label bottom-right: `[X:04, Y:12]` — same style
- Status bar: sibling `<div className="command-center__frame-status">` below the frame (outside clip-path), same border on left/right/bottom, flex row, `IDENTITY_VERIFIED` label in cyan + `SYS // 2026` in muted

---

## Fix 2 — Section backgrounds: radial gradients

**Files:** `src/components/CoreStack.css`, `src/components/ExperienceLogs.css`, `src/components/ActiveProjects.css`, `src/components/ContactUplink.css`

Each of the four non-hero sections gains a `background` with a subtle radial gradient layered over `var(--color-bg)`. Gradient origins vary per section to avoid repetition:

| Section | Origin |
|---------|--------|
| CoreStack | `20% 50%` |
| ExperienceLogs | `80% 40%` |
| ActiveProjects | `30% 60%` |
| ContactUplink | `70% 50%` |

Gradient value (same structure for all, only origin differs):
```css
background:
  radial-gradient(ellipse 70% 60% at <origin>, rgba(22, 38, 46, 0.85) 0%, transparent 70%),
  var(--color-bg);
```

---

## Fix 3 — Domain cards: chamfered corners

**File:** `src/components/CoreStack.css`

Add `clip-path` to `.domain-card` matching the existing project card treatment:
```css
clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
```

---

## Fix 4 — Cards: inner glow

**Files:** `src/components/CoreStack.css`, `src/components/ActiveProjects.css`

Add inset box-shadow to both `.domain-card` and `.project-card`:
```css
box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06);
```

On hover, increase glow intensity:
```css
box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06), 0 0 20px rgba(34, 211, 238, 0.08);
```
(Project cards already have an outer `box-shadow` on hover — this merges with it.)

---

## Fix 5 — Technical grid overlay

**Files:** `src/components/CoreStack.css`, `src/components/ExperienceLogs.css`, `src/components/ActiveProjects.css`, `src/components/ContactUplink.css`

Add a `::before` pseudo-element to each section's wrapper (or apply directly to the section element) with a 1px CSS grid at 7% opacity, 32px spacing:

```css
section::before {
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

Each section must have `position: relative` and its `.section-inner` must have `position: relative; z-index: 1` to sit above the overlay.

---

## Mobile behaviour

| Change | Mobile (≤767px) |
|--------|----------------|
| Hero frame | Hidden (`display: none`); hero returns to single column |
| Section gradients | Applied as-is (already responsive) |
| Domain card chamfers | Applied as-is |
| Inner glow | Applied as-is |
| Grid overlay | Applied as-is |

---

## Out of scope

- Content changes (names, dates, project data)
- Animation changes
- Nav changes
- Any logic or state changes
