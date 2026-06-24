'use client'

import { type Match, createPrediction, updatePrediction } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle2, XCircle, Lock } from 'lucide-react'
import { useState } from 'react'

interface MatchCardProps {
  match: Match
  showPrediction?: boolean
  onPredict?: (matchId: string, homeScore: number, awayScore: number) => void
}

export function MatchCard({ match, showPrediction = true, onPredict }: MatchCardProps) {
  const [homePrediction, setHomePrediction] = useState<string>(match.userPrediction?.homeScore?.toString() || '')
  const [awayPrediction, setAwayPrediction] = useState<string>(match.userPrediction?.awayScore?.toString() || '')
  const [isSaving, setIsSaving] = useState(false)
  const isStarted = match.startedAt ? new Date(match.startedAt) <= new Date() : false
  const isPredicted = !!match.userPrediction

  const handlePrediction = async () => {
    const homeScore = parseInt(homePrediction)
    const awayScore = parseInt(awayPrediction)
    
    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0 || isStarted) return
    
    setIsSaving(true)
    try {
      if (match.userPrediction) {
        await updatePrediction(match.userPrediction.id, homeScore, awayScore)
      } else {
        await createPrediction(parseInt(match.id), homeScore, awayScore)
      }
      onPredict?.(match.id, homeScore, awayScore)
    } catch (error) {
      console.error('Failed to save prediction:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-md',
    )}>
      <CardContent className="p-0">
        {/* Match Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            {match.tournament && (
              <Badge variant="default" className="font-normal text-xs bg-primary/10 text-primary border-primary/20">
                {match.tournament.name}
              </Badge>
            )}
            <Badge variant="outline" className="font-normal text-xs">
              {match.stage}
            </Badge>
            {isStarted && (
              <Badge variant="secondary" className="font-normal text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{match.date}</span>
            <span className="text-muted-foreground/60">|</span>
            <span>{match.time}</span>
          </div>
        </div>

        {/* Teams & Score */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <p className="font-semibold text-sm">{match.homeTeam.name}</p>
              {isStarted ? (
                <p className="text-3xl font-bold">{match.homeScore}</p>
              ) : null}
            </div>

            {/* VS */}
            <div className="text-muted-foreground font-semibold">VS</div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <p className="font-semibold text-sm">{match.awayTeam.name}</p>
              {isStarted ? (
                <p className="text-3xl font-bold">{match.awayScore}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Prediction Section */}
        {showPrediction && (
          <div className="px-4 pb-4">
            {isStarted ? (
              <div className="flex flex-col items-center justify-center gap-1 py-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>
                    {isPredicted
                      ? `پیش‌بینی شما: ${match.userPrediction?.homeScore} - ${match.userPrediction?.awayScore}`
                      : isStarted ? 'نتیجه نهایی' : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={homePrediction}
                    onChange={(e) => setHomePrediction(e.target.value)}
                    className="text-center"
                  />
                  <span className="text-xl font-bold text-muted-foreground">-</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={awayPrediction}
                    onChange={(e) => setAwayPrediction(e.target.value)}
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={handlePrediction}
                  disabled={isSaving || homePrediction === '' || awayPrediction === ''}
                  className="w-full"
                >
                  {isSaving ? 'در حال ذخیره...' : isPredicted ? 'به‌روزرسانی پیش‌بینی' : 'ثبت پیش‌بینی'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact match card for dashboard preview
export function MatchCardCompact({ match }: { match: Match }) {
  const isPredicted = !!match.userPrediction

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        {/* Tournament Name */}
        {match.tournament && (
          <div className="mb-2 text-xs text-muted-foreground text-center">
            {match.tournament.name} - {match.stage}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{match.homeTeam.name}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center shrink-0">
            <div className="font-medium">{match.time}</div>
            <div>{match.date}</div>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm font-medium truncate">{match.awayTeam.name}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          {isPredicted ? (
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/30">
              پیش‌بینی: {match.userPrediction?.homeScore} - {match.userPrediction?.awayScore}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              پیش‌بینی نشده
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}