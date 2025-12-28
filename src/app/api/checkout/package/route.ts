import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

// Définition des forfaits
const PACKAGES: Record<string, {
  name: string
  price: number
  guestLimit: number
  includesAI: boolean
  includesEmails: boolean
  includesSupport: boolean
  includesPlanner: boolean
}> = {
  essentiel: {
    name: 'Essentiel',
    price: 990,
    guestLimit: 100,
    includesAI: true,
    includesEmails: false,
    includesSupport: false,
    includesPlanner: false,
  },
  premium: {
    name: 'Premium',
    price: 2990,
    guestLimit: 200,
    includesAI: true,
    includesEmails: true,
    includesSupport: true,
    includesPlanner: false,
  },
  luxe: {
    name: 'Luxe',
    price: 7990,
    guestLimit: 999999,
    includesAI: true,
    includesEmails: true,
    includesSupport: true,
    includesPlanner: true,
  },
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { packageId, paymentType, installments, weddingId } = await req.json()

    // Vérifier le package
    const pkg = PACKAGES[packageId]
    if (!pkg) {
      return NextResponse.json({ error: "Forfait invalide" }, { status: 400 })
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier que Stripe est configuré
    if (!stripe) {
      return NextResponse.json({ error: "Paiement non configuré" }, { status: 500 })
    }

    // Créer ou récupérer le client Stripe
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Créer le mariage si pas encore créé
    let wedding
    if (weddingId) {
      wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, owners: { some: { id: user.id } } }
      })
    }

    if (!wedding) {
      wedding = await prisma.wedding.create({
        data: {
          name: "Mon Mariage",
          date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Dans 1 an
          partner1Name: user.name || "Partenaire 1",
          partner2Name: "Partenaire 2",
          guestLimit: pkg.guestLimit,
          owners: { connect: { id: user.id } }
        }
      })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oussamai.vercel.app'

    if (paymentType === 'full') {
      // PAIEMENT UNIQUE
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `OussamAI - Forfait ${pkg.name}`,
              description: `Forfait mariage complet avec ${pkg.guestLimit === 999999 ? 'invités illimités' : `${pkg.guestLimit} invités max`}`,
            },
            unit_amount: pkg.price * 100, // En centimes
          },
          quantity: 1,
        }],
        success_url: `${appUrl}/dashboard?payment=success&package=${packageId}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
          weddingId: wedding.id,
          packageId,
          paymentType: 'full',
        },
      })

      // Créer le package en base
      await prisma.weddingPackage.create({
        data: {
          name: pkg.name,
          totalPrice: pkg.price,
          paymentType: 'FULL',
          status: 'PENDING',
          guestLimit: pkg.guestLimit,
          includesAI: pkg.includesAI,
          includesEmails: pkg.includesEmails,
          includesSupport: pkg.includesSupport,
          includesPlanner: pkg.includesPlanner,
          weddingId: wedding.id,
        }
      })

      return NextResponse.json({ url: checkoutSession.url })

    } else if (paymentType === 'installments') {
      // PAIEMENT EN PLUSIEURS FOIS
      const nbInstallments = Number(installments) || 6
      const installmentAmount = Math.ceil(pkg.price / nbInstallments)
      const depositAmount = installmentAmount // Première échéance = acompte

      // Créer la première session de paiement (acompte)
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `OussamAI - Forfait ${pkg.name} (Acompte)`,
              description: `Première échéance sur ${nbInstallments} - Total: ${pkg.price}€`,
            },
            unit_amount: depositAmount * 100,
          },
          quantity: 1,
        }],
        success_url: `${appUrl}/dashboard?payment=success&package=${packageId}&installments=${nbInstallments}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
        metadata: {
          userId: user.id,
          weddingId: wedding.id,
          packageId,
          paymentType: 'installments',
          installmentsCount: nbInstallments.toString(),
          installmentNumber: '1',
        },
        // Sauvegarder la carte pour les paiements futurs
        payment_intent_data: {
          setup_future_usage: 'off_session',
        },
      })

      // Créer le package en base
      const weddingPackage = await prisma.weddingPackage.create({
        data: {
          name: pkg.name,
          totalPrice: pkg.price,
          depositAmount,
          paymentType: 'INSTALLMENTS',
          installmentsCount: nbInstallments,
          installmentAmount,
          status: 'PENDING',
          guestLimit: pkg.guestLimit,
          includesAI: pkg.includesAI,
          includesEmails: pkg.includesEmails,
          includesSupport: pkg.includesSupport,
          includesPlanner: pkg.includesPlanner,
          weddingId: wedding.id,
        }
      })

      // Créer les échéances
      const today = new Date()
      for (let i = 1; i <= nbInstallments; i++) {
        const dueDate = new Date(today)
        dueDate.setMonth(dueDate.getMonth() + i - 1)

        await prisma.payment.create({
          data: {
            amount: installmentAmount,
            type: i === 1 ? 'DEPOSIT' : 'INSTALLMENT',
            status: 'PENDING',
            dueDate,
            installmentNumber: i,
            packageId: weddingPackage.id,
          }
        })
      }

      return NextResponse.json({ url: checkoutSession.url })

    } else {
      return NextResponse.json({ error: "Type de paiement invalide" }, { status: 400 })
    }

  } catch (error) {
    console.error("Erreur checkout package:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
