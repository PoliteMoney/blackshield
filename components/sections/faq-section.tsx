'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQ {
  id: string
  translations: { question: string; answer: string }[]
}

interface FAQSectionProps {
  dict: { badge: string; title: string; subtitle: string }
  faqs: FAQ[]
}

export function FAQSection({ dict, faqs }: FAQSectionProps) {
  const [open, setOpen] = useState<string | null>(null)

  const defaultFaqs = [
    { id: '1', q: '¿Cómo funciona una consulta inicial?', a: 'La consulta inicial es confidencial y gratuita. En ella conocemos su situación, necesidades y objetivos para proponer la solución más adecuada. Puede agendar una cita virtual o presencial según su preferencia.' },
    { id: '2', q: '¿Qué sectores atiende Blackshield?', a: 'Atendemos empresas privadas, instituciones gubernamentales, sector financiero, salud, energía y tecnología. Nuestra experiencia abarca múltiples industrias con soluciones adaptadas a cada contexto.' },
    { id: '3', q: '¿Cómo garantizan la confidencialidad?', a: 'Todos nuestros compromisos incluyen acuerdos de confidencialidad (NDA). Contamos con protocolos estrictos de seguridad de la información y manejo discreto de todos los casos.' },
    { id: '4', q: '¿Trabajan con clientes internacionales?', a: 'Sí. Contamos con experiencia en 12 países y podemos atender clientes internacionales de forma remota o con presencia física según los requerimientos del proyecto.' },
    { id: '5', q: '¿Cuál es el proceso para iniciar un proyecto?', a: 'El proceso inicia con una consulta inicial, seguida de una propuesta formal, firma de acuerdos y arranque del proyecto. El timeline varía según la complejidad y urgencia de cada caso.' },
    { id: '6', q: '¿Ofrecen servicios de urgencia?', a: 'Sí. Para situaciones críticas contamos con capacidad de respuesta inmediata. Contáctenos directamente por WhatsApp para atención prioritaria.' },
  ]

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs.map(f => ({
    id: f.id,
    translations: [{ question: f.q, answer: f.a }]
  }))

  return (
    <section id="faq" className="section-padding bg-[var(--color-muted)]">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-accent)] text-sm font-medium rounded-full mb-4">
            {dict.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-secondary)] mb-4">{dict.title}</h2>
          <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto text-lg">{dict.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayFaqs.map((faq) => {
            const t = faq.translations[0]
            const isOpen = open === faq.id
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--color-muted)] transition-colors"
                >
                  <span className="font-semibold text-[var(--color-secondary)] pr-4">{t?.question}</span>
                  <ChevronDown className={cn(
                    'w-5 h-5 text-[var(--color-accent)] flex-shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180'
                  )} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-[var(--color-muted-foreground)] leading-relaxed">{t?.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
