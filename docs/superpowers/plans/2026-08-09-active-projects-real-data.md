# Active Projects Real Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fabricated `projects` data behind the Active Projects section with four real repositories from the site owner's GitHub account, hide the `LIVE_DEMO` button for projects that have no deployment, and cover the section with a test suite that future content edits cannot break.

**Architecture:** Four files change, in a forced order. `src/components/ActiveProjects.test.tsx` is created first and must pass against the *existing placeholder* data — that is what proves its assertions derive from the `projects` array rather than from literal copy. Then the `Project` interface loosens (`liveUrl` optional, `imageUrl` deleted) and `ActiveProjects.tsx` gates the `LIVE_DEMO` link behind it. Only then can the real data land, because none of the four real projects has a live URL and the current required `liveUrl` would reject them.

**Tech Stack:** TypeScript, React 19, Vitest + jsdom + React Testing Library.

## Global Constraints

- No new dependencies.
- No change to `roles`, `domains`, `hero`, or `contact` in `content.ts`.
- Exactly four project entries. `.active-projects__grid` is `repeat(2, 1fr)` (`src/components/ActiveProjects.css:19-21`), so four cards fill the 2×2 desktop grid exactly; three would leave a visible hole.
- `ProjectStatus` stays `'active' | 'in-progress'`. Do not add an `'archived'` value.
- Three description strings contain an em dash `—` (U+2014), NOT a hyphen `-` and NOT an en dash `–`. Check the character carefully; it is easy to corrupt.
- Chip colours are fixed by the spec and are not the implementer's choice. Every technology keeps the colour it already has elsewhere in `content.ts`: React/TypeScript/Golang/Angular/Node.js cyan, Express violet, MongoDB amber. New labels: MySQL cyan, Redux/Protobuf/RxJS violet.
- Tests must derive every expectation from the imported `projects` array. Never assert on a literal name, description, chip label, or URL.
- Chips must be queried scoped to their own `.project-card`, never by a global text query. Unlike Core Stack, chip labels may legitimately repeat across project cards (`TypeScript` appears on two).
- Read anchor targets with `getAttribute('href')`, never the `.href` property. The DOM resolves `.href` to an absolute URL and appends a trailing slash to bare origins, so the placeholder `https://github.com` reads back as `https://github.com/` and a comparison against the data fails.
- Never run `git add -A` or `git add .`. This repository has an unstaged `README.md` deletion, a modified `vite.config.ts`, and untracked `CLAUDE.md` and `.playwright-mcp/` that must not be staged. Stage the exact files each task names.

---

### Task 1: Add a data-driven ActiveProjects test suite

`ActiveProjects` has no test file today. Create one, and make it pass against the **existing placeholder** `projects` (Telemetry Core / Signal UI / Vault API / DataStream, with chips like Kafka and ClickHouse and links to `https://example.com`). This task changes only the test file — do not touch `content.ts` or `ActiveProjects.tsx`. If the suite fails here, the assertions are still coupled to something they shouldn't be.

**Files:**
- Create: `src/components/ActiveProjects.test.tsx`

**Interfaces:**
- Consumes: `projects: Project[]` from `../data/content`; the DOM class names `ActiveProjects.tsx` emits — `.project-card`, `.project-card__name`, `.project-card__desc`, `.project-card__chips`, `.chip`, `.card-header__id`, `.project-card__actions`.
- Produces: the `cards(container)` helper and the `beforeEach` `IntersectionObserver` stub, both of which Task 2 extends with one more test.

- [ ] **Step 1: Write the test file**

Create `src/components/ActiveProjects.test.tsx` with exactly this content:

```tsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ActiveProjects from './ActiveProjects'
import { projects } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function cards(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.project-card'))
}

describe('ActiveProjects', () => {
  test('renders the section label', () => {
    render(<ActiveProjects />)
    expect(screen.getByText('// PROJECT_ARCHIVE')).toBeInTheDocument()
  })

  test('renders one card per project, names in order', () => {
    const { container } = render(<ActiveProjects />)
    const names = cards(container).map(
      c => c.querySelector('.project-card__name')?.textContent,
    )
    expect(names).toEqual(projects.map(p => p.name))
  })

  test('renders each project description', () => {
    const { container } = render(<ActiveProjects />)
    const descriptions = cards(container).map(
      c => c.querySelector('.project-card__desc')?.textContent,
    )
    expect(descriptions).toEqual(projects.map(p => p.description))
  })

  test('renders each card chips in order, scoped to that card', () => {
    const { container } = render(<ActiveProjects />)
    const chipsPerCard = cards(container).map(c =>
      Array.from(c.querySelectorAll('.project-card__chips .chip')).map(
        el => el.textContent,
      ),
    )
    expect(chipsPerCard).toEqual(projects.map(p => p.chips.map(chip => chip.label)))
  })

  test('renders each card header as its id followed by the underscored name', () => {
    const { container } = render(<ActiveProjects />)
    const headerIds = cards(container).map(
      c => c.querySelector('.card-header__id')?.textContent,
    )
    expect(headerIds).toEqual(
      projects.map(p => `${p.id} // ${p.name.toUpperCase().replace(/ /g, '_')}`),
    )
  })

  test('every card links to its repo url', () => {
    const { container } = render(<ActiveProjects />)
    const hrefs = cards(container).map(c =>
      c
        .querySelector('.project-card__actions a')
        ?.getAttribute('href'),
    )
    expect(hrefs).toEqual(projects.map(p => p.repoUrl))
  })
})
```

- [ ] **Step 2: Run the suite and verify it passes against the placeholder data**

Run: `npx vitest run src/components/ActiveProjects.test.tsx`

Expected: 6 passed. This is the point of the task — the assertions must already hold against the fabricated content, which is only possible if they read from the `projects` array.

If any test fails, the assertion is coupled to something the data does not control. Fix the test, not the data.

- [ ] **Step 3: Commit**

```bash
git add src/components/ActiveProjects.test.tsx
git commit -m "test: add data-driven ActiveProjects suite"
```

---

### Task 2: Make liveUrl optional, drop imageUrl, gate the LIVE_DEMO link

Real projects have no deployments, so `LIVE_DEMO` must be able to not render. `imageUrl` is declared on `Project` but set by no project, making the image block in the component and its CSS rules dead code — it goes with this change rather than surviving as a field nothing uses.

The data is untouched in this task. All four placeholders still set `liveUrl`, so the new test passes trivially here; it becomes load-bearing in Task 3 when the real data sets none.

**Files:**
- Modify: `src/data/content.ts:42-52` (the `Project` interface only)
- Modify: `src/components/ActiveProjects.tsx:31-35` and `:47-57`
- Modify: `src/components/ActiveProjects.css:58-74`
- Test: `src/components/ActiveProjects.test.tsx` (append one test)

**Interfaces:**
- Consumes: the `cards()` helper and `IntersectionObserver` stub from Task 1.
- Produces: `Project.liveUrl?: string` — Task 3 relies on being able to omit the property entirely. `Project.imageUrl` no longer exists; Task 3 must not set it.

- [ ] **Step 1: Write the failing test**

Append this test to `src/components/ActiveProjects.test.tsx`, inside the existing `describe` block, after the `'every card links to its repo url'` test:

```tsx
  test('renders LIVE_DEMO only for projects that have a live url', () => {
    const { container } = render(<ActiveProjects />)
    const liveLinks = Array.from(
      container.querySelectorAll('.project-card__actions a'),
    ).filter(a => a.textContent === 'LIVE_DEMO')
    expect(liveLinks.map(a => a.getAttribute('href'))).toEqual(
      projects.filter(p => p.liveUrl).map(p => p.liveUrl),
    )
  })
```

- [ ] **Step 2: Run it and confirm it passes against current data**

Run: `npx vitest run src/components/ActiveProjects.test.tsx`

Expected: 7 passed. Every placeholder project sets `liveUrl`, so `projects.filter(p => p.liveUrl)` is all four and the component currently renders all four buttons. There is no RED state available for this test until the data changes in Task 3 — that is expected and is why this test ships alongside the implementation rather than before it.

- [ ] **Step 3: Loosen the Project interface**

In `src/data/content.ts`, change the `Project` interface. Replace:

```ts
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  coordinates: string
  repoUrl: string
  liveUrl: string
  imageUrl?: string
  chips: TechChip[]
}
```

with:

```ts
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  coordinates: string
  repoUrl: string
  liveUrl?: string
  chips: TechChip[]
}
```

- [ ] **Step 4: Gate the LIVE_DEMO link and delete the image block**

In `src/components/ActiveProjects.tsx`, delete this block entirely (it sits between the `card-header` div and the `project-card__body` div):

```tsx
              {project.imageUrl && (
                <div className="project-card__image">
                  <img src={project.imageUrl} alt={project.name} />
                </div>
              )}
```

Then replace the actions block:

```tsx
                <div className="project-card__actions">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    VIEW_REPO
                  </a>
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    LIVE_DEMO
                  </a>
                </div>
```

with:

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

- [ ] **Step 5: Delete the orphaned image CSS**

In `src/components/ActiveProjects.css`, delete these three rules (lines 58-74), leaving the `.project-card:hover::after` rule above them and the `.project-card__body` rule below them intact:

```css
.project-card__image {
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
}

.project-card__image img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
  filter: grayscale(20%);
  transition: filter 0.3s;
}

.project-card:hover .project-card__image img {
  filter: grayscale(0%);
}
```

- [ ] **Step 6: Verify nothing else references the removed field**

Run: `grep -rn "imageUrl\|project-card__image" src/`

Expected: no output. If anything matches, remove it.

- [ ] **Step 7: Run the full suite and the typechecker**

Run: `npm run test`
Expected: all files pass, including 7 in `ActiveProjects.test.tsx`.

Run: `npx tsc -b`
Expected: exits 0 with no output. This is what catches a leftover `imageUrl` on any project object.

- [ ] **Step 8: Commit**

```bash
git add src/data/content.ts src/components/ActiveProjects.tsx src/components/ActiveProjects.css src/components/ActiveProjects.test.tsx
git commit -m "feat: hide LIVE_DEMO for projects without a deployment"
```

---

### Task 3: Replace the placeholder projects with the four real repositories

Swap the data. The test file from Tasks 1 and 2 must not be modified — it staying green while the content changes underneath it is the proof that it is data-driven.

**Files:**
- Modify: `src/data/content.ts:208-269` (the `projects` array only)

**Interfaces:**
- Consumes: `Project.liveUrl?: string` from Task 2 — every entry below omits the property, which only typechecks after Task 2 has landed.
- Produces: nothing later tasks import.

- [ ] **Step 1: Replace the projects array**

In `src/data/content.ts`, replace the entire `projects` array with exactly this:

```ts
export const projects: Project[] = [
  {
    id: 'PROJ-001',
    name: 'The Movie App',
    description:
      'Browses the full TMDB catalogue through a Redux-backed store — filtering, search and trailer playback held in one predictable state tree.',
    status: 'active',
    coordinates: '[X:04, Y:12]',
    repoUrl: 'https://github.com/AmmarBerkovic/The-Movie-App',
    chips: [
      { label: 'React',      color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'Redux',      color: 'violet' },
    ],
  },
  {
    id: 'PROJ-002',
    name: 'Go User API',
    description:
      'RESTful user service on a layered Go architecture — Chi routing over GORM repositories, with paginated reads and Protobuf-generated models.',
    status: 'in-progress',
    coordinates: '[X:11, Y:07]',
    repoUrl: 'https://github.com/AmmarBerkovic/Go-User-API',
    chips: [
      { label: 'Golang',   color: 'cyan'   },
      { label: 'MySQL',    color: 'cyan'   },
      { label: 'Protobuf', color: 'violet' },
    ],
  },
  {
    id: 'PROJ-003',
    name: 'Mirror Client',
    description:
      'Server-rendered Angular workspace for continuous activity tracking — Material-driven records, filters and progress views over the Mirror API.',
    status: 'in-progress',
    coordinates: '[X:08, Y:19]',
    repoUrl: 'https://github.com/AmmarBerkovic/MirrorFE',
    chips: [
      { label: 'Angular',    color: 'cyan'   },
      { label: 'TypeScript', color: 'cyan'   },
      { label: 'RxJS',       color: 'violet' },
    ],
  },
  {
    id: 'PROJ-004',
    name: 'Mirror API',
    description:
      'Express and Mongoose service behind Mirror — CRUD endpoints over MongoDB collections with query-driven filtering across records.',
    status: 'in-progress',
    coordinates: '[X:15, Y:03]',
    repoUrl: 'https://github.com/AmmarBerkovic/MirrorBE',
    chips: [
      { label: 'Node.js', color: 'cyan'   },
      { label: 'Express', color: 'violet' },
      { label: 'MongoDB', color: 'amber'  },
    ],
  },
]
```

- [ ] **Step 2: Confirm the test file was not touched**

Run: `git diff --stat -- src/components/ActiveProjects.test.tsx`

Expected: no output. Any change here means the suite was not actually data-driven and the coupling was papered over.

- [ ] **Step 3: Run the full suite**

Run: `npm run test`

Expected: all files pass. The `'renders LIVE_DEMO only for projects that have a live url'` test now asserts an empty array against zero rendered `LIVE_DEMO` links — this is where it starts doing real work.

- [ ] **Step 4: Confirm no LIVE_DEMO link renders anywhere**

Run: `grep -c "liveUrl" src/data/content.ts`

Expected: `1` — the sole remaining occurrence is the optional property on the `Project` interface. No project sets it.

- [ ] **Step 5: Confirm the fabricated technologies are gone from the site**

Run: `grep -rn "Kafka\|ClickHouse\|dbt\|Python\|example.com" src/`

Expected: no output. These were the last invented chips and links in `content.ts`.

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc -b`
Expected: exits 0.

Run: `npm run lint`
Expected: exits 0. One pre-existing `react-hooks/exhaustive-deps` warning at `src/components/CommandCenter.tsx:23` is expected and unrelated to this branch — do not fix it.

- [ ] **Step 7: Commit**

```bash
git add src/data/content.ts
git commit -m "content: replace placeholder projects with real repositories"
```
