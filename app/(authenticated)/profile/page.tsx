'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/stat-card'
import { AchievementBadge } from '@/components/achievement-badge'
import { GatheringsSection } from '@/components/gatherings-section'
import { useAuth } from '@/lib/auth-context'
import { Trophy, Medal, Target, Percent, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null
  const accuracy = Math.round((user.correctPredictions / user.totalPredictions) * 100)

  return (
    <div className="space-y-8">
      {/* Gatherings */}
      <GatheringsSection />

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
