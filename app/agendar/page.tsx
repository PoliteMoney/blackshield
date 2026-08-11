import { cookies, headers } from 'next/headers'
import { getDictionary, getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Eyebrow } from '@/components/ui/eyebrow'
import { BookingForm } from '@/components/booking/booking-form'
import { createClient } from '@/lib/supabase/server'
import { getSiteConfig } from '@/lib/site-config'
import { redirect } from 'next/navigation'

export default async function BookingPage() {
  const cookieStore = cookies()
  const locale: Locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) ||
    getLocaleFromHeader(headers().get('accept-language'))
  const [dict, config] = await Promise.all([getDictionary(locale), getSiteConfig()])

  if (config.appointments_enabled !== 'true') redirect('/')

  const supabase = createClient()
  const { data: settings } = await supabase.from('appointment_settings').select('*').single()
  const { data: servicesRaw } = await supabase.from('services')
    .select(`id, slug, translations:services_translations(title, locale)`)
    .eq('is_active', true).order('order_index')

  const services = (servicesRaw || []).map(s => ({
    id: s.id,
    title: (s.translations || []).find((t: any) => t.locale === locale)?.title ||
           (s.translations || [])[0]?.title || ''
  }))

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-navy-deep)] py-16 text-center">
          <Eyebrow label={dict.appointments.badge} align="center" className="mb-5" />
          <h1
            className="text-5xl lg:text-6xl font-light tracking-tight text-white mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {dict.appointments.title}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{dict.appointments.subtitle}</p>
        </div>
        <div className="section-padding">
          <div className="container-custom mx-auto max-w-4xl">
            <BookingForm dict={dict.appointments} services={services} settings={settings} locale={locale} />
          </div>
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
