import { Navbar, MobileBottomNav } from '@/components/navbar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  )
}
