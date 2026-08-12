'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ChevronDown, ChevronUp, Save, Plus, Trash2, Eye, EyeOff,
  ArrowUp, ArrowDown, LayoutGrid,
  Building2, Landmark, DollarSign, HeartPulse, Zap, Cpu,
  Factory, Store, ShoppingCart, Truck, Plane, Ship,
  Leaf, Globe, Scale, Shield, Users, User,
  Briefcase, GraduationCap, BookOpen, Microscope, Stethoscope,
  Hammer, Server, Database, Cloud, Home, Car,
  Sun, Wind, CreditCard, TrendingUp, BarChart3, PieChart,
  Lock, Target, MapPin, Gavel, FileText, Banknote,
  Building, Flag, Anchor, Radio, Satellite, FlaskConical,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'es', label: '🇲🇽 ES' },
  { code: 'en', label: '🇺🇸 EN' },
]

const ICON_LIBRARY: { name: string; label: string; Icon: React.ElementType }[] = [
  { name: 'Building2',      label: 'Edificio',       Icon: Building2 },
  { name: 'Building',       label: 'Corporativo',    Icon: Building },
  { name: 'Landmark',       label: 'Gobierno',       Icon: Landmark },
  { name: 'DollarSign',     label: 'Finanzas',       Icon: DollarSign },
  { name: 'Banknote',       label: 'Banca',          Icon: Banknote },
  { name: 'CreditCard',     label: 'Pagos',          Icon: CreditCard },
  { name: 'TrendingUp',     label: 'Crecimiento',    Icon: TrendingUp },
  { name: 'BarChart3',      label: 'Análisis',       Icon: BarChart3 },
  { name: 'PieChart',       label: 'Estadísticas',   Icon: PieChart },
  { name: 'HeartPulse',     label: 'Salud',          Icon: HeartPulse },
  { name: 'Stethoscope',    label: 'Medicina',       Icon: Stethoscope },
  { name: 'Microscope',     label: 'Ciencia',        Icon: Microscope },
  { name: 'FlaskConical',   label: 'Laboratorio',    Icon: FlaskConical },
  { name: 'Zap',            label: 'Energía',        Icon: Zap },
  { name: 'Sun',            label: 'Solar',          Icon: Sun },
  { name: 'Wind',           label: 'Eólica',         Icon: Wind },
  { name: 'Cpu',            label: 'Tecnología',     Icon: Cpu },
  { name: 'Server',         label: 'Infraestructura',Icon: Server },
  { name: 'Database',       label: 'Datos',          Icon: Database },
  { name: 'Cloud',          label: 'Cloud',          Icon: Cloud },
  { name: 'Satellite',      label: 'Telecomunic.',   Icon: Satellite },
  { name: 'Radio',          label: 'Comunicación',   Icon: Radio },
  { name: 'Factory',        label: 'Manufactura',    Icon: Factory },
  { name: 'Hammer',         label: 'Construcción',   Icon: Hammer },
  { name: 'Store',          label: 'Comercio',       Icon: Store },
  { name: 'ShoppingCart',   label: 'Retail',         Icon: ShoppingCart },
  { name: 'Truck',          label: 'Logística',      Icon: Truck },
  { name: 'Plane',          label: 'Aeronáutico',    Icon: Plane },
  { name: 'Ship',           label: 'Marítimo',       Icon: Ship },
  { name: 'Anchor',         label: 'Puerto',         Icon: Anchor },
  { name: 'Car',            label: 'Automotriz',     Icon: Car },
  { name: 'Home',           label: 'Inmobiliario',   Icon: Home },
  { name: 'MapPin',         label: 'Ubicación',      Icon: MapPin },
  { name: 'Globe',          label: 'Internacional',  Icon: Globe },
  { name: 'Flag',           label: 'País',           Icon: Flag },
  { name: 'Leaf',           label: 'Ambiental',      Icon: Leaf },
  { name: 'Scale',          label: 'Legal',          Icon: Scale },
  { name: 'Gavel',          label: 'Justicia',       Icon: Gavel },
  { name: 'FileText',       label: 'Documentos',     Icon: FileText },
  { name: 'Shield',         label: 'Seguridad',      Icon: Shield },
  { name: 'Lock',           label: 'Privacidad',     Icon: Lock },
  { name: 'Target',         label: 'Estrategia',     Icon: Target },
  { name: 'Briefcase',      label: 'Negocios',       Icon: Briefcase },
  { name: 'Users',          label: 'Personas',       Icon: Users },
  { name: 'User',           label: 'Individual',     Icon: User },
  { name: 'GraduationCap',  label: 'Educación',      Icon: GraduationCap },
  { name: 'BookOpen',       label: 'Academia',       Icon: BookOpen },
]

function IconPreview({ name, className }: { name: string; className?: string }) {
  const entry = ICON_LIBRARY.find(i => i.name === name)
  if (!entry) return <Building2 className={cn('w-5 h-5', className)} />
  const { Icon } = entry
  return <Icon className={cn('w-5 h-5', className)} />
}

export function SectorsEditor({ sectors: initial }: { sectors: any[] }) {
  const [sectors, setSectors] = useState(
    [...initial].sort((a, b) => a.order_index - b.order_index)
  )
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState('es')
  const [edits, setEdits] = useState<Record<string, any>>({})
  const [iconPicker, setIconPicker] = useState<string | null>(null)

  function getEdit(id: string, locale: string, field: string) {
    const key = `${id}_${locale}_${field}`
    if (key in edits) return edits[key]
    return (sectors.find(s => s.id === id)?.translations || [])
      .find((t: any) => t.locale === locale)?.[field] ?? ''
  }

  function setEdit(id: string, locale: string, field: string, val: string) {
    setEdits(prev => ({ ...prev, [`${id}_${locale}_${field}`]: val }))
  }

  function getIcon(id: string) {
    return edits[`${id}_icon`] ?? sectors.find(s => s.id === id)?.icon ?? 'Building2'
  }

  function setIcon(id: string, icon: string) {
    setEdits(prev => ({ ...prev, [`${id}_icon`]: icon }))
    setIconPicker(null)
  }

  function getImageUrl(id: string) {
    return edits[`${id}_image_url`] ?? sectors.find(s => s.id === id)?.image_url ?? ''
  }

  function setImageUrl(id: string, url: string) {
    setEdits(prev => ({ ...prev, [`${id}_image_url`]: url }))
  }

  async function saveSector(sector: any) {
    const supabase = createClient()
    try {
      await supabase.from('sectors').update({
        icon: getIcon(sector.id),
        image_url: getImageUrl(sector.id) || null,
      }).eq('id', sector.id)
      for (const loc of LOCALES) {
        const existing = (sector.translations || []).find((t: any) => t.locale === loc.code)
        const payload = {
          title: getEdit(sector.id, loc.code, 'title'),
          description: getEdit(sector.id, loc.code, 'description'),
        }
        if (existing) {
          await supabase.from('sectors_translations').update(payload).eq('id', existing.id)
        } else {
          await supabase.from('sectors_translations').insert({ sector_id: sector.id, locale: loc.code, ...payload })
        }
      }
      toast.success('Sector guardado')
    } catch { toast.error('Error al guardar') }
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('sectors').update({ is_active: !current }).eq('id', id)
    setSectors(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
  }

  async function deleteSector(id: string) {
    if (!confirm('¿Eliminar este sector? Esta acción no se puede deshacer.')) return
    const supabase = createClient()
    const { error } = await supabase.from('sectors').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    setSectors(prev => prev.filter(s => s.id !== id))
    toast.success('Sector eliminado')
  }

  async function addSector() {
    const supabase = createClient()
    const maxOrder = sectors.reduce((m, s) => Math.max(m, s.order_index ?? 0), 0)
    const slug = `sector-nuevo-${Date.now()}`
    const { data, error } = await supabase
      .from('sectors')
      .insert({ slug, icon: 'Building2', order_index: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (error) { toast.error('Error al crear sector'); return }
    const newSector = { ...data, translations: [] }
    setSectors(prev => [...prev, newSector])
    setExpanded(data.id)
    toast.success('Sector creado — completa su contenido y guarda')
  }

  async function moveOrder(id: string, dir: 'up' | 'down') {
    const idx = sectors.findIndex(s => s.id === id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sectors.length) return
    const supabase = createClient()
    const a = sectors[idx], b = sectors[swapIdx]
    await Promise.all([
      supabase.from('sectors').update({ order_index: b.order_index }).eq('id', a.id),
      supabase.from('sectors').update({ order_index: a.order_index }).eq('id', b.id),
    ])
    const updated = [...sectors]
    updated[idx] = { ...a, order_index: b.order_index }
    updated[swapIdx] = { ...b, order_index: a.order_index }
    setSectors(updated.sort((x, y) => x.order_index - y.order_index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-800">Sectores</h2>
        <button
          onClick={addSector}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Agregar sector
        </button>
      </div>

      {sectors.map((sector, idx) => {
        const esTrans = (sector.translations || []).find((t: any) => t.locale === 'es')
        const isOpen = expanded === sector.id
        const currentIcon = getIcon(sector.id)

        return (
          <div key={sector.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <IconPreview name={currentIcon} />
              </div>

              <button
                onClick={() => setExpanded(isOpen ? null : sector.id)}
                className="flex-1 text-left min-w-0"
              >
                <p className="font-semibold text-gray-900 truncate">{esTrans?.title || sector.slug}</p>
                <p className="text-xs text-gray-400 truncate">{sector.slug}</p>
              </button>

              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button onClick={() => moveOrder(sector.id, 'up')} disabled={idx === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded transition-colors">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveOrder(sector.id, 'down')} disabled={idx === sectors.length - 1}
                  className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-20 rounded transition-colors">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(sector.id, sector.is_active)}
                  className={cn('p-1.5 rounded transition-colors',
                    sector.is_active ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:bg-gray-100')}>
                  {sector.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteSector(sector.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setExpanded(isOpen ? null : sector.id)}
                  className="p-1.5 text-gray-400 rounded">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded */}
            {isOpen && (
              <div className="border-t border-gray-100 p-5 space-y-5">

                {/* Icon picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Icono</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center text-[var(--color-primary)]">
                      <IconPreview name={currentIcon} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => setIconPicker(iconPicker === sector.id ? null : sector.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors',
                        iconPicker === sector.id
                          ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      {iconPicker === sector.id ? 'Cerrar' : 'Elegir icono'}
                    </button>
                    <span className="text-xs text-gray-400 font-mono">{currentIcon}</span>
                  </div>

                  {iconPicker === sector.id && (
                    <div className="mt-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
                        {ICON_LIBRARY.map(({ name, label, Icon }) => (
                          <button
                            key={name}
                            title={label}
                            onClick={() => setIcon(sector.id, name)}
                            className={cn(
                              'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                              currentIcon === name
                                ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                                : 'hover:bg-white text-gray-500 hover:text-gray-900 hover:shadow-sm'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[9px] leading-tight text-center line-clamp-1 w-full">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Background image */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Imagen de fondo (opcional, se muestra semitransparente detrás de la tarjeta)
                  </label>
                  <div className="flex items-center gap-3">
                    {getImageUrl(sector.id) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(sector.id)}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      value={getImageUrl(sector.id)}
                      onChange={e => setImageUrl(sector.id, e.target.value)}
                      placeholder="/images/mi-imagen.png  ó  https://..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Locale tabs + fields */}
                <div>
                  <div className="flex gap-2 mb-4">
                    {LOCALES.map(loc => (
                      <button key={loc.code} onClick={() => setActiveLocale(loc.code)}
                        className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                          activeLocale === loc.code
                            ? 'bg-[var(--color-secondary)] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                        {loc.label}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={getEdit(sector.id, activeLocale, 'title')}
                        onChange={e => setEdit(sector.id, activeLocale, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                      <textarea
                        value={getEdit(sector.id, activeLocale, 'description')}
                        onChange={e => setEdit(sector.id, activeLocale, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => saveSector(sector)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar sector
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
