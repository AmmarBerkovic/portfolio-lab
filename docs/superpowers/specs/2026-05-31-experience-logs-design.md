# Experience Logs — Split Terminal Redesign

**Date:** 2026-05-31  
**Status:** Approved

---

## Overview

Replace the current vertical timeline in `ExperienceLogs.tsx` with a full-viewport Split Terminal layout. The section occupies exactly `100vh`. A narrow left panel holds a scannable role list; a wide right panel shows the expanded detail of whichever role is active. The design matches the existing HUD aesthetic (corner brackets, scan-line, grid background, cyan palette).

---

## Layout

| Zone | Width | Purpose |
|---|---|---|
| Left panel | 38% | Compact role list + timeline connector |
| Divider | 1px | `rgba(34, 211, 238, 0.15)` vertical line |
| Right panel | 62% | Expanded role detail |

The section is `position: relative; height: 100vh; overflow: hidden`. The existing grid-line `::before` pseudo-element is reused.

---

## Left Panel

### Structure
- **Header bar** — `SYSTEM_AUDIT_LOG` label left, `3 ENTRIES` count right. Background `#22d3ee08`, bottom border `1px solid #22d3ee22`.
- **Role list** — three `<button>` entries, flex column, no gap.
- **Footer strip** — static text `CLICK_ENTRY_TO_EXPAND`, 7px mono, muted.

### Each role entry
- Layout: flex row — glowing square marker (7×7px, `box-shadow: 0 0 6px cyan`) → meta column (date, title, company) → status badge (`ACTIVE` / `ARCHIVED`).
- Active state: `border-left: 2px solid var(--color-cyan)`, background `#22d3ee0d`, full brightness.
- Inactive state: `opacity: 0.45`.
- **Hover** (inactive only): `filter: brightness(1.4)`, left-border color brightens to `#22d3ee66`, background `#22d3ee06`. No layout shift. Transition `0.15s ease`.

### Vertical connector line
`::before` pseudo on the list container — `left: 0, top: 8px, bottom: 8px, width: 1px`, gradient `cyan → transparent`.

---

## Right Panel

### Header strip
- Left: `PERSONNEL_RECORD_SYS v2.4` (8px, muted) + active record ID e.g. `LOG-001 // RECORD_ACTIVE` (9px, cyan).
- Right: pulsing live dot + `LIVE_VIEW` label. Dot animates `opacity 1 → 0.3` over 1.5s infinite.
- Bottom border `1px solid #22d3ee22`, background `#22d3ee06`.

### Content area
All of the following are driven by the `activeRole` state variable (index 0–2):

| Element | Value source | Style |
|---|---|---|
| Ghost number | `LOG-00{index+1}` | 180px, weight 900, opacity 0.035, cyan, absolute top-right |
| Date range | `role.dateRange` | 10px mono, 4px letter-spacing, cyan |
| Role title | `role.title` | 28px, weight 700, `#f1f5f9`, line-height 1.15 |
| Company | `// {role.company}` | 13px mono, muted |
| Description | `role.description` | 13px sans, `#94a3b8`, line-height 1.7, max-width 520px |
| Tech chips | `role.chips` | Existing chip styles |

### Metrics footer
Three key figures extracted **from the description text** (hardcoded per role in `content.ts` as a new `metrics` array on each `Role`). Example for LOG-001:

```ts
metrics: [
  { label: 'EVENTS/DAY',        value: '4M+' },
  { label: 'LATENCY_REDUCTION', value: '83%' },
  { label: 'TENURE',            value: '3 YRS' },
]
```

Displayed as a flex row of `label / value` pairs. Right side: `← → NAVIGATE_RECORDS` hint (8px, muted).

### Corner brackets
Four `<span>` elements with `position: absolute`, matching the CommandCenter HUD frame pattern. 12×12px, `border-color: #22d3ee`.

### Scan-line
`position: absolute` element, `height: 1px`, `background: linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)`. CSS animation sweeps `top: 0 → 100%` over 4s, repeats infinite. Pointer-events none.

---

## Interaction

### Switching roles
State: `const [activeRole, setActiveRole] = useState(0)` in `ExperienceLogs`.

On click of a left-panel entry:
1. Trigger exit animation on right-panel content: `opacity: 0`, `transform: translateX(8px)`, duration `100ms`.
2. After 100ms, update `activeRole` state.
3. Right-panel content enters: `opacity: 0 → 1`, `transform: translateX(-8px) → none`, duration `200ms`.

Implementation: a `transitioning` boolean state. On click → set `transitioning: true` → `setTimeout(100ms, () => { setActiveRole(i); setTransitioning(false) })`. CSS classes `role-detail--exit` and `role-detail--enter` handle the transforms.

---

## Data Model Changes

Add `metrics` array to the `Role` interface in `content.ts`:

```ts
export interface RoleMetric {
  label: string
  value: string
}

export interface Role {
  // ...existing fields
  metrics: RoleMetric[]
}
```

Each of the three roles in `roles[]` gets a `metrics` array of three entries.

---

## Mobile (`max-width: 767px`)

Stack vertically:
- Left panel becomes a compact horizontal scroll row of role name + date pills at the top of the section. Tapping a pill fires the same `setActiveRole` click handler as the desktop list.
- Right panel takes remaining height and shows the active role's full detail.
- `height: auto` on the section (no longer `100vh` — content dictates height).

---

## Files Changed

| File | Change |
|---|---|
| `src/components/ExperienceLogs.tsx` | Full rewrite of JSX + state logic |
| `src/components/ExperienceLogs.css` | Full rewrite of styles |
| `src/data/content.ts` | Add `RoleMetric` interface + `metrics` field to each role |

No new files. No changes to other components.
