import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIntersection } from './useIntersection'

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
let triggerIntersection: (isIntersecting: boolean) => void

beforeEach(() => {
  mockObserve.mockReset()
  mockDisconnect.mockReset()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function (cb: IntersectionObserverCallback) {
      triggerIntersection = (isIntersecting) =>
        cb([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
      return { observe: mockObserve, disconnect: mockDisconnect }
    }),
  )
})

describe('useIntersection', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useIntersection())
    expect(result.current[1]).toBe(false)
  })

  it('returns true when element intersects', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    expect(result.current[1]).toBe(true)
  })

  it('stays true after element leaves viewport', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    act(() => triggerIntersection(false))
    expect(result.current[1]).toBe(true)
  })

  it('disconnects the observer after first intersection', () => {
    const { result } = renderHook(() => useIntersection())
    act(() => triggerIntersection(true))
    expect(mockDisconnect).toHaveBeenCalledOnce()
    void result.current
  })
})
