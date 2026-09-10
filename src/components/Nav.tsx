import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import './Nav.css'

const SECTION_IDS = navLinks.map(({ href }) => href.slice(1))

export default function Nav() {
  const [activeId, setActiveId] = useState('command-center')
  const [menuOpen, setMenuOpen] = useState(false)
  const [utcTime, setUtcTime] = useState(() => new Date().toUTCString().slice(17, 25))

  useEffect(() => {
    const id = setInterval(() => {
      setUtcTime(new Date().toUTCString().slice(17, 25))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // One observer over a zero-height band across the middle of the viewport.
    // Per-section observers at a shared threshold let two sections both qualify
    // as "active" — whichever callback fired last won, so the nav could mark
    // Experience Logs current while Core Stack filled the screen. Only one
    // section can cross the middle line, so there is nothing left to race.
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current) setActiveId(current.target.id)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
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
                aria-current={activeId === href.slice(1) ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav__status">
          <span className="nav__status-badge">STATUS: NOMINAL</span>
          <span className="nav__status-time">[UTC: {utcTime}]</span>
        </div>

        <button
          className="nav__hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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
            <a href={href} className={`nav__link${activeId === href.slice(1) ? ' active' : ''}`} aria-current={activeId === href.slice(1) ? 'page' : undefined} onClick={handleLinkClick}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
