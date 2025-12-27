import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'OussamAI - Votre Assistant Mariage Intelligent',
  description: 'Planifiez le mariage de vos rêves avec OussamAI. Gestion des invités, budget, planning et assistant IA pour un mariage parfait.',
  keywords: ['mariage', 'wedding planner', 'organisation mariage', 'IA', 'assistant mariage'],
  authors: [{ name: 'OussamAI' }],
  openGraph: {
    title: 'OussamAI - Votre Assistant Mariage Intelligent',
    description: 'Planifiez le mariage de vos rêves avec notre assistant IA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
