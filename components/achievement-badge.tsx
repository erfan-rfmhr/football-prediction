import { type Achievement } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Trophy, Medal, Star, Crown, Zap, Award, Lock } from 'lucide-react'

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  crown: Crown,
  zap: Zap,
  award: Award,
}

interface AchievementBadgeProps {
  achievement: Achievement
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Trophy

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border transition-all',
        achievement.earned
          ? 'bg-card border-primary/20'
          : 'bg-muted/30 border-dashed border-muted-foreground/20 opacity-60'
      )}
    >
      <div
        className={cn(
          'p-3 rounded-lg shrink-0',
          achievement.earned
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {achievement.earned ? (
          <Icon className="h-6 w-6" />
        ) : (
          <Lock className="h-6 w-6" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{achievement.title}</p>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {achievement.earned && achievement.earnedDate && (
          <p className="text-xs text-primary mt-1">
            Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
