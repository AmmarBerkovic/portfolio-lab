import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommandCenter from './CommandCenter'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

describe('CommandCenter', () => {
  test('renders HUD frame photo', () => {
    render(<CommandCenter />)
    const img = screen.getByAltText('Ammar Berkovic')
    expect(img).toBeInTheDocument()
    expect(img).toHaveClass('command-center__photo')
  })

  test('renders top-left coordinate label', () => {
    render(<CommandCenter />)
    expect(screen.getByText('PERS_ID: ABK-001')).toBeInTheDocument()
  })

  test('renders frame status bar', () => {
    render(<CommandCenter />)
    expect(screen.getByText(/IDENTITY_VERIFIED/)).toBeInTheDocument()
  })
})
