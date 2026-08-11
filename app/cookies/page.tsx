import { cookies, headers } from 'next/headers'
import { getDictionary, getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default async function CookiesPage() {
  const cookieStore = cookies()
  const locale: Locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) ||
    getLocaleFromHeader(headers().get('accept-language'))
  const dict = await getDictionary(locale)

  const content = locale === 'es' ? `
    <h2>¿Qué son las cookies?</h2>
    <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo al visitar un sitio web. Se utilizan para recordar sus preferencias y mejorar su experiencia.</p>
    <h2>Tipos de cookies que utilizamos</h2>
    <h3>Cookies técnicas (necesarias)</h3>
    <p>Son indispensables para el funcionamiento del sitio web y no pueden desactivarse. Incluyen cookies de sesión y de seguridad.</p>
    <h3>Cookies analíticas</h3>
    <p>Utilizamos Google Analytics para entender cómo los usuarios interactúan con nuestro sitio. Esta información es anónima y se usa para mejorar nuestros servicios.</p>
    <h3>Cookies de marketing</h3>
    <p>Con su consentimiento, podemos utilizar el Pixel de Meta para medir la efectividad de nuestras campañas publicitarias.</p>
    <h2>Control de cookies</h2>
    <p>Puede controlar y/o eliminar cookies en cualquier momento desde la configuración de su navegador.</p>
    <h2>Contacto</h2>
    <p>Si tiene preguntas sobre nuestra política de cookies, contáctenos en ceo@blackshieldgc.com</p>
  ` : `
    <h2>What are cookies?</h2>
    <p>Cookies are small text files stored on your device when you visit a website. They are used to remember your preferences and improve your experience.</p>
    <h2>Types of cookies we use</h2>
    <h3>Technical cookies (necessary)</h3>
    <p>These are essential for the website to function and cannot be disabled. They include session and security cookies.</p>
    <h3>Analytical cookies</h3>
    <p>We use Google Analytics to understand how users interact with our site. This information is anonymous and used to improve our services.</p>
    <h3>Marketing cookies</h3>
    <p>With your consent, we may use the Meta Pixel to measure the effectiveness of our advertising campaigns.</p>
    <h2>Cookie control</h2>
    <p>You can control and/or delete cookies at any time from your browser settings.</p>
    <h2>Contact</h2>
    <p>If you have questions about our cookie policy, contact us at ceo@blackshieldgc.com</p>
  `

  return (
    <>
      <Navbar dict={dict.nav} />
      <main className="pt-24">
        <div className="bg-[var(--color-navy-deep)] py-16 text-center">
          <h1
            className="text-5xl font-light tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {dict.footer.cookies}
          </h1>
          <div className="mx-auto mt-5 h-px w-16 bg-[var(--color-primary)] opacity-60" />
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl">
          <div className="prose prose-lg max-w-none prose-headings:text-[var(--color-secondary)] prose-p:text-[var(--color-muted-foreground)]"
            dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </main>
      <Footer dict={dict.footer} navDict={dict.nav} />
    </>
  )
}
