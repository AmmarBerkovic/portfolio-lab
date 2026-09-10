import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactUplink from './ContactUplink'

const sendForm = vi.fn()

vi.mock('@emailjs/browser', () => ({
  default: { sendForm: (...args: unknown[]) => sendForm(...args) },
}))

beforeEach(() => {
  sendForm.mockReset()
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(function () {
      return { observe: vi.fn(), disconnect: vi.fn() }
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Fill the three required fields so the browser lets the form submit. */
async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('IDENTIFIER'), 'Recruiter')
  await user.type(screen.getByLabelText('RELAY_ADDRESS'), 'someone@example.com')
  await user.type(screen.getByLabelText('MESSAGE_PACKET'), 'Are you available?')
}

describe('ContactUplink', () => {
  test('offers the direct channels alongside the form', () => {
    render(<ContactUplink />)
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  test('marks the button as transmitting while the packet is in flight', async () => {
    // A send that never settles, so the in-flight state can be observed.
    sendForm.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    render(<ContactUplink />)
    await fillForm(user)

    await user.click(screen.getByRole('button', { name: /transmit_packet/i }))

    const button = screen.getByRole('button', { name: /transmitting/i })
    expect(button).toHaveClass('submit-btn--sending')
    expect(button).toBeDisabled()
  })

  test('reports a delivered packet once the send resolves', async () => {
    sendForm.mockResolvedValue({ status: 200 })
    const user = userEvent.setup()
    render(<ContactUplink />)
    await fillForm(user)

    await user.click(screen.getByRole('button', { name: /transmit_packet/i }))

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /packet_delivered/i })
      expect(button).toHaveClass('submit-btn--success')
      expect(button).not.toHaveClass('submit-btn--sending')
    })
  })

  test('offers a retry when the send fails', async () => {
    sendForm.mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()
    render(<ContactUplink />)
    await fillForm(user)

    await user.click(screen.getByRole('button', { name: /transmit_packet/i }))

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /retry/i })
      expect(button).toHaveClass('submit-btn--error')
      expect(button).not.toBeDisabled()
    })
  })
})
