'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/stat-card'
import { AchievementBadge } from '@/components/achievement-badge'
import { useAuth } from '@/lib/auth-context'
import { Trophy, Medal, Target, Percent, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null
  const accuracy = Math.round((user.correctPredictions / user.totalPredictions) * 100)

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{user.points} امتیاز</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">آمار</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="امتیازات"
            value={user.points}
            icon={Trophy}
          />
          <StatCard
            title="رتبه فعلی"
            value={`#${user.rank}`}
            icon={Medal}
          />
          <StatCard
            title="کل پیش‌بینی ها"
            value={user.totalPredictions}
            subtitle={`${user.correctPredictions} صحیح`}
            icon={Target}
          />
          <StatCard
            title="نرخ موفقیت"
            value={`${accuracy}%`}
            icon={Percent}
          />
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          مدال ها (به زودی)
        </h2>
        
        {/* {earnedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">موفقیت‌های کسب‌شده</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {earnedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">مجموعه‌های قفل‌شده</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lockedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
