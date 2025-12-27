import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendRsvpConfirmationEmail } from "@/lib/email"

// GET - Récupérer les infos de l'invité via son token
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    const guest = await prisma.guest.findUnique({
      where: { rsvpToken: token },
      include: {
        wedding: {
          select: {
            name: true,
            date: true,
            venue: true,
            venueAddress: true,
            partner1Name: true,
            partner2Name: true,
          }
        }
      }
    })

    if (!guest) {
      return NextResponse.json({ error: "Invitation non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      rsvpStatus: guest.rsvpStatus,
      plusOne: guest.plusOne,
      plusOneName: guest.plusOneName,
      dietaryRestrictions: guest.dietaryRestrictions,
      wedding: guest.wedding,
    })
  } catch (error) {
    console.error("Erreur GET RSVP:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Soumettre la réponse RSVP
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    const body = await req.json()

    const guest = await prisma.guest.findUnique({
      where: { rsvpToken: token },
      include: { wedding: true }
    })

    if (!guest) {
      return NextResponse.json({ error: "Invitation non trouvée" }, { status: 404 })
    }

    // Mettre à jour le guest
    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpStatus: body.rsvpStatus,
        rsvpDate: new Date(),
        plusOneConfirmed: body.plusOneConfirmed || false,
        plusOneName: body.plusOneName || null,
        dietaryRestrictions: body.dietaryRestrictions || null,
        notes: body.notes || null,
      }
    })

    // Envoyer email de confirmation si email disponible
    if (guest.email) {
      await sendRsvpConfirmationEmail(
        guest.email,
        `${guest.firstName} ${guest.lastName}`,
        guest.wedding.name,
        guest.wedding.date,
        body.rsvpStatus
      )
    }

    return NextResponse.json({ success: true, guest: updatedGuest })
  } catch (error) {
    console.error("Erreur POST RSVP:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
