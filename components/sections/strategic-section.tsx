'use client'

import Image from 'next/image'

function MexicoDecorSVG() {
  return (
    <svg viewBox="0 0 500 310" className="w-full h-auto" aria-hidden="true">
      <defs>
        <pattern id="mexDots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#4A8A9E" opacity="0.70" />
        </pattern>
        <clipPath id="mexBodyClip">
          <path d="M 68,22 L 130,15 L 200,12 L 260,13 L 308,22 L 340,38 L 362,62 L 374,90 L 375,118
            L 366,146 L 350,170 L 368,158 L 384,138 L 390,118 L 384,98 L 368,92
            L 350,105 L 338,128 L 327,154 L 318,175 L 306,194 L 284,208 L 258,216
            L 232,214 L 205,204 L 178,188 L 150,168 L 123,145 L 98,120 L 78,95
            L 68,70 L 65,46 Z" />
        </clipPath>
        <clipPath id="mexBajaClip">
          <path d="M 56,20 L 52,52 L 49,88 L 48,122 L 48,156 L 50,180 L 53,196
            L 58,204 L 63,196 L 65,174 L 66,148 L 65,116 L 62,82 L 59,50 L 57,22 Z" />
        </clipPath>
      </defs>

      {/* ── Mexico dotted fill ── */}
      {/* Baja California */}
      <rect x="0" y="0" width="500" height="310" fill="url(#mexDots)" clipPath="url(#mexBajaClip)" />
      <path d="M 56,20 L 52,52 L 49,88 L 48,122 L 48,156 L 50,180 L 53,196
        L 58,204 L 63,196 L 65,174 L 66,148 L 65,116 L 62,82 L 59,50 L 57,22 Z"
        fill="none" stroke="#5A9AAE" strokeWidth="0.8" opacity="0.5" />

      {/* Main body */}
      <rect x="0" y="0" width="500" height="310" fill="url(#mexDots)" clipPath="url(#mexBodyClip)" />
      <path d="M 68,22 L 130,15 L 200,12 L 260,13 L 308,22 L 340,38 L 362,62 L 374,90 L 375,118
        L 366,146 L 350,170 L 368,158 L 384,138 L 390,118 L 384,98 L 368,92
        L 350,105 L 338,128 L 327,154 L 318,175 L 306,194 L 284,208 L 258,216
        L 232,214 L 205,204 L 178,188 L 150,168 L 123,145 L 98,120 L 78,95
        L 68,70 L 65,46 Z"
        fill="none" stroke="#5A9AAE" strokeWidth="0.8" opacity="0.5" />

      {/* ── Gold geometric decoration ── */}
      {/* Outer rectangle */}
      <rect x="318" y="14" width="172" height="238"
        fill="none" stroke="#AD8855" strokeWidth="1.2" opacity="0.70" />
      {/* Inner rectangle */}
      <rect x="342" y="38" width="124" height="190"
        fill="none" stroke="#AD8855" strokeWidth="0.6" opacity="0.38" />

      {/* Quarter-circle arc — centered at bottom-left of outer rect (318, 252) */}
      <path d="M 318,82 A 170 170 0 0 1 488,252"
        fill="none" stroke="#AD8855" strokeWidth="1.2" opacity="0.65" />
      {/* Inner arc */}
      <path d="M 318,128 A 124 124 0 0 1 442,252"
        fill="none" stroke="#AD8855" strokeWidth="0.6" opacity="0.35" />

      {/* Crosshair accent on Yucatan tip */}
      <circle cx="388" cy="118" r="3" fill="none" stroke="#AD8855" strokeWidth="1" opacity="0.6" />
      <circle cx="388" cy="118" r="1.2" fill="#AD8855" opacity="0.7" />

      {/* Small dot — Mexico City area */}
      <circle cx="216" cy="142" r="2.5" fill="none" stroke="#AD8855" strokeWidth="1" opacity="0.5" />
      <circle cx="216" cy="142" r="1" fill="#AD8855" opacity="0.6" />
    </svg>
  )
}

interface StrategicSectionProps {
  dict: {
    title: string
    paragraph_1: string
    paragraph_2: string
    paragraph_3: string
    image_url?: string
  }
}

export function StrategicSection({ dict }: StrategicSectionProps) {
  return (
    <section className="bg-[#0D1E28] overflow-hidden">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light leading-tight text-white mb-5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {dict.title}
            </h2>
            <div className="w-12 h-px bg-[var(--color-primary)] mb-8" />
            <div className="space-y-5">
              {dict.paragraph_1 && (
                <p className="text-white/55 text-sm leading-relaxed">{dict.paragraph_1}</p>
              )}
              {dict.paragraph_2 && (
                <p className="text-white/55 text-sm leading-relaxed">{dict.paragraph_2}</p>
              )}
              {dict.paragraph_3 && (
                <p className="text-white/55 text-sm leading-relaxed">{dict.paragraph_3}</p>
              )}
            </div>
          </div>

          {/* Right — image or SVG fallback */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[520px]">
              {dict.image_url ? (
                <Image
                  src={dict.image_url}
                  alt={dict.title}
                  width={520}
                  height={320}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <MexicoDecorSVG />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
