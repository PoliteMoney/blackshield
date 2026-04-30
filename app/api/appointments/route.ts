import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, company, appointment_type, duration, service_id, date, time, notes, locale } = body

    if (!full_name || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check for conflicts
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .not('status', 'eq', 'cancelled')

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 })
    }

    // Get service name
    let service_name = ''
    if (service_id) {
      const { data: srv } = await supabase
        .from('services_translations')
        .select('title')
        .eq('service_id', service_id)
        .eq('locale', locale || 'es')
        .single()
      service_name = srv?.title || ''
    }

    const { error } = await supabase.from('appointments').insert({
      full_name, email, phone, company, appointment_type, duration,
      service_id: service_id || null, service_name, date, time, notes, locale,
      status: 'pending',
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[appointments]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
