import { createClient } from '@/lib/supabase/server'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'

export default async function BlogPostEditorPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  let post = null
  let translations: any[] = []

  if (params.id !== 'new') {
    const { data } = await supabase.from('blog_posts').select(`*, translations:blog_posts_translations(*)`).eq('id', params.id).single()
    post = data
    translations = data?.translations || []
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {params.id === 'new' ? 'Nuevo Artículo' : 'Editar Artículo'}
      </h1>
      <BlogPostEditor post={post} translations={translations} />
    </div>
  )
}
