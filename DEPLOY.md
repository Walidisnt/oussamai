# 🚀 Guide de Déploiement OussamAI

## Déploiement Express en 30 minutes

Suis ces étapes dans l'ordre pour mettre OussamAI en production ce soir !

---

## Étape 1: GitHub (5 min)

### Créer le dépôt
1. Va sur https://github.com/new
2. Nom: `oussamai`
3. Public (gratuit) ou Private
4. Ne coche rien (pas de README, pas de .gitignore)
5. Clique "Create repository"

### Pousser le code
Dans ton terminal:
```bash
cd ~/OussamAI
git remote add origin https://github.com/TON-USERNAME/oussamai.git
git push -u origin main
```

---

## Étape 2: Base de données PostgreSQL GRATUITE (5 min)

### Option A: Neon (Recommandé - Plus simple)
1. Va sur https://neon.tech
2. "Sign up" avec GitHub
3. Crée un nouveau projet: "OussamAI"
4. **Copie l'URL de connexion** qui ressemble à:
   ```
   postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase
1. Va sur https://supabase.com
2. "Start your project" avec GitHub
3. Nouveau projet → Région: Europe West
4. Va dans "Settings" → "Database"
5. Copie l'URL "Connection string (URI)"

---

## Étape 3: Vercel (10 min)

### Connecter le projet
1. Va sur https://vercel.com
2. "Sign up" avec GitHub
3. "Add New Project"
4. Importe ton dépôt `oussamai`

### Variables d'environnement
Avant de déployer, ajoute ces variables dans "Environment Variables":

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | L'URL PostgreSQL de l'étape 2 |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` dans le terminal |
| `NEXTAUTH_URL` | `https://oussamai.vercel.app` (ou ton domaine) |
| `NEXT_PUBLIC_APP_URL` | `https://oussamai.vercel.app` |

### Déployer
1. Clique "Deploy"
2. Attends 2-3 minutes
3. Ton app est en ligne! 🎉

---

## Étape 4: Stripe (10 min) - Pour les paiements

### Créer le compte
1. Va sur https://stripe.com
2. "Start now" → Crée ton compte
3. Active le "Mode Test" pour commencer (toggle en haut à droite)

### Récupérer les clés
1. Va dans Developers → API Keys
2. Copie:
   - `Publishable key`: pk_test_...
   - `Secret key`: sk_test_...

### Créer le produit Premium
1. Products → Add product
2. Nom: "OussamAI Premium"
3. Prix: 19€/mois (récurrent mensuel)
4. Sauvegarde → Copie l'ID du prix: `price_...`

### Configurer le Webhook
1. Developers → Webhooks → Add endpoint
2. URL: `https://oussamai.vercel.app/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copie le "Signing secret": `whsec_...`

### Ajouter les variables dans Vercel
| Variable | Valeur |
|----------|--------|
| `STRIPE_SECRET_KEY` | sk_test_... |
| `STRIPE_WEBHOOK_SECRET` | whsec_... |
| `STRIPE_PREMIUM_PRICE_ID` | price_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_... |

---

## Étape 5: OpenAI (5 min) - Pour l'Assistant IA

1. Va sur https://platform.openai.com
2. Crée un compte / Connecte-toi
3. API Keys → Create new secret key
4. Copie la clé: `sk-...`
5. Ajoute 5-10€ de crédits (Billing → Add credits)

### Dans Vercel
| Variable | Valeur |
|----------|--------|
| `OPENAI_API_KEY` | sk-... |

---

## Étape 6: Resend (5 min) - Pour les emails

1. Va sur https://resend.com
2. Sign up avec GitHub
3. API Keys → Create API Key
4. Copie: `re_...`

### Configurer le domaine (optionnel mais recommandé)
1. Domains → Add Domain
2. Ajoute ton domaine et les DNS

### Dans Vercel
| Variable | Valeur |
|----------|--------|
| `RESEND_API_KEY` | re_... |

---

## Étape 7: Google OAuth (Optionnel - 10 min)

Pour permettre "Se connecter avec Google":

1. Va sur https://console.cloud.google.com
2. Crée un nouveau projet "OussamAI"
3. APIs & Services → Credentials → Create Credentials → OAuth Client ID
4. Type: Web application
5. Authorized redirect URIs: `https://oussamai.vercel.app/api/auth/callback/google`
6. Copie Client ID et Client Secret

### Dans Vercel
| Variable | Valeur |
|----------|--------|
| `GOOGLE_CLIENT_ID` | ...apps.googleusercontent.com |
| `GOOGLE_CLIENT_SECRET` | GOCSPX-... |

---

## 🎉 Redéployer

Après avoir ajouté toutes les variables:
1. Va dans Vercel → Deployments
2. Clique sur les 3 points → Redeploy
3. Attends 2 min

---

## Résumé des Variables Vercel

```env
# Base de données
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=... (généré avec openssl)
NEXTAUTH_URL=https://oussamai.vercel.app
NEXT_PUBLIC_APP_URL=https://oussamai.vercel.app

# Stripe (paiements)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI (IA)
OPENAI_API_KEY=sk-...

# Resend (emails)
RESEND_API_KEY=re_...

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Passer en Production Stripe

Quand tu es prêt à recevoir de vrais paiements:
1. Complete ton profil Stripe (identité, compte bancaire)
2. Désactive le mode Test
3. Remplace les clés test par les clés live
4. Recrée le webhook avec l'URL de prod

---

## Support

Des questions? L'app ne marche pas?
- Vérifie les logs dans Vercel → Deployments → Functions
- Vérifie que toutes les variables sont configurées
- Vérifie que la base de données est accessible

Bonne chance! 🎊
