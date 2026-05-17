import { useIntersection } from '../hooks/useIntersection'
import { roles } from '../data/content'
import './ExperienceLogs.css'

export default function ExperienceLogs() {
  const [ref, isVisible] = useIntersection<HTMLElement>()

  return (
    <section id="experience-logs" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// SYSTEM_AUDIT_LOG</p>
        <h2 className="section-heading">Experience Logs</h2>

        <div className="experience-logs__list">
          {roles.map((role, i) => (
            <div
              key={`${role.company}-${role.dateRange}`}
              className={`role-entry animate-entry${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <p className="role-entry__date">{role.dateRange}</p>
              <h3 className="role-entry__title">{role.title}</h3>
              <p className="role-entry__company">// {role.company}</p>
              <p className="role-entry__desc">{role.description}</p>
              <div className="role-entry__chips">
                {role.chips.map((chip) => (
                  <span key={chip.label} className={`chip chip--${chip.color}`}>{chip.label}</span>
                ))}
              </div>
              <div className="role-entry__status">
                [ENTRY_STATUS: {role.status}]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
