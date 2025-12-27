'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const passwordChecks = [
    { label: 'Au moins 8 caractères', valid: password.length >= 8 },
    { label: 'Une majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Un chiffre', valid: /[0-9]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validations
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setIsLoading(false)
      return
    }

    if (!passwordChecks.every(check => check.valid)) {
      setError('Le mot de passe ne respecte pas les critères')
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'inscription')
        return
      }

      // Connexion automatique après inscription
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/onboarding' })
  }

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Heart className="w-12 h-12 text-white" fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold heading-serif mb-4">
            Commencez gratuitement
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers de couples qui organisent leur mariage avec OussamAI
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
            <h3 className="font-semibold mb-4">Inclus dans la version gratuite :</h3>
            <ul className="space-y-3">
              {[
                'Jusqu\'à 50 invités',
                'Gestion du budget de base',
                'Planning du jour J',
                'Assistant IA (5 questions/jour)',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="text-3xl font-bold heading-serif text-gold-gradient">OussamAI</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 heading-serif mb-2">
            Créer votre compte
          </h1>
          <p className="text-gray-600 mb-8">
            Commencez à organiser le mariage de vos rêves
          </p>

          {/* Bouton Google */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            S'inscrire avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Nom complet"
              type="text"
              placeholder="Marie & Pierre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={18} />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Critères mot de passe */}
            {password && (
              <div className="space-y-1">
                {passwordChecks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      check.valid ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {check.valid && <Check size={10} className="text-white" />}
                    </div>
                    <span className={check.valid ? 'text-green-600' : 'text-gray-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Input
              label="Confirmer le mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gold-300 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm text-gray-600">
                J'accepte les{' '}
                <Link href="/terms" className="text-gold-600 hover:underline">
                  conditions d'utilisation
                </Link>
                {' '}et la{' '}
                <Link href="/privacy" className="text-gold-600 hover:underline">
                  politique de confidentialité
                </Link>
              </span>
            </label>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Création du compte...
                </>
              ) : (
                'Créer mon compte gratuit'
              )}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-gold-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
