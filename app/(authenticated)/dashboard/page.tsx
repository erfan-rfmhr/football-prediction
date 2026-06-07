import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import { MatchCardCompact } from '@/components/match-card'
import { ActivityFeed } from '@/components/activity-feed'
import { currentUser, matches, recentActivity } from '@/lib/data'
import { Trophy, Medal, Target, Percent, ArrowRight, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 4)
  const accuracy = Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">خوش آمدی، {currentUser.name}</h1>
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
          value={currentUser.points}
          icon={Trophy}
          trend="up"
          trendValue="12 این هفته"
        />
        <StatCard
          title="رتبه شما"
          value={`#${currentUser.rank}`}
          subtitle={`از ${10} بازیکن`}
          icon={Medal}
          trend="up"
          trendValue=""
        />
        <StatCard
          title="پیشبینی‌های شما"
          value={currentUser.totalPredictions}
          subtitle={`${currentUser.correctPredictions} درست`}
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
              <div className="grid gap-3 sm:grid-cols-2">
                {upcomingMatches.map((match) => (
                  <MatchCardCompact key={match.id} match={match} />
                ))}
              </div>
              {upcomingMatches.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>تعطیلاته!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={recentActivity.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
