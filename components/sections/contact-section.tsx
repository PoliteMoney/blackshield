'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
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
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-secondary)] mb-4">{dict.title}</h2>
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
                className="flex items-center gap-3 p-5 bg-[#003E4A] text-white rounded-2xl hover:bg-[#004d5c] transition-colors"
              >
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="#4ade80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.118 1.528 5.845L.057 23.428a.75.75 0 0 0 .921.921l5.638-1.47A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 0 1-4.953-1.355l-.355-.211-3.684.96.98-3.593-.232-.37A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
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
