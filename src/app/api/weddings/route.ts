import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET - Liste des mariages de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const weddings = await prisma.wedding.findMany({
      where: {
        owners: {
          some: {
            email: session.user.email!
          }
        }
      },
      include: {
        _count: {
          select: {
            guests: true,
            tasks: true,
            budgetItems: true,
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(weddings)
  } catch (error) {
    console.error("Erreur GET weddings:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Créer un nouveau mariage
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { partner1Name, partner2Name, date, venue, budgetTotal } = body

    if (!partner1Name || !partner2Name || !date) {
      return NextResponse.json(
        { error: "Informations manquantes" },
        { status: 400 }
      )
    }

    // Vérifier le plan de l'utilisateur (limite de mariages)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { weddings: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Plan FREE = 1 mariage max
    if (user.plan === 'FREE' && user.weddings.length >= 1) {
      return NextResponse.json(
        { error: "Passez à Premium pour gérer plusieurs mariages" },
        { status: 403 }
      )
    }

    const wedding = await prisma.wedding.create({
      data: {
        name: `Mariage de ${partner1Name} & ${partner2Name}`,
        partner1Name,
        partner2Name,
        date: new Date(date),
        venue: venue || null,
        budgetTotal: budgetTotal || 0,
        guestLimit: user.plan === 'FREE' ? 50 : 500,
        owners: {
          connect: { id: user.id }
        }
      }
    })

    // Créer les tâches par défaut
    const defaultTasks = [
      { title: "Définir le budget", category: "OTHER", priority: "HIGH" },
      { title: "Choisir la date", category: "OTHER", priority: "URGENT" },
      { title: "Réserver le lieu", category: "VENUE", priority: "URGENT" },
      { title: "Sélectionner le traiteur", category: "CATERING", priority: "HIGH" },
      { title: "Choisir le photographe", category: "PHOTOGRAPHY", priority: "HIGH" },
      { title: "Commander la robe/le costume", category: "ATTIRE", priority: "MEDIUM" },
      { title: "Envoyer les faire-part", category: "INVITATIONS", priority: "HIGH" },
      { title: "Organiser la lune de miel", category: "OTHER", priority: "LOW" },
    ]

    await prisma.task.createMany({
      data: defaultTasks.map(task => ({
        ...task,
        weddingId: wedding.id,
        priority: task.priority as any,
        category: task.category as any,
      }))
    })

    return NextResponse.json(wedding, { status: 201 })
  } catch (error) {
    console.error("Erreur POST wedding:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
