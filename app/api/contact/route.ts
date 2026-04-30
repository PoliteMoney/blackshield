import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, company, subject, message, locale } = body

    if (!full_name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic honeypot / spam check
    if (body.website) {
      return NextResponse.json({ ok: true }) // Silently ignore spam
    }

    const supabase = createAdminClient()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || ''

    const { error } = await supabase.from('contact_messages').insert({
      full_name, email, phone, company, subject, message, locale,
      ip_address: ip,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
