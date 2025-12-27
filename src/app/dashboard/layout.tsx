import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Date fictive pour la démo
  const weddingDate = new Date('2025-09-15')

  return (
    <div className="min-h-screen bg-gradient-luxury pattern-overlay">
      <Sidebar />
      <div className="ml-64">
        <Header
          weddingName="Mariage de Sarah & Thomas"
          weddingDate={weddingDate}
        />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
