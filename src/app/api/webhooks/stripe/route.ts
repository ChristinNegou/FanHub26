import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Stripe webhook verification and handling will be implemented in Sprint 2
  return NextResponse.json({ received: true });
}
