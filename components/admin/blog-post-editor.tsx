'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'
import { Save, Globe } from 'lucide-react'

const LOCALES = [
  { code: 'es', label: '🇲🇽 Español' },
  { code: 'en', label: '🇺🇸 English' },
]

export function BlogPostEditor({ post, translations }: { post: any; translations: any[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeLocale, setActiveLocale] = useState('es')
  const [meta, setMeta] = useState({
    slug: post?.slug || '',
    category: post?.category || '',
    author_name: post?.author_name || '',
    image_url: post?.image_url || '',
    status: post?.status || 'draft',
  })
  const [trans, setTrans] = useState<Record<string, any>>(
    LOCALES.reduce((acc, loc) => {
      const t = translations.find(tr => tr.locale === loc.code) || {}
      acc[loc.code] = { title: t.title || '', excerpt: t.excerpt || '', content: t.content || '', meta_title: t.meta_title || '', meta_description: t.meta_description || '' }
      return acc
    }, {} as Record<string, any>)
  )

  function updateTrans(locale: string, field: string, val: string) {
    setTrans(prev => ({ ...prev, [locale]: { ...prev[locale], [field]: val } }))
    if (field === 'title' && locale === 'es' && !meta.slug) {
      setMeta(prev => ({ ...prev, slug: slugify(val) }))
    }
  }

  async function save(status?: string) {
    setSaving(true)
    const supabase = createClient()
    const finalStatus = status || meta.status
    const finalMeta = { ...meta, status: finalStatus }
    if (!finalMeta.slug) finalMeta.slug = slugify(trans.es.title)

    try {
      let postId = post?.id
      if (postId) {
        await supabase.from('blog_posts').update({ ...finalMeta, updated_at: new Date().toISOString(), ...(finalStatus === 'published' && !post?.published_at ? { published_at: new Date().toISOString() } : {}) }).eq('id', postId)
      } else {
        const { data, error } = await supabase.from('blog_posts').insert({ ...finalMeta, published_at: finalStatus === 'published' ? new Date().toISOString() : null }).select('id').single()
        if (error) throw error
        postId = data.id
      }
      for (const loc of LOCALES) {
        const existing = translations.find(t => t.locale === loc.code)
        if (existing) {
          await supabase.from('blog_posts_translations').update({ ...trans[loc.code] }).eq('id', existing.id)
        } else {
          await supabase.from('blog_posts_translations').insert({ post_id: postId, locale: loc.code, ...trans[loc.code] })
        }
      }
      toast.success(finalStatus === 'published' ? 'Artículo publicado' : 'Guardado como borrador')
      router.push('/admin/blog')
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main editor */}
      <div className="lg:col-span-2 space-y-4">
        {/* Locale tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {LOCALES.map(loc => (
              <button key={loc.code} onClick={() => setActiveLocale(loc.code)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-r border-gray-100 ${activeLocale === loc.code ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Globe className="w-3.5 h-3.5" /> {loc.label}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input type="text" value={trans[activeLocale]?.title || ''}
                onChange={e => updateTrans(activeLocale, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extracto</label>
              <textarea value={trans[activeLocale]?.excerpt || ''}
                onChange={e => updateTrans(activeLocale, 'excerpt', e.target.value)}
                rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenido (HTML)</label>
              <textarea value={trans[activeLocale]?.content || ''}
                onChange={e => updateTrans(activeLocale, 'content', e.target.value)}
                rows={16} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 resize-y font-mono" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Metadatos</h3>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
            <input type="text" value={meta.slug}
              onChange={e => setMeta(p => ({ ...p, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
            <input type="text" value={meta.category}
              onChange={e => setMeta(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Autor</label>
            <input type="text" value={meta.author_name}
              onChange={e => setMeta(p => ({ ...p, author_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">URL de imagen destacada</label>
            <input type="text" value={meta.image_url}
              onChange={e => setMeta(p => ({ ...p, image_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
          <h3 className="font-semibold text-gray-800">Publicación</h3>
          <button onClick={() => save('draft')} disabled={saving}
            className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60">
            Guardar borrador
          </button>
          <button onClick={() => save('published')} disabled={saving}
            className="w-full py-2.5 bg-[var(--color-secondary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
