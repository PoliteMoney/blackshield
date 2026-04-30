import { createAdminClient } from '@/lib/supabase/admin'
import { UsersManager } from '@/components/admin/users-manager'

export default async function UsersPage() {
  const supabase = createAdminClient()
  const { data: profiles } = await supabase
    .from('admin_profiles')
    .select('*, user:id(email)')
    .order('created_at')

  // Get auth users for emails
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const userMap = Object.fromEntries((users || []).map(u => [u.id, u.email]))

  const enriched = (profiles || []).map(p => ({ ...p, email: userMap[p.id] || '' }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>
      <UsersManager users={enriched} />
    </div>
  )
}
