import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe, createCheckoutSession, createCustomer } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID requis" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Créer ou récupérer le customer Stripe
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await createCustomer(user.email, user.name || undefined)
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Créer la session de checkout
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      user.id
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Erreur checkout:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
