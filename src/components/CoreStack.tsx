import type { CSSProperties } from 'react'
import { useIntersection } from '../hooks/useIntersection'
import { useDecode } from '../hooks/useDecode'
import { domains } from '../data/content'
import './CoreStack.css'

export default function CoreStack() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const label = useDecode('// ENGINEERING_DOMAINS', isVisible)
  const heading = useDecode('Core Stack', isVisible)

  return (
    <section id="core-stack" ref={ref}>
      <div className="section-inner">
        <p className="section-label">{label}</p>
        <h2 className="section-heading">{heading}</h2>

        <div className="core-stack__grid">
          {domains.map((domain, i) => (
            <div
              key={domain.id}
              className={`domain-card animate-boot${isVisible ? ' visible' : ''}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="card-header">
                <span className="card-header__id">{domain.id} // {domain.title.toUpperCase().replace(/ /g, '_')}</span>
                <span className="status-dot status-dot--green" style={{ animation: 'status-blink 2s ease-in-out infinite' }} />
              </div>
              <div className="domain-card__body">
                <h3 className="domain-card__title">{domain.title}</h3>
                <p className="domain-card__desc">{domain.description}</p>
                <div className="domain-card__chips">
                  {domain.chips.map((chip, ci) => (
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
