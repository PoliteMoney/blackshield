'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Credenciales incorrectas')
      setLoading(false)
    } else {
      // Hard navigation so the server picks up the new session cookie
      window.location.href = '/admin'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1A1C1E 0%, #003E4A 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/images/logo_beige.jpeg" alt="Blackshield" width={180} height={50}
            className="h-12 w-auto object-contain mx-auto mb-4"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo_blanco.png' }} />
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-white/50 text-sm mt-1">Acceso exclusivo para personal autorizado</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] text-sm"
                  placeholder="admin@blackshieldgc.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-secondary)] font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-[var(--color-secondary)]/30 border-t-[var(--color-secondary)] rounded-full animate-spin" />}
              {loading ? 'Accediendo...' : 'Ingresar'}
            </button>
          </form>
        </div>
        <p className="text-center text-white/20 text-xs mt-6">Acceso restringido. Conexión segura.</p>
      </div>
    </div>
  )
}
