# 💒 OussamAI - Votre Assistant Mariage Intelligent

<div align="center">
  <img src="public/images/logo.png" alt="OussamAI Logo" width="200"/>

  **L'application complète pour organiser le mariage de vos rêves**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma)](https://www.prisma.io/)
</div>

---

## ✨ Fonctionnalités

### 👥 Gestion des Invités
- Liste complète des invités avec filtres
- Suivi des RSVP en temps réel
- Gestion des +1 et restrictions alimentaires
- Placement automatique des tables

### 📅 Planning & Tâches
- Timeline du jour J
- Checklist personnalisée
- Rappels automatiques
- Suivi de progression

### 💰 Gestion du Budget
- Suivi des dépenses par catégorie
- Alertes de dépassement
- Graphiques de répartition
- Export des données

### 🖼️ Galerie Médias
- Upload de photos et vidéos
- Organisation par tags
- Partage avec les invités
- Galerie responsive

### 🤖 Assistant IA
- Conseils personnalisés
- Suggestions de placement
- Optimisation du budget
- Idées créatives

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Cloner le projet**
```bash
cd ~/OussamAI
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

4. **Initialiser la base de données**
```bash
npm run db:generate
npm run db:push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

6. **Ouvrir l'application**
```
http://localhost:3000
```

---

## 🏗️ Structure du Projet

```
OussamAI/
├── prisma/
│   └── schema.prisma      # Schéma de base de données
├── public/
│   └── images/            # Assets statiques
├── src/
│   ├── app/               # Pages Next.js App Router
│   │   ├── dashboard/     # Pages du dashboard
│   │   │   ├── guests/    # Gestion invités
│   │   │   ├── planning/  # Planning & tâches
│   │   │   ├── budget/    # Suivi budget
│   │   │   ├── gallery/   # Galerie médias
│   │   │   ├── ai-assistant/ # Assistant IA
│   │   │   └── settings/  # Paramètres
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   ├── layout/        # Sidebar, Header
│   │   └── ui/            # Composants réutilisables
│   ├── lib/
│   │   ├── db.ts          # Client Prisma
│   │   └── utils.ts       # Fonctions utilitaires
│   └── types/
│       └── index.ts       # Types TypeScript
├── .env                   # Variables d'environnement
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

### Couleurs
- **Or (Primary)**: `#D4A420` - Couleur principale luxueuse
- **Bordeaux (Secondary)**: `#722F37` - Couleur d'accent élégante
- **Champagne**: `#FAF5EB` - Fond doux et chaleureux
- **Ivoire**: `#FFFFF0` - Tons neutres raffinés

### Typographie
- **Playfair Display** - Titres élégants (serif)
- **Inter** - Corps de texte lisible (sans-serif)
- **Great Vibes** - Accents script (cursive)

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur dev

# Production
npm run build        # Build pour production
npm run start        # Lance le serveur prod

# Base de données
npm run db:generate  # Génère le client Prisma
npm run db:push      # Applique le schéma
npm run db:studio    # Ouvre Prisma Studio

# Qualité
npm run lint         # Vérifie le code
```

---

## 📝 Technologies

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | Framework React avec App Router |
| **TypeScript** | Typage statique |
| **Tailwind CSS** | Styles utilitaires |
| **Prisma** | ORM base de données |
| **SQLite** | Base de données locale |
| **Lucide React** | Icônes |
| **Framer Motion** | Animations |

---

## 🔮 Roadmap

- [ ] Authentification complète (NextAuth)
- [ ] API Routes fonctionnelles
- [ ] Intégration OpenAI pour l'assistant
- [ ] Upload d'images Cloudinary
- [ ] Notifications email
- [ ] Mode hors-ligne (PWA)
- [ ] Export PDF
- [ ] QR Code pour RSVP

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

## 📄 Licence

MIT © 2025 OussamAI

---

<div align="center">
  <p>Créé avec ❤️ pour rendre votre mariage inoubliable</p>
</div>
