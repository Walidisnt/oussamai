// Types pour OussamAI

export type RSVPStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'MAYBE'

export type GuestGroup =
  | 'FAMILY_PARTNER1'
  | 'FAMILY_PARTNER2'
  | 'FRIENDS_PARTNER1'
  | 'FRIENDS_PARTNER2'
  | 'MUTUAL_FRIENDS'
  | 'COLLEAGUES'
  | 'OTHER'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type TaskCategory =
  | 'VENUE'
  | 'CATERING'
  | 'DECORATION'
  | 'ATTIRE'
  | 'PHOTOGRAPHY'
  | 'MUSIC'
  | 'FLOWERS'
  | 'INVITATIONS'
  | 'TRANSPORTATION'
  | 'ACCOMMODATION'
  | 'LEGAL'
  | 'OTHER'

export type BudgetCategory =
  | 'VENUE'
  | 'CATERING'
  | 'PHOTOGRAPHY'
  | 'VIDEOGRAPHY'
  | 'MUSIC_DJ'
  | 'FLOWERS'
  | 'DECORATION'
  | 'ATTIRE_BRIDE'
  | 'ATTIRE_GROOM'
  | 'BEAUTY'
  | 'INVITATIONS'
  | 'TRANSPORTATION'
  | 'ACCOMMODATION'
  | 'WEDDING_RINGS'
  | 'GIFTS'
  | 'HONEYMOON'
  | 'OTHER'

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  rsvpStatus: RSVPStatus
  rsvpDate?: Date
  plusOne: boolean
  plusOneName?: string
  dietaryRestrictions?: string
  notes?: string
  group: GuestGroup
  tableId?: string
  seatNumber?: number
}

export interface Table {
  id: string
  name: string
  capacity: number
  shape: 'ROUND' | 'RECTANGULAR' | 'SQUARE' | 'OVAL'
  positionX?: number
  positionY?: number
  guests: Guest[]
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: Date
  completed: boolean
  priority: Priority
  category: TaskCategory
}

export interface BudgetItem {
  id: string
  name: string
  category: BudgetCategory
  estimatedCost: number
  actualCost?: number
  paid: boolean
  paidDate?: Date
  notes?: string
}

export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime?: Date
  location?: string
  type: 'CEREMONY' | 'RECEPTION' | 'COCKTAIL' | 'DINNER' | 'PARTY' | 'PHOTO_SESSION' | 'PREPARATION' | 'OTHER'
  color?: string
}

export interface MediaItem {
  id: string
  url: string
  thumbnail?: string
  type: 'IMAGE' | 'VIDEO'
  caption?: string
  tags?: string[]
  uploadedBy?: string
  createdAt: Date
}

export interface Wedding {
  id: string
  name: string
  date: Date
  venue?: string
  venueAddress?: string
  description?: string
  coverImage?: string
  theme?: string
  primaryColor?: string
  secondaryColor?: string
  partner1Name: string
  partner2Name: string
  guestLimit: number
  budgetTotal: number
}

export interface DashboardStats {
  totalGuests: number
  confirmedGuests: number
  pendingGuests: number
  declinedGuests: number
  totalBudget: number
  spentBudget: number
  remainingBudget: number
  completedTasks: number
  totalTasks: number
  daysUntilWedding: number
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// Labels en français
export const RSVP_LABELS: Record<RSVPStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  DECLINED: 'Décliné',
  MAYBE: 'Peut-être',
}

export const GUEST_GROUP_LABELS: Record<GuestGroup, string> = {
  FAMILY_PARTNER1: 'Famille (partenaire 1)',
  FAMILY_PARTNER2: 'Famille (partenaire 2)',
  FRIENDS_PARTNER1: 'Amis (partenaire 1)',
  FRIENDS_PARTNER2: 'Amis (partenaire 2)',
  MUTUAL_FRIENDS: 'Amis communs',
  COLLEAGUES: 'Collègues',
  OTHER: 'Autres',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  URGENT: 'Urgente',
}

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  VENUE: 'Lieu de réception',
  CATERING: 'Traiteur',
  PHOTOGRAPHY: 'Photographie',
  VIDEOGRAPHY: 'Vidéographie',
  MUSIC_DJ: 'Musique / DJ',
  FLOWERS: 'Fleurs',
  DECORATION: 'Décoration',
  ATTIRE_BRIDE: 'Tenue mariée',
  ATTIRE_GROOM: 'Tenue marié',
  BEAUTY: 'Beauté / Coiffure',
  INVITATIONS: 'Faire-part',
  TRANSPORTATION: 'Transport',
  ACCOMMODATION: 'Hébergement',
  WEDDING_RINGS: 'Alliances',
  GIFTS: 'Cadeaux invités',
  HONEYMOON: 'Lune de miel',
  OTHER: 'Autres',
}

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  VENUE: 'Lieu',
  CATERING: 'Traiteur',
  DECORATION: 'Décoration',
  ATTIRE: 'Tenues',
  PHOTOGRAPHY: 'Photo/Vidéo',
  MUSIC: 'Musique',
  FLOWERS: 'Fleurs',
  INVITATIONS: 'Invitations',
  TRANSPORTATION: 'Transport',
  ACCOMMODATION: 'Hébergement',
  LEGAL: 'Administratif',
  OTHER: 'Autres',
}
