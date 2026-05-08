import { notFound } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { getSiteConfig } from '@/lib/site-config'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getHomeContent } from '@/lib/page-content'

const SLUGS = [
  'planeacion-e-inteligencia',
  'ejecucion',
  'proteccion',
]

const FALLBACK: Record<string, { title: string; paragraphs: string[] }> = {
  'planeacion-e-inteligencia': {
    title: 'Planeación e inteligencia',
    paragraphs: [
      'Toda decisión en México exige contexto.',
      'Antes de actuar, analizamos el entorno real: legal nacional e internacional, regulatorio, institucional, político, social, mediático, reputacional, de seguridad, operativo, geográfico, logístico, financiero, energético y de relaciones internacionales.',
      'Trabajamos bajo un ciclo de inteligencia: identificamos necesidades, captamos información, validamos, analizamos escenarios y convertimos la complejidad en criterio accionable.',
      'El objetivo es claro: que el cliente entienda México antes de entrar, y recupere control si ya está operando dentro.',
      'A partir de ese análisis, ayudamos al cliente a decidir mejor: qué hacer, cómo hacerlo, qué riesgos considerar, qué actores evaluar, qué evitar y cuándo ejecutar.',
      'Acompañamos desde la primera idea o interés por México hasta la toma de decisión y su implementación.',
      'No improvisamos. Inteligencia primero, estrategia después.',
    ],
  },
  'ejecucion': {
    title: 'Ejecución',
    paragraphs: [
      'Orden, control y alineación.',
      'Estructuramos y coordinamos la implementación en México — desde lo legal y corporativo hasta la operación en campo.',
      'Definimos el plan de acción, asignamos responsabilidades, coordinamos equipos locales e internacionales y gestionamos la ejecución de principio a fin.',
      'Cada acción está alineada con la estrategia definida. No ejecutamos de forma aislada: mantenemos coherencia entre el objetivo del cliente y cada paso que se da en México.',
      'Nuestra presencia local garantiza que las decisiones se implementen con la precisión que el entorno mexicano requiere.',
    ],
  },
  'proteccion': {
    title: 'Protección',
    paragraphs: [
      'No reaccionamos tarde.',
      'Una vez en operación, el entorno no se detiene. Damos seguimiento continuo, anticipamos riesgos emergentes y mantenemos control activo del escenario.',
      'Monitoreamos cambios regulatorios, movimientos de actores relevantes y señales tempranas de riesgo para actuar antes de que los problemas escalen.',
      'La protección no es defensiva: es anticipación, vigilancia y capacidad de respuesta en tiempo real.',
      'El objetivo es que nuestros clientes operen con certeza, sabiendo que hay un equipo estratégico monitoreando y actuando cuando el contexto lo requiere.',
    ],
  },
}

export function generateStaticParams() {
  return SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fallback = FALLBACK[params.slug]
  if (!fallback) return {}
  return {
    title: `${fallback.title} — Cómo trabajamos`,
    description: fallback.paragraphs[0]?.slice(0, 160),
  }
}

async function getContent(slug: string, locale: string) {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('page_content')
      .select('extra')
      .eq('page', 'como-trabajamos')
      .eq('section', slug)
      .eq('locale', locale)
      .eq('is_active', true)
      .single()

    if (data?.extra && typeof data.extra === 'object') {
      return data.extra as { title?: string; paragraphs?: string[] }
    }
  } catch { /* fall through */ }
  return null
}

export default async function ComoTrabajamosPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  if (!SLUGS.includes(slug)) notFound()

  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const locale: Locale = cookieLocale || getLocaleFromHeader(headersList.get('accept-language'))

  const [dict, db, config, homeDb] = await Promise.all([
    getDictionary(locale),
    getContent(slug, locale),
    getSiteConfig(),
    getHomeContent(locale),
  ])

  const fallback = FALLBACK[slug] ?? { title: slug, paragraphs: [] }
  const title = db?.title || fallback.title
  const paragraphs: string[] = db?.paragraphs?.length ? db.paragraphs : fallback.paragraphs

  const navDict = { ...dict.nav, ...(homeDb.nav ?? {}) }
  const footerDict = { ...dict.footer, ...(homeDb.footer ?? {}) }
  const capacitiesDict = { ...dict.capacities, ...(homeDb.capacities ?? {}) }

  return (
    <>
      <Navbar dict={navDict} />

      {/* Hero */}
      <section className="bg-[#0D1E28] pt-32 pb-20">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#methodology"
            className="inline-flex items-center gap-2 text-[#AD8855] text-xs font-semibold tracking-widest uppercase mb-8 hover:opacity-75 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cómo trabajamos
          </Link>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-white max-w-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h1>
          <div className="mt-6 h-px w-16 bg-[#AD8855] opacity-60" />
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="space-y-7">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-lg font-medium text-[var(--color-secondary)] leading-relaxed'
                    : 'text-[var(--color-secondary)]/80 text-base leading-relaxed'
                }
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-secondary)]/50 mb-6">
              ¿Desea saber más sobre cómo trabajamos?
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-accent)] text-white text-sm font-semibold tracking-wider uppercase rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--color-accent)]/20"
            >
              Contactar a Blackshield
            </Link>
          </div>
        </div>
      </section>

      <Footer dict={footerDict} navDict={navDict} capacitiesDict={capacitiesDict} />
    </>
  )
}
