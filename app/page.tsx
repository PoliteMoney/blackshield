import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
import { getHomeContent } from '@/lib/page-content'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CookieBanner } from '@/components/layout/cookie-banner'
import { Hero } from '@/components/sections/hero'
import { Stats } from '@/components/sections/stats'
import { AboutSection } from '@/components/sections/about-section'
import { CapacitiesSection } from '@/components/sections/capacities-section'
import { SectorsSection } from '@/components/sections/sectors-section'
import { MethodologySection } from '@/components/sections/methodology-section'
import { FAQSection } from '@/components/sections/faq-section'
import { ContactSection } from '@/components/sections/contact-section'
import { CTASection } from '@/components/sections/cta-section'
import { StrategicSection } from '@/components/sections/strategic-section'
import { HowWeWorkSection } from '@/components/sections/how-we-work-section'
import { InsightsSection } from '@/components/sections/insights-section'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { getSiteConfig } from '@/lib/site-config'

async function getPageData(locale: Locale) {
  const supabase = createClient()

  const [sectorsRes, faqsRes, postsRes] = await Promise.all([
    supabase.from('sectors').select(`
      id, slug, icon,
      translations:sectors_translations(title, description, locale)
    `).eq('is_active', true).order('order_index'),
    supabase.from('faqs').select(`
      id,
      translations:faqs_translations(question, answer, locale)
    `).eq('is_active', true).order('order_index'),
    supabase.from('blog_posts').select(`
      id, slug, image_url, category, published_at, source_platform, source_url,
      translations:blog_posts_translations(title, excerpt, locale), post_reactions(count)
    `).eq('status', 'published').order('published_at', { ascending: false }).limit(8),
  ])

  function filterByLocale(items: any[]) {
    return (items || []).map(item => ({
      ...item,
      translations: (item.translations || []).filter((t: any) => t.locale === locale)
    }))
  }

  const insights = filterByLocale(postsRes.data || [])
    .map((post: any) => ({
      id: post.id,
      slug: post.slug,
      image_url: post.image_url,
      category: post.category,
      published_at: post.published_at,
      source_platform: post.source_platform,
      source_url: post.source_url,
      title: post.translations[0]?.title || '',
      excerpt: post.translations[0]?.excerpt || '',
      reactionCount: post.post_reactions?.[0]?.count ?? 0,
    }))
    .filter((post: any) => post.title)

  return {
    sectors: filterByLocale(sectorsRes.data || []),
    faqs: filterByLocale(faqsRes.data || []),
    insights,
  }
}

// Merge DB content over JSON fallback — DB values win only when non-empty
function merge<T extends object>(base: T, override?: Record<string, any>): T {
  if (!override) return base
  const result = { ...base } as Record<string, any>
  for (const [key, val] of Object.entries(override)) {
    if (val === null || val === undefined) continue
    if (typeof val === 'string' && val.trim() === '') continue
    result[key] = val
  }
  return result as T
}

export default async function HomePage() {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const locale: Locale = cookieLocale || getLocaleFromHeader(headersList.get('accept-language'))

  const [dict, { sectors, faqs, insights }, config, db] = await Promise.all([
    getDictionary(locale),
    getPageData(locale),
    getSiteConfig(),
    getHomeContent(locale),
  ])

  // Each section: DB content overrides JSON defaults field-by-field
  const c = {
    nav:         merge(dict.nav,         db.nav),
    hero:        merge(dict.hero,        db.hero),
    about:       merge(dict.about,       db.about),
    stats:       merge(dict.stats,       db.stats),
    capacities:  merge(dict.capacities,  db.capacities),
    sectors:     merge(dict.sectors,     db.sectors),
    methodology: merge(dict.methodology, db.methodology),
    how_we_work:      merge(dict.how_we_work,      db.how_we_work),
    when_we_intervene: merge(dict.when_we_intervene, db.when_we_intervene),
    strategic:   merge(dict.strategic,   db.strategic),
    cta:         merge(dict.cta,         db.cta),
    faq:         merge(dict.faq,         db.faq),
    contact:     merge(dict.contact,     db.contact),
    footer:      merge(dict.footer,      db.footer),
    cookies:     merge(dict.cookies,     db.cookies),
    insights:    merge(dict.blog,        db.insights),
  }

  return (
    <>
      <Navbar dict={c.nav} />

      <main>
        <Hero dict={c.hero} contactDict={c.contact} />
        <ScrollReveal><StrategicSection dict={c.strategic} /></ScrollReveal>
        <ScrollReveal><HowWeWorkSection workDict={c.how_we_work} interveneDict={c.when_we_intervene} /></ScrollReveal>
        {(c.stats as any).visible !== false && (
          <ScrollReveal><Stats dict={c.stats} /></ScrollReveal>
        )}
        <ScrollReveal><AboutSection dict={c.about} /></ScrollReveal>
        <ScrollReveal><CapacitiesSection dict={c.capacities} /></ScrollReveal>
        <ScrollReveal><MethodologySection dict={c.methodology} /></ScrollReveal>
        <ScrollReveal><SectorsSection dict={c.sectors} sectors={sectors} /></ScrollReveal>
        {config.blog_enabled === 'true' && (
          <ScrollReveal><InsightsSection dict={c.insights} posts={insights} locale={locale} /></ScrollReveal>
        )}
        <ScrollReveal><CTASection dict={c.cta} /></ScrollReveal>
        <ScrollReveal><FAQSection dict={c.faq} faqs={faqs} /></ScrollReveal>
        <ScrollReveal><ContactSection dict={c.contact} /></ScrollReveal>
      </main>

      <Footer dict={c.footer} navDict={c.nav} capacitiesDict={c.capacities} />
      {config.cookie_policy_enabled === 'true' && <CookieBanner dict={c.cookies} />}
    </>
  )
}
