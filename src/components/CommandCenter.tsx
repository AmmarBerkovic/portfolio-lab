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

        <div
          className={`command-center__right animate-entry${isVisible ? ' visible' : ''}`}
          style={{ transitionDelay: '0.3s' }}
        >
          <div className="profile-frame">
            <img src="/profile.jpg" alt="Ammar Berkovic" className="profile-frame__img" />
            <span className="profile-frame__coord">[45.8150° N // ALT: 122M]</span>
          </div>

          <div className="auth-panel">
            <div className="card-header">
              <span className="card-header__id">AUTHENTICATED_ENTITY</span>
              <span
                className="status-dot status-dot--green"
                style={{ animation: 'status-blink 2s ease-in-out infinite' }}
              />
            </div>
            <div className="auth-panel__body">
              <div className="auth-row">
                <span className="auth-row__key">BIOS_INTEGRITY</span>
                <span className="auth-row__val auth-row__val--cyan">99.8%</span>
              </div>
              <div className="auth-row">
                <span className="auth-row__key">LOCATION</span>
                <span className="auth-row__val">45.8150° N // ALT: 122M</span>
              </div>
              <div className="auth-row">
                <span className="auth-row__key">TMP</span>
                <span className="auth-row__val">36.6°C</span>
              </div>
              <div className="auth-row">
                <span className="auth-row__key">HRT</span>
                <span className="auth-row__val">62BPM</span>
              </div>
              <div className="auth-row">
                <span className="auth-row__key">PACKET_IN</span>
                <span className="auth-row__val">12.4GB</span>
              </div>
              <div className="auth-row">
                <span className="auth-row__key">ENCR_LEVEL</span>
                <span className="auth-row__val auth-row__val--cyan">AES_256</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-prompt" aria-hidden="true">
        SCROLL_FOR_CORE
        <span className="scroll-prompt__arrow" />
      </div>
    </section>
  )
}
