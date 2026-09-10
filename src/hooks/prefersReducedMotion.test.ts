import { describe, expect, test, vi, afterEach } from 'vitest'
import { prefersReducedMotion } from './prefersReducedMotion'

/** jsdom ships no matchMedia, so each test supplies the answer it needs. */
function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches, media: query })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('prefersReducedMotion', () => {
  test('reports the preference when the browser answers', () => {
    stubMatchMedia(true)
    expect(prefersReducedMotion()).toBe(true)
  })

  test('reports no preference when the query does not match', () => {
    stubMatchMedia(false)
    expect(prefersReducedMotion()).toBe(false)
  })

  test('asks for the reduce query specifically', () => {
    stubMatchMedia(true)
    prefersReducedMotion()
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  test('assumes motion is fine where matchMedia is missing', () => {
    // jsdom's default. Animating is the safe fallback — refusing to animate
    // would be indistinguishable from a broken hook.
    expect(prefersReducedMotion()).toBe(false)
  })
})
