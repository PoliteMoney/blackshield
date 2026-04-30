'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown, ChevronUp, Save, Globe, Star, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'es', label: '🇲🇽 ES' },
  { code: 'en', label: '🇺🇸 EN' },
]

export function ServicesEditor({ services: initial }: { services: any[] }) {
  const [services, setServices] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeLocale, setActiveLocale] = useState('es')
  const [edits, setEdits] = useState<Record<string, any>>({})

  function getEdit(serviceId: string, locale: string, field: string, fallback = '') {
    return edits[`${serviceId}_${locale}_${field}`] ?? (
      (services.find(s => s.id === serviceId)?.translations || []).find((t: any) => t.locale === locale)?.[field] ?? fallback
    )
  }

  function setEdit(serviceId: string, locale: string, field: string, val: string) {
    setEdits(prev => ({ ...prev, [`${serviceId}_${locale}_${field}`]: val }))
  }

  async function saveService(service: any) {
    const supabase = createClient()
    try {
      for (const loc of LOCALES) {
        const existing = (service.translations || []).find((t: any) => t.locale === loc.code)
        const data = {
          title: getEdit(service.id, loc.code, 'title'),
          short_description: getEdit(service.id, loc.code, 'short_description'),
          full_description: getEdit(service.id, loc.code, 'full_description'),
        }
        if (existing) {
          await supabase.from('services_translations').update(data).eq('id', existing.id)
        } else {
          await supabase.from('services_translations').insert({ service_id: service.id, locale: loc.code, ...data })
        }
      }
      toast.success('Servicio guardado')
    } catch { toast.error('Error al guardar') }
  }

  async function toggleField(id: string, field: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('services').update({ [field]: !current }).eq('id', id)
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: !current } : s))
  }

  return (
    <div className="space-y-4">
      {services.map(service => {
        const esTrans = (service.translations || []).find((t: any) => t.locale === 'es')
        const isExpanded = expanded === service.id

        return (
          <div key={service.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 p-5">
              <button onClick={() => setExpanded(isExpanded ? null : service.id)} className="flex-1 flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                  <span className="text-lg">{service.order_index}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{esTrans?.title || service.slug}</p>
                  <p className="text-xs text-gray-400">{service.slug}</p>
                </div>
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleField(service.id, 'featured', service.featured)}
                  className={cn('p-2 rounded-lg transition-colors', service.featured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:bg-gray-100')}>
                  <Star className="w-4 h-4" />
                </button>
                <button onClick={() => toggleField(service.id, 'is_active', service.is_active)}
                  className={cn('p-2 rounded-lg transition-colors', service.is_active ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:bg-gray-100')}>
                  {service.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => setExpanded(isExpanded ? null : service.id)} className="p-2 text-gray-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 p-5">
                <div className="flex gap-2 mb-4">
                  {LOCALES.map(loc => (
                    <button key={loc.code} onClick={() => setActiveLocale(loc.code)}
                      className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        activeLocale === loc.code ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                      {loc.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
                    <input type="text"
                      value={getEdit(service.id, activeLocale, 'title')}
                      onChange={e => setEdit(service.id, activeLocale, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción corta</label>
                    <textarea
                      value={getEdit(service.id, activeLocale, 'short_description')}
                      onChange={e => setEdit(service.id, activeLocale, 'short_description', e.target.value)}
                      rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción completa</label>
                    <textarea
                      value={getEdit(service.id, activeLocale, 'full_description')}
                      onChange={e => setEdit(service.id, activeLocale, 'full_description', e.target.value)}
                      rows={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-y" />
                  </div>
                  <button onClick={() => saveService(service)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
                    <Save className="w-3.5 h-3.5" /> Guardar servicio
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
