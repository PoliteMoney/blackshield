import { cookies, headers } from 'next/headers'
import { getDictionary, getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { getSiteConfig } from '@/lib/site-config'

export default async function TermsPage() {
  const cookieStore = cookies()
  const locale: Locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) ||
    getLocaleFromHeader(headers().get('accept-language'))
  const [dict, config] = await Promise.all([getDictionary(locale), getSiteConfig()])
  const content = locale === 'en' ? config.terms_en : config.terms_es

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-navy-deep)] py-16 text-center">
          <h1
            className="text-5xl font-light tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {dict.footer.terms}
          </h1>
          <div className="mx-auto mt-5 h-px w-16 bg-[var(--color-primary)] opacity-60" />
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
