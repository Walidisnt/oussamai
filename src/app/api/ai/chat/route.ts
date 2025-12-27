import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Contexte système pour l'assistant mariage
const SYSTEM_PROMPT = `Tu es OussamAI, un assistant intelligent spécialisé dans l'organisation de mariages.
Tu aides les couples à planifier leur mariage parfait en français.

Tes capacités :
- Conseiller sur le budget et proposer des optimisations
- Suggérer des idées de décoration, thèmes, et ambiances
- Aider au placement des invités
- Créer des timelines pour le jour J
- Répondre à toutes questions sur l'organisation de mariage

Règles :
- Sois chaleureux, professionnel et enthousiaste
- Donne des conseils pratiques et personnalisés
- Utilise des emojis avec modération pour rendre les réponses plus vivantes
- Structure tes réponses avec des titres markdown quand c'est pertinent
- Propose toujours des actions concrètes

Contexte du mariage (si disponible) : {context}`

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { message, weddingId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 })
    }

    // Vérifier le quota pour les utilisateurs gratuits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (user?.plan === 'FREE') {
      // Compter les messages du jour
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const messageCount = await prisma.aIMessage.count({
        where: {
          conversation: {
            wedding: {
              owners: { some: { id: user.id } }
            }
          },
          role: 'USER',
          createdAt: { gte: today }
        }
      })

      if (messageCount >= 5) {
        return NextResponse.json(
          { error: "Limite de 5 questions/jour atteinte. Passez à Premium pour un accès illimité !" },
          { status: 403 }
        )
      }
    }

    // Récupérer le contexte du mariage si disponible
    let context = "Aucun mariage sélectionné"
    if (weddingId) {
      const wedding = await prisma.wedding.findFirst({
        where: {
          id: weddingId,
          owners: { some: { email: session.user.email! } }
        },
        include: {
          guests: { select: { rsvpStatus: true } },
          tasks: { where: { completed: false }, take: 5 },
          budgetItems: { select: { estimatedCost: true, actualCost: true, paid: true } }
        }
      })

      if (wedding) {
        const confirmedGuests = wedding.guests.filter(g => g.rsvpStatus === 'CONFIRMED').length
        const totalBudget = wedding.budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0)
        const spentBudget = wedding.budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0)

        context = `
Mariage : ${wedding.name}
Date : ${wedding.date.toLocaleDateString('fr-FR')}
Lieu : ${wedding.venue || 'Non défini'}
Invités : ${confirmedGuests} confirmés sur ${wedding.guests.length} invités
Budget : ${spentBudget}€ dépensés sur ${totalBudget}€ prévus
Tâches en cours : ${wedding.tasks.map(t => t.title).join(', ') || 'Aucune'}
`
      }
    }

    // Si pas de clé OpenAI, utiliser des réponses prédéfinies
    if (!process.env.OPENAI_API_KEY) {
      const fallbackResponse = getFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT.replace('{context}', context) },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse."

    // Sauvegarder la conversation
    if (weddingId) {
      let conversation = await prisma.aIConversation.findFirst({
        where: { weddingId },
        orderBy: { updatedAt: 'desc' }
      })

      if (!conversation) {
        conversation = await prisma.aIConversation.create({
          data: { weddingId }
        })
      }

      await prisma.aIMessage.createMany({
        data: [
          { conversationId: conversation.id, role: 'USER', content: message },
          { conversationId: conversation.id, role: 'ASSISTANT', content: response }
        ]
      })
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Erreur AI chat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Réponses de fallback si OpenAI n'est pas configuré
function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('budget')) {
    return `## 💰 Conseils Budget

Voici mes recommandations pour optimiser votre budget :

1. **Lieu de réception** (30-40% du budget) - Négociez les dates hors saison
2. **Traiteur** (25-30%) - Comparez au moins 3 devis
3. **Photo/Vidéo** (10-15%) - Réservez tôt pour de meilleurs tarifs
4. **Décoration** (5-10%) - Le DIY peut vous faire économiser beaucoup !

💡 **Astuce** : Gardez toujours 10% de marge pour les imprévus.

Voulez-vous que je vous aide à détailler un poste en particulier ?`
  }

  if (msg.includes('placement') || msg.includes('table')) {
    return `## 🪑 Conseils Placement

Pour un placement réussi :

1. **Table d'honneur** - Mariés + témoins + parents
2. **Familles proches** - Tables 1-3
3. **Amis du couple** - Regroupez par affinités
4. **Collègues** - Une ou deux tables dédiées
5. **Table enfants** - Près de la sortie avec animation

⚠️ **À éviter** : Ne placez pas ensemble des personnes en conflit !

Voulez-vous que j'analyse votre liste d'invités pour des suggestions personnalisées ?`
  }

  if (msg.includes('timing') || msg.includes('planning') || msg.includes('jour j')) {
    return `## ⏰ Planning Type Jour J

| Heure | Événement |
|-------|-----------|
| 14h00 | Cérémonie |
| 15h30 | Vin d'honneur & Photos |
| 18h00 | Cocktail |
| 19h30 | Dîner |
| 22h00 | Ouverture du bal |
| 23h00 | Gâteau |
| 00h00+ | Soirée dansante |

💡 **Conseil** : Prévoyez 30 min de marge entre chaque moment !`
  }

  return `## 🤵👰 Bienvenue sur OussamAI !

Je suis votre assistant personnel pour organiser le mariage parfait.

Je peux vous aider avec :
- 💰 **Budget** - Optimisation et suivi des dépenses
- 👥 **Invités** - Gestion RSVP et placement
- 📅 **Planning** - Timeline du jour J
- 🎨 **Décoration** - Idées et inspiration
- 📋 **Tâches** - Check-list personnalisée

Posez-moi votre question et je vous guiderai !

*Pour des réponses personnalisées avec l'IA avancée, configurez votre clé OpenAI ou passez à Premium.*`
}
