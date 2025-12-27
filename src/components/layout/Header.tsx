'use client'

import { Bell, Search, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  weddingName?: string
  weddingDate?: Date
}

export default function Header({ weddingName = 'Mon Mariage', weddingDate }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const daysUntilWedding = weddingDate
    ? Math.ceil((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gold-200/50 flex items-center justify-between px-8">
      {/* Titre et compte à rebours */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 heading-serif">{weddingName}</h2>
        {daysUntilWedding && daysUntilWedding > 0 && (
          <p className="text-sm text-gold-600">
            <span className="font-bold text-gold-500">{daysUntilWedding}</span> jours avant le grand jour
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 w-64 border border-gold-200 rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gold-50 rounded-full transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gold-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gold-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucune nouvelle notification
              </div>
            </div>
          )}
        </div>

        {/* Profil */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-gold-50 rounded-full transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gold-100 overflow-hidden z-50">
              <div className="p-2">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded-lg">Mon profil</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gold-50 rounded-lg">Paramètres</a>
                <hr className="my-2 border-gold-100" />
                <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Déconnexion</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
