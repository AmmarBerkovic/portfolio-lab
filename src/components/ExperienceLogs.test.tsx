import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceLogs from './ExperienceLogs'
import { roles } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function metricValues(container: HTMLElement): (string | null)[] {
  return Array.from(
    container.querySelectorAll('.experience-logs__metric-value'),
  ).map(el => el.textContent)
}

describe('ExperienceLogs', () => {
  test('renders section audit label', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(/SYSTEM_AUDIT_LOG/)).toBeInTheDocument()
  })

  test('renders one left-panel entry per role, in order', () => {
    render(<ExperienceLogs />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(roles.length)

    const titles = buttons.map(b => b.querySelector('.role-entry__title')?.textContent)
    expect(titles).toEqual(roles.map(r => r.title))
  })

  test('first role is active by default — its title appears in the detail panel', () => {
    render(<ExperienceLogs />)
    expect(screen.getAllByText(roles[0].title).length).toBeGreaterThanOrEqual(2)
  })

  test('clicking a role entry changes the active detail content', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const last = roles[roles.length - 1]
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[buttons.length - 1])

    expect(
      await screen.findByText(`// ${last.company}`, {
        selector: '.experience-logs__role-company',
      }),
    ).toBeInTheDocument()
  })

  test('metrics for the active role are displayed, in order', () => {
    const { container } = render(<ExperienceLogs />)
    expect(metricValues(container)).toEqual(roles[0].metrics.map(m => m.value))
  })

  test('renders the active role chips, in order, with their colour class', () => {
    const { container } = render(<ExperienceLogs />)
    const chips = Array.from(
      container.querySelectorAll('.experience-logs__chips .chip'),
    )

    expect(chips.map(el => el.textContent)).toEqual(
      roles[0].chips.map(chip => chip.label),
    )
    expect(chips.map(el => el.className)).toEqual(
      roles[0].chips.map(chip => `chip chip--${chip.color}`),
    )
  })

  test('clicking same role twice does not break state', async () => {
    const user = userEvent.setup()
    const { container } = render(<ExperienceLogs />)

    const first = screen.getAllByRole('button')[0]
    await user.click(first)
    await user.click(first)

    expect(metricValues(container)).toEqual(roles[0].metrics.map(m => m.value))
  })
})
