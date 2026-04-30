import { NextRequest, NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/site-config'

// Stripe module - PREPARED but disabled by default
// Enable via Admin > Settings > Pagos > stripe_enabled = true

export async function POST(req: NextRequest) {
  const config = await getSiteConfig()

  if (config.stripe_enabled !== 'true') {
    return NextResponse.json({ error: 'Payments are not enabled' }, { status: 403 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    // Dynamic import to avoid errors when Stripe is not configured
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

    const body = await req.json()
    const { price_id, success_url, cancel_url, appointment_id } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      mode: 'payment',
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL}/agendar/success`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/agendar`,
      metadata: { appointment_id: appointment_id || '' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
