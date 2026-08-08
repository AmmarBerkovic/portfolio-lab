import { describe, test, expect } from 'vitest'
import { domains, roles, projects } from './content'

const allChips = [
  ...domains.flatMap(d => d.chips),
  ...roles.flatMap(r => r.chips),
  ...projects.flatMap(p => p.chips),
]

describe('content data invariants', () => {
  test('every technology renders in exactly one colour site-wide', () => {
    const coloursByLabel = new Map<string, Set<string>>()
    for (const chip of allChips) {
      const seen = coloursByLabel.get(chip.label) ?? new Set<string>()
      seen.add(chip.color)
      coloursByLabel.set(chip.label, seen)
    }

    const conflicts = [...coloursByLabel.entries()]
      .filter(([, colours]) => colours.size > 1)
      .map(([label, colours]) => `${label}: ${[...colours].join(', ')}`)

    expect(conflicts).toEqual([])
  })

  test('no chip label appears on more than one Core Stack card', () => {
    const labels = domains.flatMap(d => d.chips.map(c => c.label))
    const duplicates = labels.filter((l, i) => labels.indexOf(l) !== i)

    expect(duplicates).toEqual([])
  })
})
