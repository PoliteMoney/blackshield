'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Building, Phone, Eye, CheckCircle, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export function MessagesTable({ messages: initial }: { messages: any[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<any | null>(null)

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('contact_messages').update({ status }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
    toast.success('Estado actualizado')
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">Todos los mensajes ({messages.length})</h2>
        </div>
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-12">No hay mensajes</p>
          )}
          {messages.map(msg => (
            <button key={msg.id} onClick={() => { setSelected(msg); updateStatus(msg.id, 'read') }}
              className={cn(
                'w-full text-left p-4 hover:bg-gray-50 transition-colors',
                selected?.id === msg.id && 'bg-gray-50',
              )}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900 truncate">{msg.full_name}</span>
                {msg.status === 'new' && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-500 truncate">{msg.subject || msg.email}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(msg.created_at, 'es-MX')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
        {!selected ? (
          <div className="h-full flex items-center justify-center py-24">
            <div className="text-center">
              <Mail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Selecciona un mensaje para ver los detalles</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selected.full_name}</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3.5 h-3.5" />{selected.email}
                  </span>
                  {selected.phone && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="w-3.5 h-3.5" />{selected.phone}
                    </span>
                  )}
                  {selected.company && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Building className="w-3.5 h-3.5" />{selected.company}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(selected.id, 'replied')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Marcar respondido">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button onClick={() => updateStatus(selected.id, 'archived')}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="Archivar">
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
            {selected.subject && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Asunto</p>
                <p className="font-medium text-gray-800 text-sm">{selected.subject}</p>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-400">
              <span>Recibido: {formatDate(selected.created_at, 'es-MX')}</span>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Consulta'}`}
                className="text-[var(--color-accent)] hover:underline font-medium">
                Responder por email →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
