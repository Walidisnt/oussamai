'use client'

import { useState } from 'react'
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  Wallet,
  TrendingUp,
  CheckCircle2,
  ListTodo,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

// Données de démonstration
const mockStats = {
  totalGuests: 150,
  confirmedGuests: 98,
  pendingGuests: 42,
  declinedGuests: 10,
  totalBudget: 35000,
  spentBudget: 22450,
  remainingBudget: 12550,
  completedTasks: 24,
  totalTasks: 45,
  daysUntilWedding: 263,
}

const upcomingTasks = [
  { id: 1, title: 'Confirmer le traiteur', dueDate: '2025-01-15', priority: 'HIGH' as const },
  { id: 2, title: 'Envoyer les faire-part', dueDate: '2025-01-20', priority: 'URGENT' as const },
  { id: 3, title: 'Essayage robe de mariée', dueDate: '2025-01-25', priority: 'MEDIUM' as const },
  { id: 4, title: 'Réserver le DJ', dueDate: '2025-02-01', priority: 'HIGH' as const },
]

const recentActivity = [
  { id: 1, action: 'Marie Dupont a confirmé sa présence', time: 'Il y a 2 heures' },
  { id: 2, action: 'Paiement effectué: Fleuriste (1500€)', time: 'Il y a 5 heures' },
  { id: 3, action: 'Jean Martin a décliné l\'invitation', time: 'Hier' },
  { id: 4, action: 'Nouvelle photo ajoutée à la galerie', time: 'Hier' },
]

const priorityColors = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
} as const

export default function DashboardPage() {
  const [aiTip] = useState("💡 Conseil IA: D'après vos invités confirmés, je recommande de prévoir 12 tables de 8 personnes pour optimiser l'espace.")

  const budgetProgress = (mockStats.spentBudget / mockStats.totalBudget) * 100
  const tasksProgress = (mockStats.completedTasks / mockStats.totalTasks) * 100
  const guestsProgress = (mockStats.confirmedGuests / mockStats.totalGuests) * 100

  return (
    <div className="space-y-8 animate-fade-in">
      {/* En-tête avec compteur */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-burgundy-500 via-burgundy-600 to-burgundy-700 p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 mb-2">Compte à rebours</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold heading-serif">{mockStats.daysUntilWedding}</span>
              <span className="text-2xl text-white/80">jours</span>
            </div>
            <p className="mt-2 text-white/80 text-lg">
              15 Septembre 2025 • Château de Versailles
            </p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-16 h-16 text-rose-300" fill="currentColor" />
            </div>
            <p className="mt-3 text-lg font-medium heading-script text-3xl">Sarah & Thomas</p>
          </div>
        </div>
      </div>

      {/* Conseil IA */}
      <div className="bg-gradient-to-r from-gold-50 to-champagne-100 border border-gold-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="text-gray-700 flex-1">{aiTip}</p>
        <Button variant="outline" size="sm">
          En savoir plus
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Invités */}
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="success">{mockStats.confirmedGuests} confirmés</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-800">{mockStats.totalGuests}</p>
            <p className="text-sm text-gray-500 mt-1">Invités au total</p>
            <Progress value={guestsProgress} className="mt-4" size="sm" />
          </CardContent>
        </Card>

        {/* Budget */}
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="gold">{Math.round(budgetProgress)}% utilisé</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(mockStats.spentBudget)}</p>
            <p className="text-sm text-gray-500 mt-1">sur {formatCurrency(mockStats.totalBudget)}</p>
            <Progress
              value={budgetProgress}
              className="mt-4"
              size="sm"
              variant={budgetProgress > 90 ? 'danger' : budgetProgress > 75 ? 'warning' : 'gold'}
            />
          </CardContent>
        </Card>

        {/* Tâches */}
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="info">{mockStats.totalTasks - mockStats.completedTasks} restantes</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-800">{mockStats.completedTasks}/{mockStats.totalTasks}</p>
            <p className="text-sm text-gray-500 mt-1">Tâches complétées</p>
            <Progress value={tasksProgress} className="mt-4" size="sm" variant="success" />
          </CardContent>
        </Card>

        {/* RSVP */}
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <Badge variant="warning">{mockStats.pendingGuests} en attente</Badge>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-500" />
                <span className="text-lg font-semibold">{mockStats.confirmedGuests}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-red-500" />
                <span className="text-lg font-semibold">{mockStats.declinedGuests}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">Réponses RSVP</p>
          </CardContent>
        </Card>
      </div>

      {/* Grille secondaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tâches à venir */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prochaines tâches</CardTitle>
            <Button variant="ghost" size="sm">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-champagne-50 rounded-xl hover:bg-champagne-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gold-300 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={priorityColors[task.priority]} size="sm">
                    {task.priority === 'URGENT' ? 'Urgent' :
                     task.priority === 'HIGH' ? 'Haute' :
                     task.priority === 'MEDIUM' ? 'Moyenne' : 'Basse'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activité récente</CardTitle>
            <Button variant="ghost" size="sm">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-4 bg-champagne-50 rounded-xl"
                >
                  <div className="w-2 h-2 bg-gold-500 rounded-full mt-2" />
                  <div>
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition du budget */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition du budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Lieu', amount: 8000, color: 'bg-blue-500' },
              { name: 'Traiteur', amount: 6500, color: 'bg-green-500' },
              { name: 'Photo/Vidéo', amount: 3500, color: 'bg-purple-500' },
              { name: 'Décoration', amount: 2500, color: 'bg-pink-500' },
              { name: 'Musique', amount: 1500, color: 'bg-amber-500' },
              { name: 'Fleurs', amount: 1200, color: 'bg-rose-500' },
              { name: 'Tenues', amount: 2800, color: 'bg-indigo-500' },
              { name: 'Autres', amount: 1450, color: 'bg-gray-500' },
            ].map((item) => (
              <div key={item.name} className="bg-champagne-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatCurrency(item.amount)}</p>
                <Progress
                  value={(item.amount / mockStats.totalBudget) * 100}
                  className="mt-2"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
