'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const PACKAGES = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    description: 'Pour les couples autonomes',
    price: 990,
    color: 'from-gray-400 to-gray-600',
    features: [
      'Jusqu\'à 100 invités',
      'Gestion RSVP complète',
      'Planning jour J',
      'Suivi budget',
      'Assistant IA basique',
      'Support email',
    ],
    notIncluded: [
      'Wedding planner dédié',
      'Aide au choix des prestataires',
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Notre best-seller',
    price: 2990,
    popular: true,
    color: 'from-gold to-gold-dark',
    features: [
      'Jusqu\'à 200 invités',
      'Tout Essentiel +',
      'Assistant IA avancé illimité',
      'Envoi invitations email',
      'Coordination prestataires',
      'Support prioritaire 7j/7',
      '2 appels conseil inclus',
    ],
    notIncluded: [
      'Wedding planner sur place',
    ]
  },
  {
    id: 'luxe',
    name: 'Luxe',
    description: 'Service complet clé en main',
    price: 7990,
    color: 'from-burgundy to-burgundy-dark',
    features: [
      'Invités illimités',
      'Tout Premium +',
      'Wedding planner dédié',
      'Coordination jour J sur place',
      'Négociation prestataires',
      'Gestion complète A à Z',
      'Répétition générale incluse',
      'Ligne directe 24/7',
    ],
    notIncluded: []
  },
  {
    id: 'sur-mesure',
    name: 'Sur-Mesure',
    description: 'Votre mariage unique',
    price: null,
    color: 'from-purple-600 to-purple-800',
    features: [
      'Devis personnalisé',
      'Services à la carte',
      'Mariage destination',
      'Événements multi-jours',
      'Équipe dédiée complète',
      'Concierge privé',
    ],
    notIncluded: []
  }
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [paymentType, setPaymentType] = useState<'full' | 'installments'>('full')
  const [installments, setInstallments] = useState(6)

  const calculateInstallment = (price: number) => {
    return Math.ceil(price / installments)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💒</span>
            </div>
            <span className="font-serif text-2xl text-gold-dark">OussamAI</span>
          </Link>
          <div className="flex gap-4">
            {session ? (
              <Link href="/dashboard" className="btn-primary">
                Mon Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary">
                  Commencer
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-serif text-gray-900 mb-4">
          Choisissez votre <span className="text-gold">forfait mariage</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Du simple outil d'organisation au service clé en main avec wedding planner dédié
        </p>

        {/* Payment Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setPaymentType('full')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              paymentType === 'full'
                ? 'bg-gold text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            💳 Paiement unique
          </button>
          <button
            onClick={() => setPaymentType('installments')}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              paymentType === 'installments'
                ? 'bg-gold text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📅 En plusieurs fois
          </button>
        </div>

        {/* Installments selector */}
        {paymentType === 'installments' && (
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className="text-gray-600">Payer en</span>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="px-4 py-2 border-2 border-gold rounded-lg font-semibold"
            >
              <option value={3}>3 fois</option>
              <option value={6}>6 fois</option>
              <option value={10}>10 fois</option>
              <option value={12}>12 fois</option>
            </select>
            <span className="text-gray-600">sans frais</span>
          </div>
        )}
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                pkg.popular ? 'ring-4 ring-gold scale-105 z-10' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gold text-white text-center py-2 text-sm font-semibold">
                  ⭐ LE PLUS POPULAIRE
                </div>
              )}

              <div className={`bg-gradient-to-br ${pkg.color} p-6 ${pkg.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-serif text-white mb-1">{pkg.name}</h3>
                <p className="text-white/80 text-sm">{pkg.description}</p>
              </div>

              <div className="p-6">
                {pkg.price ? (
                  <div className="mb-6">
                    {paymentType === 'full' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          {pkg.price.toLocaleString('fr-FR')}€
                        </span>
                        <span className="text-gray-500 ml-2">TTC</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          {calculateInstallment(pkg.price).toLocaleString('fr-FR')}€
                        </span>
                        <span className="text-gray-500 ml-2">/mois × {installments}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          Total: {pkg.price.toLocaleString('fr-FR')}€
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">Sur devis</span>
                  </div>
                )}

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                  {pkg.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 opacity-50">
                      <span className="text-gray-400 mt-0.5">✗</span>
                      <span className="text-gray-400 text-sm line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={session ? `/checkout/${pkg.id}?type=${paymentType}&installments=${installments}` : '/register'}
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {pkg.price ? 'Choisir ce forfait' : 'Nous contacter'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Option */}
      <section className="bg-gradient-to-r from-gold/10 to-burgundy/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
            Préférez-vous un abonnement mensuel ?
          </h2>
          <p className="text-gray-600 mb-8">
            Accédez à tous les outils pour organiser votre mariage vous-même, sans engagement.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-sm text-gold font-semibold mb-2">ABONNEMENT</div>
            <h3 className="text-2xl font-serif text-gray-900 mb-2">OussamAI Pro</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">19€</span>
              <span className="text-gray-500">/mois</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Accès complet aux outils + Assistant IA illimité<br/>
              Sans engagement - Résiliable à tout moment
            </p>
            <Link
              href={session ? '/dashboard/settings' : '/register'}
              className="block w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Commencer l'essai gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-center text-gray-900 mb-12">
          Questions fréquentes
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Comment fonctionne le paiement en plusieurs fois ?
            </h3>
            <p className="text-gray-600">
              Vous choisissez le nombre de mensualités (3, 6, 10 ou 12 mois) et payez la première échéance.
              Les prélèvements suivants sont automatiques, sans frais supplémentaires.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Puis-je passer d'un forfait à un autre ?
            </h3>
            <p className="text-gray-600">
              Oui ! Vous pouvez upgrader à tout moment. La différence sera calculée au prorata et vous
              pourrez la régler en une fois ou l'ajouter à vos mensualités.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Que se passe-t-il si j'annule mon mariage ?
            </h3>
            <p className="text-gray-600">
              Nous comprenons que les plans changent. Contactez-nous et nous trouverons une solution adaptée
              à votre situation. Les forfaits Luxe et Sur-Mesure incluent une garantie annulation.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Le wedding planner est-il vraiment dédié à mon mariage ?
            </h3>
            <p className="text-gray-600">
              Absolument ! Pour les forfaits Luxe et Sur-Mesure, vous avez un wedding planner attitré
              qui vous accompagne de A à Z, joignable par téléphone et présent le jour J.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-burgundy to-burgundy-dark py-16 text-center">
        <h2 className="text-3xl font-serif text-white mb-4">
          Prêt à organiser le mariage de vos rêves ?
        </h2>
        <p className="text-white/80 mb-8">
          Créez votre compte gratuitement et explorez nos forfaits
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-4 bg-white text-burgundy rounded-full font-semibold hover:shadow-xl transition"
        >
          Commencer maintenant →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
              <span className="text-white">💒</span>
            </div>
            <span className="font-serif text-xl">OussamAI</span>
          </div>
          <p className="text-gray-400">
            © 2024 OussamAI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
