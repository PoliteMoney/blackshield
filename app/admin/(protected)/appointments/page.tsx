import { createClient } from '@/lib/supabase/server'
import { AppointmentsTable } from '@/components/admin/appointments-table'

export default async function AppointmentsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Citas</h1>
      <AppointmentsTable appointments={data || []} />
    </div>
  )
}
