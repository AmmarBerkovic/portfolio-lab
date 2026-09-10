import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './prefersReducedMotion'

/**
 * Drift a decorative layer at a fraction of the scroll distance.
 *
 * The transform is written straight to the node inside a requestAnimationFrame
 * rather than held in state: parallax updates on every scroll frame, and
 * routing that through React would re-render the hero sixty times a second to
 * move a background. Nothing else writes to this element's transform, so there
 * is no property for React and the hook to disagree about.
 *
 * A rate of 0 is a layer welded to the page; 1 is a layer that never moves
 * relative to the viewport. Anything above roughly 0.4 stops reading as depth
 * and starts reading as a background failing to keep up.
 */
export function useParallax<T extends HTMLElement>(rate: number) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Drift is decoration, not information — unlike the nav's scan readout it
    // has nothing to say, so it resolves to nothing rather than staying live.
    if (prefersReducedMotion()) {
      el.style.transform = ''
      return
    }

    let frame = 0
    let queued = false

    const write = () => {
      queued = false
      const y = window.scrollY || document.documentElement.scrollTop || 0
      el.style.transform = `translate3d(0, ${Math.round(y * rate)}px, 0)`
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(write)
    }

    write()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [rate])

  return ref
}
