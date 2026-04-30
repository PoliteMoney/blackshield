'use client'

import { Building2, Landmark, DollarSign, HeartPulse, Zap, Cpu } from 'lucide-react'

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
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-sm font-medium rounded-full mb-4">
            {dict.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-secondary)] mb-4">{dict.title}</h2>
          <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => {
            const Icon = iconMap[sector.icon] || Building2
            const t = sector.translations[0]
            return (
              <div
                key={sector.id}
                className="group relative p-8 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-secondary)] mb-3">{t?.title}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{t?.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
