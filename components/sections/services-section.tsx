'use client'

import Link from 'next/link'
import { ArrowRight, Target, Shield, AlertTriangle, CheckSquare, BarChart2, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Target, Shield, AlertTriangle, CheckSquare, BarChart2, Briefcase,
}

interface Service {
  id: string
  slug: string
  icon: string
  featured: boolean
  translations: { title: string; short_description: string }[]
}

interface ServicesSectionProps {
  dict: { badge: string; title: string; subtitle: string; learn_more: string; all_services: string }
  services: Service[]
  locale: string
}

export function ServicesSection({ dict, services, locale }: ServicesSectionProps) {
  return (
    <section id="services" className="section-padding bg-[var(--color-muted)]">
      <div className="container-custom mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-sm font-medium rounded-full mb-4">
            {dict.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-secondary)] mb-4">{dict.title}</h2>
          <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Shield
            const t = service.translations[0]
            return (
              <div
                key={service.id}
                className={cn(
                  'group p-8 rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
                  service.featured
                    ? 'bg-[var(--color-secondary)] border-transparent text-white'
                    : 'bg-white border-[var(--color-border)] hover:border-[var(--color-primary)]'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
                  service.featured ? 'bg-[var(--color-primary)]/20' : 'bg-[var(--color-muted)]'
                )}>
                  <Icon className={cn(
                    'w-7 h-7',
                    service.featured ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent)]'
                  )} />
                </div>
                <h3 className={cn(
                  'text-xl font-bold mb-3',
                  service.featured ? 'text-white' : 'text-[var(--color-secondary)]'
                )}>
                  {t?.title}
                </h3>
                <p className={cn(
                  'text-sm leading-relaxed mb-6',
                  service.featured ? 'text-white/60' : 'text-[var(--color-muted-foreground)]'
                )}>
                  {t?.short_description}
                </p>
                <Link
                  href={`/servicios/${service.slug}`}
                  className={cn(
                    'inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3',
                    service.featured ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent)]'
                  )}
                >
                  {dict.learn_more}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--color-accent)] text-[var(--color-accent)] text-sm font-semibold tracking-wide rounded-lg hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
          >
            {dict.all_services}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
