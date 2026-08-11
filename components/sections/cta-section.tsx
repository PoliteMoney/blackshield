'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useSiteConfig } from '@/components/providers/site-config-provider'
import { useLocale } from '@/components/providers/locale-provider'

interface CTASectionProps {
  dict: { title: string; subtitle: string; button: string; contact: string }
}

export function CTASection({ dict }: CTASectionProps) {
  const config = useSiteConfig()
  const { locale } = useLocale()

  const waMessage = locale === 'en' ? config.whatsapp_message_en : config.whatsapp_message_es
  const waNumber = (config.whatsapp_number || '').replace(/\D/g, '')
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage || '')}`

  return (
    <section className="section-padding bg-[var(--color-secondary)]">
      <div className="container-custom mx-auto text-center">
        {/* Oro divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-[var(--color-primary)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          <div className="h-px w-16 bg-[var(--color-primary)]" />
        </div>
        <h2 className="display-heading text-5xl sm:text-6xl lg:text-7xl leading-[1.0] text-white mb-6">
          {dict.title}
        </h2>
        <p className="text-white/50 text-base max-w-xl mx-auto mb-10 leading-relaxed">
          {dict.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-white text-sm font-semibold tracking-wide rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors duration-300 shadow-lg shadow-[var(--color-accent)]/25"
          >
            {dict.button}
            <ArrowRight className="w-4 h-4" />
          </Link>
          {waNumber && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 border border-white/15 text-white text-sm font-medium rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
