'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'

const PACKAGES: Record<string, {
  name: string
  price: number
  features: string[]
}> = {
  essentiel: {
    name: 'Essentiel',
    price: 990,
    features: [
      'Jusqu\'à 100 invités',
      'Gestion RSVP complète',
      'Planning jour J',
      'Suivi budget',
      'Assistant IA basique',
    ],
  },
  premium: {
    name: 'Premium',
    price: 2990,
    features: [
      'Jusqu\'à 200 invités',
      'Tout Essentiel +',
      'Assistant IA avancé illimité',
      'Envoi invitations email',
      'Coordination prestataires',
      'Support prioritaire 7j/7',
    ],
  },
  luxe: {
    name: 'Luxe',
    price: 7990,
    features: [
      'Invités illimités',
      'Tout Premium +',
      'Wedding planner dédié',
      'Coordination jour J sur place',
      'Gestion complète A à Z',
    ],
  },
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const packageId = params.packageId as string
  const paymentType = searchParams.get('type') || 'full'
  const installments = Number(searchParams.get('installments')) || 6

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pkg = PACKAGES[packageId]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout/' + packageId)
    }
  }, [status, router, packageId])

  if (!pkg) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Forfait non trouvé</h1>
          <Link href="/pricing" className="text-gold hover:underline">
            Retour aux tarifs
          </Link>
        </div>
      </div>
    )
  }

  const installmentAmount = Math.ceil(pkg.price / installments)

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          paymentType,
          installments,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError('Une erreur est survenue')
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-gold">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/pricing" className="text-gold hover:underline mb-4 inline-block">
            ← Retour aux tarifs
          </Link>
          <h1 className="text-4xl font-serif text-gray-900">Finaliser votre commande</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Récapitulatif */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Récapitulatif</h2>

            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Forfait {pkg.name}
                  </h3>
                  <p className="text-gray-500 text-sm">Organisation de mariage</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {pkg.price.toLocaleString('fr-FR')}€
                </span>
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mode de paiement */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Mode de paiement</h3>

              {paymentType === 'full' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-semibold text-green-800">Paiement unique</p>
                      <p className="text-sm text-green-600">Réglez la totalité aujourd'hui</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-blue-800">
                        Paiement en {installments}x sans frais
                      </p>
                      <p className="text-sm text-blue-600">
                        {installmentAmount}€/mois pendant {installments} mois
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{pkg.price.toLocaleString('fr-FR')}€</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">TVA (incluse)</span>
                <span className="font-semibold">{Math.round(pkg.price * 0.2 / 1.2).toLocaleString('fr-FR')}€</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {paymentType === 'full' ? 'Total à payer' : 'À payer aujourd\'hui'}
                  </span>
                  <span className="text-2xl font-bold text-gold">
                    {paymentType === 'full'
                      ? `${pkg.price.toLocaleString('fr-FR')}€`
                      : `${installmentAmount.toLocaleString('fr-FR')}€`
                    }
                  </span>
                </div>
                {paymentType === 'installments' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Puis {installments - 1} prélèvements de {installmentAmount}€
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Formulaire de paiement */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Paiement sécurisé</h2>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Vous allez être redirigé vers notre partenaire Stripe pour effectuer le paiement en toute sécurité.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8" />
                <span className="text-sm text-gray-500">Paiement 100% sécurisé</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>🔒</span>
                <span>Vos données sont chiffrées et protégées</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Redirection...
                </span>
              ) : (
                <>
                  Payer {paymentType === 'full'
                    ? `${pkg.price.toLocaleString('fr-FR')}€`
                    : `${installmentAmount.toLocaleString('fr-FR')}€`
                  }
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              En cliquant sur "Payer", vous acceptez nos{' '}
              <Link href="/terms" className="underline">Conditions générales</Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="underline">Politique de confidentialité</Link>
            </p>

            {/* Garanties */}
            <div className="mt-8 pt-6 border-t space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                Satisfait ou remboursé 14 jours
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                Support client disponible 7j/7
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                Annulation possible jusqu'à 30j avant le mariage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
