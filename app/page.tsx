import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getLocaleFromHeader, getDictionary, type Locale } from '@/lib/i18n/dictionaries'
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

  function filterByLocale(items: any[], localeKey = 'locale') {
    return (items || []).map(item => ({
      ...item,
      translations: (item.translations || []).filter((t: any) => t[localeKey] === locale)
    }))
  }

  return {
    services: filterByLocale(servicesRes.data || []),
    sectors: filterByLocale(sectorsRes.data || []),
    faqs: filterByLocale(faqsRes.data || []),
  }
}

export default async function HomePage() {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const locale: Locale = cookieLocale || getLocaleFromHeader(headersList.get('accept-language'))

  const [dict, { services, sectors, faqs }, config] = await Promise.all([
    getDictionary(locale),
    getPageData(locale),
    getSiteConfig(),
  ])

  return (
    <>
      <Navbar dict={dict.nav} />

      <main>
        <Hero dict={dict.hero} contactDict={dict.contact} />
        <Stats dict={dict.stats} />
        <AboutSection dict={dict.about} />
        <ServicesSection dict={dict.services} services={services} locale={locale} />
        <SectorsSection dict={dict.sectors} sectors={sectors} />
        <MethodologySection dict={dict.methodology} />
        <CTASection dict={dict.cta} />
        <FAQSection dict={dict.faq} faqs={faqs} />
        <ContactSection dict={dict.contact} />
      </main>

      <Footer dict={dict.footer} navDict={dict.nav} />
      {config.cookie_policy_enabled === 'true' && <CookieBanner dict={dict.cookies} />}
    </>
  )
}
