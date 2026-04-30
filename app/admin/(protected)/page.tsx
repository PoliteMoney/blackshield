import { createClient } from '@/lib/supabase/server'
import { Calendar, MessageSquare, TrendingUp, Users, Eye, BookOpen } from 'lucide-react'

async function getDashboardStats() {
  const supabase = createClient()
  const [appointments, messages, posts, contacts] = await Promise.all([
    supabase.from('appointments').select('id, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('id, full_name, email, subject, created_at, status').order('created_at', { ascending: false }).limit(5),
    supabase.from('blog_posts').select('id, status').throwOnError(),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])
  return {
    recentAppointments: appointments.data || [],
    recentMessages: messages.data || [],
    totalPosts: posts.data?.length || 0,
    newMessages: contacts.count || 0,
  }
}

export default async function AdminDashboard() {
  const { recentAppointments, recentMessages, totalPosts, newMessages } = await getDashboardStats()
  const supabase = createClient()
  const { count: pendingAppointments } = await supabase
    .from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'pending')

  const stats = [
    { label: 'Citas pendientes', value: pendingAppointments || 0, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Mensajes nuevos', value: newMessages, icon: MessageSquare, color: 'bg-green-100 text-green-600' },
    { label: 'Artículos publicados', value: totalPosts, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { label: 'Visitas (proximamente)', value: '—', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
            Citas Recientes
          </h2>
          {recentAppointments.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay citas aún</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.full_name || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-400">{a.date} • {a.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--color-accent)]" />
            Mensajes Recientes
          </h2>
          {recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay mensajes aún</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m: any) => (
                <div key={m.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{m.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.subject || m.email}</p>
                  </div>
                  {m.status === 'new' && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
