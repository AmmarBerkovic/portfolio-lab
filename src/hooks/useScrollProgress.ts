import { useEffect, useState } from 'react'

/**
 * How far through the document the viewport has travelled, 0 to 1.
 *
 * A document no taller than the viewport has nowhere to travel, so it reads 0
 * rather than dividing by zero and reporting NaN into the nav readout.
 */
export function computeProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const scrollable = scrollHeight - clientHeight
  if (scrollable <= 0) return 0
  return Math.min(Math.max(scrollTop / scrollable, 0), 1)
}

/**
 * Track scroll position for the nav's scan readout.
 *
 * This reports a position rather than playing an animation, so it stays live
 * under reduced motion — the readout is information, and suppressing it would
 * withhold the same detail from the visitors most likely to want it.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setProgress(computeProgress(scrollTop, scrollHeight, clientHeight))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}
