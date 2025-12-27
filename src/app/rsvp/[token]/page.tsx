'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Heart, Check, X, Loader2, Calendar, MapPin, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface GuestData {
  id: string
  firstName: string
  lastName: string
  email: string
  rsvpStatus: string
  plusOne: boolean
  plusOneName: string | null
  dietaryRestrictions: string | null
  wedding: {
    name: string
    date: string
    venue: string | null
    venueAddress: string | null
    partner1Name: string
    partner2Name: string
  }
}

export default function RSVPPage() {
  const params = useParams()
  const token = params.token as string

  const [guest, setGuest] = useState<GuestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Formulaire
  const [response, setResponse] = useState<'CONFIRMED' | 'DECLINED' | null>(null)
  const [plusOneConfirmed, setPlusOneConfirmed] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [dietary, setDietary] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchGuest()
  }, [token])

  const fetchGuest = async () => {
    try {
      const res = await fetch(`/api/rsvp/${token}`)
      if (!res.ok) throw new Error('Invitation non trouvée')
      const data = await res.json()
      setGuest(data)
      setDietary(data.dietaryRestrictions || '')
      setPlusOneName(data.plusOneName || '')
    } catch (err) {
      setError('Cette invitation n\'existe pas ou a expiré.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!response) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/rsvp/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rsvpStatus: response,
          plusOneConfirmed: guest?.plusOne && response === 'CONFIRMED' ? plusOneConfirmed : false,
          plusOneName: plusOneConfirmed ? plusOneName : null,
          dietaryRestrictions: dietary || null,
          notes: message || null,
        })
      })

      if (!res.ok) throw new Error('Erreur lors de l\'envoi')

      setSubmitted(true)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    )
  }

  if (error || !guest) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invitation introuvable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const weddingDate = new Date(guest.wedding.date)
  const formattedDate = weddingDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-luxury flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 heading-serif mb-4">
            {response === 'CONFIRMED' ? 'Merci !' : 'Réponse enregistrée'}
          </h1>
          <p className="text-gray-600 text-lg">
            {response === 'CONFIRMED'
              ? 'Nous sommes ravis que vous puissiez être des nôtres !'
              : 'Nous avons bien reçu votre réponse. Vous serez dans nos pensées.'}
          </p>
          <div className="mt-8 pt-8 border-t border-gold-100">
            <p className="text-gold-600 font-medium">{guest.wedding.partner1Name} & {guest.wedding.partner2Name}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-luxury py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 heading-serif mb-2">
            {guest.wedding.name}
          </h1>
          <p className="text-xl text-gold-600 heading-script">
            {guest.wedding.partner1Name} & {guest.wedding.partner2Name}
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Infos mariage */}
          <div className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Vous êtes invité(e) !</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <Calendar className="w-6 h-6" />
                <div>
                  <p className="text-sm text-white/70">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              {guest.wedding.venue && (
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <MapPin className="w-6 h-6" />
                  <div>
                    <p className="text-sm text-white/70">Lieu</p>
                    <p className="font-medium">{guest.wedding.venue}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Bonjour {guest.firstName} {guest.lastName}
            </h3>
            <p className="text-gray-600 mb-8">
              Merci de nous confirmer votre présence pour ce jour si spécial.
            </p>

            {/* Choix RSVP */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setResponse('CONFIRMED')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  response === 'CONFIRMED'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-semibold text-gray-800">Je serai présent(e)</p>
                <p className="text-sm text-gray-500">J'ai hâte d'y être !</p>
              </button>

              <button
                onClick={() => setResponse('DECLINED')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  response === 'DECLINED'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <p className="font-semibold text-gray-800">Je ne pourrai pas venir</p>
                <p className="text-sm text-gray-500">Malheureusement...</p>
              </button>
            </div>

            {/* Options supplémentaires si confirmé */}
            {response === 'CONFIRMED' && (
              <div className="space-y-6 mb-8 animate-fade-in">
                {/* +1 */}
                {guest.plusOne && (
                  <div className="p-4 bg-champagne-50 rounded-xl">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={plusOneConfirmed}
                        onChange={(e) => setPlusOneConfirmed(e.target.checked)}
                        className="w-5 h-5 rounded border-gold-300 text-gold-500 focus:ring-gold-500"
                      />
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gold-500" />
                        <span className="font-medium text-gray-800">Je viens avec un accompagnant</span>
                      </div>
                    </label>
                    {plusOneConfirmed && (
                      <Input
                        placeholder="Nom de votre accompagnant"
                        value={plusOneName}
                        onChange={(e) => setPlusOneName(e.target.value)}
                      />
                    )}
                  </div>
                )}

                {/* Régime alimentaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Régimes alimentaires / Allergies
                  </label>
                  <Input
                    placeholder="Végétarien, sans gluten, allergies..."
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Un petit mot pour les mariés (optionnel)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gold-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                rows={3}
                placeholder="Félicitations ! Nous avons hâte de célébrer avec vous..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Bouton submit */}
            <Button
              className="w-full"
              disabled={!response || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Envoi en cours...
                </>
              ) : (
                'Confirmer ma réponse'
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Organisé avec ♥ via OussamAI
        </p>
      </div>
    </div>
  )
}
