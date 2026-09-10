import { describe, expect, test, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { computeProgress, useScrollProgress } from './useScrollProgress'

/** Give the jsdom document a scrollable geometry it otherwise never has. */
function stubDocumentScroll(scrollTop: number, scrollHeight: number, clientHeight: number) {
  for (const [prop, value] of Object.entries({ scrollTop, scrollHeight, clientHeight })) {
    Object.defineProperty(document.documentElement, prop, { value, configurable: true })
  }
}

afterEach(() => {
  for (const prop of ['scrollTop', 'scrollHeight', 'clientHeight']) {
    Reflect.deleteProperty(document.documentElement, prop)
  }
})

describe('computeProgress', () => {
  test('is 0 at the top of the document', () => {
    expect(computeProgress(0, 3000, 1000)).toBe(0)
  })

  test('is 1 once the last pixel is on screen', () => {
    expect(computeProgress(2000, 3000, 1000)).toBe(1)
  })

  test('is the fraction of scrollable distance covered', () => {
    expect(computeProgress(500, 3000, 1000)).toBe(0.25)
  })

  test('is 0 when the document is shorter than the viewport', () => {
    // Dividing by a zero scrollable distance would otherwise report NaN,
    // which renders as "NaN%" in the readout.
    expect(computeProgress(0, 800, 1000)).toBe(0)
  })

  test('clamps elastic overscroll to the ends', () => {
    expect(computeProgress(-120, 3000, 1000)).toBe(0)
    expect(computeProgress(2600, 3000, 1000)).toBe(1)
  })
})

describe('useScrollProgress', () => {
  test('reports the position the document already holds on mount', () => {
    stubDocumentScroll(1000, 3000, 1000)
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0.5)
  })

  test('follows the document as it scrolls', () => {
    stubDocumentScroll(0, 3000, 1000)
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)

    stubDocumentScroll(2000, 3000, 1000)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(1)
  })

  test('stops listening once unmounted', () => {
    stubDocumentScroll(0, 3000, 1000)
    const { result, unmount } = renderHook(() => useScrollProgress())
    unmount()

    stubDocumentScroll(2000, 3000, 1000)
    window.dispatchEvent(new Event('scroll'))
    expect(result.current).toBe(0)
  })
})
