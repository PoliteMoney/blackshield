import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  // Verify caller is admin
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('admin_profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, full_name, role } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: inviteData, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role: role || 'editor' },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/login`,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Create admin profile
  await admin.from('admin_profiles').insert({
    id: inviteData.user.id,
    full_name,
    role: role || 'editor',
    is_active: true,
  })

  return NextResponse.json({ ok: true })
}
