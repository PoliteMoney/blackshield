'use client'

import Link from 'next/link'
import {
  User, Target, TrendingUp, FileText, Lock, Scale,
  Users, Megaphone, Shield, Copyright, GraduationCap, Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SLUGS = [
  'representacion-estrategica',
  'inteligencia-estrategica',
  'entrada-y-operacion',
  'estructuracion-corporativa',
  'proteccion-patrimonial',
  'asuntos-legales',
  'representacion-de-victimas',
  'gestion-de-crisis',
  'gobernanza',
  'propiedad-intelectual',
  'fortalecimiento-institucional',
  'derecho-corporativo',
]

const ICONS = [
  <User          key={0}  className="w-8 h-8" />,
  <Target        key={1}  className="w-8 h-8" />,
  <TrendingUp    key={2}  className="w-8 h-8" />,
  <FileText      key={3}  className="w-8 h-8" />,
  <Lock          key={4}  className="w-8 h-8" />,
  <Scale         key={5}  className="w-8 h-8" />,
  <Users         key={6}  className="w-8 h-8" />,
  <Megaphone     key={7}  className="w-8 h-8" />,
  <Shield        key={8}  className="w-8 h-8" />,
  <Copyright     key={9}  className="w-8 h-8" />,
  <GraduationCap key={10} className="w-8 h-8" />,
  <Building2     key={11} className="w-8 h-8" />,
]

interface CapacitiesSectionProps {
  dict: {
    title: string
    items: Array<{ title: string; desc: string }>
  }
}

function Card({
  item,
  index,
  lastInRow,
}: {
  item: { title: string; desc: string }
  index: number
  lastInRow: boolean
}) {
  return (
    <Link
      href={`/capacidades/${SLUGS[index] ?? SLUGS[0]}`}
      className={cn(
        'flex flex-col items-center text-center px-5 py-10 group cursor-pointer transition-colors hover:bg-[#AD8855]/5',
        !lastInRow && 'border-r border-[#AD8855]/20',
      )}
    >
      <div className="text-[#AD8855] mb-5 opacity-85 group-hover:opacity-100 transition-opacity">
        {ICONS[index] ?? ICONS[0]}
      </div>
      <p className="text-[11px] font-semibold text-white leading-snug mb-3 uppercase tracking-wide group-hover:text-[#AD8855] transition-colors">
        {item.title}
      </p>
      <p className="text-[11px] text-white/50 leading-relaxed">
        {item.desc}
      </p>
    </Link>
  )
}

export function CapacitiesSection({ dict }: CapacitiesSectionProps) {
  const items = Array.isArray(dict?.items) ? dict.items : []
  const row1 = items.slice(0, 6)
  const row2 = items.slice(6, 12)

  return (
    <section id="capacities" className="bg-[#0D1E28]">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">

        <h2
          className="text-3xl sm:text-4xl font-light text-center text-white mb-16"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {dict?.title}
        </h2>

        {/* Row 1 — 6 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-[#AD8855]/15">
          {row1.map((item, i) => (
            <Card key={i} item={item} index={i} lastInRow={i === row1.length - 1} />
          ))}
        </div>

        {/* Row 2 — 6 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {row2.map((item, i) => (
            <Card key={i + 6} item={item} index={i + 6} lastInRow={i === row2.length - 1} />
          ))}
        </div>

      </div>
    </section>
  )
}
