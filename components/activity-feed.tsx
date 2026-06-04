import { type Activity } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ClipboardList, Trophy, TrendingUp } from 'lucide-react'

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activity.type === 'prediction' 
          ? ClipboardList 
          : activity.type === 'points' 
            ? Trophy 
            : TrendingUp

        return (
          <div
            key={activity.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg transition-colors',
              'hover:bg-muted/50'
            )}
          >
            <div className={cn(
              'p-2 rounded-lg shrink-0',
              activity.type === 'prediction' && 'bg-blue-500/10 text-blue-600',
              activity.type === 'points' && 'bg-green-500/10 text-green-600',
              activity.type === 'rank' && 'bg-purple-500/10 text-purple-600'
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
