import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './prefersReducedMotion'

/** Terminal-register noise: brackets, slashes, operators and binary digits.
 *  No letters, so a half-decoded heading never reads as a different word. */
const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

/** Fast enough that the heading is readable before it is looked at directly. */
const DURATION_MS = 750

/**
 * The target as it looks partway through resolving out of glyph noise.
 *
 * Characters settle left to right, spaces never scramble, and the length never
 * changes — the headings are monospaced, so a same-length scramble occupies
 * exactly the same box and cannot shift the layout around it.
 */
export function scrambleTo(target: string, progress: number): string {
  const settled = Math.floor(progress * target.length)

  let out = ''
  for (let i = 0; i < target.length; i++) {
    out +=
      i < settled || target[i] === ' '
        ? target[i]
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

/**
 * Resolve a section heading out of glyph noise when the section scrolls in.
 *
 * At rest the hook is the plain text, so the heading is readable whether or not
 * the observer ever fires and whatever the visitor's motion preference.
 */
export function useDecode(text: string, active: boolean): string {
  /* Only the scramble lives in state. The resting value is derived, so an
     inactive hook — or one under reduced motion — never sets state at all. */
  const [scrambled, setScrambled] = useState<string | null>(null)

  useEffect(() => {
    if (!active || prefersReducedMotion()) return

    let frame = 0
    let startedAt: number | null = null

    const step = (timestamp: number) => {
      startedAt ??= timestamp
      const progress = Math.min((timestamp - startedAt) / DURATION_MS, 1)

      if (progress < 1) {
        setScrambled(scrambleTo(text, progress))
        frame = requestAnimationFrame(step)
      } else {
        // Release the override rather than setting the final text, so the
        // resolved heading is the same string the component was handed.
        setScrambled(null)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [text, active])

  return scrambled ?? text
}
