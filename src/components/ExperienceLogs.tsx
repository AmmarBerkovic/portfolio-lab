import { useState, useRef, useEffect } from 'react'
import { useIntersection } from '../hooks/useIntersection'
import { roles } from '../data/content'
import './ExperienceLogs.css'

export default function ExperienceLogs() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const [activeRole, setActiveRole] = useState(0)
  const [exiting, setExiting] = useState(false)
  const nextRole = useRef(0)

  function handleRoleSelect(index: number) {
    if (index === activeRole || exiting) return
    nextRole.current = index
    setExiting(true)
  }

  function handleExitEnd() {
    if (!exiting) return
    setActiveRole(nextRole.current)
    setExiting(false)
  }

  // Fallback for environments where CSS animations don't fire (e.g. jsdom in tests)
  useEffect(() => {
    if (!exiting) return
    const id = setTimeout(handleExitEnd, 300)
    return () => clearTimeout(id)
  }, [exiting]) // eslint-disable-line react-hooks/exhaustive-deps

  const role = roles[activeRole]

  return (
    <section
      id="experience-logs"
      ref={ref}
      className={`experience-logs${isVisible ? ' experience-logs--visible' : ''}`}
    >
      <div className="experience-logs__grid">

        {/* ── Left panel ── */}
        <div className="experience-logs__left">
          <div className="experience-logs__left-header">
            <span>// SYSTEM_AUDIT_LOG</span>
            <span>{roles.length} ENTRIES</span>
          </div>

          <div className="experience-logs__list">
            <div className="experience-logs__connector" aria-hidden="true" />
            {roles.map((r, i) => (
              <button
                key={`${r.company}-${r.dateRange}`}
                className={`role-entry${i === activeRole ? ' role-entry--active' : ''}`}
                onClick={() => handleRoleSelect(i)}
                aria-pressed={i === activeRole}
              >
                <span className="role-entry__marker" aria-hidden="true" />
                <span className="role-entry__meta">
                  <span className="role-entry__date">{r.dateRange}</span>
                  <span className="role-entry__title">{r.title}</span>
                  <span className="role-entry__company">// {r.company}</span>
                </span>
                <span className={`role-entry__badge role-entry__badge--${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </button>
            ))}
          </div>

          <div className="experience-logs__left-footer">CLICK_ENTRY_TO_EXPAND</div>
        </div>

        {/* ── Right panel ── */}
        <div className="experience-logs__right">
          <div className="experience-logs__right-header">
            <div>
              <span className="experience-logs__proto">PERSONNEL_RECORD_SYS v2.4</span>
              <span className="experience-logs__record-id">
                LOG-00{activeRole + 1} // RECORD_{role.status}
              </span>
            </div>
            <div className="experience-logs__live">
              <span className="experience-logs__live-dot" aria-hidden="true" />
              LIVE_VIEW
            </div>
          </div>

          <div
            key={activeRole}
            className={`experience-logs__detail${exiting ? ' experience-logs__detail--exiting' : ''}`}
            onAnimationEnd={exiting ? handleExitEnd : undefined}
          >
            <span className="experience-logs__ghost-id" aria-hidden="true">
              00{activeRole + 1}
            </span>

            <p className="experience-logs__role-date">{role.dateRange}</p>
            <h2 className="experience-logs__role-title">{role.title}</h2>
            <p className="experience-logs__role-company">// {role.company}</p>
            <p className="experience-logs__role-desc">{role.description}</p>

            <div className="experience-logs__chips">
              {role.chips.map((chip) => (
                <span key={chip.label} className={`chip chip--${chip.color}`}>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div className="experience-logs__right-footer">
            <div className="experience-logs__metrics">
              {role.metrics.map((m) => (
                <div key={m.label} className="experience-logs__metric">
                  <span className="experience-logs__metric-label">{m.label}</span>
                  <span className="experience-logs__metric-value">{m.value}</span>
                </div>
              ))}
            </div>
            <span className="experience-logs__nav-hint">← → NAVIGATE_RECORDS</span>
          </div>

          {/* HUD corners */}
          <span className="experience-logs__corner experience-logs__corner--tl" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--tr" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--bl" aria-hidden="true" />
          <span className="experience-logs__corner experience-logs__corner--br" aria-hidden="true" />

          <div className="experience-logs__scan-line" aria-hidden="true" />
        </div>

      </div>
    </section>
  )
}
