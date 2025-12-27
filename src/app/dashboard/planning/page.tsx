'use client'

import { useState } from 'react'
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Flag,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Progress from '@/components/ui/Progress'
import { formatDate } from '@/lib/utils'
import { TASK_CATEGORY_LABELS, PRIORITY_LABELS, type Priority, type TaskCategory } from '@/types'

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  completed: boolean
  priority: Priority
  category: TaskCategory
}

interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime?: string
  location?: string
  type: string
  color: string
}

// Données de démonstration
const mockTasks: Task[] = [
  { id: '1', title: 'Confirmer le traiteur', description: 'Appeler M. Dubois pour confirmer le menu', dueDate: '2025-01-15', completed: false, priority: 'HIGH', category: 'CATERING' },
  { id: '2', title: 'Envoyer les faire-part', dueDate: '2025-01-20', completed: false, priority: 'URGENT', category: 'INVITATIONS' },
  { id: '3', title: 'Essayage robe de mariée', description: 'RDV chez Pronuptia à 14h', dueDate: '2025-01-25', completed: false, priority: 'MEDIUM', category: 'ATTIRE' },
  { id: '4', title: 'Réserver le DJ', dueDate: '2025-02-01', completed: false, priority: 'HIGH', category: 'MUSIC' },
  { id: '5', title: 'Choisir le photographe', dueDate: '2025-01-10', completed: true, priority: 'HIGH', category: 'PHOTOGRAPHY' },
  { id: '6', title: 'Commander les alliances', dueDate: '2025-01-05', completed: true, priority: 'URGENT', category: 'OTHER' },
  { id: '7', title: 'Réserver l\'hébergement famille', dueDate: '2025-02-15', completed: false, priority: 'MEDIUM', category: 'ACCOMMODATION' },
  { id: '8', title: 'Valider la décoration florale', dueDate: '2025-03-01', completed: false, priority: 'LOW', category: 'FLOWERS' },
]

const mockEvents: Event[] = [
  { id: '1', title: 'Cérémonie civile', date: '2025-09-15', startTime: '14:00', endTime: '15:00', location: 'Mairie du 8ème', type: 'CEREMONY', color: '#D4A420' },
  { id: '2', title: 'Cérémonie religieuse', date: '2025-09-15', startTime: '15:30', endTime: '16:30', location: 'Église Saint-Pierre', type: 'CEREMONY', color: '#D4A420' },
  { id: '3', title: 'Cocktail', date: '2025-09-15', startTime: '17:00', endTime: '19:00', location: 'Château de Versailles', type: 'COCKTAIL', color: '#FDA4AF' },
  { id: '4', title: 'Dîner', date: '2025-09-15', startTime: '19:30', endTime: '22:00', location: 'Château de Versailles', type: 'DINNER', color: '#722F37' },
  { id: '5', title: 'Soirée dansante', date: '2025-09-15', startTime: '22:00', endTime: '04:00', location: 'Château de Versailles', type: 'PARTY', color: '#8B5CF6' },
]

const priorityColors: Record<Priority, 'default' | 'info' | 'warning' | 'danger'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
}

export default function PlanningPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [events] = useState<Event[]>(mockEvents)
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'ALL'>('ALL')
  const [showCompleted, setShowCompleted] = useState(true)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const progress = (completedTasks / totalTasks) * 100

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.completed) return false
    if (filterCategory !== 'ALL' && task.category !== filterCategory) return false
    return true
  })

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  // Grouper les tâches par échéance
  const urgentTasks = filteredTasks.filter(t => !t.completed && t.priority === 'URGENT')
  const upcomingTasks = filteredTasks.filter(t => !t.completed && t.priority !== 'URGENT')
  const completedTasksList = filteredTasks.filter(t => t.completed)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 heading-serif">Planning & Tâches</h1>
          <p className="text-gray-500 mt-1">Organisez votre mariage étape par étape</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsAddEventModalOpen(true)}>
            <Calendar size={18} className="mr-2" />
            Nouvel événement
          </Button>
          <Button onClick={() => setIsAddTaskModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      {/* Progression globale */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Progression globale</h3>
              <p className="text-sm text-gray-500">{completedTasks} tâches sur {totalTasks} complétées</p>
            </div>
            <span className="text-3xl font-bold text-gold-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} size="lg" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tâches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  options={[
                    { value: 'ALL', label: 'Toutes les catégories' },
                    ...Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
                  ]}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'ALL')}
                  className="w-56"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="w-4 h-4 rounded border-gold-300 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="text-sm text-gray-600">Afficher les tâches terminées</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tâches urgentes */}
          {urgentTasks.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Flag size={20} />
                  Tâches urgentes ({urgentTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tâches à venir */}
          <Card>
            <CardHeader>
              <CardTitle>Tâches à venir ({upcomingTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-center text-gray-400 py-4">Aucune tâche à venir</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tâches terminées */}
          {showCompleted && completedTasksList.length > 0 && (
            <Card className="opacity-75">
              <CardHeader>
                <CardTitle className="text-gray-500">Tâches terminées ({completedTasksList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasksList.map((task) => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline du jour J */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-gold-500" />
                Programme du Jour J
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gold-600 font-medium mb-4">15 Septembre 2025</p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gold-200" />
                <div className="space-y-6">
                  {events.map((event, index) => (
                    <div key={event.id} className="relative pl-10">
                      <div
                        className="absolute left-2 w-5 h-5 rounded-full border-4 border-white"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="bg-champagne-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gold-600">
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        {event.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(TASK_CATEGORY_LABELS).slice(0, 6).map(([category, label]) => {
                  const categoryTasks = tasks.filter(t => t.category === category)
                  const completed = categoryTasks.filter(t => t.completed).length
                  const total = categoryTasks.length
                  if (total === 0) return null

                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(completed / total) * 100} className="w-20" size="sm" />
                        <span className="text-xs text-gray-500 w-12">{completed}/{total}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal ajout tâche */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Nouvelle tâche"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Titre de la tâche" placeholder="Ex: Confirmer le traiteur" required />
          <Input label="Description" placeholder="Détails supplémentaires..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date d'échéance" type="date" required />
            <Select
              label="Priorité"
              options={Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </div>
          <Select
            label="Catégorie"
            options={Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gold-100">
            <Button variant="outline" type="button" onClick={() => setIsAddTaskModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer la tâche</Button>
          </div>
        </form>
      </Modal>

      {/* Modal ajout événement */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Nouvel événement"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Titre de l'événement" placeholder="Ex: Cérémonie" required />
          <Input label="Date" type="date" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Heure de début" type="time" required />
            <Input label="Heure de fin" type="time" />
          </div>
          <Input label="Lieu" placeholder="Ex: Château de Versailles" />
          <Select
            label="Type d'événement"
            options={[
              { value: 'CEREMONY', label: 'Cérémonie' },
              { value: 'COCKTAIL', label: 'Cocktail' },
              { value: 'DINNER', label: 'Dîner' },
              { value: 'PARTY', label: 'Soirée' },
              { value: 'PHOTO_SESSION', label: 'Séance photo' },
              { value: 'OTHER', label: 'Autre' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gold-100">
            <Button variant="outline" type="button" onClick={() => setIsAddEventModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer l'événement</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// Composant TaskItem
function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        task.completed
          ? 'bg-gray-50 opacity-60'
          : 'bg-champagne-50 hover:bg-champagne-100'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gold-300 hover:border-gold-500'
        }`}
      >
        {task.completed && <CheckCircle2 size={16} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-gray-500 truncate">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={priorityColors[task.priority]} size="sm">
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        <Badge variant="gold" size="sm">
          {TASK_CATEGORY_LABELS[task.category]}
        </Badge>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Clock size={14} />
          {formatDate(task.dueDate, { day: 'numeric', month: 'short' })}
        </span>
      </div>

      <div className="flex gap-1">
        <button className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors">
          <Edit2 size={14} />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
