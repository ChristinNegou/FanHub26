import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const FEATURED_PRICE_CAD = 4900; // 49.00 CAD in cents
