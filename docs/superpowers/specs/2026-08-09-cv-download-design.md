# Command Center — CV Download Button

**Date:** 2026-08-09
**Status:** Approved
**Scope:** Add a download link for `CV.pdf` to the HUD frame footer in `CommandCenter`, matching the Stitch design. Moves the PDF into `public/`, removes the `.gitignore` rule that excludes it, adds a `cv` block to the `hero` data, and covers the link with a test.

## Background

The Stitch project *Modern Tech Lab Portfolio* (`projects/2575579259492182174`), screen *Portfolio - Refined Hero Section*, gained a new element in its HUD frame footer: a full-width bordered link below the `TMP`/`HRT` data rows, inside the same bracket-cornered card that holds the photo. Left side is a download icon plus the label `EXPORT_MANIFEST.PDF`; right side is a size hint. The mockup styles it `border-tertiary/20` over `bg-tertiary/5`, lifting to `bg-tertiary/10` on hover with the label transitioning to full tertiary.

`CV.pdf` already exists at the repository root (161,824 bytes). It has served as the source of truth for the `roles` and `domains` content cycles but has never been served by the site, and has never been tracked by git.

## Goals

- A visitor can download the CV in one click from the hero, without leaving the page.
- The button matches the Stitch mockup's placement and treatment.
- The link is covered by a test that fails if the `href` or `download` attribute regresses.

## Non-goals

- No other changes to `CommandCenter` — the badge, headings, bio, status indicators, and the two existing CTAs are untouched.
- No changes to `roles`, `domains`, `projects`, or `contact`.
- No new dependencies.
- The hero still says "SENIOR FULL-STACK ENGINEER" against the CV's "Full Stack Engineer". Carried forward from the Experience Logs spec; still out of scope.
- No redaction of the PDF. Considered and declined — see Risks.

## The file

`CV.pdf` moves from the repository root to `public/CV.pdf`. Vite serves `public/` at the site root verbatim, so it resolves at `/CV.pdf` with no import, no hashing, and no bundling.

The trailing block of `.gitignore` is removed:

```
# CV source (contains PII — never commit)
CV.pdf
```

That pattern is unanchored, so it matches at any depth — leaving it in place would silently exclude `public/CV.pdf` too. Since Vercel builds from the git repository, the asset would be absent from every deployment and the button would 404 in production while working locally. Removing the rule is therefore load-bearing, not incidental tidying.

This reverses a deliberate decision recorded in the gitignore comment. It was raised with the user, who chose to commit the PDF as-is over the three alternatives offered (a redacted public copy, an external host, Vercel Blob).

## Data shape

`hero` (`src/data/content.ts:67-78`) gains a `cv` block:

```ts
cv: {
  label:    'EXPORT_MANIFEST.PDF',
  href:     '/CV.pdf',
  fileName: 'Ammar-Berkovic-CV.pdf', // what the browser saves it as
  size:     '[158KB]',               // update when replacing public/CV.pdf
},
```

`hero` is an inferred object literal, not a declared interface, so no type changes are needed. This follows the codebase rule that components hold no copy.

`fileName` is separate from `href` on purpose. The `download` attribute renames the file on save, so a recruiter's Downloads folder gets a name that identifies its owner rather than a generic `CV.pdf` that collides with every other applicant's.

`size` is a hardcoded string, chosen over a runtime `HEAD` request for `Content-Length`. 161,824 bytes is 158.0 KiB. The mockup's `[4.2MB]` is placeholder text and is not carried over. The trade-off accepted: the value goes stale if the PDF is replaced without editing this line, which the trailing comment exists to catch. A runtime fetch would add a network request, a loading state, and a failure path to a decorative label.

## Component change

One element is appended inside `command-center__frame-footer` (`CommandCenter.tsx:117-133`), after the second `command-center__frame-data` row:

```tsx
<a
  className="command-center__cv"
  href={hero.cv.href}
  download={hero.cv.fileName}
  aria-label={`Download CV, PDF, ${hero.cv.size.replace(/[[\]]/g, '')}`}
>
  <span className="command-center__cv-main">
    <span className="command-center__cv-icon" aria-hidden="true">↓</span>
    <span className="command-center__cv-label">{hero.cv.label}</span>
  </span>
  <span className="command-center__cv-size">{hero.cv.size}</span>
</a>
```

**The icon is a `↓` glyph, not an SVG.** The mockup uses Material Symbols `file_download`, but no component in this codebase renders an SVG — decorative marks are Unicode glyphs throughout, including `◎` in this same frame's header and `▼▼` in the scroll hint. Introducing the first inline SVG, or a `<use>` reference to the otherwise-unused `public/icons.svg` sprite, for one decorative mark is not worth the inconsistency. Recommended to the user and approved.

**`aria-label` is added beyond the mockup.** `EXPORT_MANIFEST.PDF` is in-world HUD copy that does not announce as a CV download. The visible label stays as designed; the accessible name says what the link does.

## Styles

Appended to `CommandCenter.css` after the `.command-center__frame-data` rules. The parent `.command-center__frame-footer` is already `flex-direction: column` with `gap: 6px`, so the link needs no margin of its own.

- `.command-center__cv` — flex row, `justify-content: space-between`, `align-items: center`, `padding: 6px 12px`, `1px solid rgba(34, 211, 238, 0.2)` border over `rgba(34, 211, 238, 0.05)`, `text-decoration: none`, `transition` on background and color at 300ms.
- `.command-center__cv:hover` — background to `rgba(34, 211, 238, 0.1)`; label and icon to `var(--color-cyan)`.
- `.command-center__cv:focus-visible` — `outline: 1px solid var(--color-cyan)` with a small offset. Not in the mockup, added because this is the only interactive control inside an otherwise decorative frame.
- `.command-center__cv-main` — flex row, `gap: 6px`, `align-items: center`.
- `.command-center__cv-label` — `var(--font-mono)`, `9px`, `rgba(218, 226, 253, 0.6)`, matching `.command-center__frame-footer-row`.
- `.command-center__cv-size` — `var(--font-mono)`, `8px`, `rgba(34, 211, 238, 0.4)`.

Cyan channels are written as literal `rgba(34, 211, 238, …)` rather than as `--color-cyan`, because the surrounding footer rules already use literal rgba for tinted surfaces and the token holds no alpha variant.

## Testing

`CommandCenter.test.tsx` exists and stubs `IntersectionObserver` in `beforeEach`. One case is added, deriving its expectations from the imported `hero` object rather than literal copy, consistent with the other suites in this repo:

1. Renders a link whose accessible content includes `hero.cv.label`, with `href` equal to `hero.cv.href` and a `download` attribute equal to `hero.cv.fileName`.

The `download` assertion is the point of the test. Without it, the attribute could be dropped and the link would still resolve — it would just navigate to the PDF instead of saving it, a regression no href-only check would catch.

The size hint is not asserted. It is decorative and would only couple the suite to a value expected to drift.

## Verification

1. `npm run test` — full suite green, including the new case.
2. `npx tsc -b` — exits 0.
3. `npm run lint` — no new errors. One pre-existing `react-hooks/exhaustive-deps` warning at `src/components/CommandCenter.tsx:23` is expected and unrelated.
4. `git status` — confirm `public/CV.pdf` appears as a tracked addition and not as ignored. This is the step that catches a gitignore pattern still matching; the other three would all pass with the asset absent from the repository.

No browser verification step, per the user's standing preference against routine frontend checks.

## Risks

- **Committing the PDF is irreversible.** `portfolio-lab` is a public GitHub repository as of the Active Projects cycle. Once `public/CV.pdf` is pushed, the file is publicly readable and permanently present in git history; deleting it later removes it from the working tree but not from history, and not from any clone or fork. The user was shown this and chose it over a redacted copy, an external host, and Vercel Blob.
- **The PDF's contents were not verified before this spec was written.** It uses a subset font with a custom glyph encoding, and no PDF tooling is installed in this environment (`pdftoppm` absent; raw stream extraction returns unmapped glyph codes). Whatever personal detail the original `# contains PII` comment was guarding — home address, phone number — is unconfirmed. The user should read the file before the commit lands; it is the last cheap moment to swap in a redacted version.
- **A public download button publishes the CV's contents regardless of hosting.** Committing is not what makes the CV public — the button is. What committing additionally costs is revocability: an externally hosted file can be swapped or withdrawn at any time, a committed one cannot.
- **The `size` value can drift.** Replacing `public/CV.pdf` without editing `hero.cv.size` leaves a wrong number on the page. Mitigated only by the trailing comment; nothing enforces it. Accepted by the user when raised after implementation.

## Amendment — 2026-08-09: made findable

Once shipped, the button proved easy to miss. The cause was not size or dimness in isolation: the label rendered at 9px / 60% opacity directly beneath `BIOS_INTEGRITY` at 9px / 55%, making the site's one interactive control typographically indistinguishable from the telemetry above it. The HUD aesthetic works by rendering everything as passive readout, so a control placed inside that stack is camouflaged by the design working correctly. Blending in more carefully cannot fix this — the button has to break the pattern.

Five treatments were mocked up and reviewed as a live comparison page. The user chose the first three, applied together.

**1. Copy.** `EXPORT_MANIFEST.PDF` → `EXPORT_CV.PDF`. "Manifest" does not read as "résumé" to anyone not already in on the theme; `CV` is the term a recruiter scans for, and the `EXPORT_` prefix keeps the terminal register. Data-only change. The test did not need editing — it derives from `hero.cv.label` — which is the property the data-driven convention exists to provide.

**2. Contrast.** Label and icon from `rgba(218, 226, 253, 0.6)` to `var(--color-text)`; border from 20% to 45% cyan; size hint from 40% to 55% cyan; vertical padding 6px → 8px. The button becomes the only full-contrast element in a footer of dim readouts.

**3. Motion.** A `::after` pseudo-element sweeps a low-opacity cyan gradient across the button every 5s (`cv-sweep`), requiring `position: relative` and `overflow: hidden` on the anchor. This is the element that makes the button *catch* the eye rather than merely being legible once found — peripheral vision registers motion in an otherwise still region. It reads as in-world because the frame already animates: the photo carries a scan line and the integrity bar pulses.

Rejected: promoting the link into the left-column CTA row beside `VIEW_ARCHIVE` and `OPEN_UPLINK`. It addresses the cause rather than compensating for it and would almost certainly outperform all three changes above, but it abandons the Stitch placement and a third button dilutes the primary CTA. Recorded here because it remains the strongest option if the CV ever needs to be the hero's main call to action.

### Reduced motion

`.command-center__cv::after` is disabled under `@media (prefers-reduced-motion: reduce)`, degrading to treatment 2 — still the highest-contrast element in the footer, just static.

**This is the only `prefers-reduced-motion` guard in the codebase.** The badge ping, the photo scan line, the integrity `bar-pulse`, and the entry transitions all animate unconditionally. Guarding only the new animation while leaving the pre-existing ones untouched is inconsistent; a site-wide pass belongs in its own change and was deliberately not bundled here.
