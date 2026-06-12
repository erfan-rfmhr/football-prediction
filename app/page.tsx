'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Target, Users, ArrowRight, Crown } from 'lucide-react'
import { leaderboard, convertApiMatchToMatch, type ApiMatch } from '@/lib/data'
import { getAuthHeaders } from '@/lib/auth'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LandingPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const topPlayers = leaderboard.slice(0, 3)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${API_BASE_URL}/api/competitions/matches/`, {
          headers,
        })
        if (res.ok) {
          const apiMatches: ApiMatch[] = await res.json()
          setMatches(apiMatches.map(convertApiMatchToMatch))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl mx-auto leading-tight">
            بازی ها رو پیش‌بینی کن{' '}
            <span className="text-primary">دوستاتو شکست بده</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            نشون بده کی بیشتر از همه فوتبالو میشناسه
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 h-12 px-8 text-base">
                پیش‌بینی کن
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base">
                <Trophy className="h-4 w-4" />
                رده‌بندی
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Upcoming Matches Preview */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">بازی‌های پیش رو</h2>
              <p className="text-muted-foreground mt-1">تا شروع نشده پیش‌بینی خودتو ثبت کن</p>
            </div>
            <Link href="/matches">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                بیشتر
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({length:3}).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-4 h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </CardContent>
                </Card>
              ))
            ) : (
              upcomingMatches.map((match) => (
                <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-xs">
                        {match.stage}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{match.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-center">
                        <p className="text-sm font-medium">{match.homeTeam.name}</p>
                      </div>
                      <span className="text-xl font-bold text-muted-foreground">VS</span>
                      <div className="flex-1 text-center">
                        <p className="text-sm font-medium">{match.awayTeam.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          <Link href="/matches" className="sm:hidden">
            <Button variant="outline" className="w-full mt-4 gap-2">
              نمایش همه
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">برترین‌ها</h2>
              <p className="text-muted-foreground mt-1">لیست نوستراداموس‌ها</p>
            </div>
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                جدول کامل
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {topPlayers.map((player, index) => (
              <Card key={player.id} className={index === 0 ? 'border-[var(--gold)]/50 bg-[var(--gold)]/5' : ''}>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block">
                    {index === 0 && (
                      <Crown className="h-6 w-6 text-[var(--gold)] absolute -top-4 left-1/2 -translate-x-1/2" />
                    )}
                    <Avatar className="h-16 w-16 border-4 border-primary/20 mx-auto">
                      <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                        {player.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="mt-4">
                    <Badge className={
                      index === 0 ? 'bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/30' :
                      index === 1 ? 'bg-[var(--silver)]/20 text-[var(--silver)] border-[var(--silver)]/30' :
                      'bg-[var(--bronze)]/20 text-[var(--bronze)] border-[var(--bronze)]/30'
                    } variant="outline">
                      #{index + 1}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{player.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-1">{player.points} امتیاز</p>
                  <p className="text-sm text-muted-foreground">{player.correctPredictions} پیش‌بینی درست</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold">چطور کار می‌کنه</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              ساده، جذاب و رقابتی
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">پیش‌بینی کن</h3>
                <p className="text-muted-foreground mt-2">
                  نتیجه رو حدس بزن
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">امتیاز جمع کن</h3>
                <p className="text-muted-foreground mt-2">
                  خودتو برسون بالای جدول
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">رقابت کن</h3>
                <p className="text-muted-foreground mt-2">
                  بین دوستات کی فوتبال سرش می‌شه
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="relative">
                <h2 className="text-2xl sm:text-4xl font-bold">آماده‌ای؟</h2>
                <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
                  منتظر چی هستی؟ تا بازی شروع نشده پیش‌بینی تو ثبت کن.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base gap-2">
                    شروع
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span>پیش‌بینی کن</span>
            </div>
            <p>رقابت کن</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
