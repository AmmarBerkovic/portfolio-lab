import type { CSSProperties } from 'react'
import { useIntersection } from '../hooks/useIntersection'
import { useDecode } from '../hooks/useDecode'
import { useCountUp } from '../hooks/useCountUp'
import { roles } from '../data/content'
import './ExperienceLogs.css'

/** One metric, counting up to itself. Its own component because the hook
 *  cannot be called from inside the metrics loop. */
function MetricValue({ value, active }: { value: string; active: boolean }) {
  const display = useCountUp(value, active)
  return <span className="metric__value">{display}</span>
}

export default function ExperienceLogs() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const label = useDecode('// SYSTEM_AUDIT_LOG', isVisible)
  const heading = useDecode('Experience Logs', isVisible)

  return (
    <section id="experience-logs" ref={ref}>
      <div className="section-inner">
        <div className="logs__head">
          <div>
            <p className="section-label">{label}</p>
            <h2 className="section-heading">{heading}</h2>
          </div>
          <span className="logs__count">
            [{String(roles.length).padStart(2, '0')}] TOTAL_ENTRIES
          </span>
        </div>

        <div className="logs__list">
          {roles.map((role, i) => (
            <article
              key={`${role.company}-${role.dateRange}`}
              className={`entry entry--${role.status.toLowerCase()}${i === 0 ? ' entry--latest' : ''} animate-boot${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="entry__rail">
                <span className="entry__date">{role.dateRange}</span>
                <span className="entry__status">
                  <i className="entry__dot" aria-hidden="true" />
                  {role.status}
                </span>
                {role.metrics && (
                  <div className="entry__metrics">
                    {role.metrics.map((m) => (
                      <div key={m.label} className="metric">
                        <span className="metric__label">{m.label}</span>
                        <MetricValue value={m.value} active={isVisible} />
                      </div>
                    ))}
                  </div>
                )}
                <span className="entry__record">
                  LOG-{String(i + 1).padStart(3, '0')}
                </span>
              </div>

              <div className="entry__body">
                <h3 className="entry__title">{role.title}</h3>
                <p className="entry__company">// {role.company}</p>
                <p className="entry__desc">{role.description}</p>
                <div className="entry__chips">
                  {role.chips.map((chip, ci) => (
                    <span
                      key={chip.label}
                      className={`chip chip--${chip.color}`}
                      style={{ '--i': ci } as CSSProperties}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* HUD brackets mark the live record only, so they mean something. */}
              {role.status === 'ACTIVE' && (
                <>
                  <span className="entry__corner entry__corner--tr" aria-hidden="true" />
                  <span className="entry__corner entry__corner--br" aria-hidden="true" />
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
