'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Trophy, Home, Calendar, ClipboardList, User, LogIn, UserPlus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const publicNavItems = [
  { href: '/matches', label: 'مسابقه‌ها', icon: Calendar },
  { href: '/leaderboard', label: 'رده‌بندی', icon: Trophy },
]

const authNavItems = [
  { href: '/dashboard', label: 'داشبورد', icon: Home },
  { href: '/matches', label: 'مسابقه‌ها', icon: Calendar },
  { href: '/predictions', label: 'پیش‌بینی‌ها', icon: ClipboardList },
  { href: '/leaderboard', label: 'رده‌بندی', icon: Trophy },
  { href: '/profile', label: 'پروفایل', icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = user ? authNavItems : publicNavItems

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:inline-block">پیش‌بینی فوتبال</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'gap-2',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Info & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Points Badge or Auth Buttons */}
          {user ? (
            <>
              <Link href="/profile" className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium hidden md:inline-block">{user.name}</span>
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-1">
                  <LogIn className="h-4 w-4" />
                  ورود
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="lg:hidden" render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">باز و بسته کردن منو</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-6">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 pb-4 border-b">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <LogIn className="h-4 w-4" />
                        ورود
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start gap-2">
                        <UserPlus className="h-4 w-4" />
                        ثبت‌نام
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start gap-3',
                            isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {authNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground transition-colors',
                isActive && 'text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}