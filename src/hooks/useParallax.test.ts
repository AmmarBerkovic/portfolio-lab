import { describe, expect, test, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useParallax } from './useParallax'

/** Attach the ref the hook hands back to a real element, as a component would. */
function mountOn(rate: number) {
  const el = document.createElement('div')
  document.body.appendChild(el)

  const view = renderHook(() => {
    const ref = useParallax<HTMLDivElement>(rate)
    ref.current = el
    return ref
  })

  return { el, view }
}

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  Reflect.deleteProperty(window, 'scrollY')
})

describe('useParallax', () => {
  test('holds the layer still at the top of the document', async () => {
    const { el } = mountOn(0.6)
    await waitFor(() => expect(el.style.transform).toBe('translate3d(0, 0px, 0)'))
  })

  test('moves the layer by a fraction of the distance scrolled', async () => {
    const { el } = mountOn(0.6)
    scrollTo(500)
    await waitFor(() => expect(el.style.transform).toBe('translate3d(0, 300px, 0)'))
  })

  test('moves a slower layer less over the same distance', async () => {
    // Two layers at different rates is what separates depth from one sliding plane.
    const { el } = mountOn(0.3)
    scrollTo(500)
    await waitFor(() => expect(el.style.transform).toBe('translate3d(0, 150px, 0)'))
  })

  test('leaves the layer alone when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    const { el } = mountOn(0.6)
    scrollTo(500)

    // Drift is decoration, so it resolves to nothing rather than staying live.
    await waitFor(() => expect(el.style.transform).toBe(''))
  })

  test('stops moving the layer once unmounted', async () => {
    const { el, view } = mountOn(0.6)
    scrollTo(100)
    await waitFor(() => expect(el.style.transform).toBe('translate3d(0, 60px, 0)'))

    view.unmount()
    scrollTo(900)
    await new Promise(resolve => requestAnimationFrame(() => resolve(null)))
    expect(el.style.transform).toBe('translate3d(0, 60px, 0)')
  })
})
