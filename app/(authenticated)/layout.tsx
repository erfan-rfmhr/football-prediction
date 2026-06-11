'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { MobileBottomNav } from '@/components/navbar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  )
}
