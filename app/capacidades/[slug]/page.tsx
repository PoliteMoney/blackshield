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

// ── Static slugs ──────────────────────────────────────────────────────────────

const SLUGS = [
  'representacion-estrategica',
  'inteligencia-estrategica',
  'entrada-y-operacion',
  'estructuracion-corporativa',
  'proteccion-patrimonial',
  'asuntos-legales',
  'representacion-de-victimas',
  'gestion-de-crisis',
  'gobernanza',
  'propiedad-intelectual',
  'fortalecimiento-institucional',
  'derecho-corporativo',
]

// ── Fallback content ──────────────────────────────────────────────────────────

const FALLBACK: Record<string, { title: string; paragraphs: string[] }> = {
  'representacion-estrategica': {
    title: 'Representación estratégica en México',
    paragraphs: [
      'Muchas empresas e instituciones internacionales necesitan operar en México pero no cuentan con presencia local de confianza. Blackshield actúa como su representante estratégico: coordinando acciones, interlocutando con actores clave y ejecutando en nombre de sus clientes con total control y transparencia.',
      'Nuestro equipo asume la gestión directa de trámites legales, corporativos y regulatorios, manteniendo al cliente informado en cada etapa. No dependemos de intermediarios; somos la extensión operativa de su organización dentro del país.',
      'Esta capacidad es especialmente valiosa para fondos de inversión, despachos internacionales, gobiernos extranjeros y empresas multinacionales que requieren un aliado de alto nivel con autoridad para actuar, decidir y proteger sus intereses en México.',
    ],
  },
  'inteligencia-estrategica': {
    title: 'Inteligencia estratégica y análisis de contexto',
    paragraphs: [
      'Tomar decisiones sin información verificada es un riesgo innecesario. Blackshield desarrolla análisis de inteligencia estratégica que combinan fuentes abiertas, redes de información especializadas y metodologías de análisis de riesgo para construir una imagen clara del entorno en el que opera o desea operar su organización.',
      'Evaluamos actores clave, tendencias regulatorias, riesgos políticos y operativos, antecedentes de contrapartes y escenarios futuros. Nuestros reportes permiten anticipar contingencias y diseñar estrategias robustas antes de ejecutar cualquier acción.',
      'Este servicio está orientado a empresas que ingresan a México, fondos que evalúan activos, organizaciones que enfrentan litigios complejos o directivos que necesitan tomar decisiones críticas con la mayor información posible y el menor nivel de incertidumbre.',
    ],
  },
  'entrada-y-operacion': {
    title: 'Entrada, expansión y operación en México',
    paragraphs: [
      'El mercado mexicano ofrece oportunidades únicas, pero también presenta complejidades regulatorias, fiscales y operativas que requieren orientación especializada. Blackshield acompaña a empresas internacionales en todo el proceso de entrada: desde el análisis de viabilidad hasta el inicio de operaciones, pasando por la selección de estructura jurídica y el cumplimiento de obligaciones locales.',
      'Coordinamos con autoridades, registros públicos, notarios, despachos fiscales y organismos regulatorios para garantizar una entrada ordenada y eficiente. También diseñamos estrategias de expansión para empresas ya establecidas que buscan escalar sus operaciones o diversificarse en el mercado nacional.',
      'Nuestra experiencia abarca sectores como tecnología, manufactura, energía, salud, servicios financieros y consumo masivo. En cada caso, adaptamos la estrategia a las particularidades del sector y al perfil del cliente.',
    ],
  },
  'estructuracion-corporativa': {
    title: 'Estructuración corporativa y fiscal',
    paragraphs: [
      'Una estructura corporativa y fiscal bien diseñada es la base de cualquier operación eficiente, segura y sostenible. Blackshield diseña estructuras adaptadas a los objetivos de cada cliente: holding internacionales, vehículos de inversión, figuras jurídicas locales y esquemas de propiedad que optimizan la carga fiscal y protegen el patrimonio.',
      'Trabajamos en coordinación con asesores fiscales especializados en México y en jurisdicciones clave para garantizar el cumplimiento normativo y la eficiencia de la estructura elegida. También apoyamos en procesos de due diligence, reestructuraciones corporativas y operaciones de M&A.',
      'Nuestro enfoque combina precisión técnica con visión estratégica: no solo construimos estructuras legalmente válidas, sino estructuras que le dan al cliente control, flexibilidad y seguridad a largo plazo.',
    ],
  },
  'proteccion-patrimonial': {
    title: 'Protección patrimonial e inversión en México',
    paragraphs: [
      'Proteger el patrimonio en entornos complejos requiere estrategia, anticipación y conocimiento profundo del marco legal y las herramientas disponibles. Blackshield diseña esquemas de protección patrimonial para personas físicas, familias empresarias y organizaciones que buscan salvaguardar sus activos frente a riesgos legales, fiscales o de terceros.',
      'Trabajamos con fideicomisos, figuras de propiedad compartida, contratos de protección y estructuras internacionales que permiten mantener el control de los activos con el menor nivel de exposición posible. También asesoramos en inversiones inmobiliarias y la adquisición de activos estratégicos en México.',
      'Cada esquema es diseñado a medida, considerando el perfil del cliente, el origen de los activos, los riesgos identificados y los objetivos de largo plazo. La discreción es un principio fundamental en todo nuestro trabajo en esta área.',
    ],
  },
  'asuntos-legales': {
    title: 'Dirección estratégica de asuntos legales',
    paragraphs: [
      'Los procesos legales en México —ya sean civiles, mercantiles, penales, administrativos o fiscales— exigen no solo representación técnica sino dirección estratégica. Blackshield asume el control estratégico de los asuntos legales de sus clientes: coordinando despachos, supervisando estrategias procesales y tomando decisiones orientadas a resultados.',
      'Actuamos como director de orquesta entre el cliente y sus abogados litigantes: garantizamos que la estrategia legal esté alineada con los objetivos del negocio, que los recursos se utilicen de manera eficiente y que las decisiones críticas se tomen con información completa y criterio estratégico.',
      'Este servicio es especialmente valioso para empresas multinacionales con litigios complejos en México, inversionistas que enfrentan disputas contractuales o regulatorias, y organizaciones que necesitan un interlocutor de alto nivel con autoridad para coordinar equipos legales multijurisdiccionales.',
    ],
  },
  'representacion-de-victimas': {
    title: 'Representación estratégica de víctimas en México',
    paragraphs: [
      'Cuando individuos, familias o empresas se convierten en víctimas de delitos, fraudes, abusos o violaciones de derechos en México, la diferencia entre obtener justicia y quedar desprotegido depende en gran medida de la calidad de la representación y la inteligencia estratégica detrás del caso.',
      'Blackshield representa estratégicamente a víctimas en procesos penales, civiles y administrativos: supervisando las investigaciones, coordinando con autoridades, gestionando la atención mediática cuando es necesario y garantizando que los derechos del cliente sean respetados en todo momento.',
      'Nuestra capacidad de combinar representación legal, inteligencia de contexto y comunicación estratégica nos permite diseñar estrategias integrales que maximizan las posibilidades de éxito, protegen la reputación del cliente y generan presión legítima sobre los actores responsables.',
    ],
  },
  'gestion-de-crisis': {
    title: 'Gestión de crisis, reputación y comunicación estratégica',
    paragraphs: [
      'Las crisis —legales, regulatorias, mediáticas o reputacionales— pueden dañar de forma irreversible a una organización si no se gestionan con rapidez, criterio y coordinación. Blackshield activa protocolos de gestión de crisis diseñados para contener el daño, controlar el relato y proteger los intereses del cliente en el menor tiempo posible.',
      'Coordinamos equipos de comunicación, abogados y asesores estratégicos para responder de manera unificada y coherente. Evaluamos el contexto, identificamos actores clave y diseñamos mensajes precisos para cada audiencia: medios, autoridades, empleados, inversionistas y clientes.',
      'Nuestro enfoque va más allá de la gestión reactiva: trabajamos en la prevención y en el fortalecimiento de la resiliencia institucional, para que nuestros clientes estén preparados antes de que llegue la crisis.',
    ],
  },
  'gobernanza': {
    title: 'Gobernanza, integridad y cumplimiento',
    paragraphs: [
      'En un entorno donde las exigencias regulatorias y los estándares de integridad son cada vez más altos, contar con sistemas robustos de gobernanza corporativa, programas de cumplimiento y culturas organizacionales sanas no es solo un requisito legal, sino una ventaja competitiva.',
      'Blackshield diseña e implementa programas de compliance adaptados al perfil de riesgo y al sector de cada organización: desde la identificación de vulnerabilidades hasta la implantación de controles, políticas y mecanismos de denuncia. También asesoramos en la estructuración de órganos de gobierno y en la gestión de conflictos de interés.',
      'Nuestros programas están alineados con estándares internacionales y con las obligaciones locales en materia de prevención de lavado de dinero, anticorrupción, protección de datos y responsabilidad corporativa.',
    ],
  },
  'propiedad-intelectual': {
    title: 'Propiedad intelectual, marca y contratos',
    paragraphs: [
      'La propiedad intelectual es uno de los activos más valiosos y más expuestos de cualquier organización. Blackshield protege las marcas, patentes, secretos comerciales y derechos de autor de sus clientes en México, coordinando registros, vigilancia activa y acciones legales frente a infractores.',
      'También estructuramos contratos comerciales, acuerdos de confidencialidad, contratos de licencia y joint ventures que protejan los intereses del cliente y minimicen el riesgo de disputas. Nuestro enfoque combina precisión jurídica con visión estratégica: los contratos no solo deben ser válidos, deben funcionar.',
      'Para empresas que operan en mercados donde la piratería, la imitación y el incumplimiento contractual son riesgos frecuentes, contar con una estrategia proactiva de protección de propiedad intelectual es una inversión necesaria y de alto retorno.',
    ],
  },
  'fortalecimiento-institucional': {
    title: 'Capacitación y fortalecimiento institucional',
    paragraphs: [
      'La fortaleza de cualquier organización depende, en última instancia, de la calidad de sus líderes, sus equipos y sus procesos internos. Blackshield diseña programas de capacitación y fortalecimiento institucional orientados a mejorar las capacidades estratégicas, legales y operativas de las organizaciones que acompañamos.',
      'Desarrollamos talleres, programas de formación y diagnósticos organizacionales para equipos directivos, áreas jurídicas, unidades de cumplimiento y equipos de comunicación. También apoyamos en procesos de transformación institucional, diseño de estructuras y desarrollo de liderazgo.',
      'Nuestros programas son personalizados y prácticos: partimos del diagnóstico real de cada organización, diseñamos contenidos relevantes y medimos el impacto en términos concretos de capacidad instalada y resultados operativos.',
    ],
  },
  'derecho-corporativo': {
    title: 'Derecho corporativo y estructura empresarial',
    paragraphs: [
      'Diseñamos y coordinamos estructuras corporativas nacionales e internacionales para operar, invertir y expandirse en México con control, claridad y visión estratégica.',
      'Intervenimos en la creación, reorganización y fortalecimiento de estructuras empresariales orientadas a crecimiento, protección patrimonial, continuidad operativa y coordinación eficiente entre entidades mexicanas y extranjeras.',
      'Nuestro alcance incluye: constitución y reorganización de sociedades; holdings y estructuras multinivel; estructuras entre empresas mexicanas y extranjeras; gobierno corporativo y órganos de decisión; relaciones entre socios, inversionistas y grupos empresariales; participación accionaria y control corporativo; expansión y operación transnacional; acuerdos corporativos, continuidad y sucesión empresarial; y coordinación estratégica entre entidades operativas, patrimoniales, inmobiliarias y de servicios.',
      'Nuestro enfoque busca que cada estructura no solo funcione legalmente, sino que permita operar con orden, protección y sostenibilidad a nivel nacional e internacional.',
      'Una estructura corporativa correcta no solo organiza la operación: protege el control, facilita el crecimiento y reduce riesgos a largo plazo.',
    ],
  },
}

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return SLUGS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const fallback = FALLBACK[params.slug]
  if (!fallback) return {}
  return {
    title: fallback.title,
    description: fallback.paragraphs[0]?.slice(0, 160),
  }
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getCapacidadContent(slug: string, locale: string) {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('page_content')
      .select('extra')
      .eq('page', 'capacidades')
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CapacidadPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  if (!SLUGS.includes(slug)) notFound()

  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const locale: Locale = cookieLocale || getLocaleFromHeader(headersList.get('accept-language'))

  const [dict, db, config] = await Promise.all([
    getDictionary(locale),
    getCapacidadContent(slug, locale),
    getSiteConfig(),
  ])

  const homeDb = await getHomeContent(locale)

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
            href="/#capacities"
            className="inline-flex items-center gap-2 text-[#AD8855] text-xs font-semibold tracking-widest uppercase mb-8 hover:opacity-75 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Capacidades
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
              <p key={i} className="text-[var(--color-secondary)]/80 text-base leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-secondary)]/50 mb-6">
              ¿Desea saber más sobre esta capacidad?
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
