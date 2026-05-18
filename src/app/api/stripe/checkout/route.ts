import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, FEATURED_PRICE_CAD } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { barId, locale } = await request.json();
  if (!barId) {
    return NextResponse.json({ error: 'Missing barId' }, { status: 400 });
  }

  // Verify bar ownership
  const { data: bar } = await supabase
    .from('bars')
    .select('id, name, stripe_customer_id')
    .eq('id', barId)
    .eq('owner_id', user.id)
    .single();

  if (!bar) {
    return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const successUrl = `${appUrl}/${locale}/bar/dashboard?featured=success`;
  const cancelUrl = `${appUrl}/${locale}/bar/dashboard`;

  // Reuse existing Stripe customer or create a new one
  let customerId = bar.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id, bar_id: barId },
    });
    customerId = customer.id;
    await supabase.from('bars').update({ stripe_customer_id: customerId }).eq('id', barId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'FanHub26 — Bar en vedette',
            description: 'Votre bar apparaît en tête des résultats pendant 1 mois.',
          },
          unit_amount: FEATURED_PRICE_CAD,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: { bar_id: barId, locale: locale ?? 'fr' },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({ url: session.url });
}
