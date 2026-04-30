import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ booked: [] })

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('appointments')
    .select('time')
    .eq('date', date)
    .not('status', 'eq', 'cancelled')

  const booked = (data || []).map(r => (r.time as string).slice(0, 5))
  return NextResponse.json({ booked })
}
