import { useEffect, useRef, useState } from 'react'

export function useIntersection<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}
