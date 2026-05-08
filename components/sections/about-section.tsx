'use client'

import { CheckCircle2 } from 'lucide-react'

interface AboutSectionProps {
  dict: {
    badge: string; title: string; subtitle: string
    mission_title: string; mission_body: string
    vision_title: string; vision_body: string
    values_title: string; values: string[]
    years_label: string; clients_label: string
  }
  content?: { title?: string; subtitle?: string; body?: string }
}

export function AboutSection({ dict, content }: AboutSectionProps) {

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <div className="relative md:mx-6 lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center relative overflow-hidden">
                {/* Radar rings decoration */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    <circle cx="150" cy="150" r="60"  fill="none" stroke="white" strokeWidth="1"/>
                    <circle cx="150" cy="150" r="110" fill="none" stroke="white" strokeWidth="1"/>
                    <circle cx="150" cy="150" r="145" fill="none" stroke="white" strokeWidth="1"/>
                    <line x1="150" y1="5" x2="150" y2="295" stroke="white" strokeWidth="0.5"/>
                    <line x1="5" y1="150" x2="295" y2="150" stroke="white" strokeWidth="0.5"/>
                  </svg>
                </div>
                <div className="text-center p-8 relative z-10">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 text-[var(--color-primary)]" fill="currentColor">
                      <path d="M50 5L5 25v25c0 27.6 19.4 53.4 45 59 25.6-5.6 45-31.4 45-59V25L50 5z" fillOpacity="0.3" />
                      <path d="M50 15L15 31v19c0 21.5 15 41.5 35 46 20-4.5 35-24.5 35-46V31L50 15z" fillOpacity="0.5" />
                      <path d="M45 55l-10-10 3.5-3.5L45 48l17-17 3.5 3.5L45 55z" />
                    </svg>
                  </div>
                  <p className="text-[var(--color-primary)] text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                    Blackshield Global Consulting
                  </p>
                  <p className="text-white/40 text-xs tracking-widest uppercase">Est. 2009</p>
                </div>
              </div>
            </div>
            {/* Floating cards — hidden on mobile to prevent horizontal scroll */}
            <div className="hidden md:block absolute -right-6 top-8 bg-white rounded-xl shadow-xl p-4 border border-[var(--color-border)]">
              <div className="text-2xl font-bold text-[var(--color-secondary)]">15+</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">{dict.years_label}</div>
            </div>
            <div className="hidden md:block absolute -left-6 bottom-8 bg-[var(--color-secondary)] rounded-xl shadow-xl p-4">
              <div className="text-2xl font-bold text-[var(--color-primary)]">500+</div>
              <div className="text-xs text-white/60">{dict.clients_label}</div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-sm font-medium rounded-full mb-4">
              {dict.badge}
            </span>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-secondary)] mb-4">
              {content?.title || dict.title}
            </h2>
            <p className="text-[var(--color-muted-foreground)] text-lg leading-relaxed mb-8">
              {content?.subtitle || dict.subtitle}
            </p>

            {/* Mission & Vision */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-[var(--color-muted)] rounded-xl border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-2">{dict.mission_title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{dict.mission_body}</p>
              </div>
              <div className="p-5 bg-[var(--color-secondary)] rounded-xl">
                <h3 className="font-semibold text-[var(--color-primary)] mb-2">{dict.vision_title}</h3>
                <p className="text-sm text-white/60">{dict.vision_body}</p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h3 className="font-semibold text-[var(--color-secondary)] mb-4">{dict.values_title}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {dict.values.map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                    <span className="text-sm text-[var(--color-muted-foreground)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
