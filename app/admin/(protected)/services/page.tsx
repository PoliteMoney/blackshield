import { createClient } from '@/lib/supabase/server'
import { ServicesEditor } from '@/components/admin/services-editor'

export default async function AdminServicesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('services')
    .select(`*, translations:services_translations(*)`)
    .order('order_index')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Servicios</h1>
      <ServicesEditor services={data || []} />
    </div>
  )
}
