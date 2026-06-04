import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Podium, RankChange } from '@/components/podium'
import { leaderboard, currentUser } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          See how you rank against your friends
        </p>
      </div>

      {/* Podium */}
      <Card className="overflow-hidden bg-gradient-to-b from-muted/50 to-card">
        <CardContent className="pt-4">
          <Podium users={leaderboard} currentUserId={currentUser.id} />
        </CardContent>
      </Card>

      {/* Full Rankings Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Correct</TableHead>
                  <TableHead className="text-center w-20">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((player, index) => {
                  const isCurrentUser = player.id === currentUser.id
                  return (
                    <TableRow
                      key={player.id}
                      className={cn(
                        isCurrentUser && 'bg-primary/5 hover:bg-primary/10'
                      )}
                    >
                      <TableCell>
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          index === 0 && 'bg-[var(--gold)]/20 text-[var(--gold)]',
                          index === 1 && 'bg-[var(--silver)]/20 text-[var(--silver)]',
                          index === 2 && 'bg-[var(--bronze)]/20 text-[var(--bronze)]',
                          index > 2 && 'bg-muted text-muted-foreground'
                        )}>
                          {player.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className={cn(
                            'h-9 w-9 border-2',
                            isCurrentUser ? 'border-primary' : 'border-transparent'
                          )}>
                            <AvatarFallback className={cn(
                              'font-semibold',
                              isCurrentUser ? 'bg-primary/10 text-primary' : 'bg-muted'
                            )}>
                              {player.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{player.name}</span>
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-primary font-medium">(You)</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold tabular-nums">{player.points}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="tabular-nums text-muted-foreground">
                          {player.correctPredictions}/{player.totalPredictions}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <RankChange current={player.rank} previous={player.previousRank} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden divide-y">
            {leaderboard.map((player, index) => {
              const isCurrentUser = player.id === currentUser.id
              return (
                <div
                  key={player.id}
                  className={cn(
                    'flex items-center gap-3 p-4',
                    isCurrentUser && 'bg-primary/5'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                    index === 0 && 'bg-[var(--gold)]/20 text-[var(--gold)]',
                    index === 1 && 'bg-[var(--silver)]/20 text-[var(--silver)]',
                    index === 2 && 'bg-[var(--bronze)]/20 text-[var(--bronze)]',
                    index > 2 && 'bg-muted text-muted-foreground'
                  )}>
                    {player.rank}
                  </div>
                  <Avatar className={cn(
                    'h-10 w-10 border-2 shrink-0',
                    isCurrentUser ? 'border-primary' : 'border-transparent'
                  )}>
                    <AvatarFallback className={cn(
                      'font-semibold',
                      isCurrentUser ? 'bg-primary/10 text-primary' : 'bg-muted'
                    )}>
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{player.name}</span>
                      {isCurrentUser && (
                        <span className="text-xs text-primary font-medium shrink-0">(You)</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {player.correctPredictions} correct predictions
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold tabular-nums">{player.points}</p>
                    <RankChange current={player.rank} previous={player.previousRank} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <div className="text-center py-16">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No players yet</h3>
          <p className="text-muted-foreground mt-1">
            Start predicting to appear on the leaderboard
          </p>
        </div>
      )}
    </div>
  )
}
