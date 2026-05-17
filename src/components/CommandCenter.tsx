import { useIntersection } from '../hooks/useIntersection'
import { hero } from '../data/content'
import './CommandCenter.css'

const STATUS_DOT_CLASS: Record<string, string> = {
  green: 'status-dot--green',
  cyan:  'status-dot--cyan',
  amber: 'status-dot--amber',
}

export default function CommandCenter() {
  const [ref, isVisible] = useIntersection<HTMLDivElement>(0.2)

  return (
    <section id="command-center" className="command-center">
      <div className="section-inner command-center__inner" ref={ref}>
        <p className="section-label">// PERSONNEL_IDENTIFICATION</p>

        <h1 className={`command-center__name${isVisible ? ' visible' : ''}`}>
          {hero.name}
        </h1>

        <p className="command-center__title">{hero.title}</p>

        <div className={`command-center__status animate-entry${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}>
          {hero.statusIndicators.map(({ label, color }) => (
            <div key={label} className="status-item">
              <span className={`status-dot ${STATUS_DOT_CLASS[color]}`} />
              {label}
            </div>
          ))}
        </div>

        <div className={`command-center__actions animate-entry${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.6s' }}>
          <a href={hero.primaryCta.href} className="btn-primary">
            {hero.primaryCta.label} &gt;&gt;
          </a>
          <a href={hero.secondaryCta.href} className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
