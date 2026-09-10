import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import ExperienceLogs from './ExperienceLogs'
import { roles } from '../data/content'

/** Captures the observer callback so a test can drive the reveal itself. */
let triggerIntersection: (() => void) | null = null

beforeEach(() => {
  triggerIntersection = null
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function (cb: IntersectionObserverCallback) {
      triggerIntersection = () =>
        cb(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        )
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function textOf(container: HTMLElement, selector: string): string[] {
  return Array.from(container.querySelectorAll(selector)).map(
    el => el.textContent?.trim() ?? '',
  )
}

describe('ExperienceLogs', () => {
  test('renders the section audit label', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(/SYSTEM_AUDIT_LOG/)).toBeInTheDocument()
  })

  test('renders a level-2 heading naming the section', () => {
    render(<ExperienceLogs />)
    expect(
      screen.getByRole('heading', { level: 2, name: /Experience Logs/i }),
    ).toBeInTheDocument()
  })

  test('states the total number of entries', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(`[0${roles.length}] TOTAL_ENTRIES`)).toBeInTheDocument()
  })

  test('renders one entry per role, in order', () => {
    const { container } = render(<ExperienceLogs />)
    expect(textOf(container, '.entry__title')).toEqual(roles.map(r => r.title))
  })

  test('renders every role description, not only the first', () => {
    const { container } = render(<ExperienceLogs />)
    expect(textOf(container, '.entry__desc')).toEqual(
      roles.map(r => r.description),
    )
  })

  test('renders every role company, in order', () => {
    const { container } = render(<ExperienceLogs />)
    expect(textOf(container, '.entry__company')).toEqual(
      roles.map(r => `// ${r.company}`),
    )
  })

  test('renders every chip of every role, with its colour class', () => {
    const { container } = render(<ExperienceLogs />)
    const chips = Array.from(container.querySelectorAll('.entry__chips .chip'))

    expect(chips.map(el => el.textContent)).toEqual(
      roles.flatMap(r => r.chips.map(c => c.label)),
    )
    expect(chips.map(el => el.className)).toEqual(
      roles.flatMap(r => r.chips.map(c => `chip chip--${c.color}`)),
    )
  })

  test('renders the metrics of every role that has them', () => {
    const { container } = render(<ExperienceLogs />)
    expect(textOf(container, '.metric__value')).toEqual(
      roles.flatMap(r => r.metrics?.map(m => m.value) ?? []),
    )
  })

  test('chips carry their position so the hover cascade can stagger them', () => {
    const { container } = render(<ExperienceLogs />)
    const indices = Array.from(
      container.querySelectorAll<HTMLElement>('.entry__chips .chip'),
    ).map(el => el.style.getPropertyValue('--i'))

    // Position restarts per record, so each entry's cascade starts from its left.
    expect(indices).toEqual(roles.flatMap(r => r.chips.map((_, i) => String(i))))
  })

  test('renders every role status as a readable badge', () => {
    const { container } = render(<ExperienceLogs />)
    expect(textOf(container, '.entry__status')).toEqual(roles.map(r => r.status))
  })

  test('has no click-to-switch controls — every record is already open', () => {
    render(<ExperienceLogs />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  test('the most recent record is highlighted as the latest entry', () => {
    const { container } = render(<ExperienceLogs />)
    const latest = container.querySelectorAll('.entry--latest')

    expect(latest).toHaveLength(1)
    expect(latest[0]).toBe(container.querySelector('.entry'))
  })

  test('HUD corner brackets mark only a role that is currently active', () => {
    const { container } = render(<ExperienceLogs />)
    const activeCount = roles.filter(r => r.status === 'ACTIVE').length

    // Two brackets per live record — none at all once every role has ended.
    expect(container.querySelectorAll('.entry__corner')).toHaveLength(
      activeCount * 2,
    )
  })

  test('the education entry carries its own modifier class', () => {
    const { container } = render(<ExperienceLogs />)
    expect(container.querySelectorAll('.entry--education')).toHaveLength(1)
  })

  test('the education entry renders no metrics strip', () => {
    const { container } = render(<ExperienceLogs />)
    expect(
      container.querySelector('.entry--education .entry__metrics'),
    ).toBeNull()
  })

  test('entries use the shared scroll-reveal pattern', () => {
    const { container } = render(<ExperienceLogs />)
    const entries = container.querySelectorAll('.entry')

    expect(entries).toHaveLength(roles.length)
    entries.forEach(el => {
      expect(el.className).toContain('animate-entry')
      expect(el.className).not.toContain('visible')
    })
  })

  test('entries become visible once the section is scrolled into view', () => {
    const { container } = render(<ExperienceLogs />)
    act(() => triggerIntersection?.())

    container.querySelectorAll('.entry').forEach(el => {
      expect(el.className).toContain('visible')
    })
  })

  test('metrics settle on their exact values after counting up', async () => {
    const { container } = render(<ExperienceLogs />)
    act(() => triggerIntersection?.())

    // Mid-count the strip shows partial figures; what matters is where it lands.
    await waitFor(
      () =>
        expect(textOf(container, '.metric__value')).toEqual(
          roles.flatMap(r => r.metrics?.map(m => m.value) ?? []),
        ),
      { timeout: 3000 },
    )
  })
})
