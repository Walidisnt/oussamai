'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  Calendar,
  Users,
  Wallet,
  Heart,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Wand2,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Suggestions de prompts
const quickPrompts = [
  { icon: Users, text: "Comment organiser le placement des tables ?", category: "Invités" },
  { icon: Wallet, text: "Comment optimiser mon budget mariage ?", category: "Budget" },
  { icon: Calendar, text: "Quel est le timing idéal pour le jour J ?", category: "Planning" },
  { icon: Heart, text: "Idées originales pour la décoration", category: "Déco" },
]

const suggestionCards = [
  {
    title: "Suggestions de placement",
    description: "Optimisez le placement de vos 150 invités avec l'IA",
    icon: Users,
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "Analyse du budget",
    description: "Détectez les économies potentielles",
    icon: Wallet,
    color: "from-green-400 to-green-600"
  },
  {
    title: "Idées créatives",
    description: "Générez des idées personnalisées pour votre thème",
    icon: Wand2,
    color: "from-purple-400 to-purple-600"
  },
  {
    title: "Checklist intelligente",
    description: "Tâches personnalisées selon votre date",
    icon: Calendar,
    color: "from-amber-400 to-amber-600"
  },
]

// Réponses simulées de l'IA
const aiResponses: Record<string, string> = {
  "placement": `## 💡 Suggestions pour le placement de vos tables

Basé sur votre liste de 150 invités, voici mes recommandations :

### Configuration optimale
- **15 tables de 10 personnes** ou **12 tables de 12 personnes**
- Table d'honneur de 8-10 places pour les mariés et témoins

### Conseils de placement
1. **Regroupez les familles** - Placez les familles proches ensemble tout en mélangeant les côtés
2. **Les amis proches près de vous** - Tables 1-3 pour vos meilleurs amis
3. **Évitez les conflits** - J'ai noté que les familles Dupont et Martin ne s'entendent pas, séparez-les
4. **Pensez aux enfants** - Créez une table enfants près de la sortie

### Action suggérée
Voulez-vous que je génère automatiquement un plan de placement optimal ?`,

  "budget": `## 💰 Analyse de votre budget mariage

### Résumé actuel
- **Budget total** : 35 000€
- **Dépensé** : 22 450€ (64%)
- **Restant** : 12 550€

### 🔍 Opportunités d'économies détectées

| Catégorie | Actuel | Suggestion | Économie |
|-----------|--------|------------|----------|
| Traiteur | 6 500€ | Menu cocktail + buffet | -800€ |
| Décoration | 2 500€ | DIY + récupération | -500€ |
| Faire-part | 400€ | E-invitations | -300€ |

**Total économies potentielles : 1 600€**

### ⚠️ Alertes
- Le poste "Lune de miel" (5 000€) n'est pas encore réservé
- Prévoyez 10% de marge pour les imprévus

### Recommandation
Avec les économies suggérées, vous pourriez améliorer la prestation photo/vidéo ou ajouter un photobooth !`,

  "timing": `## ⏰ Timing idéal pour votre jour J

Basé sur votre cérémonie à 14h et 150 invités :

### Programme recommandé

| Heure | Événement | Durée |
|-------|-----------|-------|
| 12:00 | Préparatifs finaux | 2h |
| 14:00 | **Cérémonie civile** | 45min |
| 15:00 | Déplacement + Photos | 1h |
| 16:00 | **Cocktail** | 2h |
| 18:00 | Entrée des mariés | 15min |
| 18:30 | **Dîner** | 2h30 |
| 21:00 | Ouverture de bal | 30min |
| 21:30 | **Soirée dansante** | 4h+ |

### 💡 Conseils timing
1. **Photos de groupe** : Faites-les pendant le cocktail
2. **Discours** : Max 3-4, entre les plats
3. **Gâteau** : Vers 22h30 pour un moment fort
4. **Bouquet** : Avant minuit pour garder l'énergie

Voulez-vous que j'ajoute ce programme à votre planning ?`,

  "default": `## 🤖 Je suis OussamAI, votre assistant mariage

Je suis là pour vous aider à planifier le mariage parfait ! Voici ce que je peux faire :

### Mes capacités
- 📊 **Analyser votre budget** et suggérer des optimisations
- 👥 **Optimiser le placement** de vos invités
- 📅 **Créer des plannings** personnalisés
- 💡 **Générer des idées** créatives
- ✅ **Gérer vos tâches** et rappels

### Comment puis-je vous aider aujourd'hui ?

Vous pouvez me poser des questions comme :
- "Comment réduire mon budget traiteur ?"
- "Suggère-moi des thèmes de mariage originaux"
- "Crée un planning pour les 3 prochains mois"

Je m'adapte à **votre mariage** avec Sarah & Thomas prévu le 15 septembre 2025 ! 🎊`
}

function getAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  if (message.includes('placement') || message.includes('table')) {
    return aiResponses.placement
  } else if (message.includes('budget') || message.includes('économi') || message.includes('argent')) {
    return aiResponses.budget
  } else if (message.includes('timing') || message.includes('horaire') || message.includes('planning') || message.includes('programme')) {
    return aiResponses.timing
  }
  return aiResponses.default
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simuler un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Ajouter la réponse de l'IA
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(content),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMessage])
    setIsTyping(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 animate-fade-in">
      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <CardHeader className="border-b border-gold-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Assistant OussamAI</CardTitle>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <RefreshCw size={18} className="mr-2" />
                Nouvelle conversation
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              /* État initial */
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 heading-serif mb-2">
                  Bienvenue sur OussamAI
                </h2>
                <p className="text-gray-500 max-w-md mb-8">
                  Votre assistant intelligent pour planifier le mariage parfait.
                  Posez-moi vos questions !
                </p>

                {/* Suggestions rapides */}
                <div className="grid grid-cols-2 gap-3 max-w-lg">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center gap-3 p-4 bg-champagne-50 hover:bg-champagne-100 rounded-xl text-left transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                        <prompt.icon className="w-5 h-5 text-gold-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gold-600 font-medium">{prompt.category}</p>
                        <p className="text-sm text-gray-700">{prompt.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Messages */
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-burgundy-500'
                      : 'bg-gradient-to-br from-gold-400 to-gold-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-burgundy-500 text-white rounded-tr-none'
                        : 'bg-champagne-50 text-gray-800 rounded-tl-none'
                    }`}>
                      {message.role === 'assistant' ? (
                        <div
                          className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-ul:text-gray-600 prose-table:text-sm"
                          dangerouslySetInnerHTML={{
                            __html: message.content
                              .replace(/## /g, '<h3 class="text-lg font-bold mt-4 mb-2">')
                              .replace(/### /g, '<h4 class="font-semibold mt-3 mb-1">')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n\n/g, '</p><p class="my-2">')
                              .replace(/\n/g, '<br/>')
                              .replace(/\| /g, '<td class="border px-2 py-1">')
                              .replace(/ \|/g, '</td>')
                          }}
                        />
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>

                    {/* Actions pour les messages IA */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                          <Copy size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-champagne-50 rounded-2xl rounded-tl-none p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gold-100 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-gold-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                <Send size={20} />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Sidebar avec suggestions */}
      <div className="w-80 space-y-4 hidden xl:block">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggestions IA</h3>

        {suggestionCards.map((card, index) => (
          <Card key={index} hover className="cursor-pointer group">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 group-hover:text-gold-600 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Astuce du jour */}
        <Card className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5" />
              <span className="font-medium">Astuce du jour</span>
            </div>
            <p className="text-sm text-white/90">
              Pensez à confirmer les prestataires 6 mois avant le mariage pour éviter les mauvaises surprises !
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
