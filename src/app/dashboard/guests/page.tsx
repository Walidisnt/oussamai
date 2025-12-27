'use client'

import { useState } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MoreVertical,
  UserCheck,
  UserX,
  Clock,
  Edit2,
  Trash2,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { RSVP_LABELS, GUEST_GROUP_LABELS, type RSVPStatus, type GuestGroup } from '@/types'
import { getInitials } from '@/lib/utils'

interface Guest {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  rsvpStatus: RSVPStatus
  plusOne: boolean
  plusOneName?: string
  group: GuestGroup
  dietaryRestrictions?: string
  table?: string
}

// Données de démonstration
const mockGuests: Guest[] = [
  { id: '1', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@email.com', phone: '06 12 34 56 78', rsvpStatus: 'CONFIRMED', plusOne: true, plusOneName: 'Pierre Dupont', group: 'FAMILY_PARTNER1', table: 'Table 1' },
  { id: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', rsvpStatus: 'CONFIRMED', plusOne: false, group: 'FRIENDS_PARTNER1', table: 'Table 3' },
  { id: '3', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.b@email.com', phone: '06 98 76 54 32', rsvpStatus: 'PENDING', plusOne: true, group: 'FAMILY_PARTNER2' },
  { id: '4', firstName: 'Lucas', lastName: 'Petit', email: 'lucas.petit@email.com', rsvpStatus: 'DECLINED', plusOne: false, group: 'COLLEAGUES' },
  { id: '5', firstName: 'Emma', lastName: 'Robert', email: 'emma.r@email.com', rsvpStatus: 'MAYBE', plusOne: true, group: 'MUTUAL_FRIENDS', dietaryRestrictions: 'Végétarienne' },
  { id: '6', firstName: 'Thomas', lastName: 'Richard', email: 'thomas.r@email.com', rsvpStatus: 'CONFIRMED', plusOne: false, group: 'FRIENDS_PARTNER2', table: 'Table 2' },
  { id: '7', firstName: 'Camille', lastName: 'Durand', email: 'camille.d@email.com', rsvpStatus: 'PENDING', plusOne: true, plusOneName: 'Marc Durand', group: 'FAMILY_PARTNER1' },
  { id: '8', firstName: 'Alexandre', lastName: 'Moreau', email: 'alex.m@email.com', rsvpStatus: 'CONFIRMED', plusOne: false, group: 'COLLEAGUES', table: 'Table 4' },
]

const rsvpColors: Record<RSVPStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  DECLINED: 'danger',
  MAYBE: 'info',
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<RSVPStatus | 'ALL'>('ALL')
  const [filterGroup, setFilterGroup] = useState<GuestGroup | 'ALL'>('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  // Stats
  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus === 'CONFIRMED').length,
    pending: guests.filter(g => g.rsvpStatus === 'PENDING').length,
    declined: guests.filter(g => g.rsvpStatus === 'DECLINED').length,
    withPlusOne: guests.filter(g => g.plusOne).length,
  }

  // Filtrage
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || guest.rsvpStatus === filterStatus
    const matchesGroup = filterGroup === 'ALL' || guest.group === filterGroup
    return matchesSearch && matchesStatus && matchesGroup
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 heading-serif">Gestion des invités</h1>
          <p className="text-gray-500 mt-1">Gérez votre liste d'invités et suivez les RSVP</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload size={18} className="mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={18} className="mr-2" />
            Ajouter un invité
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-gold-500" />
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{stats.confirmed}</span>
            </div>
            <p className="text-sm text-gray-500">Confirmés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-600">{stats.pending}</span>
            </div>
            <p className="text-sm text-gray-500">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <UserX className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{stats.declined}</span>
            </div>
            <p className="text-sm text-gray-500">Déclinés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{stats.withPlusOne}</span>
            </div>
            <p className="text-sm text-gray-500">Avec +1</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[250px]">
              <Input
                placeholder="Rechercher un invité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <Select
              options={[
                { value: 'ALL', label: 'Tous les statuts' },
                { value: 'CONFIRMED', label: 'Confirmés' },
                { value: 'PENDING', label: 'En attente' },
                { value: 'DECLINED', label: 'Déclinés' },
                { value: 'MAYBE', label: 'Peut-être' },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RSVPStatus | 'ALL')}
              className="w-48"
            />
            <Select
              options={[
                { value: 'ALL', label: 'Tous les groupes' },
                ...Object.entries(GUEST_GROUP_LABELS).map(([value, label]) => ({ value, label }))
              ]}
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value as GuestGroup | 'ALL')}
              className="w-56"
            />
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des invités */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des invités ({filteredGuests.length})</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-champagne-50 border-b border-gold-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Invité</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Groupe</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">RSVP</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">+1</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Table</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-champagne-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-medium">
                        {getInitials(guest.firstName, guest.lastName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{guest.firstName} {guest.lastName}</p>
                        {guest.dietaryRestrictions && (
                          <p className="text-xs text-amber-600">🍽️ {guest.dietaryRestrictions}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {guest.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail size={14} /> {guest.email}
                        </p>
                      )}
                      {guest.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone size={14} /> {guest.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" size="sm">
                      {GUEST_GROUP_LABELS[guest.group]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rsvpColors[guest.rsvpStatus]}>
                      {RSVP_LABELS[guest.rsvpStatus]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {guest.plusOne ? (
                      <div>
                        <span className="text-green-600">✓ Oui</span>
                        {guest.plusOneName && (
                          <p className="text-xs text-gray-500">{guest.plusOneName}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {guest.table ? (
                      <Badge variant="gold" size="sm">{guest.table}</Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gold-600 hover:bg-gold-50 rounded-lg transition-colors">
                        <Send size={16} />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setSelectedGuest(guest)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun invité trouvé</p>
          </div>
        )}
      </Card>

      {/* Modal d'ajout */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un invité"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" placeholder="Prénom" required />
            <Input label="Nom" placeholder="Nom" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="email@exemple.com" />
            <Input label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
          </div>
          <Select
            label="Groupe"
            options={Object.entries(GUEST_GROUP_LABELS).map(([value, label]) => ({ value, label }))}
            placeholder="Sélectionner un groupe"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gold-300 text-gold-500 focus:ring-gold-500" />
              <span>Invité avec accompagnant (+1)</span>
            </label>
          </div>
          <Input label="Régimes alimentaires / Allergies" placeholder="Végétarien, sans gluten, etc." />
          <Input label="Notes" placeholder="Notes additionnelles..." />

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter l'invité
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
