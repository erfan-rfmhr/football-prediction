import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/stat-card'
import { AchievementBadge } from '@/components/achievement-badge'
import { currentUser } from '@/lib/data'
import { Trophy, Medal, Target, Percent, Calendar } from 'lucide-react'

export default function ProfilePage() {
  const accuracy = Math.round((currentUser.correctPredictions / currentUser.totalPredictions) * 100)
  const earnedAchievements = currentUser.achievements.filter(a => a.earned)
  const lockedAchievements = currentUser.achievements.filter(a => !a.earned)

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentUser.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {currentUser.memberSince}</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">{currentUser.points} points</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Points"
            value={currentUser.points}
            icon={Trophy}
          />
          <StatCard
            title="Current Rank"
            value={`#${currentUser.rank}`}
            icon={Medal}
          />
          <StatCard
            title="Predictions"
            value={currentUser.totalPredictions}
            subtitle={`${currentUser.correctPredictions} correct`}
            icon={Target}
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={Percent}
          />
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Achievements ({earnedAchievements.length}/{currentUser.achievements.length})
        </h2>
        
        {earnedAchievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Earned</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {earnedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Locked</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lockedAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
