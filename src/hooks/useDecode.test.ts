import { describe, expect, test, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { scrambleTo, useDecode } from './useDecode'

const HEADING = 'Core Stack'
const LABEL = '// ENGINEERING_DOMAINS'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('scrambleTo', () => {
  test('returns the target untouched at full progress', () => {
    expect(scrambleTo(LABEL, 1)).toBe(LABEL)
  })

  test('holds the target length at every progress', () => {
    // Headings are monospaced, so a same-length scramble cannot shift layout.
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      expect(scrambleTo(HEADING, progress)).toHaveLength(HEADING.length)
    }
  })

  test('keeps spaces where they are so word shapes stay put', () => {
    expect(scrambleTo(HEADING, 0)[4]).toBe(' ')
  })

  test('settles characters from the left', () => {
    const half = scrambleTo(LABEL, 0.5)
    expect(half.slice(0, Math.floor(LABEL.length * 0.5))).toBe(
      LABEL.slice(0, Math.floor(LABEL.length * 0.5)),
    )
  })

  test('handles an empty string', () => {
    expect(scrambleTo('', 0)).toBe('')
  })
})

describe('useDecode', () => {
  test('shows the real text before it is activated', () => {
    const { result } = renderHook(() => useDecode(HEADING, false))
    expect(result.current).toBe(HEADING)
  })

  test('skips the scramble when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    const { result } = renderHook(() => useDecode(HEADING, true))
    expect(result.current).toBe(HEADING)
  })

  test('settles on the real text once activated', async () => {
    const { result } = renderHook(() => useDecode(LABEL, true))
    await waitFor(() => expect(result.current).toBe(LABEL), { timeout: 3000 })
  })
})
