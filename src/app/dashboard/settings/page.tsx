'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Palette,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Camera,
  Save,
  Check
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'wedding', label: 'Mariage', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'billing', label: 'Abonnement', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 heading-serif">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez les paramètres de votre compte et de votre mariage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="h-fit">
          <CardContent className="py-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold-100 text-gold-700 font-medium'
                      : 'text-gray-600 hover:bg-champagne-50'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
              <hr className="my-4 border-gold-100" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={20} />
                Déconnexion
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profil */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Gérez vos informations de profil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-3xl font-bold">
                        ST
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gold-600 transition-colors">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Photo de profil</p>
                      <p className="text-sm text-gray-500">JPG, PNG ou GIF. Max 2 Mo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Prénom" defaultValue="Sarah" />
                    <Input label="Nom" defaultValue="Martin" />
                  </div>
                  <Input label="Email" type="email" defaultValue="sarah.martin@email.com" />
                  <Input label="Téléphone" type="tel" defaultValue="+33 6 12 34 56 78" />

                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      {saved ? <Check size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                      {saved ? 'Enregistré !' : 'Enregistrer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mariage */}
          {activeTab === 'wedding' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Informations du mariage</CardTitle>
                  <CardDescription>Détails de votre événement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nom du partenaire 1" defaultValue="Sarah" />
                      <Input label="Nom du partenaire 2" defaultValue="Thomas" />
                    </div>
                    <Input label="Date du mariage" type="date" defaultValue="2025-09-15" />
                    <Input label="Lieu de réception" defaultValue="Château de Versailles" />
                    <Input label="Adresse" defaultValue="Place d'Armes, 78000 Versailles" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Nombre d'invités max" type="number" defaultValue="150" />
                      <Input label="Budget total (€)" type="number" defaultValue="35000" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thème et couleurs</CardTitle>
                  <CardDescription>Personnalisez l'apparence de votre espace</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select
                      label="Thème du mariage"
                      options={[
                        { value: 'classic', label: 'Classique & Élégant' },
                        { value: 'romantic', label: 'Romantique' },
                        { value: 'bohemian', label: 'Bohème' },
                        { value: 'rustic', label: 'Champêtre' },
                        { value: 'modern', label: 'Moderne & Minimaliste' },
                      ]}
                      defaultValue="classic"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur principale
                      </label>
                      <div className="flex gap-3">
                        {['#D4A420', '#722F37', '#1E3A5F', '#2D5A3D', '#6B4C9A', '#C4878A'].map((color) => (
                          <button
                            key={color}
                            className="w-10 h-10 rounded-full border-4 border-white shadow-md hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { title: 'Réponses RSVP', description: 'Quand un invité confirme sa présence' },
                    { title: 'Rappels de tâches', description: 'Avant les échéances importantes' },
                    { title: 'Mises à jour budget', description: 'Quand un paiement est effectué' },
                    { title: 'Conseils IA', description: "Suggestions personnalisées de l'assistant" },
                    { title: 'Newsletter', description: 'Astuces et inspiration mariage' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b border-gold-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gold-300 text-gold-500 focus:ring-gold-500" />
                          <span className="text-sm text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={index < 3} className="w-4 h-4 rounded border-gold-300 text-gold-500 focus:ring-gold-500" />
                          <span className="text-sm text-gray-600">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apparence */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Personnalisation de l'interface</CardTitle>
                <CardDescription>Adaptez l'application à vos préférences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Mode d'affichage</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Clair', value: 'light' },
                        { label: 'Sombre', value: 'dark' },
                        { label: 'Système', value: 'system' },
                      ].map((mode) => (
                        <button
                          key={mode.value}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            mode.value === 'light'
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-gold-200 hover:border-gold-300'
                          }`}
                        >
                          <div className={`w-full h-20 rounded-lg mb-2 ${
                            mode.value === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                          }`} />
                          <p className="font-medium text-gray-800">{mode.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Select
                    label="Langue"
                    options={[
                      { value: 'fr', label: 'Français' },
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Español' },
                    ]}
                    defaultValue="fr"
                  />

                  <Select
                    label="Format de date"
                    options={[
                      { value: 'dd/mm/yyyy', label: 'JJ/MM/AAAA (15/09/2025)' },
                      { value: 'mm/dd/yyyy', label: 'MM/JJ/AAAA (09/15/2025)' },
                      { value: 'yyyy-mm-dd', label: 'AAAA-MM-JJ (2025-09-15)' },
                    ]}
                    defaultValue="dd/mm/yyyy"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sécurité */}
          {activeTab === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>Modifiez votre mot de passe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input label="Mot de passe actuel" type="password" />
                    <Input label="Nouveau mot de passe" type="password" />
                    <Input label="Confirmer le mot de passe" type="password" />
                    <Button>Mettre à jour le mot de passe</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                  <CardDescription>Ajoutez une couche de sécurité supplémentaire</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">2FA désactivée</p>
                      <p className="text-sm text-gray-500">Protégez votre compte avec l'authentification à deux facteurs</p>
                    </div>
                    <Button variant="outline">Activer</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Abonnement */}
          {activeTab === 'billing' && (
            <>
              <Card className="bg-gradient-to-br from-gold-400 to-gold-600 text-white">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 mb-1">Plan actuel</p>
                      <h3 className="text-2xl font-bold">OussamAI Premium</h3>
                      <p className="text-white/80">Accès illimité à toutes les fonctionnalités</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold">19€</p>
                      <p className="text-white/80">/mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Méthode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-champagne-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expire 12/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Modifier</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique de facturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Montant</th>
                        <th className="pb-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-100">
                      {[
                        { date: '01/12/2024', desc: 'Abonnement Premium', amount: '19,00€', status: 'Payé' },
                        { date: '01/11/2024', desc: 'Abonnement Premium', amount: '19,00€', status: 'Payé' },
                        { date: '01/10/2024', desc: 'Abonnement Premium', amount: '19,00€', status: 'Payé' },
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="py-3 text-gray-600">{row.date}</td>
                          <td className="py-3 text-gray-800">{row.desc}</td>
                          <td className="py-3 text-gray-800">{row.amount}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
