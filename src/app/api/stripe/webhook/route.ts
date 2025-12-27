import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error("Erreur webhook signature:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await prisma.user.update({
            where: { stripeCustomerId: session.customer as string },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              plan: "PREMIUM",
            },
          })
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          await prisma.user.update({
            where: { stripeCustomerId: invoice.customer as string },
            data: {
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              plan: "PREMIUM",
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: "FREE",
          },
        })
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erreur traitement webhook:", error)
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 })
  }
}
