'use client'

import { useState, useCallback } from 'react'
import {
  Image as ImageIcon,
  Video,
  Upload,
  Download,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Filter,
  Grid,
  LayoutGrid,
  Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

interface MediaItem {
  id: string
  url: string
  thumbnail?: string
  type: 'IMAGE' | 'VIDEO'
  caption?: string
  tags: string[]
  uploadedBy: string
  createdAt: string
  liked: boolean
}

// Données de démonstration avec images Unsplash
const mockMedia: MediaItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', type: 'IMAGE', caption: 'Notre belle cérémonie', tags: ['cérémonie', 'église'], uploadedBy: 'Sarah', createdAt: '2024-12-15', liked: true },
  { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', type: 'IMAGE', caption: 'Échange des alliances', tags: ['alliances', 'cérémonie'], uploadedBy: 'Thomas', createdAt: '2024-12-15', liked: false },
  { id: '3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', type: 'IMAGE', caption: 'La décoration du lieu', tags: ['décoration', 'fleurs'], uploadedBy: 'Sarah', createdAt: '2024-12-14', liked: true },
  { id: '4', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', type: 'IMAGE', caption: 'Gâteau de mariage', tags: ['gâteau', 'dessert'], uploadedBy: 'Marie', createdAt: '2024-12-14', liked: false },
  { id: '5', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', type: 'IMAGE', caption: 'Bouquet de la mariée', tags: ['bouquet', 'fleurs'], uploadedBy: 'Sarah', createdAt: '2024-12-13', liked: true },
  { id: '6', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800', type: 'IMAGE', caption: 'Les préparatifs', tags: ['préparatifs'], uploadedBy: 'Thomas', createdAt: '2024-12-13', liked: false },
  { id: '7', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800', type: 'IMAGE', caption: 'Photo de groupe famille', tags: ['famille', 'groupe'], uploadedBy: 'Jean', createdAt: '2024-12-12', liked: true },
  { id: '8', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', type: 'IMAGE', caption: 'Détails de table', tags: ['décoration', 'table'], uploadedBy: 'Sarah', createdAt: '2024-12-12', liked: false },
  { id: '9', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800', type: 'IMAGE', caption: 'Première danse', tags: ['danse', 'soirée'], uploadedBy: 'Marie', createdAt: '2024-12-11', liked: true },
  { id: '10', url: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800', type: 'IMAGE', caption: 'Sortie des mariés', tags: ['cérémonie', 'sortie'], uploadedBy: 'Thomas', createdAt: '2024-12-11', liked: false },
  { id: '11', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800', type: 'IMAGE', caption: 'Lieu de réception', tags: ['lieu', 'château'], uploadedBy: 'Sarah', createdAt: '2024-12-10', liked: true },
  { id: '12', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800', type: 'IMAGE', caption: 'Les invités', tags: ['invités', 'groupe'], uploadedBy: 'Jean', createdAt: '2024-12-10', liked: false },
]

const allTags = ['cérémonie', 'décoration', 'fleurs', 'gâteau', 'famille', 'soirée', 'préparatifs', 'lieu']

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>(mockMedia)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const filteredMedia = media.filter(item => {
    if (filterTag && !item.tags.includes(filterTag)) return false
    if (filterType !== 'ALL' && item.type !== filterType) return false
    return true
  })

  const toggleLike = (mediaId: string) => {
    setMedia(media.map(item =>
      item.id === mediaId ? { ...item, liked: !item.liked } : item
    ))
  }

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedMedia) return
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedMedia.id)
    let newIndex: number
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredMedia.length - 1
    } else {
      newIndex = currentIndex < filteredMedia.length - 1 ? currentIndex + 1 : 0
    }
    setSelectedMedia(filteredMedia[newIndex])
  }

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'IMAGE').length,
    videos: media.filter(m => m.type === 'VIDEO').length,
    liked: media.filter(m => m.liked).length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 heading-serif">Galerie photos & vidéos</h1>
          <p className="text-gray-500 mt-1">Partagez et organisez vos souvenirs de mariage</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Tout télécharger
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload size={18} className="mr-2" />
            Ajouter des médias
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="w-5 h-5 text-gold-500" />
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-500">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{stats.images}</span>
            </div>
            <p className="text-sm text-gray-500">Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Video className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{stats.videos}</span>
            </div>
            <p className="text-sm text-gray-500">Vidéos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
              <span className="text-2xl font-bold text-red-600">{stats.liked}</span>
            </div>
            <p className="text-sm text-gray-500">Favoris</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === 'ALL' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('ALL')}
              >
                Tous
              </Button>
              <Button
                variant={filterType === 'IMAGE' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('IMAGE')}
              >
                <ImageIcon size={16} className="mr-1" />
                Photos
              </Button>
              <Button
                variant={filterType === 'VIDEO' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('VIDEO')}
              >
                <Video size={16} className="mr-1" />
                Vidéos
              </Button>

              <div className="h-8 w-px bg-gold-200 mx-2" />

              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTag === tag
                      ? 'bg-gold-500 text-white'
                      : 'bg-champagne-100 text-gray-600 hover:bg-champagne-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gold-100 text-gold-600' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'masonry' ? 'bg-gold-100 text-gold-600' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille de médias */}
      <div className={`grid gap-4 ${
        viewMode === 'grid'
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {filteredMedia.map((item, index) => (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-2xl bg-gray-100 cursor-pointer ${
              viewMode === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''
            }`}
            onClick={() => setSelectedMedia(item)}
          >
            <img
              src={item.url}
              alt={item.caption || 'Image'}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                viewMode === 'masonry' && index % 3 === 0 ? 'h-full min-h-[400px]' : 'h-64'
              }`}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Actions en haut */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(item.id)
                  }}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    item.liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Heart size={18} fill={item.liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Info en bas */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {item.caption && (
                  <p className="text-white font-medium mb-2">{item.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-white/80">{item.uploadedBy}</span>
                </div>
              </div>

              {/* Badge vidéo */}
              {item.type === 'VIDEO' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun média trouvé</p>
          <p className="text-gray-400">Ajoutez vos premières photos et vidéos</p>
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Bouton fermer */}
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-50"
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateMedia('prev')}
            className="absolute left-4 p-2 text-white/70 hover:text-white z-50"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={() => navigateMedia('next')}
            className="absolute right-4 p-2 text-white/70 hover:text-white z-50"
          >
            <ChevronRight size={48} />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[80vh] relative">
            <img
              src={selectedMedia.url}
              alt={selectedMedia.caption || 'Image'}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          {/* Info en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-3xl mx-auto">
              {selectedMedia.caption && (
                <p className="text-white text-xl font-medium mb-2">{selectedMedia.caption}</p>
              )}
              <div className="flex items-center justify-between text-white/70">
                <div className="flex gap-2">
                  {selectedMedia.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <span>Par {selectedMedia.uploadedBy}</span>
                  <button
                    onClick={() => toggleLike(selectedMedia.id)}
                    className={`p-2 rounded-full transition-colors ${
                      selectedMedia.liked ? 'bg-red-500 text-white' : 'hover:bg-white/10'
                    }`}
                  >
                    <Heart size={24} fill={selectedMedia.liked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Download size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal upload */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Ajouter des médias"
        size="lg"
      >
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gold-300 rounded-2xl p-12 text-center hover:border-gold-400 hover:bg-gold-50/50 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gold-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-800 mb-2">
              Glissez vos fichiers ici
            </p>
            <p className="text-gray-500 mb-4">ou cliquez pour parcourir</p>
            <Button variant="outline">Choisir des fichiers</Button>
            <p className="text-xs text-gray-400 mt-4">
              Formats acceptés : JPG, PNG, GIF, MP4, MOV (max 50 Mo)
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-100">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Annuler
            </Button>
            <Button>Télécharger</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
