import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import './Nav.css'

const SECTION_IDS = ['command-center', 'core-stack', 'experience-logs', 'active-projects', 'contact-uplink']

export default function Nav() {
  const [activeId, setActiveId] = useState('command-center')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { threshold: 0.4 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <nav className="nav">
        <a href="#command-center" className="nav__logo">
          AMMAR<span>_BERKOVIC</span>
        </a>

        <ul className="nav__links">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={`nav__link${activeId === href.slice(1) ? ' active' : ''}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="nav__hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <ul className={`nav__overlay${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className={`nav__link${activeId === href.slice(1) ? ' active' : ''}`} onClick={handleLinkClick}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
