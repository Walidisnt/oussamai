import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Prix des abonnements
export const PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    priceId: null,
    features: [
      'Jusqu\'à 50 invités',
      '1 mariage',
      'Assistant IA (5 questions/jour)',
      'Gestion budget de base',
      'Planning jour J',
    ],
    limits: {
      guests: 50,
      weddings: 1,
      aiQuestionsPerDay: 5,
    }
  },
  PREMIUM: {
    name: 'Premium',
    price: 19,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Invités illimités',
      'Mariages illimités',
      'Assistant IA illimité',
      'Envoi d\'invitations email',
      'Page RSVP personnalisée',
      'Export PDF',
      'Support prioritaire',
    ],
    limits: {
      guests: 999999,
      weddings: 999999,
      aiQuestionsPerDay: 999999,
    }
  },
  ENTERPRISE: {
    name: 'Entreprise',
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Tout Premium +',
      'Multi-utilisateurs',
      'API accès',
      'Marque blanche',
      'Account manager dédié',
    ],
    limits: {
      guests: 999999,
      weddings: 999999,
      aiQuestionsPerDay: 999999,
    }
  }
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
  })

  return customer
}

export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  return session
}
