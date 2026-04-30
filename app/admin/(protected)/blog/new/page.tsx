import { BlogPostEditor } from '@/components/admin/blog-post-editor'

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Artículo</h1>
      <BlogPostEditor post={null} translations={[]} />
    </div>
  )
}
