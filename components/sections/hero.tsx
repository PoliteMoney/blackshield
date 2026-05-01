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
    <section className="relative min-h-screen bg-[var(--color-background)] overflow-hidden flex items-center">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(0,62,74,0.04) 0%, transparent 60%)' }} />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* items-stretch: left column stretches to match the image height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-stretch">

          {/* Left — text distributed top→bottom across image height */}
          <div className="order-2 lg:order-1 flex flex-col justify-between py-2 animate-fade-in lg:pr-12">

            {/* Top group: identity + headline + tagline + description */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-4">
                {dict.badge}
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light leading-[1.15] text-[var(--color-secondary)] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {dict.tagline_line1}{' '}
                <em className="not-italic" style={{ color: 'var(--color-primary)' }}>
                  {dict.tagline_line2}
                </em>
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[var(--color-primary)]" />
                <div className="h-1 w-1 rounded-full bg-[var(--color-primary)]" />
              </div>
              <p className="text-[11px] font-medium tracking-widest uppercase text-[var(--color-accent)] opacity-80 mb-4">
                {dict.sub_tagline}
              </p>
              <p className="text-sm text-[var(--color-foreground)]/60 max-w-lg leading-relaxed">
                {dict.subtitle}
              </p>
            </div>

            {/* Middle group: CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 py-6">
              <Link
                href="/agendar"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-xs font-semibold tracking-wide rounded-lg hover:bg-[#004d5c] transition-colors duration-300 shadow-lg shadow-[var(--color-accent)]/20"
              >
                {dict.cta_primary}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-xs font-medium rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors duration-300"
              >
                {dict.cta_secondary}
              </Link>
            </div>

            {/* Bottom group: trust indicators */}
            <div className="flex flex-wrap gap-5 pt-6 border-t border-[var(--color-border)]">
              {[dict.trust_1, dict.trust_2, dict.trust_3].map((label) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                  <span className="text-[10px] font-medium text-[var(--color-foreground)]/50 tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right — Radar image (sets the column height) */}
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <Image
              src="/images/radar.png"
              alt="Radar Blackshield"
              width={900}
              height={900}
              className="w-full h-auto object-contain"
              priority
            />
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
