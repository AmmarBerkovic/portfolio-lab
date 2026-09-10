import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import Nav from './Nav'
import { navLinks } from '../data/content'

function stubDocumentScroll(scrollTop: number, scrollHeight: number, clientHeight: number) {
  for (const [prop, value] of Object.entries({ scrollTop, scrollHeight, clientHeight })) {
    Object.defineProperty(document.documentElement, prop, { value, configurable: true })
  }
}

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  for (const prop of ['scrollTop', 'scrollHeight', 'clientHeight']) {
    Reflect.deleteProperty(document.documentElement, prop)
  }
})

describe('Nav', () => {
  test('renders every section link', () => {
    render(<Nav />)
    for (const { label, href } of navLinks) {
      expect(screen.getAllByRole('link', { name: label })[0]).toHaveAttribute('href', href)
    }
  })

  test('reports how far through the document the visitor has scrolled', () => {
    stubDocumentScroll(1000, 3000, 1000)
    render(<Nav />)
    expect(screen.getByText('[SCAN: 050%]')).toBeInTheDocument()
  })

  test('pads the readout so the nav does not reflow as the number grows', () => {
    stubDocumentScroll(0, 3000, 1000)
    render(<Nav />)
    expect(screen.getByText('[SCAN: 000%]')).toBeInTheDocument()
  })

  test('updates the readout as the document scrolls', () => {
    stubDocumentScroll(0, 3000, 1000)
    render(<Nav />)

    stubDocumentScroll(3000, 3000, 1000)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByText('[SCAN: 100%]')).toBeInTheDocument()
  })

  test('sizes the progress bar to the scroll position', () => {
    stubDocumentScroll(500, 3000, 1000)
    const { container } = render(<Nav />)
    const bar = container.querySelector('.nav__progress')
    expect(bar).toHaveStyle({ width: '25%' })
  })

  test('keeps the progress bar out of the accessibility tree', () => {
    // The readout beside it already carries the same information as text.
    stubDocumentScroll(500, 3000, 1000)
    const { container } = render(<Nav />)
    expect(container.querySelector('.nav__progress')).toHaveAttribute('aria-hidden', 'true')
  })
})
