'use client'

import { Search, Lightbulb, Rocket, BarChart3 } from 'lucide-react'

const stepIcons = [Search, Lightbulb, Rocket, BarChart3]

interface MethodologyStep { title: string; desc: string }

interface MethodologySectionProps {
  dict: { badge: string; title: string; subtitle: string; steps: MethodologyStep[] }
}

export function MethodologySection({ dict }: MethodologySectionProps) {
  return (
    <section id="methodology" className="section-padding bg-[var(--color-secondary)]">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium rounded-full mb-4">
            {dict.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{dict.title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dict.steps.map((step, index) => {
              const Icon = stepIcons[index] || Search
              return (
                <div key={index} className="relative group text-center">
                  <div className="relative inline-flex mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-secondary)] text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
