'use client'

import Link from 'next/link'
import { Compass, Maximize2, Shield, Globe, Building2, Scale, Users, AlertTriangle } from 'lucide-react'

const WORK_SLUGS = [
  'planeacion-e-inteligencia',
  'ejecucion',
  'proteccion',
]

const WORK_ICONS = [
  <Compass key="compass" className="w-8 h-8" />,
  <Maximize2 key="maximize" className="w-8 h-8" />,
  <Shield key="shield" className="w-8 h-8" />,
]

const INTERVENE_ICONS = [
  <Globe key="globe" className="w-6 h-6" />,
  <Building2 key="building" className="w-6 h-6" />,
  <Shield key="shield2" className="w-6 h-6" />,
  <Scale key="scale" className="w-6 h-6" />,
  <Users key="users" className="w-6 h-6" />,
  <AlertTriangle key="alert" className="w-6 h-6" />,
]

interface HowWeWorkSectionProps {
  workDict: {
    title: string
    items: Array<{ label: string; description: string; tagline: string }>
  }
  interveneDict: {
    title: string
    tagline: string
    items: string[]
  }
}

export function HowWeWorkSection({ workDict, interveneDict }: HowWeWorkSectionProps) {
  const workItems = Array.isArray(workDict?.items) ? workDict.items : []
  const interveneItems = Array.isArray(interveneDict?.items) ? interveneDict.items : []

  return (
    <section className="bg-[var(--color-background)]">

      {/* ── Cómo trabajamos ── */}
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <h2
          className="text-3xl sm:text-4xl font-light text-center text-[var(--color-secondary)] mb-14"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {workDict?.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
          {workItems.slice(0, 3).map((item, i) => (
            <Link
              key={i}
              href={`/como-trabajamos/${WORK_SLUGS[i]}`}
              className="flex flex-col items-center text-center px-8 py-8 md:py-4 group hover:bg-[var(--color-muted)] transition-colors rounded-xl"
            >
              <div className="w-16 h-16 rounded-full border border-[var(--color-secondary)]/25 flex items-center justify-center mb-6 text-[var(--color-secondary)]/60 group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {WORK_ICONS[i] ?? WORK_ICONS[0]}
              </div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-secondary)] mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                {item.label}
              </p>
              <p className="text-sm text-[var(--color-foreground)]/55 leading-relaxed mb-5 max-w-xs">
                {item.description}
              </p>
              {item.tagline && (
                <p className="text-xs font-medium text-[var(--color-primary)] tracking-wide">
                  {item.tagline}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[var(--color-border)]" />

      {/* ── Cuándo intervenimos ── */}
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <h2
          className="text-3xl sm:text-4xl font-light text-center text-[var(--color-secondary)] mb-12"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {interveneDict?.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {interveneItems.slice(0, 6).map((label, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)]/55">
                {INTERVENE_ICONS[i] ?? INTERVENE_ICONS[0]}
              </div>
              <p className="text-xs text-[var(--color-foreground)]/65 leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>

        {interveneDict?.tagline && (
          <p className="text-center text-sm text-[var(--color-foreground)]/45 mt-12 tracking-wide">
            {interveneDict.tagline}
          </p>
        )}
      </div>

    </section>
  )
}
