'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  Image,
  MessageCircle,
  Settings,
  Heart,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invités', href: '/dashboard/guests', icon: Users },
  { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
  { name: 'Budget', href: '/dashboard/budget', icon: Wallet },
  { name: 'Galerie', href: '/dashboard/gallery', icon: Image },
  { name: 'Assistant IA', href: '/dashboard/ai-assistant', icon: Sparkles },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-gold-200/50 z-40">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gold-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold heading-serif text-gold-gradient">OussamAI</h1>
            <p className="text-[10px] text-gold-500 -mt-1">Votre mariage parfait</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white shadow-gold'
                  : 'text-gray-600 hover:bg-gold-50 hover:text-gold-600'
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Promo IA */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} />
            <span className="font-semibold">Assistant IA</span>
          </div>
          <p className="text-sm text-white/80 mb-3">
            Obtenez des suggestions personnalisées pour votre mariage
          </p>
          <Link
            href="/dashboard/ai-assistant"
            className="block text-center py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            Essayer maintenant
          </Link>
        </div>
      </div>
    </aside>
  )
}
