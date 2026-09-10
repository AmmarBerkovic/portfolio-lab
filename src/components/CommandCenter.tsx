import { useState, useEffect } from 'react'
import heroImg from '../assets/hero.webp'
import { useIntersection } from '../hooks/useIntersection'
import { useParallax } from '../hooks/useParallax'
import { hero } from '../data/content'
import './CommandCenter.css'

const STATUS_DOT_CLASS: Record<string, string> = {
  green: 'status-dot--green',
  cyan:  'status-dot--cyan',
  amber: 'status-dot--amber',
}

function useUtcClock() {
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = () => {
    const d = new Date()
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  }
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function CommandCenter() {
  const [ref, isVisible] = useIntersection<HTMLDivElement>(0.2)
  const utcTime = useUtcClock()
  // The grid sits furthest back and drifts most; the rings are nearer the
  // viewer and drift at half the rate, which is what separates the two planes.
  const gridRef = useParallax<HTMLDivElement>(0.6)
  const ringsRef = useParallax<HTMLDivElement>(0.3)

  return (
    <section id="command-center" className="command-center">
      {/* A real element rather than ::after, so the drift has something to
          transform. Inset past the section top and bottom in CSS so sliding it
          never exposes an edge. */}
      <div className="command-center__grid" ref={gridRef} aria-hidden="true" />

      <div className="section-inner command-center__inner" ref={ref}>

        {/* ── Left column ── */}
        <div className="command-center__left">

          <div className="command-center__badge">
            <span className="command-center__badge-dot">
              <span className="command-center__badge-dot-ping" />
              <span className="command-center__badge-dot-core" />
            </span>
            <span className="command-center__badge-label">SYSTEM_V2.4_READY</span>
            <span className="command-center__badge-time">[UTC: {utcTime}]</span>
          </div>

          <div className="command-center__heading-group">
            <span className="command-center__heading-sub">CORE_ENGINEERING</span>
            <h1 className={`command-center__name${isVisible ? ' visible' : ''}`}>
              {hero.name}
            </h1>
          </div>

          <p className="command-center__bio">{hero.bio}</p>

          <div
            className={`command-center__status animate-entry${isVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.3s' }}
          >
            {hero.statusIndicators.map(({ label, color }) => (
              <div key={label} className="status-item">
                <span className={`status-dot ${STATUS_DOT_CLASS[color]}`} />
                {label}
              </div>
            ))}
          </div>

          <div
            className={`command-center__actions animate-entry${isVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.5s' }}
          >
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label} &gt;&gt;
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="command-center__right">
          {/* The rings rotate, so the drift goes on a wrapper — a transform on
              the rings themselves would overwrite their rotation. */}
          <div className="command-center__ring-layer" ref={ringsRef} aria-hidden="true">
            <div className="command-center__ring command-center__ring--outer" />
            <div className="command-center__ring command-center__ring--inner" />
          </div>

          <div className="command-center__frame">
            {/* Corner brackets */}
            <span className="command-center__corner command-center__corner--tl" />
            <span className="command-center__corner command-center__corner--tr" />
            <span className="command-center__corner command-center__corner--bl" />
            <span className="command-center__corner command-center__corner--br" />

            {/* Header */}
            <div className="command-center__frame-header">
              <div>
                <span className="command-center__frame-proto">AUTH_PROTO_6741</span>
                <span className="command-center__frame-secure">Personnel_Secure</span>
              </div>
              <span className="command-center__frame-icon">◎</span>
            </div>

            {/* Image */}
            <div className="command-center__frame-image">
              {/* Intrinsic size is declared so the frame reserves the right
                  height before the image lands — without it the panel grows
                  from its 260px min-height on first paint and shifts layout. */}
              <img
                src={heroImg}
                alt="Ammar Berkovic"
                className="command-center__photo"
                width={640}
                height={787}
                fetchPriority="high"
                decoding="async"
              />
              <div className="command-center__scanlines" />
              <div className="command-center__scan-line" />
              <div className="command-center__auth-badge">
                <span>AUTHENTICATED_ENTITY</span>
              </div>
            </div>

            {/* Footer */}
            <div className="command-center__frame-footer">
              {/* Readouts stay in the HUD register but carry real details —
                  invented figures here teach a reader to discount the real
                  metrics in the experience logs. */}
              <div className="command-center__frame-footer-row">
                <span>SPECIALISM</span>
                <span className="command-center__frame-value">PUBLISHING / SEO</span>
              </div>
              <div className="command-center__frame-bar">
                <div className="command-center__frame-bar-fill" />
              </div>
              <div className="command-center__frame-data">
                <span>LOC: TUZLA, BA</span>
                <span>UTC+01:00</span>
              </div>
              <div className="command-center__frame-data">
                <span>REMOTE: WORLDWIDE</span>
                <span>EN / DE</span>
              </div>

              <a
                className="command-center__cv"
                href={hero.cv.href}
                download={hero.cv.fileName}
                aria-label={`Download CV, PDF, ${hero.cv.size.replace(/[[\]]/g, '')}`}
              >
                <span className="command-center__cv-main">
                  <span className="command-center__cv-icon" aria-hidden="true">↓</span>
                  <span className="command-center__cv-label">{hero.cv.label}</span>
                </span>
                <span className="command-center__cv-size">{hero.cv.size}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="command-center__scroll-hint">
        <span className="command-center__scroll-label">SCROLL_FOR_CORE</span>
        <span className="command-center__scroll-arrow">▼▼</span>
      </div>
    </section>
  )
}
