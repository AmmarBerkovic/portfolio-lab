import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ActiveProjects from './ActiveProjects'
import { projects } from '../data/content'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

function cards(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.project-card'))
}

describe('ActiveProjects', () => {
  test('renders the section label', () => {
    render(<ActiveProjects />)
    expect(screen.getByText('// PROJECT_ARCHIVE')).toBeInTheDocument()
  })

  test('renders one card per project, names in order', () => {
    const { container } = render(<ActiveProjects />)
    const names = cards(container).map(
      c => c.querySelector('.project-card__name')?.textContent,
    )
    expect(names).toEqual(projects.map(p => p.name))
  })

  test('renders each project description', () => {
    const { container } = render(<ActiveProjects />)
    const descriptions = cards(container).map(
      c => c.querySelector('.project-card__desc')?.textContent,
    )
    expect(descriptions).toEqual(projects.map(p => p.description))
  })

  test('renders each card chips in order, scoped to that card', () => {
    const { container } = render(<ActiveProjects />)
    const chipsPerCard = cards(container).map(c =>
      Array.from(c.querySelectorAll('.project-card__chips .chip')).map(
        el => el.textContent,
      ),
    )
    expect(chipsPerCard).toEqual(projects.map(p => p.chips.map(chip => chip.label)))
  })

  test('renders each card header as its id followed by the underscored name', () => {
    const { container } = render(<ActiveProjects />)
    const headerIds = cards(container).map(
      c => c.querySelector('.card-header__id')?.textContent,
    )
    expect(headerIds).toEqual(
      projects.map(p => `${p.id} // ${p.name.toUpperCase().replace(/ /g, '_')}`),
    )
  })

  test('every card links to its repo url', () => {
    const { container } = render(<ActiveProjects />)
    const hrefs = cards(container).map(c =>
      c
        .querySelector('.project-card__actions a')
        ?.getAttribute('href'),
    )
    expect(hrefs).toEqual(projects.map(p => p.repoUrl))
  })

  test('renders LIVE_DEMO only for projects that have a live url', () => {
    const { container } = render(<ActiveProjects />)
    const liveLinks = Array.from(
      container.querySelectorAll('.project-card__actions a'),
    ).filter(a => a.textContent === 'LIVE_DEMO')
    expect(liveLinks.map(a => a.getAttribute('href'))).toEqual(
      projects.filter(p => p.liveUrl).map(p => p.liveUrl),
    )
  })
})
