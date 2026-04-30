import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { getSiteConfig } from '@/lib/site-config'
import { SiteConfigProvider } from '@/components/providers/site-config-provider'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { getLocaleFromHeader, type Locale } from '@/lib/i18n/dictionaries'
import { Toaster } from 'react-hot-toast'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return {
    title: { default: config.site_name || 'Blackshield Global Consulting', template: `%s | ${config.site_name}` },
    description: config.site_tagline_es || 'Consultoría estratégica, seguridad corporativa y gestión de riesgos.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    icons: { icon: config.logo_url || '/images/logo_completo.png' },
    openGraph: {
      siteName: config.site_name,
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language')
  const locale: Locale = cookieLocale || getLocaleFromHeader(acceptLanguage)

  const gaId = config.ga_measurement_id
  const pixelId = config.meta_pixel_id

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Fonts – loaded via globals.css @import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Analytics */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${gaId}');
            ` }} />
          </>
        )}
        {/* Meta Pixel */}
        {pixelId && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixelId}');fbq('track','PageView');
          ` }} />
        )}
      </head>
      <body suppressHydrationWarning>
        <SiteConfigProvider config={config}>
          <LocaleProvider defaultLocale={locale}>
            {children}
            <Toaster position="top-right" toastOptions={{
              style: { background: 'var(--color-secondary)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
            }} />
          </LocaleProvider>
        </SiteConfigProvider>
      </body>
    </html>
  )
}
