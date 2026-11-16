'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { useState } from 'react'

// Web3Forms access keys are public by design (https://web3forms.com).
// Set NEXT_PUBLIC_WEB3FORMS_KEY in the deployment env. Without it the form is
// replaced by a direct email link, so visitors never hit a form that cannot send.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ''
const CONTACT_EMAIL = 'hello@0xj4an.xyz'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Contact from ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div>
        <div>
          <SectionHeader kicker="02 / Say hi" title="Contact" intro="Collaborations, talks, governance or just a hello." color="#4dd0e1" />

          {!WEB3FORMS_KEY ? (
            <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-gray-300">The best way to reach me is by email.</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          ) : status === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 rounded-lg border border-green-500/30 bg-green-500/10 p-8 text-center"
            >
              <p className="text-lg text-green-400">Message sent! I will get back to you soon.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm text-gray-400 hover:text-white"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-red-400">
                  Something went wrong. Please try again or email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a>.
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  )
}
