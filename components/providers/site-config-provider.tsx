'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteConfig } from '@/lib/site-config'

const SiteConfigContext = createContext<SiteConfig>({})

export function SiteConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  return (
    <SiteConfigContext.Provider value={config}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-primary: ${config.color_primary || '#DDD0C8'};
          --color-secondary: ${config.color_secondary || '#323232'};
          --color-accent: ${config.color_accent || '#8B7355'};
          --font-heading: '${config.font_heading || 'Playfair Display'}', serif;
          --font-sans: '${config.font_body || 'Inter'}', system-ui, sans-serif;
        }
      ` }} />
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
