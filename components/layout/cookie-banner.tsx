'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

interface CookieBannerProps {
  dict: { message: string; policy: string; accept: string; decline: string }
}

export function CookieBanner({ dict }: CookieBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-fade-in">
      <div className="bg-[var(--color-secondary)] text-white rounded-lg p-5 shadow-2xl border border-white/10">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-white/80 leading-relaxed">
              {dict.message}{' '}
              <Link href="/cookies" className="text-[var(--color-primary)] hover:underline">
                {dict.policy}
              </Link>.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={accept}
                className="flex-1 py-2 bg-[var(--color-primary)] text-[var(--color-secondary)] text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                {dict.accept}
              </button>
              <button
                onClick={decline}
                className="flex-1 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
              >
                {dict.decline}
              </button>
            </div>
          </div>
          <button onClick={decline} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
