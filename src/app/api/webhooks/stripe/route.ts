import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const barId = session.metadata?.bar_id;
      const subscriptionId = session.subscription as string;
      if (!barId || !subscriptionId) break;

      const featuredUntil = new Date();
      featuredUntil.setMonth(featuredUntil.getMonth() + 1);

      await supabase.from('bars').update({
        is_featured: true,
        featured_until: featuredUntil.toISOString(),
        stripe_subscription_id: subscriptionId,
      }).eq('id', barId);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id;
      if (!subscriptionId) break;

      const featuredUntil = new Date();
      featuredUntil.setMonth(featuredUntil.getMonth() + 1);

      await supabase.from('bars')
        .update({ is_featured: true, featured_until: featuredUntil.toISOString() })
        .eq('stripe_subscription_id', subscriptionId);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('bars')
        .update({ is_featured: false, featured_until: null, stripe_subscription_id: null })
        .eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      if (sub.status !== 'active' && sub.status !== 'trialing') {
        await supabase.from('bars')
          .update({ is_featured: false })
          .eq('stripe_subscription_id', sub.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
