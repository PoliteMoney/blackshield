'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n/dictionaries'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({ locale: 'es', setLocale: () => {} })

export function LocaleProvider({ children, defaultLocale }: { children: ReactNode; defaultLocale: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const router = useRouter()

  function handleSetLocale(newLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    setLocale(newLocale)
    router.refresh()
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
