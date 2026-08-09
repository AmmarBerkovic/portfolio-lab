import { useIntersection } from '../hooks/useIntersection'
import { projects } from '../data/content'
import './ActiveProjects.css'

const STATUS_DOT: Record<string, string> = {
  'active':      'status-dot--green',
  'in-progress': 'status-dot--amber',
}

export default function ActiveProjects() {
  const [ref, isVisible] = useIntersection<HTMLElement>()

  return (
    <section id="active-projects" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// PROJECT_ARCHIVE</p>
        <h2 className="section-heading">Active Projects</h2>

        <div className="active-projects__grid">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`project-card animate-entry${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="card-header">
                <span className="card-header__id">{project.id} // {project.name.toUpperCase().replace(/ /g, '_')}</span>
                <span className={`status-dot ${STATUS_DOT[project.status]}`} />
              </div>

              <div className="project-card__body">
                <h3 className="project-card__name">{project.name}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__chips">
                  {project.chips.map((chip) => (
                    <span key={chip.label} className={`chip chip--${chip.color}`}>{chip.label}</span>
                  ))}
                </div>
              </div>

              <div className="project-card__footer">
                <span className="project-card__coordinates">{project.coordinates}</span>
                <div className="project-card__actions">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    VIEW_REPO
                  </a>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                      LIVE_DEMO
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
