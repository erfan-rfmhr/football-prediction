import { type User } from '@/lib/data'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react'

interface PodiumProps {
  users: User[]
  currentUserId?: string
}

export function Podium({ users, currentUserId }: PodiumProps) {
  // Get top 3 users
  const [first, second, third] = users.slice(0, 3)

  if (!first || !second || !third) return null

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 py-8 px-4">
      {/* Second Place */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className={cn(
          'h-14 w-14 sm:h-16 sm:w-16 border-4',
          second.id === currentUserId ? 'border-primary' : 'border-[var(--silver)]'
        )}>
          <AvatarFallback className="bg-[var(--silver)]/20 text-lg font-bold">
            {second.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold text-sm">{second.name}</p>
          <p className="text-sm text-muted-foreground">{second.points} امتیاز</p>
        </div>
        <div className="w-20 sm:w-24 h-24 sm:h-28 rounded-t-lg bg-gradient-to-t from-[var(--silver)]/30 to-[var(--silver)]/10 flex items-center justify-center border border-[var(--silver)]/30 border-b-0">
          <span className="text-3xl sm:text-4xl font-bold text-[var(--silver)]">2</span>
        </div>
      </div>

      {/* First Place */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Crown className="h-6 w-6 text-[var(--gold)] absolute -top-8 left-1/2 -translate-x-1/2" />
          <Avatar className={cn(
            'h-16 w-16 sm:h-20 sm:w-20 border-4',
            first.id === currentUserId ? 'border-primary' : 'border-[var(--gold)]'
          )}>
            <AvatarFallback className="bg-[var(--gold)]/20 text-xl font-bold">
              {first.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center">
          <p className="font-semibold">{first.name}</p>
          <p className="text-sm text-muted-foreground">{first.points} امتیاز</p>
        </div>
        <div className="w-20 sm:w-24 h-32 sm:h-36 rounded-t-lg bg-gradient-to-t from-[var(--gold)]/30 to-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/30 border-b-0">
          <span className="text-4xl sm:text-5xl font-bold text-[var(--gold)]">1</span>
        </div>
      </div>

      {/* Third Place */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className={cn(
          'h-12 w-12 sm:h-14 sm:w-14 border-4',
          third.id === currentUserId ? 'border-primary' : 'border-[var(--bronze)]'
        )}>
          <AvatarFallback className="bg-[var(--bronze)]/20 text-base font-bold">
            {third.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold text-sm">{third.name}</p>
          <p className="text-sm text-muted-foreground">{third.points} امتیاز</p>
        </div>
        <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-t-lg bg-gradient-to-t from-[var(--bronze)]/30 to-[var(--bronze)]/10 flex items-center justify-center border border-[var(--bronze)]/30 border-b-0">
          <span className="text-2xl sm:text-3xl font-bold text-[var(--bronze)]">3</span>
        </div>
      </div>
    </div>
  )
}

interface RankChangeProps {
  current: number
  previous: number
}

export function RankChange({ current, previous }: RankChangeProps) {
  const diff = previous - current

  if (diff > 0) {
    return (
      <span className="flex items-center gap-0.5 text-green-600 text-sm">
        <TrendingUp className="h-4 w-4" />
        {diff}
      </span>
    )
  } else if (diff < 0) {
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-sm">
        <TrendingDown className="h-4 w-4" />
        {Math.abs(diff)}
      </span>
    )
  }

  return (
    <span className="flex items-center gap-0.5 text-muted-foreground text-sm">
      <Minus className="h-4 w-4" />
    </span>
  )
}
