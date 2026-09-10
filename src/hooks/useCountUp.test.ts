import { describe, expect, test, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { parseNumericParts, renderParts, useCountUp } from './useCountUp'

afterEach(() => {
  vi.unstubAllGlobals()
})

/* The real metric values from content.ts. A count-up that cannot reproduce
   these exactly is worse than no animation, so they drive the tests. */
const REAL_VALUES = [
  '250K SMS/MO',
  '836K USERS',
  '247 CLUBS',
  '15 CLIENT SITES',
  '2,044 → 63',
  '3.5 YRS',
  'MEAN',
  'DURING_DEGREE',
  '12 MONTHS',
]

describe('parseNumericParts', () => {
  test('splits a value into its number and its trailing text', () => {
    expect(parseNumericParts('247 CLUBS')).toEqual([
      { num: 247, grouped: false, decimals: 0 },
      { text: ' CLUBS' },
    ])
  })

  test('treats a unit suffix fused to the number as text', () => {
    expect(parseNumericParts('250K SMS/MO')).toEqual([
      { num: 250, grouped: false, decimals: 0 },
      { text: 'K SMS/MO' },
    ])
  })

  test('finds both numbers in a before-and-after value', () => {
    expect(parseNumericParts('2,044 → 63')).toEqual([
      { num: 2044, grouped: true, decimals: 0 },
      { text: ' → ' },
      { num: 63, grouped: false, decimals: 0 },
    ])
  })

  test('records how many decimal places a number was written with', () => {
    expect(parseNumericParts('3.5 YRS')).toEqual([
      { num: 3.5, grouped: false, decimals: 1 },
      { text: ' YRS' },
    ])
  })

  test('finds no numbers in a text-only value', () => {
    expect(parseNumericParts('DURING_DEGREE')).toEqual([{ text: 'DURING_DEGREE' }])
  })
})

describe('renderParts', () => {
  test.each(REAL_VALUES)('lands on %s exactly at full progress', (value) => {
    expect(renderParts(parseNumericParts(value), 1)).toBe(value)
  })

  test('holds a text-only value still from the first frame', () => {
    const parts = parseNumericParts('MEAN')
    expect(renderParts(parts, 0)).toBe('MEAN')
    expect(renderParts(parts, 0.5)).toBe('MEAN')
  })

  test('keeps the suffix in place while the number climbs', () => {
    expect(renderParts(parseNumericParts('250K SMS/MO'), 0.5)).toBe('125K SMS/MO')
  })

  test('keeps comma grouping while counting', () => {
    expect(renderParts(parseNumericParts('2,044 → 63'), 0.5)).toContain('1,022')
  })

  test('keeps the decimal place while counting', () => {
    expect(renderParts(parseNumericParts('3.5 YRS'), 0.5)).toBe('1.8 YRS')
  })

  test('starts every number at zero', () => {
    expect(renderParts(parseNumericParts('247 CLUBS'), 0)).toBe('0 CLUBS')
  })
})

describe('useCountUp', () => {
  test('shows the finished value before it is activated', () => {
    // The observer may never fire — a stale tab, a crawler, a failed script.
    // A metric that reads 0 in that case is a lie, so rest is the real figure.
    const { result } = renderHook(() => useCountUp('836K USERS', false))
    expect(result.current).toBe('836K USERS')
  })

  test('skips straight to the finished value when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    const { result } = renderHook(() => useCountUp('247 CLUBS', true))
    expect(result.current).toBe('247 CLUBS')
  })

  test('settles on the exact value once activated', async () => {
    const { result } = renderHook(() => useCountUp('2,044 → 63', true))
    await waitFor(() => expect(result.current).toBe('2,044 → 63'), { timeout: 3000 })
  })

  test('leaves a value with no digits alone', () => {
    const { result } = renderHook(() => useCountUp('DURING_DEGREE', true))
    expect(result.current).toBe('DURING_DEGREE')
  })
})
