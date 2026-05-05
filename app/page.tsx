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
import { ServicesSection } from '@/components/sections/services-section'
import { SectorsSection } from '@/components/sections/sectors-section'
import { MethodologySection } from '@/components/sections/methodology-section'
import { FAQSection } from '@/components/sections/faq-section'
import { ContactSection } from '@/components/sections/contact-section'
import { CTASection } from '@/components/sections/cta-section'
import { StrategicSection } from '@/components/sections/strategic-section'
import { getSiteConfig } from '@/lib/site-config'

async function getPageData(locale: Locale) {
  const supabase = createClient()

  const [servicesRes, sectorsRes, faqsRes] = await Promise.all([
    supabase.from('services').select(`
      id, slug, icon, featured, order_index,
      translations:services_translations(title, short_description, locale)
    `).eq('is_active', true).order('order_index'),
    supabase.from('sectors').select(`
      id, slug, icon,
      translations:sectors_translations(title, description, locale)
    `).eq('is_active', true).order('order_index'),
    supabase.from('faqs').select(`
      id,
      translations:faqs_translations(question, answer, locale)
    `).eq('is_active', true).order('order_index'),
  ])

  function filterByLocale(items: any[]) {
    return (items || []).map(item => ({
      ...item,
      translations: (item.translations || []).filter((t: any) => t.locale === locale)
    }))
  }

  return {
    services: filterByLocale(servicesRes.data || []),
    sectors: filterByLocale(sectorsRes.data || []),
    faqs: filterByLocale(faqsRes.data || []),
  }
}

// Merge DB content over JSON fallback — DB values always win
function merge<T extends object>(base: T, override?: Record<string, any>): T {
  if (!override || Object.keys(override).length === 0) return base
  return { ...base, ...override }
}

export default async function HomePage() {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const locale: Locale = cookieLocale || getLocaleFromHeader(headersList.get('accept-language'))

  const [dict, { services, sectors, faqs }, config, db] = await Promise.all([
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
    services:    merge(dict.services,    db.services),
    sectors:     merge(dict.sectors,     db.sectors),
    methodology: merge(dict.methodology, db.methodology),
    strategic:   merge(dict.strategic,   db.strategic),
    cta:         merge(dict.cta,         db.cta),
    faq:         merge(dict.faq,         db.faq),
    contact:     merge(dict.contact,     db.contact),
    footer:      merge(dict.footer,      db.footer),
    cookies:     merge(dict.cookies,     db.cookies),
  }

  return (
    <>
      <Navbar dict={c.nav} />

      <main>
        <Hero dict={c.hero} contactDict={c.contact} radarUrl={config.radar_url} />
        <StrategicSection dict={c.strategic} />
        <Stats dict={c.stats} />
        <AboutSection dict={c.about} />
        <ServicesSection dict={c.services} services={services} locale={locale} />
        <SectorsSection dict={c.sectors} sectors={sectors} />
        <MethodologySection dict={c.methodology} />
        <CTASection dict={c.cta} />
        <FAQSection dict={c.faq} faqs={faqs} />
        <ContactSection dict={c.contact} />
      </main>

      <Footer dict={c.footer} navDict={c.nav} />
      {config.cookie_policy_enabled === 'true' && <CookieBanner dict={c.cookies} />}
    </>
  )
}
