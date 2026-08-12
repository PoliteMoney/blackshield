'use client'

import Link from 'next/link'
import { Compass, Maximize2, FileSignature, BarChart3, Globe, Building2, Shield, Scale } from 'lucide-react'
import { MaskIcon } from '@/components/ui/mask-icon'

const WORK_SLUGS = [
  'planeacion-e-inteligencia',
  'ejecucion',
  'proteccion',
  'resultados',
]

const WORK_ICONS = [
  <Compass       key="compass"   className="w-8 h-8" />,
  <Maximize2     key="maximize"  className="w-8 h-8" />,
  <FileSignature key="signature" className="w-8 h-8" />,
  <BarChart3     key="barchart"  className="w-8 h-8" />,
]

/** Person sitting on the ground, head down, crying — victims of a crime. */
function VictimIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18" />
      <circle cx="11.3" cy="8.6" r="2.3" />
      <path d="M6.6 21v-2.3c0-3.6 2.1-6.5 4.7-6.5s4.7 2.9 4.7 6.5V21" />
      <circle cx="8.6" cy="12.2" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="7.6" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="14.0" cy="12.2" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  )
}

const INTERVENE_ICONS = [
  <Globe      key="globe"    className="w-full h-full" />,
  <Building2  key="building" className="w-full h-full" />,
  <Shield     key="shield2"  className="w-full h-full" />,
  <Scale      key="scale"    className="w-full h-full" />,
  <VictimIcon key="victim"   className="w-full h-full" />,
  <MaskIcon   key="risk"     src="/images/riesgo_reputacional.png" color="var(--color-accent)" className="w-full h-full" />,
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
        <h2 className="display-heading text-4xl sm:text-5xl xl:text-6xl text-center text-[var(--color-secondary)] mb-16">
          {workDict?.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          {workItems.slice(0, 4).map((item, i) => (
            <Link
              key={i}
              href={`/como-trabajamos/${WORK_SLUGS[i]}`}
              className="flex flex-col items-center text-center px-6 py-8 group hover:bg-[var(--color-muted)] transition-colors rounded-lg"
            >
              <div className="w-16 h-16 rounded-full bg-transparent border-2 border-[var(--color-accent)] flex items-center justify-center mb-6 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/5 transition-colors">
                {WORK_ICONS[i] ?? WORK_ICONS[0]}
              </div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-secondary)] mb-4">
                {item.label}
              </p>
              <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-5 max-w-xs">
                {item.description}
              </p>
              {item.tagline && (
                <p className="text-xs font-medium text-[var(--color-secondary)] tracking-wide">
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
        <h2 className="display-heading text-4xl sm:text-5xl xl:text-6xl text-center text-[var(--color-secondary)] mb-14">
          {interveneDict?.title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {interveneItems.slice(0, 6).map((label, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 p-5 rounded-full bg-transparent border-2 border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)]">
                {INTERVENE_ICONS[i] ?? INTERVENE_ICONS[0]}
              </div>
              <p className="text-base text-[var(--color-secondary)] leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>

        {interveneDict?.tagline && (
          <p className="text-center text-sm text-[var(--color-secondary)] mt-12 tracking-wide">
            {interveneDict.tagline}
          </p>
        )}
      </div>

    </section>
  )
}
