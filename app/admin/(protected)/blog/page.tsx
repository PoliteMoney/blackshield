import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { BlogPostsList } from '@/components/admin/blog-posts-list'

export default async function AdminBlogPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select(`id, slug, status, published_at, created_at, category, author_name,
      translations:blog_posts_translations(title, locale)`)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-secondary)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>
      <BlogPostsList posts={data || []} />
    </div>
  )
}
