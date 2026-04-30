import { createClient } from '@/lib/supabase/server'

export type SiteConfig = Record<string, string>

const fallback: SiteConfig = {
  site_name: 'Blackshield Global Consulting',
  site_tagline_es: 'Legal Strategy. Powered by Intelligence.',
  site_tagline_en: 'Legal Strategy. Powered by Intelligence.',
  logo_url: '/images/logo_negro.png',
  logo_white_url: '/images/logo_beige.jpeg',
  color_primary: '#AD8855',
  color_secondary: '#1A1C1E',
  color_accent: '#003E4A',
  font_heading: 'Cormorant Garamond',
  font_body: 'Montserrat',
  contact_email: 'ceo@blackshieldgc.com',
  whatsapp_number: '+521234567890',
  whatsapp_message_es: 'Hola, me interesa conocer más sobre sus servicios de consultoría.',
  whatsapp_message_en: 'Hello, I am interested in learning more about your consulting services.',
  stripe_enabled: 'false',
  blog_enabled: 'true',
  appointments_enabled: 'true',
  cookie_policy_enabled: 'true',
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_config').select('key, value')
    if (!data) return fallback
    const config: SiteConfig = {}
    data.forEach(({ key, value }) => { config[key] = value ?? '' })
    return { ...fallback, ...config }
  } catch {
    return fallback
  }
}
