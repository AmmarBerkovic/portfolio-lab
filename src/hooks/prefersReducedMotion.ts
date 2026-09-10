/**
 * Whether the visitor has asked for reduced motion.
 *
 * The global block in index.css collapses CSS transitions and animations, but
 * it cannot touch an animation driven from JavaScript — a requestAnimationFrame
 * loop runs straight through it. Anything animating in JS has to ask directly.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
