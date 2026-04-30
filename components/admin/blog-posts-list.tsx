'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export function BlogPostsList({ posts: initial }: { posts: any[] }) {
  const [posts, setPosts] = useState(initial)

  async function toggleStatus(post: any) {
    const supabase = createClient()
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null
    await supabase.from('blog_posts').update({ status: newStatus, published_at: publishedAt, updated_at: new Date().toISOString() }).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p))
    toast.success(newStatus === 'published' ? 'Publicado' : 'Archivado como borrador')
  }

  async function deletePost(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return
    const supabase = createClient()
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    toast.success('Artículo eliminado')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {['Título', 'Categoría', 'Estado', 'Fecha', 'Acciones'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr><td colSpan={5} className="text-center py-12 text-gray-400">No hay artículos</td></tr>
          )}
          {posts.map(post => {
            const t = (post.translations || []).find((tr: any) => tr.locale === 'es') || post.translations?.[0]
            return (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900 text-sm">{t?.title || post.slug}</p>
                  <p className="text-xs text-gray-400">/{post.slug}</p>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{post.category || '—'}</td>
                <td className="px-4 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                    post.status === 'published' ? 'bg-green-100 text-green-700' :
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600')}>
                    {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Borrador' : post.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {post.published_at ? formatDate(post.published_at, 'es-MX') : '—'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/${post.id}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => toggleStatus(post)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                      {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deletePost(post.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
