'use client'

import { ScanSearch, Radar, Compass, Gauge } from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'

// Matched to each step's actual content:
// 1. Lectura integral del escenario -> scanning/reading the situation
// 2. Inteligencia de contexto        -> radar/intelligence gathering
// 3. Estrategia legal                -> strategic direction
// 4. Ejecución con control           -> a controlled, monitored process
const stepIcons = [ScanSearch, Radar, Compass, Gauge]

interface MethodologyStep { title: string; desc: string }

interface MethodologySectionProps {
  dict: { badge: string; title: string; subtitle: string; steps: MethodologyStep[] }
}

export function MethodologySection({ dict }: MethodologySectionProps) {
  return (
    <section id="methodology" className="section-padding relative bg-[var(--color-secondary)] overflow-hidden">
      {/* Ambient radar-ring watermark */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[560px] h-[560px] opacity-[0.05] pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle cx="150" cy="150" r="60"  fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="150" cy="150" r="110" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="150" cy="150" r="145" fill="none" stroke="white" strokeWidth="1"/>
          <line x1="150" y1="5" x2="150" y2="295" stroke="white" strokeWidth="0.5"/>
          <line x1="5" y1="150" x2="295" y2="150" stroke="white" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="container-custom mx-auto relative">
        <div className="text-center mb-20">
          <Eyebrow label={dict.badge} align="center" size="lg" className="mb-5" />
          <h2 className="display-heading text-4xl lg:text-5xl xl:text-6xl text-white mb-5">
            {dict.title}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {dict.steps.map((step, index) => {
              const Icon = stepIcons[index] || ScanSearch
              return (
                <div key={index} className="relative group text-center">
                  <span
                    className="display-heading absolute -top-4 left-1/2 -translate-x-1/2 text-8xl text-[var(--color-primary)]/10 leading-none select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="relative pt-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)] border border-[var(--color-primary)]/40 flex items-center justify-center mb-8 mx-auto group-hover:border-[var(--color-primary)] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
