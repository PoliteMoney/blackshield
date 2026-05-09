'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard, Settings, FileText, Briefcase, BookOpen,
  Calendar, MessageSquare, Users, ChevronRight, Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Configuración', href: '/admin/settings', icon: Settings },
  { label: 'Contenido', href: '/admin/content', icon: FileText },
  { label: 'Servicios', href: '/admin/services', icon: Briefcase },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Citas', href: '/admin/appointments', icon: Calendar },
  { label: 'Mensajes', href: '/admin/messages', icon: MessageSquare },
  { label: 'Usuarios', href: '/admin/users', icon: Users, adminOnly: true },
]

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname()

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <aside className="w-64 bg-[var(--color-secondary)] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin">
          <Image src="/images/isotipo_blanco.png" alt="Blackshield Admin" width={36} height={36}
            className="h-9 w-auto object-contain" />
        </Link>
        <p className="text-white/30 text-xs mt-2">Panel de Administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          if (item.adminOnly && role !== 'admin') return null
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-[var(--color-primary)] text-[var(--color-secondary)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}>
              <Icon className="w-4 h-4" />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* View Site */}
      <div className="p-4 border-t border-white/10">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-4 py-3 text-white/40 hover:text-white text-sm transition-colors rounded-xl hover:bg-white/5">
          <Globe className="w-4 h-4" />
          Ver sitio web
        </Link>
      </div>
    </aside>
  )
}
