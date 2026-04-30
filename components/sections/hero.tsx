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

function WorldRadarSVG() {
  // Equirectangular city positions for 900×480 viewBox:
  // x=(lon+180)/360*900, y=(90-lat)/180*480
  const cx = 450, cy = 240

  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const a = (i * 15 * Math.PI) / 180
    const r1 = 215, r2 = i % 6 === 0 ? 200 : 208
    return { x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a), x2: cx + r2 * Math.sin(a), y2: cy - r2 * Math.cos(a), major: i % 6 === 0 }
  })

  // Geographically accurate city positions
  const dc     = { x: 258, y: 136 } // Washington D.C.
  const mexico = { x: 202, y: 188 } // Mexico City
  const london = { x: 450, y: 103 } // London
  const tokyo  = { x: 799, y: 145 } // Tokyo
  const dubai  = { x: 588, y: 173 } // Dubai
  const sao    = { x: 334, y: 303 } // São Paulo

  return (
    <svg viewBox="0 0 900 480" className="w-full" aria-hidden="true">
      <defs>
        <radialGradient id="radarGlowW" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#AD8855" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#AD8855" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="centerGlowW" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#AD8855" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#AD8855" stopOpacity="0" />
        </radialGradient>
        <filter id="glowMX">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* World map image — equirectangular, 900×480 */}
      <image href="/images/world-map-dots.png" x="0" y="0" width="900" height="480"
        preserveAspectRatio="xMidYMid meet" opacity="0.38" />

      {/* USA highlight */}
      <rect x="137" y="109" width="150" height="64" fill="#003E4A" opacity="0.18" rx="3" />
      <rect x="137" y="109" width="150" height="64" fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.38" rx="3" />

      {/* Mexico highlight */}
      <rect x="162" y="164" width="68" height="40" fill="#AD8855" opacity="0.18" rx="3" />
      <rect x="162" y="164" width="68" height="40" fill="none" stroke="#AD8855" strokeWidth="1" opacity="0.38" rx="3" />

      {/* ── RADAR OVERLAY ── */}
      <circle cx={cx} cy={cy} r="220" fill="url(#radarGlowW)" />

      {/* Rings — Oro */}
      <circle cx={cx} cy={cy} r="55"  fill="none" stroke="#AD8855" strokeWidth="1"   opacity="0.55" />
      <circle cx={cx} cy={cy} r="110" fill="none" stroke="#AD8855" strokeWidth="1"   opacity="0.42" />
      <circle cx={cx} cy={cy} r="165" fill="none" stroke="#AD8855" strokeWidth="0.8" opacity="0.30" />
      <circle cx={cx} cy={cy} r="220" fill="none" stroke="#AD8855" strokeWidth="0.8" opacity="0.22" />

      {/* Crosshairs */}
      <line x1={cx} y1="20"  x2={cx} y2="460"  stroke="#AD8855" strokeWidth="0.8" opacity="0.28" />
      <line x1="230" y1={cy} x2="670" y2={cy}   stroke="#AD8855" strokeWidth="0.8" opacity="0.28" />
      <line x1="294" y1="84" x2="606" y2="396"  stroke="#AD8855" strokeWidth="0.5" opacity="0.15" />
      <line x1="606" y1="84" x2="294" y2="396"  stroke="#AD8855" strokeWidth="0.5" opacity="0.15" />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="#AD8855" strokeWidth={t.major ? 1.5 : 0.75} opacity={t.major ? 0.42 : 0.22} />
      ))}

      {/* Sweep sector */}
      <path d={`M ${cx} ${cy} L ${cx} 20 A 220 220 0 0 1 ${cx + 155} ${cy - 165} Z`}
        fill="#AD8855" opacity="0.04" />
      <path d={`M ${cx} ${cy} L ${cx} 20 A 220 220 0 0 1 ${cx + 155} ${cy - 165} Z`}
        fill="none" stroke="#AD8855" strokeWidth="1" opacity="0.15" />

      {/* Connection lines center → cities */}
      <line x1={cx} y1={cy} x2={dc.x}     y2={dc.y}     stroke="#AD8855" strokeWidth="0.8" opacity="0.45" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={mexico.x} y2={mexico.y} stroke="#AD8855" strokeWidth="0.8" opacity="0.45" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={london.x} y2={london.y} stroke="#AD8855" strokeWidth="0.7" opacity="0.30" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={tokyo.x}  y2={tokyo.y}  stroke="#AD8855" strokeWidth="0.7" opacity="0.28" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={dubai.x}  y2={dubai.y}  stroke="#AD8855" strokeWidth="0.7" opacity="0.28" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={sao.x}    y2={sao.y}    stroke="#AD8855" strokeWidth="0.7" opacity="0.25" strokeDasharray="5 3" />

      {/* Washington D.C. */}
      <circle cx={dc.x} cy={dc.y} r="8"   fill="#003E4A" opacity="0.12" filter="url(#glowMX)" />
      <circle cx={dc.x} cy={dc.y} r="4"   fill="#003E4A" opacity="0.85" />
      <circle cx={dc.x} cy={dc.y} r="1.8" fill="#F5F7F8" />
      <text x={dc.x + 7} y={dc.y - 2} fontSize="7" fill="#003E4A" opacity="0.85" fontFamily="Montserrat,sans-serif" fontWeight="700">EUA</text>

      {/* Mexico City */}
      <circle cx={mexico.x} cy={mexico.y} r="8"   fill="#AD8855" opacity="0.12" filter="url(#glowMX)" />
      <circle cx={mexico.x} cy={mexico.y} r="4"   fill="#AD8855" opacity="0.85" />
      <circle cx={mexico.x} cy={mexico.y} r="1.8" fill="#F5F7F8" />
      <text x={mexico.x + 7} y={mexico.y - 2} fontSize="7" fill="#AD8855" opacity="0.90" fontFamily="Montserrat,sans-serif" fontWeight="700">México</text>

      {/* London */}
      <circle cx={london.x} cy={london.y} r="3"   fill="#AD8855" opacity="0.85" />
      <circle cx={london.x} cy={london.y} r="1.2" fill="#F5F7F8" />

      {/* Tokyo */}
      <circle cx={tokyo.x} cy={tokyo.y} r="3"   fill="#AD8855" opacity="0.85" />
      <circle cx={tokyo.x} cy={tokyo.y} r="1.2" fill="#F5F7F8" />

      {/* Dubai */}
      <circle cx={dubai.x} cy={dubai.y} r="3"   fill="#AD8855" opacity="0.75" />
      <circle cx={dubai.x} cy={dubai.y} r="1.2" fill="#F5F7F8" />

      {/* São Paulo */}
      <circle cx={sao.x} cy={sao.y} r="3"   fill="#AD8855" opacity="0.70" />
      <circle cx={sao.x} cy={sao.y} r="1.2" fill="#F5F7F8" />

      {/* Center */}
      <circle cx={cx} cy={cy} r="18"  fill="url(#centerGlowW)" />
      <circle cx={cx} cy={cy} r="7"   fill="#AD8855" opacity="0.15" />
      <circle cx={cx} cy={cy} r="3.5" fill="#AD8855" opacity="0.90" />
      <circle cx={cx} cy={cy} r="1.5" fill="#F5F7F8" />

      {/* NSEW labels */}
      <text x="453" y="32"  fontSize="8" fill="#AD8855" opacity="0.50" fontFamily="Montserrat,sans-serif">N</text>
      <text x="453" y="458" fontSize="8" fill="#AD8855" opacity="0.50" fontFamily="Montserrat,sans-serif">S</text>
      <text x="660" y="244" fontSize="8" fill="#AD8855" opacity="0.50" fontFamily="Montserrat,sans-serif">E</text>
      <text x="218" y="244" fontSize="8" fill="#AD8855" opacity="0.50" fontFamily="Montserrat,sans-serif">W</text>
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
              <WorldRadarSVG />
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
