import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './prefersReducedMotion'

/** A literal run of text — punctuation, units, an arrow — held still. */
export interface TextPart {
  text: string
}

/** A number that counts up, remembering how it was written so it can be
 *  rebuilt exactly: `2,044` keeps its comma, `3.5` keeps its decimal. */
export interface NumberPart {
  num: number
  grouped: boolean
  decimals: number
}

export type ValuePart = TextPart | NumberPart

const NUMBER = /\d[\d,]*(?:\.\d+)?/g

const isNumber = (part: ValuePart): part is NumberPart => 'num' in part

/**
 * Split a metric value into the runs that count and the runs that don't.
 *
 * Metric values are not plain numbers — `2,044 → 63` holds two figures,
 * `250K SMS/MO` fuses a unit to one, and `MEAN` holds none at all. Anything
 * that isn't a digit run is text, so a value with no digits animates nothing.
 */
export function parseNumericParts(value: string): ValuePart[] {
  const parts: ValuePart[] = []
  let cursor = 0

  NUMBER.lastIndex = 0
  for (let match = NUMBER.exec(value); match; match = NUMBER.exec(value)) {
    if (match.index > cursor) parts.push({ text: value.slice(cursor, match.index) })

    const raw = match[0]
    parts.push({
      num: Number(raw.replace(/,/g, '')),
      grouped: raw.includes(','),
      decimals: raw.split('.')[1]?.length ?? 0,
    })
    cursor = match.index + raw.length
  }

  if (cursor < value.length) parts.push({ text: value.slice(cursor) })
  return parts
}

function group(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatNumber(part: NumberPart, progress: number): string {
  const fixed = (part.num * progress).toFixed(part.decimals)
  if (!part.grouped) return fixed

  const [whole, fraction] = fixed.split('.')
  return fraction === undefined ? group(whole) : `${group(whole)}.${fraction}`
}

/** Rebuild the value at a point between 0 (all numbers at zero) and 1 (the
 *  original string, character for character). */
export function renderParts(parts: ValuePart[], progress: number): string {
  return parts
    .map((part) => (isNumber(part) ? formatNumber(part, progress) : part.text))
    .join('')
}

/** Long enough to read as counting, short enough not to delay the figure. */
const DURATION_MS = 1100

/**
 * Count a metric value up to itself when its section scrolls into view.
 *
 * At rest — before activation, under reduced motion, or for a value holding no
 * digits at all — this is the finished string. The animation is decoration over
 * a figure that is always correct, never the thing that produces it.
 */
export function useCountUp(value: string, active: boolean): string {
  /* Only the in-flight count lives in state. The finished figure is derived, so
     a value with no digits — or one under reduced motion — never sets state. */
  const [counting, setCounting] = useState<string | null>(null)

  useEffect(() => {
    const parts = parseNumericParts(value)
    const hasNumbers = parts.some((part) => 'num' in part)

    if (!active || !hasNumbers || prefersReducedMotion()) return

    let frame = 0
    let startedAt: number | null = null

    const step = (timestamp: number) => {
      startedAt ??= timestamp
      const progress = Math.min((timestamp - startedAt) / DURATION_MS, 1)

      if (progress < 1) {
        // Ease out cubic — reads as a readout settling, not a spinner.
        setCounting(renderParts(parts, 1 - Math.pow(1 - progress, 3)))
        frame = requestAnimationFrame(step)
      } else {
        // Release the override so the strip lands on the authored string,
        // never on a rounded reconstruction of it.
        setCounting(null)
      }
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, active])

  return counting ?? value
}
