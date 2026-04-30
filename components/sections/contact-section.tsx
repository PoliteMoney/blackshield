'use client'

import { useState } from 'react'
import { Mail, Phone, MessageCircle, MapPin, Send } from 'lucide-react'
import { useSiteConfig } from '@/components/providers/site-config-provider'
import { useLocale } from '@/components/providers/locale-provider'
import toast from 'react-hot-toast'

interface ContactSectionProps {
  dict: Record<string, string>
}

export function ContactSection({ dict }: ContactSectionProps) {
  const config = useSiteConfig()
  const { locale } = useLocale()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', company: '', subject: '', message: '' })

  const waMessage = locale === 'en' ? config.whatsapp_message_en : config.whatsapp_message_es
  const waNumber = (config.whatsapp_number || '').replace(/\D/g, '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (res.ok) {
        toast.success(dict.success)
        setForm({ full_name: '', email: '', phone: '', company: '', subject: '', message: '' })
      } else {
        toast.error(dict.error)
      }
    } catch {
      toast.error(dict.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-sm font-medium rounded-full mb-4">
            {dict.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-secondary)] mb-4">{dict.title}</h2>
          <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-[var(--color-secondary)] rounded-2xl">
              <h3 className="text-white font-semibold mb-6">{dict.contact_info_title}</h3>
              <div className="space-y-5">
                {config.contact_email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">{dict.email_label}</p>
                      <a href={`mailto:${config.contact_email}`} className="text-white text-sm hover:text-[var(--color-primary)] transition-colors">
                        {config.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                {waNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">{dict.phone_label}</p>
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                        className="text-white text-sm hover:text-[var(--color-primary)] transition-colors">
                        {config.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}
                {config.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">{dict.address_label}</p>
                      <p className="text-white text-sm">{config.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">{dict.whatsapp}</p>
                  <p className="text-sm text-white/70">{dict.whatsapp_instant}</p>
                </div>
              </a>
            )}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm">
              <h3 className="font-semibold text-[var(--color-secondary)] mb-6">{dict.form_title}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.name} *</label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.email} *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.phone}</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.company}</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.subject}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.message} *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? dict.sending : dict.send}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
