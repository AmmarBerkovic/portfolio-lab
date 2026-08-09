import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommandCenter from './CommandCenter'
import { hero } from '../data/content'

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

  test('renders system badge', () => {
    render(<CommandCenter />)
    expect(screen.getByText('SYSTEM_V2.4_READY')).toBeInTheDocument()
  })

  test('renders frame auth header', () => {
    render(<CommandCenter />)
    expect(screen.getByText('AUTH_PROTO_6741')).toBeInTheDocument()
  })

  test('renders CV download link that saves the file', () => {
    render(<CommandCenter />)
    const link = screen.getByRole('link', { name: /download cv/i })
    expect(link).toHaveTextContent(hero.cv.label)
    expect(link).toHaveAttribute('href', hero.cv.href)
    expect(link).toHaveAttribute('download', hero.cv.fileName)
  })
})
