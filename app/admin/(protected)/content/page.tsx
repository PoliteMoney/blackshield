import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/admin/content-editor'
import { SectorsEditor } from '@/components/admin/sectors-editor'

export default async function ContentPage() {
  const supabase = createClient()

  const [{ data: content }, { data: sectors }] = await Promise.all([
    supabase.from('page_content').select('*').order('page').order('section'),
    supabase.from('sectors').select(`*, translations:sectors_translations(*)`).order('order_index'),
  ])

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Contenido de Páginas</h1>
        <ContentEditor content={content || []} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Sectores</h1>
        <SectorsEditor sectors={sectors || []} />
      </div>
    </div>
  )
}
