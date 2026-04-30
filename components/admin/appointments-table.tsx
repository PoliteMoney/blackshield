'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada'
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export function AppointmentsTable({ appointments: initial }: { appointments: any[] }) {
  const [appointments, setAppointments] = useState(initial)
  const [filter, setFilter] = useState('all')

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    const { error } = await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    toast.success('Estado actualizado')
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100 flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === f ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {f === 'all' ? 'Todas' : STATUS_LABELS[f]}
            <span className="ml-2 text-xs">
              ({f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Cliente', 'Fecha / Hora', 'Tipo', 'Servicio', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">No hay citas</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900 text-sm">{a.full_name}</p>
                  <p className="text-xs text-gray-400">{a.email}</p>
                  {a.company && <p className="text-xs text-gray-400">{a.company}</p>}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {a.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" /> {a.time} ({a.duration} min)
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    {a.appointment_type === 'virtual' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {a.appointment_type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{a.service_name || '—'}</td>
                <td className="px-4 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-600')}>
                    {STATUS_LABELS[a.status] || a.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {a.status === 'pending' && (
                      <button onClick={() => updateStatus(a.id, 'confirmed')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirmar">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {a.status === 'confirmed' && (
                      <button onClick={() => updateStatus(a.id, 'completed')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Completar">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    {!['cancelled', 'completed'].includes(a.status) && (
                      <button onClick={() => updateStatus(a.id, 'cancelled')}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancelar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
