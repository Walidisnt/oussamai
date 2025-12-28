import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions, Provider } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

// Construire les providers dynamiquement
const providers: Provider[] = []

// Ajouter Google seulement si les credentials sont présentes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  )
}

// Toujours ajouter Credentials
providers.push(
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mot de passe", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email et mot de passe requis")
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user || !user.password) {
        throw new Error("Utilisateur non trouvé")
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
      )

      if (!isPasswordValid) {
        throw new Error("Mot de passe incorrect")
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    }
  })
)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Toujours autoriser la connexion
      return true
    },
    async jwt({ token, user, account, profile }) {
      // Première connexion : stocker les infos utilisateur
      if (account && user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", user.email)
    },
    async signOut({ token }) {
      console.log("User signed out")
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Activer le debug temporairement
}
