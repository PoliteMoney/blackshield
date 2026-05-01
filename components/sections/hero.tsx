'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroProps {
  dict: {
    badge: string; title: string; tagline_line1: string; tagline_line2: string
    sub_tagline: string; subtitle: string; cta_primary: string; cta_secondary: string; scroll: string
    trust_1: string; trust_2: string; trust_3: string
  }
  contactDict: { whatsapp: string }
}

export function Hero({ dict }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-[var(--color-background)] overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(0,62,74,0.04) 0%, transparent 60%)' }} />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Text content */}
          <div className="order-2 lg:order-1 animate-fade-in">
            {/* Eyebrow label */}
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-6">
              {dict.badge}
            </p>

            {/* Main headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-[4.25rem] font-light leading-[1.1] text-[var(--color-secondary)] mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {dict.tagline_line1}{' '}
              <em className="not-italic" style={{ color: 'var(--color-primary)' }}>
                {dict.tagline_line2}
              </em>
            </h1>

            {/* Oro divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-[var(--color-primary)]" />
              <div className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
            </div>

            {/* Sub-tagline */}
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] opacity-80 mb-5">
              {dict.sub_tagline}
            </p>

            {/* Description */}
            <p className="text-base text-[var(--color-foreground)]/60 max-w-lg leading-relaxed mb-10">
              {dict.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/agendar"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-white text-sm font-semibold tracking-wide rounded-lg hover:bg-[#004d5c] transition-colors duration-300 shadow-lg shadow-[var(--color-accent)]/20"
              >
                {dict.cta_primary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-sm font-medium rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
              >
                {dict.cta_secondary}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-12 pt-10 border-t border-[var(--color-border)]">
              {[dict.trust_1, dict.trust_2, dict.trust_3].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-foreground)]/50 tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Radar image */}
          <div className="order-1 lg:order-2 flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="w-full max-w-[520px]">
              <Image
                src="/images/radar.png"
                alt="Radar Blackshield"
                width={520}
                height={520}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-foreground)]/30 text-xs">
        <span className="tracking-widest uppercase text-[10px]">{dict.scroll}</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}
