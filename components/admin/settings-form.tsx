'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Palette, Globe, Phone, FileText, Settings, ToggleLeft, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  branding: { label: 'Marca e Identidad', icon: Palette },
  contact: { label: 'Contacto', icon: Phone },
  analytics: { label: 'Analítica', icon: Globe },
  payments: { label: 'Pagos (Stripe)', icon: Settings },
  integrations: { label: 'Integraciones', icon: Settings },
  legal: { label: 'Contenido Legal', icon: FileText },
  social: { label: 'Redes Sociales', icon: Globe },
  features: { label: 'Funcionalidades', icon: ToggleLeft },
}

export function SettingsForm({ settings }: { settings: any[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s: { key: string; value?: string }) => [s.key, s.value || '']))
  )
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('branding')

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {} as Record<string, any[]>)

  async function saveCategory(category: string) {
    setSaving(category)
    const supabase = createClient()
    const items = grouped[category] || []
    try {
      await Promise.all(items.map((s: { key: string }) =>
        supabase.from('site_config').update({ value: values[s.key], updated_at: new Date().toISOString() }).eq('key', s.key)
      ))
      toast.success('Configuración guardada correctamente')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(null)
    }
  }

  const renderInput = (setting: any) => {
    const val = values[setting.key] ?? ''
    const onChange = (v: string) => setValues(prev => ({ ...prev, [setting.key]: v }))

    if (setting.type === 'boolean') {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => onChange(val === 'true' ? 'false' : 'true')}
            className={cn('w-11 h-6 rounded-full transition-colors relative', val === 'true' ? 'bg-[var(--color-accent)]' : 'bg-gray-300')}>
            <div className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow',
              val === 'true' ? 'translate-x-5' : 'translate-x-0')} />
          </div>
          <span className="text-sm text-gray-600">{val === 'true' ? 'Habilitado' : 'Deshabilitado'}</span>
        </label>
      )
    }
    if (setting.type === 'color') {
      return (
        <div className="flex items-center gap-3">
          <input type="color" value={val || '#000000'}
            onChange={e => onChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer border-0" />
          <input type="text" value={val}
            onChange={e => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="#000000" />
        </div>
      )
    }
    if (setting.type === 'image') {
      return (
        <div className="space-y-2">
          <input type="text" value={val}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="/images/logo.png o URL" />
          {val && (
            <div className="h-16 bg-gray-800 rounded-lg flex items-center px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={val} alt="" className="h-10 w-auto object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}
        </div>
      )
    }
    // Large text (legal content)
    if (setting.key.startsWith('terms') || setting.key.startsWith('privacy')) {
      return (
        <textarea value={val} onChange={e => onChange(e.target.value)} rows={8}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)] resize-y font-mono"
          placeholder="HTML content..." />
      )
    }
    return (
      <input type="text" value={val} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-accent)]" />
    )
  }

  return (
    <div className="flex gap-6">
      {/* Tabs */}
      <div className="w-52 space-y-1 flex-shrink-0">
        {Object.entries(grouped).map(([cat]) => {
          const cfg = categoryConfig[cat] || { label: cat, icon: Settings }
          const Icon = cfg.icon
          return (
            <button key={cat} onClick={() => setActiveTab(cat)}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                activeTab === cat ? 'bg-[var(--color-secondary)] text-white' : 'text-gray-600 hover:bg-gray-100')}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Settings panel */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {grouped[activeTab] && (
          <>
            <h2 className="font-semibold text-gray-900 mb-6">
              {categoryConfig[activeTab]?.label || activeTab}
            </h2>
            <div className="space-y-6">
              {grouped[activeTab].map((setting: any) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.label || setting.key}
                  </label>
                  {setting.description && (
                    <p className="text-xs text-gray-400 mb-2">{setting.description}</p>
                  )}
                  {renderInput(setting)}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => saveCategory(activeTab)}
                disabled={saving === activeTab}
                className="px-6 py-2.5 bg-[var(--color-secondary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2 text-sm">
                {saving === activeTab && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving === activeTab ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
