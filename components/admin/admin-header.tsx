'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AdminHeader({ user, profile }: { user: any; profile: any }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{profile?.full_name || user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
