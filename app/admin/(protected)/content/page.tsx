import { createClient } from '@/lib/supabase/server'
import { ContentEditor } from '@/components/admin/content-editor'

export default async function ContentPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('page_content')
    .select('*')
    .order('page')
    .order('section')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Contenido de Páginas</h1>
      <ContentEditor content={data || []} />
    </div>
  )
}
