'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Shield, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function UsersManager({ users: initial }: { users: any[] }) {
  const [users, setUsers] = useState(initial)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', role: 'editor' })
  const [inviting, setInviting] = useState(false)

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('admin_profiles').update({ is_active: !current }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !current } : u))
    toast.success('Usuario actualizado')
  }

  async function changeRole(id: string, role: string) {
    const supabase = createClient()
    await supabase.from('admin_profiles').update({ role }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    toast.success('Rol actualizado')
  }

  async function inviteUser(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      })
      if (res.ok) {
        toast.success('Invitación enviada')
        setShowInvite(false)
        setInviteForm({ email: '', full_name: '', role: 'editor' })
      } else {
        toast.error('Error al invitar')
      }
    } catch { toast.error('Error') } finally { setInviting(false) }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-secondary)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" /> Invitar usuario
        </button>
      </div>

      {showInvite && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Invitar nuevo administrador</h3>
          <form onSubmit={inviteUser} className="grid sm:grid-cols-3 gap-4">
            <input type="email" placeholder="Email" required value={inviteForm.email}
              onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            <input type="text" placeholder="Nombre completo" value={inviteForm.full_name}
              onChange={e => setInviteForm(p => ({ ...p, full_name: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
            <select value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
            <div className="sm:col-span-3 flex gap-3">
              <button type="submit" disabled={inviting}
                className="px-4 py-2 bg-[var(--color-secondary)] text-white text-sm rounded-lg hover:opacity-90 disabled:opacity-60">
                {inviting ? 'Enviando...' : 'Enviar invitación'}
              </button>
              <button type="button" onClick={() => setShowInvite(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Usuario', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(u.full_name || u.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{u.full_name || '—'}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none">
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium',
                    u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => toggleActive(u.id, u.is_active)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    {u.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
