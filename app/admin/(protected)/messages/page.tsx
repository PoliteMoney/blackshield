import { createClient } from '@/lib/supabase/server'
import { MessagesTable } from '@/components/admin/messages-table'

export default async function MessagesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mensajes de Contacto</h1>
      <MessagesTable messages={data || []} />
    </div>
  )
}
