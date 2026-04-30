import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { SiteConfigProvider } from '@/components/providers/site-config-provider'
import { getSiteConfig } from '@/lib/site-config'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) redirect('/admin/login')

  const config = await getSiteConfig()

  return (
    <SiteConfigProvider config={config}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar role={profile.role} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader user={user} profile={profile} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SiteConfigProvider>
  )
}
