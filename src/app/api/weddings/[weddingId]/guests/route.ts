import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Liste des invités d'un mariage
export async function GET(
  req: NextRequest,
  { params }: { params: { weddingId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { weddingId } = params

    // Vérifier l'accès au mariage
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        owners: { some: { email: session.user.email! } }
      }
    })

    if (!wedding) {
      return NextResponse.json({ error: "Mariage non trouvé" }, { status: 404 })
    }

    const guests = await prisma.guest.findMany({
      where: { weddingId },
      include: { table: true },
      orderBy: { lastName: 'asc' }
    })

    return NextResponse.json(guests)
  } catch (error) {
    console.error("Erreur GET guests:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Ajouter un invité
export async function POST(
  req: NextRequest,
  { params }: { params: { weddingId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { weddingId } = params
    const body = await req.json()

    // Vérifier l'accès et les limites
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        owners: { some: { email: session.user.email! } }
      },
      include: {
        guests: true,
        owners: true
      }
    })

    if (!wedding) {
      return NextResponse.json({ error: "Mariage non trouvé" }, { status: 404 })
    }

    // Vérifier la limite d'invités selon le plan
    const currentCount = wedding.guests.length
    if (currentCount >= wedding.guestLimit) {
      return NextResponse.json(
        { error: `Limite de ${wedding.guestLimit} invités atteinte. Passez à Premium pour plus.` },
        { status: 403 }
      )
    }

    const guest = await prisma.guest.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email || null,
        phone: body.phone || null,
        group: body.group || 'OTHER',
        plusOne: body.plusOne || false,
        plusOneName: body.plusOneName || null,
        dietaryRestrictions: body.dietaryRestrictions || null,
        notes: body.notes || null,
        weddingId,
      }
    })

    return NextResponse.json(guest, { status: 201 })
  } catch (error) {
    console.error("Erreur POST guest:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
