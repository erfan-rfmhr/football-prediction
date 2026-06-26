'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import { MatchCard } from '@/components/match-card'
import { useAuth } from '@/lib/auth-context'
import { convertApiMatchToMatch, type ApiMatch, type ApiPrediction, type Match, type PaginatedResponse, getAuthHeaders, getDashboardData, type ApiDashboardData } from '@/lib/data'
import { Trophy, Medal, Target, Percent, ArrowRight, Calendar, Sparkles, Award } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'

function getDateRange() {
  const today = new Date()
  const to = new Date(today)
  to.setDate(to.getDate() + 3)
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  return { dateFrom: fmt(today), dateTo: fmt(to) }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<ApiDashboardData | null>(null)
  const upcomingMatches = matches

  if (!user) return null

  const accuracy = dashboardData?.accuracy_percentage ??
    (user.totalPredictions > 0 ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0)

  const handlePrediction = (matchId: string, saved: ApiPrediction) => {
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? {
              ...m,
              userPrediction: {
                id: saved.id,
                homeScore: saved.home_score,
                awayScore: saved.away_score,
              },
            }
          : m
      )
    )
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = await getAuthHeaders()

        // Fetch matches within today..today+3 days window
        const { dateFrom, dateTo } = getDateRange()
        const matchesUrl = new URL(`${API_BASE_URL}/api/competitions/matches/`)
        matchesUrl.searchParams.append('date_from', dateFrom)
        matchesUrl.searchParams.append('date_to', dateTo)
        matchesUrl.searchParams.append('page_size', '4')

        const matchesResponse = await fetch(matchesUrl.toString(), {
          headers,
        })
        if (matchesResponse.ok) {
          const data: PaginatedResponse<ApiMatch> = await matchesResponse.json()
          setMatches(data.results.map(convertApiMatchToMatch))
        }

        // Fetch dashboard data
        const dashboardData = await getDashboardData()
        setDashboardData(dashboardData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">خوش آمدی، {user.name}</h1>
          <p className="text-muted-foreground mt-1">اینجا می‌تونی فعالیت‌هاتو ببینی</p>
        </div>
        <Link href="/matches">
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            پیش‌بینی
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="امتیازات شما"
          value={dashboardData?.total_points ?? user.points}
          icon={Trophy}
          trend="up"
          trendValue=""
        />
        <StatCard
          title="رتبه شما"
          value={`#${dashboardData?.user_rank ?? user.rank}`}
          subtitle={`از ${10} بازیکن`}
          icon={Medal}
          trend="up"
          trendValue=""
        />
        <StatCard
          title="پیشبینی‌های شما"
          value={dashboardData?.total_predictions ?? user.totalPredictions}
          subtitle={`${dashboardData?.correct_predictions ?? user.correctPredictions} درست`}
          icon={Target}
        />
        <StatCard
          title="درصد دقت شما"
          value={`${accuracy}%`}
          icon={Percent}
          trend={accuracy >= 70 ? 'up' : accuracy >= 50 ? 'neutral' : 'down'}
          trendValue={accuracy >= 70 ? 'عالی' : accuracy >= 50 ? 'خوب' : 'ادامه بده'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Matches */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">مسابقات پیش رو</CardTitle>
              <Link href="/matches">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  نمایش همه
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={match} onPredict={handlePrediction} />
                  ))}
                  {upcomingMatches.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>تعطیلاته!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Points Calculation Guide */}
        <div>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">نحوه محاسبه امتیازات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                امتیاز هر بازی پس از ثبت نتیجه نهایی بر اساس فاکتورهای زیر محاسبه می‌شود:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">پیش‌بینی دقیق</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">حدس دقیق نتیجه بازی (مثلاً پیش‌بینی ۲-۱ و پایان بازی با همین نتیجه)</p>
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                      ۱۰+ امتیاز
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">پیش‌بینی تفاضل گل</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">حدس درست برنده و تفاضل گل بازی (مثلاً پیش‌بینی ۲-۰ و پایان بازی با نتیجه ۳-۱)</p>
                    <span className="inline-flex items-center rounded-md bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mt-2">
                      ۷+ امتیاز
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">پیش‌بینی نتیجه کلی</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">حدس درست برنده بازی (یا مساوی) بدون حدس تفاضل یا نتیجه دقیق</p>
                    <span className="inline-flex items-center rounded-md bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mt-2">
                      ۵+ امتیاز
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}