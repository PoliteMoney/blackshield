'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useSiteConfig } from '@/components/providers/site-config-provider'
import { useLocale } from '@/components/providers/locale-provider'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/dictionaries'

interface NavItem {
  key: string
  label: string
  href: string
}

interface NavbarProps {
  dict: Record<string, string>
}

export function Navbar({ dict }: NavbarProps) {
  const config = useSiteConfig()
  const { locale, setLocale } = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navItems: NavItem[] = [
    { key: 'about',       label: dict.about       || 'Quiénes Somos', href: '/#about' },
    { key: 'services',    label: dict.services    || 'Capacidades',   href: '/#capacities' },
    { key: 'sectors',     label: dict.sectors     || 'Sectores',      href: '/#sectors' },
    { key: 'methodology', label: dict.methodology || 'Metodología',   href: '/#methodology' },
    ...(config.blog_enabled === 'true' ? [{ key: 'blog', label: dict.blog || 'Blog', href: '/blog' }] : []),
    { key: 'faq',         label: dict.faq         || 'FAQ',           href: '/#faq' },
    { key: 'contact',     label: dict.contact     || 'Contacto',      href: '/#contact' },
  ]

  const scrolledStyle = 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--color-border)] py-3'
  const topStyle      = 'bg-transparent py-5'

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? scrolledStyle : topStyle)}>
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src={config.logo_url || '/images/logo_negro.png'}
              alt={config.site_name || 'Blackshield'}
              width={220}
              height={72}
              className={cn(
                'w-auto object-contain transition-all duration-300',
                isScrolled ? 'h-10' : 'h-16'
              )}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-xs font-semibold tracking-widest uppercase text-[var(--color-secondary)]/70 hover:text-[var(--color-secondary)] transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] text-xs font-semibold tracking-widest uppercase transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {locale.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </button>
              {isLangOpen && (
                <div className="absolute top-9 right-0 bg-white border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden min-w-[130px]">
                  {(['es', 'en'] as Locale[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLocale(lang); setIsLangOpen(false) }}
                      className={cn(
                        'flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-left hover:bg-[var(--color-muted)] transition-colors',
                        locale === lang ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]/70'
                      )}
                    >
                      {lang === 'es' ? '🇲🇽 Español' : '🇺🇸 English'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            {config.appointments_enabled === 'true' && (
              <Link
                href="/agendar"
                className="px-5 py-2.5 bg-[var(--color-accent)] text-white text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-[#004d5c] transition-colors duration-200 shadow-md shadow-[var(--color-accent)]/20"
              >
                {dict.book || 'Agendar Cita'}
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden text-[var(--color-secondary)] p-2"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--color-border)] shadow-lg">
          <div className="px-4 py-5 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-secondary)]/70 hover:text-[var(--color-accent)] py-3 border-b border-[var(--color-border)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex items-center gap-5">
              {(['es', 'en'] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLocale(lang); setIsMobileOpen(false) }}
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase transition-colors',
                    locale === lang ? 'text-[var(--color-accent)]' : 'text-[var(--color-secondary)]/50'
                  )}
                >
                  {lang === 'es' ? '🇲🇽 ES' : '🇺🇸 EN'}
                </button>
              ))}
            </div>
            {config.appointments_enabled === 'true' && (
              <Link
                href="/agendar"
                onClick={() => setIsMobileOpen(false)}
                className="block text-center py-3 bg-[var(--color-accent)] text-white text-xs font-semibold tracking-widest uppercase rounded-lg mt-3"
              >
                {dict.book || 'Agendar Cita'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
