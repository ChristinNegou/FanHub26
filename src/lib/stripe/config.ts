import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const STRIPE_PLANS = {
  featured: {
    priceId: '',
    amount: 4900,
    currency: 'cad',
    name: 'Featured',
  },
  premium: {
    priceId: '',
    amount: 9900,
    currency: 'cad',
    name: 'Premium',
  },
} as const;
