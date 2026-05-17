import heroImg from '../assets/hero.png'
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
        <div className="command-center__left">
          <p className="section-label">// PERSONNEL_IDENTIFICATION</p>

          <h1 className={`command-center__name${isVisible ? ' visible' : ''}`}>
            {hero.name}
          </h1>

          <p className="command-center__title">{hero.title}</p>

          <div
            className={`command-center__status animate-entry${isVisible ? ' visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
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
            style={{ transitionDelay: '0.6s' }}
          >
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label} &gt;&gt;
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="command-center__right">
          <div className="command-center__frame">
            <div className="command-center__frame-inner">
              <img
                src={heroImg}
                alt="Ammar Berkovic"
                className="command-center__photo"
              />
              <div className="command-center__scanlines" />
              <span className="command-center__coord command-center__coord--tl">
                PERS_ID: ABK-001
              </span>
              <span className="command-center__coord command-center__coord--br">
                [X:04, Y:12]
              </span>
            </div>
            <div className="command-center__frame-status">
              <span className="command-center__frame-label">▪ IDENTITY_VERIFIED</span>
              <span className="command-center__frame-id">SYS // 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
