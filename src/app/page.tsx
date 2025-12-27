'use client'

import Link from 'next/link'
import {
  Heart,
  Sparkles,
  Users,
  Calendar,
  Wallet,
  Image,
  CheckCircle,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  {
    icon: Users,
    title: "Gestion des invités",
    description: "Gérez votre liste d'invités, suivez les RSVP et organisez le placement des tables en quelques clics."
  },
  {
    icon: Calendar,
    title: "Planning intelligent",
    description: "Créez votre timeline parfaite avec des tâches automatiques et des rappels personnalisés."
  },
  {
    icon: Wallet,
    title: "Suivi du budget",
    description: "Gardez le contrôle de vos dépenses avec des graphiques clairs et des alertes intelligentes."
  },
  {
    icon: Image,
    title: "Galerie partagée",
    description: "Centralisez toutes vos photos et vidéos dans un espace élégant et sécurisé."
  },
  {
    icon: Sparkles,
    title: "Assistant IA",
    description: "Obtenez des conseils personnalisés et des suggestions intelligentes pour chaque aspect de votre mariage."
  },
  {
    icon: Heart,
    title: "Design luxueux",
    description: "Profitez d'une interface élégante et raffinée, à l'image de votre grand jour."
  },
]

const testimonials = [
  {
    name: "Marie & Pierre",
    date: "Mariés en Juin 2024",
    text: "OussamAI a transformé notre organisation. L'assistant IA nous a fait économiser 3000€ sur notre budget !",
    avatar: "M"
  },
  {
    name: "Sophie & Thomas",
    date: "Mariés en Septembre 2024",
    text: "Le placement automatique des tables a été une révélation. Plus de disputes familiales !",
    avatar: "S"
  },
  {
    name: "Léa & Antoine",
    date: "Mariage prévu en 2025",
    text: "La galerie partagée permet à toute la famille de suivre les préparatifs. C'est magique !",
    avatar: "L"
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold heading-serif text-gold-gradient">OussamAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gold-600 transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gold-600 transition-colors">Témoignages</a>
            <a href="#pricing" className="text-gray-600 hover:text-gold-600 transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gold-600 transition-colors">
              Connexion
            </Link>
            <Link href="/dashboard">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 pattern-overlay" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gold-100/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-100/50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full text-gold-700 text-sm font-medium mb-8">
              <Sparkles size={16} />
              Propulsé par l'Intelligence Artificielle
            </div>

            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-bold heading-serif text-gray-800 mb-6 leading-tight">
              Créez le mariage de vos
              <span className="text-gold-gradient block">rêves avec l'IA</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              OussamAI est votre assistant intelligent pour organiser un mariage parfait.
              Gestion des invités, budget, planning et conseils personnalisés.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-10">
                  Démarrer gratuitement
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Play size={20} className="ml-1 text-gold-500" fill="currentColor" />
                </div>
                Voir la démo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-500">5000+</p>
                <p className="text-gray-500">Mariages organisés</p>
              </div>
              <div className="w-px h-12 bg-gold-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-500">98%</p>
                <p className="text-gray-500">Satisfaction</p>
              </div>
              <div className="w-px h-12 bg-gold-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-500">2500€</p>
                <p className="text-gray-500">Économie moyenne</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-ivory-100 via-transparent to-transparent z-10" />
            <div className="bg-white rounded-2xl shadow-2xl border border-gold-100 overflow-hidden mx-auto max-w-5xl">
              <div className="h-8 bg-gray-100 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-4 bg-gradient-luxury h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Heart size={48} className="mx-auto mb-4 text-gold-300" />
                  <p className="text-lg">Aperçu du dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold heading-serif text-gray-800 mb-4">
              Tout ce qu'il vous faut pour un mariage parfait
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour chaque étape de votre organisation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-champagne-50 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 bg-gradient-to-br from-burgundy-500 via-burgundy-600 to-burgundy-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-20 right-40 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-40 right-20 w-20 h-20 border border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6">
                <Sparkles size={16} />
                Intelligence Artificielle
              </div>
              <h2 className="text-4xl font-bold heading-serif mb-6">
                Un assistant IA qui comprend vos besoins
              </h2>
              <p className="text-xl text-white/80 mb-8">
                OussamAI analyse votre situation et vous propose des conseils personnalisés
                pour chaque aspect de votre mariage.
              </p>

              <ul className="space-y-4">
                {[
                  "Suggestions de placement optimisées",
                  "Analyse et optimisation du budget",
                  "Idées créatives personnalisées",
                  "Planning intelligent adaptatif",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-gold-400" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard/ai-assistant" className="inline-block mt-8">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-burgundy-600">
                  Essayer l'assistant IA
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">OussamAI</p>
                    <p className="text-xs text-white/60">Assistant IA</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/90">
                      💡 Je recommande de placer vos grands-parents à la table 2,
                      près de la piste de danse mais avec un accès facile à la sortie.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/90">
                      💰 Vous pourriez économiser 800€ en optant pour un cocktail
                      dînatoire plutôt qu'un repas assis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-champagne-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold heading-serif text-gray-800 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Des milliers de couples ont organisé leur mariage avec OussamAI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} className="text-gold-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold heading-serif text-white mb-6">
            Prêt à organiser le mariage de vos rêves ?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Rejoignez des milliers de couples heureux et commencez votre aventure aujourd'hui.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-gold-600 hover:bg-gray-100 text-lg px-10">
              Commencer gratuitement
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <p className="text-white/70 mt-4 text-sm">
            Pas de carte bancaire requise • Essai gratuit de 30 jours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-2xl font-bold heading-serif">OussamAI</span>
              </div>
              <p className="text-gray-400">
                L'assistant intelligent pour organiser le mariage parfait.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Témoignages</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gold-400 transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 OussamAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
