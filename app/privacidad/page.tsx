import { cookies, headers } from 'next/headers'
import { getDictionary, getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSiteConfig } from '@/lib/site-config'

export default async function PrivacyPage() {
  const cookieStore = cookies()
  const locale: Locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) ||
    getLocaleFromHeader(headers().get('accept-language'))
  const [dict, config] = await Promise.all([getDictionary(locale), getSiteConfig()])
  const content = locale === 'en' ? config.privacy_en : config.privacy_es

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-secondary)] py-16 text-center">
          <h1 className="text-4xl font-bold text-white">{dict.footer.privacy}</h1>
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
          {content ? (
            <div className="prose prose-lg max-w-none prose-headings:text-[var(--color-secondary)]"
              dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--color-muted-foreground)]">
                {locale === 'es' ? 'Contenido próximamente disponible.' : 'Content coming soon.'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
