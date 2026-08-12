'use client'

import Image from 'next/image'
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
            <div className="relative rounded-lg overflow-hidden aspect-square">
              <Image
                src="/images/punto_control_mex.png"
                alt="Blackshield Global Consulting — punto de control en México"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <Eyebrow label={dict.badge} size="lg" className="mb-5" />
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
