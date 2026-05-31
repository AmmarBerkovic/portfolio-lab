import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceLogs from './ExperienceLogs'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

describe('ExperienceLogs', () => {
  test('renders section audit label', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText(/SYSTEM_AUDIT_LOG/)).toBeInTheDocument()
  })

  test('renders all three role entries in the left panel', () => {
    render(<ExperienceLogs />)
    const buttons = screen.getAllByRole('button')
    const titles = buttons.map(b => b.querySelector('.role-entry__title')?.textContent)
    expect(titles).toContain('Senior Full-Stack Engineer')
    expect(titles).toContain('Full-Stack Engineer')
    expect(titles).toContain('Frontend Engineer')
  })

  test('first role is active by default — its title appears in the detail panel', () => {
    render(<ExperienceLogs />)
    const headings = screen.getAllByText('Senior Full-Stack Engineer')
    expect(headings.length).toBeGreaterThanOrEqual(2)
  })

  test('clicking a role entry changes the active detail content', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const frontendBtn = screen.getByRole('button', { name: /Frontend Engineer/ })
    await user.click(frontendBtn)

    expect(await screen.findByText(/Axiom Labs/, { selector: '.experience-logs__role-company' })).toBeInTheDocument()
  })

  test('metrics for the active role are displayed', () => {
    render(<ExperienceLogs />)
    expect(screen.getByText('4M+')).toBeInTheDocument()
    expect(screen.getByText('83%')).toBeInTheDocument()
    expect(screen.getByText('3 YRS')).toBeInTheDocument()
  })

  test('clicking same role twice does not break state', async () => {
    const user = userEvent.setup()
    render(<ExperienceLogs />)

    const srBtn = screen.getByRole('button', { name: /Senior Full-Stack Engineer/ })
    await user.click(srBtn)
    await user.click(srBtn)

    expect(screen.getByText('4M+')).toBeInTheDocument()
  })
})
