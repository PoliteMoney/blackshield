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
  // Equirectangular projection: x=(lon+180)*2.5, y=(90-lat)*2.667 → viewBox 900×480, center (450,240)
  const cx = 450, cy = 240

  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const a = (i * 15 * Math.PI) / 180
    const r1 = 215, r2 = i % 6 === 0 ? 200 : 208
    return { x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a), x2: cx + r2 * Math.sin(a), y2: cy - r2 * Math.cos(a), major: i % 6 === 0 }
  })

  return (
    <svg viewBox="0 0 900 480" className="w-full" aria-hidden="true">
      <defs>
        <pattern id="mapDots" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="#383B3E" />
        </pattern>
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

      {/* ── WORLD MAP ── */}

      {/* Greenland */}
      <path d="M 252,38 L 280,30 L 310,33 L 325,48 L 322,66 L 306,76 L 282,78 L 260,66 L 250,52 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* North America */}
      <path d="M 42,88 L 68,58 L 105,48 L 150,50 L 192,60 L 230,76 L 262,95 L 280,122 L 285,148 L 274,170 L 255,185 L 235,202 L 220,220 L 208,242 L 192,254 L 176,242 L 165,226 L 157,210 L 144,194 L 130,176 L 118,158 L 104,140 L 88,120 L 68,108 L 48,112 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* USA — highlighted */}
      <path d="M 143,152 L 170,142 L 208,143 L 248,148 L 276,156 L 280,172 L 268,186 L 246,193 L 212,196 L 180,196 L 156,190 L 140,178 Z"
        fill="#003E4A" opacity="0.20" />
      <path d="M 143,152 L 170,142 L 208,143 L 248,148 L 276,156 L 280,172 L 268,186 L 246,193 L 212,196 L 180,196 L 156,190 L 140,178 Z"
        fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.45" />

      {/* Mexico — highlighted */}
      <path d="M 158,190 L 180,186 L 210,188 L 228,198 L 232,210 L 225,224 L 214,238 L 198,246 L 182,240 L 170,228 L 160,214 L 156,202 Z"
        fill="#003E4A" opacity="0.20" />
      <path d="M 158,190 L 180,186 L 210,188 L 228,198 L 232,210 L 225,224 L 214,238 L 198,246 L 182,240 L 170,228 L 160,214 L 156,202 Z"
        fill="none" stroke="#003E4A" strokeWidth="1" opacity="0.45" />

      {/* South America */}
      <path d="M 220,210 L 240,198 L 266,193 L 294,204 L 312,224 L 322,254 L 320,292 L 308,330 L 285,370 L 262,386 L 248,373 L 234,346 L 220,314 L 210,280 L 207,250 L 212,226 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* Europe */}
      <path d="M 416,62 L 444,52 L 474,50 L 505,53 L 533,62 L 543,78 L 545,94 L 537,110 L 518,122 L 496,130 L 473,133 L 450,130 L 430,122 L 418,108 L 414,88 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* Africa */}
      <path d="M 416,130 L 444,122 L 480,120 L 516,128 L 543,146 L 556,174 L 558,208 L 552,250 L 540,292 L 521,334 L 500,364 L 477,370 L 458,356 L 443,330 L 430,295 L 418,257 L 408,216 L 406,176 L 412,152 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* Asia */}
      <path d="M 540,62 L 578,50 L 628,45 L 682,48 L 730,53 L 775,58 L 815,68 L 842,82 L 850,100 L 840,122 L 818,142 L 800,162 L 774,178 L 743,190 L 712,200 L 680,210 L 648,218 L 615,215 L 582,206 L 558,190 L 544,172 L 534,148 L 530,122 L 532,94 L 538,76 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* SE Asia islands */}
      <ellipse cx="718" cy="244" rx="18" ry="10" fill="url(#mapDots)" opacity="0.45" />
      <ellipse cx="754" cy="257" rx="24" ry="11" fill="url(#mapDots)" opacity="0.45" />
      <ellipse cx="800" cy="238" rx="10" ry="7"  fill="url(#mapDots)" opacity="0.40" />

      {/* Australia */}
      <path d="M 738,272 L 766,262 L 808,268 L 840,280 L 847,306 L 843,333 L 825,351 L 800,358 L 766,353 L 742,336 L 730,310 L 730,288 Z"
        fill="url(#mapDots)" opacity="0.45" />

      {/* ── RADAR OVERLAY ── */}
      <circle cx={cx} cy={cy} r="220" fill="url(#radarGlowW)" />

      {/* Rings — Oro */}
      <circle cx={cx} cy={cy} r="55"  fill="none" stroke="#AD8855" strokeWidth="1"   opacity="0.55" />
      <circle cx={cx} cy={cy} r="110" fill="none" stroke="#AD8855" strokeWidth="1"   opacity="0.42" />
      <circle cx={cx} cy={cy} r="165" fill="none" stroke="#AD8855" strokeWidth="0.8" opacity="0.30" />
      <circle cx={cx} cy={cy} r="220" fill="none" stroke="#AD8855" strokeWidth="0.8" opacity="0.22" />

      {/* Crosshairs */}
      <line x1={cx} y1="20"     x2={cx} y2="460"   stroke="#AD8855" strokeWidth="0.8" opacity="0.28" />
      <line x1="230" y1={cy}    x2="670" y2={cy}    stroke="#AD8855" strokeWidth="0.8" opacity="0.28" />
      <line x1="294" y1="84"    x2="606" y2="396"   stroke="#AD8855" strokeWidth="0.5" opacity="0.15" />
      <line x1="606" y1="84"    x2="294" y2="396"   stroke="#AD8855" strokeWidth="0.5" opacity="0.15" />

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

      {/* ── CONNECTION LINES (center → cities) ── */}
      <line x1={cx} y1={cy} x2="207" y2="170" stroke="#AD8855" strokeWidth="0.8" opacity="0.45" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2="193" y2="215" stroke="#AD8855" strokeWidth="0.8" opacity="0.45" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2="460" y2="112" stroke="#AD8855" strokeWidth="0.7" opacity="0.30" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2="796" y2="153" stroke="#AD8855" strokeWidth="0.7" opacity="0.28" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2="588" y2="186" stroke="#AD8855" strokeWidth="0.7" opacity="0.28" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2="267" y2="320" stroke="#AD8855" strokeWidth="0.7" opacity="0.25" strokeDasharray="5 3" />

      {/* ── CITY DOTS ── */}
      {/* Washington D.C. (USA) */}
      <circle cx="207" cy="170" r="8"  fill="#003E4A" opacity="0.12" filter="url(#glowMX)" />
      <circle cx="207" cy="170" r="4"  fill="#003E4A" opacity="0.85" />
      <circle cx="207" cy="170" r="1.8" fill="#F5F7F8" />
      <text x="214" y="167" fontSize="7" fill="#003E4A" opacity="0.80" fontFamily="Montserrat,sans-serif" fontWeight="700">EUA</text>

      {/* Mexico City */}
      <circle cx="193" cy="215" r="8"  fill="#003E4A" opacity="0.12" filter="url(#glowMX)" />
      <circle cx="193" cy="215" r="4"  fill="#003E4A" opacity="0.85" />
      <circle cx="193" cy="215" r="1.8" fill="#F5F7F8" />
      <text x="200" y="212" fontSize="7" fill="#003E4A" opacity="0.80" fontFamily="Montserrat,sans-serif" fontWeight="700">México</text>

      {/* London */}
      <circle cx="460" cy="112" r="3" fill="#AD8855" opacity="0.85" />
      <circle cx="460" cy="112" r="1.2" fill="#F5F7F8" />

      {/* Tokyo */}
      <circle cx="796" cy="153" r="3" fill="#AD8855" opacity="0.85" />
      <circle cx="796" cy="153" r="1.2" fill="#F5F7F8" />

      {/* Dubai */}
      <circle cx="588" cy="186" r="3" fill="#AD8855" opacity="0.75" />
      <circle cx="588" cy="186" r="1.2" fill="#F5F7F8" />

      {/* São Paulo */}
      <circle cx="267" cy="320" r="3" fill="#AD8855" opacity="0.70" />
      <circle cx="267" cy="320" r="1.2" fill="#F5F7F8" />

      {/* Johannesburg */}
      <circle cx="498" cy="336" r="2.5" fill="#AD8855" opacity="0.60" />

      {/* Singapore */}
      <circle cx="710" cy="240" r="2.5" fill="#AD8855" opacity="0.60" />

      {/* ── CENTER ── */}
      <circle cx={cx} cy={cy} r="18" fill="url(#centerGlowW)" />
      <circle cx={cx} cy={cy} r="7"  fill="#AD8855" opacity="0.15" />
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
