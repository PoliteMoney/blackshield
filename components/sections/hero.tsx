'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useSiteConfig } from '@/components/providers/site-config-provider'

interface HeroProps {
  dict: {
    badge: string; title: string; tagline_line1: string; tagline_line2: string
    sub_tagline: string; subtitle: string; cta_primary: string; cta_secondary: string; scroll: string
    trust_1: string; trust_2: string; trust_3: string
    radar_card1_label: string; radar_card1_desc: string
    radar_card2_label: string; radar_card2_desc: string
  }
  contactDict: { whatsapp: string }
}

function RadarSVG() {
  return (
    <svg viewBox="0 0 520 520" className="w-full max-w-[480px]" aria-hidden="true">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#003E4A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#003E4A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#AD8855" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#AD8855" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="260" cy="260" r="240" fill="url(#radarGlow)" />

      {/* Concentric rings */}
      <circle cx="260" cy="260" r="60"  fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.25" />
      <circle cx="260" cy="260" r="120" fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.20" />
      <circle cx="260" cy="260" r="180" fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.16" />
      <circle cx="260" cy="260" r="240" fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.12" />

      {/* Cardinal crosshairs */}
      <line x1="260" y1="20"  x2="260" y2="500" stroke="#003E4A" strokeWidth="1" opacity="0.18" />
      <line x1="20"  y1="260" x2="500" y2="260" stroke="#003E4A" strokeWidth="1" opacity="0.18" />

      {/* Diagonal grid */}
      <line x1="90"  y1="90"  x2="430" y2="430" stroke="#003E4A" strokeWidth="0.5" opacity="0.10" />
      <line x1="430" y1="90"  x2="90"  y2="430" stroke="#003E4A" strokeWidth="0.5" opacity="0.10" />

      {/* Degree tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const r1 = 234, r2 = i % 6 === 0 ? 218 : 226
        return (
          <line
            key={i}
            x1={260 + r1 * Math.sin(angle)}
            y1={260 - r1 * Math.cos(angle)}
            x2={260 + r2 * Math.sin(angle)}
            y2={260 - r2 * Math.cos(angle)}
            stroke="#003E4A"
            strokeWidth={i % 6 === 0 ? 1.5 : 0.75}
            opacity={i % 6 === 0 ? 0.3 : 0.18}
          />
        )
      })}

      {/* Sweep sector */}
      <path
        d="M 260 260 L 260 20 A 240 240 0 0 1 434 134 Z"
        fill="#003E4A"
        opacity="0.04"
      />
      <path
        d="M 260 260 L 260 20 A 240 240 0 0 1 434 134 Z"
        fill="none"
        stroke="#003E4A"
        strokeWidth="1"
        opacity="0.12"
      />

      {/* Target blip – main */}
      <circle cx="330" cy="152" r="10" fill="#003E4A" opacity="0.08" />
      <circle cx="330" cy="152" r="5"  fill="#AD8855" opacity="0.9" />
      <circle cx="330" cy="152" r="2"  fill="#AD8855" />

      {/* Target blip – secondary */}
      <circle cx="190" cy="338" r="8"  fill="#003E4A" opacity="0.08" />
      <circle cx="190" cy="338" r="4"  fill="#AD8855" opacity="0.6" />

      {/* Outer intersections */}
      <circle cx="260" cy="80"  r="3" fill="#AD8855" opacity="0.5" />
      <circle cx="440" cy="260" r="3" fill="#AD8855" opacity="0.4" />
      <circle cx="260" cy="440" r="3" fill="#AD8855" opacity="0.4" />
      <circle cx="80"  cy="260" r="3" fill="#AD8855" opacity="0.35" />

      {/* Center pulse */}
      <circle cx="260" cy="260" r="20" fill="url(#centerGlow)" />
      <circle cx="260" cy="260" r="8"  fill="#003E4A" opacity="0.15" />
      <circle cx="260" cy="260" r="4"  fill="#AD8855" opacity="0.9" />
      <circle cx="260" cy="260" r="2"  fill="#AD8855" />

      {/* Coordinate labels */}
      <text x="265" y="35"  fontSize="8" fill="#003E4A" opacity="0.35" fontFamily="Montserrat, sans-serif">N</text>
      <text x="265" y="490" fontSize="8" fill="#003E4A" opacity="0.35" fontFamily="Montserrat, sans-serif">S</text>
      <text x="492" y="264" fontSize="8" fill="#003E4A" opacity="0.35" fontFamily="Montserrat, sans-serif">E</text>
      <text x="22"  y="264" fontSize="8" fill="#003E4A" opacity="0.35" fontFamily="Montserrat, sans-serif">W</text>
    </svg>
  )
}

export function Hero({ dict, contactDict }: HeroProps) {
  const config = useSiteConfig()

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

          {/* Right — Radar SVG */}
          <div className="order-1 lg:order-2 flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-full max-w-[460px]">
              <RadarSVG />
              {/* Logo centrado sobre el radar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image
                  src="/images/logo_negro.png"
                  alt="Blackshield"
                  width={200}
                  height={80}
                  className="w-44 h-auto object-contain"
                />
              </div>
              {/* Decorative card overlay */}
              <div className="absolute top-6 right-0 bg-white border border-[var(--color-border)] rounded-xl p-4 shadow-sm max-w-[160px]">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-1">
                  {dict.radar_card1_label}
                </p>
                <p className="text-xs text-[var(--color-foreground)]/60 leading-snug">
                  {dict.radar_card1_desc}
                </p>
              </div>
              <div className="absolute bottom-10 left-0 bg-[var(--color-secondary)] rounded-xl p-4 shadow-lg max-w-[160px]">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--color-primary)] mb-1">
                  {dict.radar_card2_label}
                </p>
                <p className="text-xs text-white/60 leading-snug">
                  {dict.radar_card2_desc}
                </p>
              </div>
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
