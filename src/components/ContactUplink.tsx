import { useState, useRef, useEffect, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { useIntersection } from '../hooks/useIntersection'
import { contact } from '../data/content'
import './ContactUplink.css'

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

const BTN_LABEL: Record<SendStatus, string> = {
  idle:    'TRANSMIT_PACKET >>',
  sending: 'TRANSMITTING...',
  success: 'PACKET_DELIVERED',
  error:   'TRANSMISSION_FAILED — RETRY',
}

const BTN_CLASS: Record<SendStatus, string> = {
  idle:    '',
  sending: '',
  success: 'submit-btn--success',
  error:   'submit-btn--error',
}

export default function ContactUplink() {
  const [ref, isVisible] = useIntersection<HTMLElement>()
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<SendStatus>('idle')

  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending' || !formRef.current) return
    setStatus('sending')
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      if (isMounted.current) {
        setStatus('success')
        formRef.current?.reset()
      }
    } catch {
      if (isMounted.current) setStatus('error')
    }
  }

  return (
    <section id="contact-uplink" ref={ref}>
      <div className="section-inner">
        <p className="section-label">// OPEN_CHANNEL</p>
        <h2 className="section-heading">Contact Uplink</h2>

        <div className={`contact-uplink__layout animate-entry${isVisible ? ' visible' : ''}`}>
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="from_name">IDENTIFIER</label>
              <div className="field-wrapper">
                <input id="from_name" name="from_name" className="field-input" type="text" required autoComplete="name" />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="from_email">RELAY_ADDRESS</label>
              <div className="field-wrapper">
                <input id="from_email" name="from_email" className="field-input" type="email" required autoComplete="email" />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="message">MESSAGE_PACKET</label>
              <div className="field-wrapper">
                <textarea id="message" name="message" className="field-textarea" required autoComplete="off" />
                <span className="bracket-bl" />
                <span className="bracket-br" />
              </div>
            </div>

            <button
              type="submit"
              className={`btn-primary submit-btn ${BTN_CLASS[status]}`}
              disabled={status === 'sending' || status === 'success'}
            >
              {BTN_LABEL[status]}
            </button>
          </form>

          <span
            role="status"
            aria-live="polite"
            style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
          >
            {status === 'success' ? 'Message sent successfully.' : status === 'error' ? 'Failed to send message. Please try again.' : ''}
          </span>

          <aside className="contact-sidebar" aria-label="Direct channels">
            <p className="contact-sidebar__heading">// DIRECT_CHANNELS</p>
            <a href={contact.github} target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link__prefix">$</span> open github.com/ammar
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-link">
              <span className="contact-link__prefix">$</span> open linkedin.com/in/ammar
            </a>
            <a href={`mailto:${contact.email}`} className="contact-link">
              <span className="contact-link__prefix">$</span> send {contact.email}
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
