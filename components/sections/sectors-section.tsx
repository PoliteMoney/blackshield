'use client'

import { Building2, Landmark, DollarSign, HeartPulse, Zap, Cpu } from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'

const iconMap: Record<string, React.ElementType> = {
  Building2, Landmark, DollarSign, HeartPulse, Zap, Cpu,
}

interface Sector {
  id: string
  slug: string
  icon: string
  translations: { title: string; description: string }[]
}

interface SectorsSectionProps {
  dict: { badge: string; title: string; subtitle: string }
  sectors: Sector[]
}

export function SectorsSection({ dict, sectors }: SectorsSectionProps) {
  return (
    <section id="sectors" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <Eyebrow label={dict.badge} align="center" className="mb-5" />
          <h2 className="display-heading text-4xl lg:text-5xl xl:text-6xl text-[var(--color-secondary)] mb-5">
            {dict.title}
          </h2>
          <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => {
            const Icon = iconMap[sector.icon] || Building2
            const t = sector.translations[0]
            return (
              <div key={sector.id} className="card-flat group p-8">
                <div className="w-12 h-12 rounded-full border border-[var(--color-primary)]/40 flex items-center justify-center mb-6 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-3">{t?.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{t?.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
