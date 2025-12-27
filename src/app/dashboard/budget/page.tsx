'use client'

import { useState } from 'react'
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  PieChart,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Download,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Progress from '@/components/ui/Progress'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BUDGET_CATEGORY_LABELS, type BudgetCategory } from '@/types'

interface BudgetItem {
  id: string
  name: string
  category: BudgetCategory
  estimatedCost: number
  actualCost?: number
  paid: boolean
  paidDate?: string
  vendor?: string
  notes?: string
}

// Données de démonstration
const mockBudgetItems: BudgetItem[] = [
  { id: '1', name: 'Château de Versailles', category: 'VENUE', estimatedCost: 8000, actualCost: 8500, paid: true, paidDate: '2024-12-01', vendor: 'Domaine Royal' },
  { id: '2', name: 'Traiteur Menu Gastronomique', category: 'CATERING', estimatedCost: 6500, actualCost: 6200, paid: false, vendor: 'Chef Dubois' },
  { id: '3', name: 'Photographe & Vidéaste', category: 'PHOTOGRAPHY', estimatedCost: 3500, actualCost: 3500, paid: true, paidDate: '2024-11-15', vendor: 'Studio Lumière' },
  { id: '4', name: 'Décoration florale', category: 'FLOWERS', estimatedCost: 2500, paid: false, vendor: 'Fleurs de Paris' },
  { id: '5', name: 'DJ & Sonorisation', category: 'MUSIC_DJ', estimatedCost: 1500, paid: false },
  { id: '6', name: 'Robe de mariée', category: 'ATTIRE_BRIDE', estimatedCost: 2000, actualCost: 2200, paid: true, paidDate: '2024-10-20', vendor: 'Pronuptia' },
  { id: '7', name: 'Costume marié', category: 'ATTIRE_GROOM', estimatedCost: 800, actualCost: 850, paid: true, paidDate: '2024-11-01' },
  { id: '8', name: 'Alliances', category: 'WEDDING_RINGS', estimatedCost: 1200, actualCost: 1400, paid: true, paidDate: '2024-12-10', vendor: 'Cartier' },
  { id: '9', name: 'Faire-part', category: 'INVITATIONS', estimatedCost: 400, paid: false },
  { id: '10', name: 'Coiffure & Maquillage', category: 'BEAUTY', estimatedCost: 500, paid: false },
  { id: '11', name: 'Transport invités', category: 'TRANSPORTATION', estimatedCost: 800, paid: false },
  { id: '12', name: 'Gâteau de mariage', category: 'CATERING', estimatedCost: 600, paid: false, vendor: 'Pâtisserie Royale' },
  { id: '13', name: 'Lune de miel Maldives', category: 'HONEYMOON', estimatedCost: 5000, paid: false },
]

// Couleurs par catégorie
const categoryColors: Record<BudgetCategory, string> = {
  VENUE: '#3B82F6',
  CATERING: '#10B981',
  PHOTOGRAPHY: '#8B5CF6',
  VIDEOGRAPHY: '#6366F1',
  MUSIC_DJ: '#F59E0B',
  FLOWERS: '#EC4899',
  DECORATION: '#F97316',
  ATTIRE_BRIDE: '#14B8A6',
  ATTIRE_GROOM: '#06B6D4',
  BEAUTY: '#D946EF',
  INVITATIONS: '#84CC16',
  TRANSPORTATION: '#64748B',
  ACCOMMODATION: '#7C3AED',
  WEDDING_RINGS: '#D4A420',
  GIFTS: '#EF4444',
  HONEYMOON: '#0EA5E9',
  OTHER: '#6B7280',
}

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>(mockBudgetItems)
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | 'ALL'>('ALL')
  const [filterPaid, setFilterPaid] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Calculs
  const totalEstimated = items.reduce((sum, item) => sum + item.estimatedCost, 0)
  const totalActual = items.reduce((sum, item) => sum + (item.actualCost || 0), 0)
  const totalPaid = items.filter(i => i.paid).reduce((sum, item) => sum + (item.actualCost || item.estimatedCost), 0)
  const remaining = totalEstimated - totalPaid

  // Grouper par catégorie pour le graphique
  const categoryTotals = Object.keys(BUDGET_CATEGORY_LABELS).map(cat => {
    const categoryItems = items.filter(i => i.category === cat)
    const estimated = categoryItems.reduce((sum, i) => sum + i.estimatedCost, 0)
    const actual = categoryItems.reduce((sum, i) => sum + (i.actualCost || 0), 0)
    return {
      category: cat as BudgetCategory,
      label: BUDGET_CATEGORY_LABELS[cat as BudgetCategory],
      estimated,
      actual,
      color: categoryColors[cat as BudgetCategory],
    }
  }).filter(c => c.estimated > 0)

  // Filtrage
  const filteredItems = items.filter(item => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false
    if (filterPaid === 'PAID' && !item.paid) return false
    if (filterPaid === 'UNPAID' && item.paid) return false
    return true
  })

  const togglePaid = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, paid: !item.paid, paidDate: !item.paid ? new Date().toISOString().split('T')[0] : undefined }
        : item
    ))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 heading-serif">Gestion du budget</h1>
          <p className="text-gray-500 mt-1">Suivez vos dépenses et restez dans votre budget</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Ajouter une dépense
          </Button>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gold-50 to-champagne-100 border-gold-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 text-gold-500" />
              <Badge variant="gold">Budget total</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalEstimated)}</p>
            <p className="text-sm text-gray-500 mt-1">Estimé</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <Badge variant="success">Payé</Badge>
            </div>
            <p className="text-3xl font-bold text-green-700">{formatCurrency(totalPaid)}</p>
            <p className="text-sm text-gray-500 mt-1">{Math.round((totalPaid / totalEstimated) * 100)}% du budget</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <Badge variant="warning">Restant</Badge>
            </div>
            <p className="text-3xl font-bold text-amber-700">{formatCurrency(remaining)}</p>
            <p className="text-sm text-gray-500 mt-1">À payer</p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${totalActual > totalEstimated ? 'from-red-50 to-rose-100 border-red-200' : 'from-blue-50 to-indigo-100 border-blue-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              {totalActual > totalEstimated ? (
                <TrendingUp className="w-8 h-8 text-red-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-blue-500" />
              )}
              <Badge variant={totalActual > totalEstimated ? 'danger' : 'info'}>
                {totalActual > totalEstimated ? 'Dépassement' : 'Économies'}
              </Badge>
            </div>
            <p className={`text-3xl font-bold ${totalActual > totalEstimated ? 'text-red-700' : 'text-blue-700'}`}>
              {formatCurrency(Math.abs(totalEstimated - totalActual))}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {totalActual > totalEstimated ? 'Au-dessus du budget' : 'Sous le budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="text-gold-500" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTotals.slice(0, 8).map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-sm text-gray-600">{cat.label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {formatCurrency(cat.estimated)}
                    </span>
                  </div>
                  <Progress
                    value={(cat.estimated / totalEstimated) * 100}
                    size="sm"
                    className="mb-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Liste des dépenses */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  options={[
                    { value: 'ALL', label: 'Toutes les catégories' },
                    ...Object.entries(BUDGET_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
                  ]}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as BudgetCategory | 'ALL')}
                  className="w-56"
                />
                <Select
                  options={[
                    { value: 'ALL', label: 'Tous les statuts' },
                    { value: 'PAID', label: 'Payé' },
                    { value: 'UNPAID', label: 'Non payé' },
                  ]}
                  value={filterPaid}
                  onChange={(e) => setFilterPaid(e.target.value as 'ALL' | 'PAID' | 'UNPAID')}
                  className="w-40"
                />
              </div>
            </CardContent>
          </Card>

          {/* Table des dépenses */}
          <Card>
            <CardHeader>
              <CardTitle>Détail des dépenses ({filteredItems.length})</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-champagne-50 border-b border-gold-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Dépense</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Catégorie</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Estimé</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Réel</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Statut</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-champagne-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {item.vendor && (
                            <p className="text-sm text-gray-500">{item.vendor}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: categoryColors[item.category] }}
                          />
                          <span className="text-sm text-gray-600">
                            {BUDGET_CATEGORY_LABELS[item.category]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-800">{formatCurrency(item.estimatedCost)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.actualCost ? (
                          <span className={item.actualCost > item.estimatedCost ? 'text-red-600' : 'text-green-600'}>
                            {formatCurrency(item.actualCost)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePaid(item.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            item.paid
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {item.paid ? (
                            <>
                              <CheckCircle2 size={14} />
                              Payé
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              À payer
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune dépense trouvée</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal d'ajout */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter une dépense"
        size="md"
      >
        <form className="space-y-4">
          <Input label="Nom de la dépense" placeholder="Ex: Traiteur" required />
          <Select
            label="Catégorie"
            options={Object.entries(BUDGET_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
            placeholder="Sélectionner une catégorie"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Coût estimé" type="number" placeholder="0.00" required />
            <Input label="Coût réel" type="number" placeholder="0.00" />
          </div>
          <Input label="Prestataire" placeholder="Nom du prestataire" />
          <Input label="Notes" placeholder="Notes additionnelles..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gold-300 text-gold-500 focus:ring-gold-500" />
            <span>Marquer comme payé</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
