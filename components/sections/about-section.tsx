'use client'

import { CheckCircle2 } from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'

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
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden">
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
                  <div className="w-28 h-28 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 text-[var(--color-primary)]">
                      {/* Outer shield */}
                      <path
                        d="M50 4 L7 19 L7 51 C7 75 26 93 50 99 C74 93 93 75 93 51 L93 19 Z"
                        fill="currentColor" fillOpacity="0.12"
                        stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.5"
                      />
                      {/* Inner shield */}
                      <path
                        d="M50 14 L17 27 L17 51 C17 69 32 85 50 90 C68 85 83 69 83 51 L83 27 Z"
                        fill="currentColor" fillOpacity="0.22"
                        stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.8"
                      />
                      {/* Checkmark */}
                      <path
                        d="M32 52 L44 64 L68 40"
                        fill="none"
                        stroke="currentColor" strokeWidth="4"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[var(--color-primary)] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                    Blackshield Global Consulting
                  </p>
                  <p className="text-white/50 text-[9px] font-medium tracking-[0.16em] uppercase leading-relaxed">
                    Legal Strategy.<br />Powered by Intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <Eyebrow label={dict.badge} className="mb-5" />
            <h2 className="display-heading text-4xl lg:text-5xl xl:text-6xl text-[var(--color-secondary)] mb-5">
              {content?.title || dict.title}
            </h2>
            <p className="text-[var(--color-muted-foreground)] text-lg leading-relaxed mb-8">
              {content?.subtitle || dict.subtitle}
            </p>

            {/* Mission & Vision */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-[var(--color-muted)] rounded-lg border border-[var(--color-border)]">
                <h3 className="font-semibold text-[var(--color-secondary)] mb-2">{dict.mission_title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{dict.mission_body}</p>
              </div>
              <div className="p-5 bg-[var(--color-secondary)] rounded-lg">
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
