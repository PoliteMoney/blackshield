export type Locale = 'es' | 'en'

export const locales: Locale[] = ['es', 'en']
export const defaultLocale: Locale = 'es'

const dictionaries = {
  es: () => import('./locales/es.json').then((m) => m.default),
  en: () => import('./locales/en.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

export function getLocaleFromHeader(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  const preferred = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
  return preferred === 'en' ? 'en' : 'es'
}
