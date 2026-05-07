'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react'
import { useSiteConfig } from '@/components/providers/site-config-provider'

interface FooterProps {
  dict: Record<string, string>
  navDict: Record<string, string>
  capacitiesDict?: { title?: string; items?: Array<{ title: string; desc?: string }> }
}

export function Footer({ dict, navDict, capacitiesDict }: FooterProps) {
  const config = useSiteConfig()
  const year = new Date().getFullYear()

  const capacities = (capacitiesDict?.items ?? []).slice(0, 6)

  return (
    <footer className="bg-[var(--color-secondary)] text-white">
      {/* Top accent bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-40" />

      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image
                src={config.logo_white_url || '/images/logo_beige.jpeg'}
                alt={config.site_name || 'Blackshield'}
                width={160}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-primary)] mb-3">
              Legal Strategy. Powered by Intelligence.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              {dict.description}
            </p>
            <div className="flex gap-3 mt-6">
              {config.social_linkedin && (
                <a href={config.social_linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-white/8 border border-white/10 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {config.social_twitter && (
                <a href={config.social_twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-white/8 border border-white/10 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {config.social_facebook && (
                <a href={config.social_facebook} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-white/8 border border-white/10 rounded-lg hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-primary)] mb-5">
              {dict.quick_links}
            </h3>
            <ul className="space-y-3">
              {[
                { label: navDict.home,        href: '/' },
                { label: navDict.about,       href: '/#about' },
                { label: navDict.methodology, href: '/#methodology' },
                { label: navDict.blog,        href: '/blog' },
                { label: navDict.contact,     href: '/#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Capacities */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-primary)] mb-5">
              {dict.services}
            </h3>
            <ul className="space-y-3">
              {capacities.map((item) => (
                <li key={item.title}>
                  <Link href="/#capacities"
                    className="text-white/50 hover:text-white text-sm transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--color-primary)] mb-5">
              Contacto
            </h3>
            <ul className="space-y-4">
              {config.contact_email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${config.contact_email}`}
                    className="text-white/50 hover:text-white text-sm transition-colors">
                    {config.contact_email}
                  </a>
                </li>
              )}
              {config.whatsapp_number && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <a href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-white/50 hover:text-white text-sm transition-colors">
                    {config.whatsapp_number}
                  </a>
                </li>
              )}
              {config.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-sm">{config.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wide">
            &copy; {year} {config.site_name}. {dict.rights}
          </p>
          <div className="flex gap-6">
            <Link href="/terminos"   className="text-white/30 hover:text-[var(--color-primary)] text-xs transition-colors">{dict.terms}</Link>
            <Link href="/privacidad" className="text-white/30 hover:text-[var(--color-primary)] text-xs transition-colors">{dict.privacy}</Link>
            <Link href="/cookies"    className="text-white/30 hover:text-[var(--color-primary)] text-xs transition-colors">{dict.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
