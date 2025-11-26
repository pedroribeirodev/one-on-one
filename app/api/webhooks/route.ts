import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Stripe webhook handler will be implemented here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const body = await req.text()
  
  // TODO: Verify Stripe webhook signature
  // TODO: Handle different event types
  
  return NextResponse.json({ received: true })
}
