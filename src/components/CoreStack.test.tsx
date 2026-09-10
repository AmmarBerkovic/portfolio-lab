import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoreStack from './CoreStack'
import { domains } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function cards(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.domain-card'))
}

describe('CoreStack', () => {
  test('renders the section label', () => {
    render(<CoreStack />)
    expect(screen.getByText('// ENGINEERING_DOMAINS')).toBeInTheDocument()
  })

  test('renders one card per domain, titles in order', () => {
    const { container } = render(<CoreStack />)
    const titles = cards(container).map(
      c => c.querySelector('.domain-card__title')?.textContent,
    )
    expect(titles).toEqual(domains.map(d => d.title))
  })

  test('renders each domain description', () => {
    const { container } = render(<CoreStack />)
    const descriptions = cards(container).map(
      c => c.querySelector('.domain-card__desc')?.textContent,
    )
    expect(descriptions).toEqual(domains.map(d => d.description))
  })

  test('renders each card chips in order, scoped to that card', () => {
    const { container } = render(<CoreStack />)
    const chipsPerCard = cards(container).map(c =>
      Array.from(c.querySelectorAll('.domain-card__chips .chip')).map(
        el => el.textContent,
      ),
    )
    expect(chipsPerCard).toEqual(domains.map(d => d.chips.map(chip => chip.label)))
  })

  test('cards power on with the boot reveal rather than the shared fade', () => {
    const { container } = render(<CoreStack />)
    cards(container).forEach(el => {
      expect(el.className).toContain('animate-boot')
      expect(el.className).not.toContain('animate-entry')
      expect(el.className).not.toContain('visible')
    })
  })

  test('chips carry their position so the hover cascade can stagger them', () => {
    const { container } = render(<CoreStack />)
    const indices = cards(container).map(c =>
      Array.from(c.querySelectorAll<HTMLElement>('.domain-card__chips .chip')).map(
        el => el.style.getPropertyValue('--i'),
      ),
    )
    // Position restarts per card, so every card's cascade starts on its first chip.
    expect(indices).toEqual(domains.map(d => d.chips.map((_, i) => String(i))))
  })

  test('renders each card header as its id followed by the underscored title', () => {
    const { container } = render(<CoreStack />)
    const headerIds = cards(container).map(
      c => c.querySelector('.card-header__id')?.textContent,
    )
    expect(headerIds).toEqual(
      domains.map(d => `${d.id} // ${d.title.toUpperCase().replace(/ /g, '_')}`),
    )
  })
})
