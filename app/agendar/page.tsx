import { cookies, headers } from 'next/headers'
import { getDictionary, getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
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
        <div className="bg-[var(--color-secondary)] py-16 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium rounded-full mb-4">
            {dict.appointments.badge}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{dict.appointments.title}</h1>
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
