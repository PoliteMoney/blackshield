'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Save, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const PAGES = ['home', 'about', 'services', 'sectors', 'methodology', 'contact', 'blog', 'faq']
const LOCALES = [{ code: 'es', label: '🇲🇽 ES' }, { code: 'en', label: '🇺🇸 EN' }]

export function ContentEditor({ content: initial }: { content: any[] }) {
  const [content, setContent] = useState(initial)
  const [activePage, setActivePage] = useState('home')
  const [activeLocale, setActiveLocale] = useState('es')
  const [edits, setEdits] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  const pageContent = content.filter(c => c.page === activePage && c.locale === activeLocale)

  function getEdit(id: string, field: string, fallback = '') {
    return edits[`${id}_${field}`] ?? (content.find(c => c.id === id)?.[field] ?? fallback)
  }

  function setEdit(id: string, field: string, val: string) {
    setEdits(prev => ({ ...prev, [`${id}_${field}`]: val }))
  }

  async function saveAll() {
    setSaving(true)
    const supabase = createClient()
    try {
      for (const item of pageContent) {
        const updates: Record<string, string> = {}
        for (const field of ['title', 'subtitle', 'body', 'cta_text', 'cta_url', 'image_url', 'meta_title', 'meta_description']) {
          const key = `${item.id}_${field}`
          if (key in edits) updates[field] = edits[key]
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from('page_content').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', item.id)
          setContent(prev => prev.map(c => c.id === item.id ? { ...c, ...updates } : c))
        }
      }
      toast.success('Contenido guardado')
    } catch { toast.error('Error al guardar') } finally { setSaving(false) }
  }

  async function addSection() {
    const section = prompt('Nombre de la sección (ej: hero, features, cta):')
    if (!section) return
    const supabase = createClient()
    const { data, error } = await supabase.from('page_content').insert({
      page: activePage, section, locale: activeLocale, is_active: true
    }).select().single()
    if (data) setContent(prev => [...prev, data])
    else toast.error('Error: ' + error?.message)
  }

  return (
    <div className="flex gap-6">
      {/* Page tabs */}
      <div className="w-44 space-y-1 flex-shrink-0">
        {PAGES.map(page => (
          <button key={page} onClick={() => setActivePage(page)}
            className={cn('w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left capitalize',
              activePage === page ? 'bg-[var(--color-secondary)] text-white' : 'text-gray-600 hover:bg-gray-100')}>
            {page}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 space-y-4">
        {/* Locale + actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {LOCALES.map(loc => (
              <button key={loc.code} onClick={() => setActiveLocale(loc.code)}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                  activeLocale === loc.code ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                <Globe className="w-3.5 h-3.5" /> {loc.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={addSection}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
              <Plus className="w-3.5 h-3.5" /> Agregar sección
            </button>
            <button onClick={saveAll} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-60">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar todo
            </button>
          </div>
        </div>

        {pageContent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No hay secciones para esta página/idioma. Agrega una sección para empezar.</p>
          </div>
        ) : (
          pageContent.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-5 capitalize flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                Sección: {item.section}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: 'title', label: 'Título' },
                  { field: 'subtitle', label: 'Subtítulo' },
                  { field: 'cta_text', label: 'Texto del botón CTA' },
                  { field: 'cta_url', label: 'URL del botón CTA' },
                  { field: 'image_url', label: 'URL de imagen' },
                  { field: 'meta_title', label: 'Meta título (SEO)' },
                  { field: 'meta_description', label: 'Meta descripción (SEO)' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                    <input type="text" value={getEdit(item.id, field)}
                      onChange={e => setEdit(item.id, field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cuerpo / Descripción</label>
                  <textarea value={getEdit(item.id, 'body')}
                    onChange={e => setEdit(item.id, 'body', e.target.value)}
                    rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-y" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
