'use client'

import { teams, type Match, type TeamCode, formatMatchDate, isPredictionCorrect } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle2, XCircle, Lock, Radio } from 'lucide-react'
import { useState } from 'react'

interface MatchCardProps {
  match: Match
  showPrediction?: boolean
  onPredict?: (matchId: string, prediction: 'home' | 'draw' | 'away') => void
}

export function MatchCard({ match, showPrediction = true, onPredict }: MatchCardProps) {
  const [selectedPrediction, setSelectedPrediction] = useState<'home' | 'draw' | 'away' | undefined>(match.userPrediction)
  const homeTeam = teams[match.homeTeam]
  const awayTeam = teams[match.awayTeam]
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'
  const isPredicted = !!selectedPrediction
  const correct = isPredictionCorrect(match)

  const handlePrediction = (prediction: 'home' | 'draw' | 'away') => {
    if (isFinished || match.predictionLocked) return
    setSelectedPrediction(prediction)
    onPredict?.(match.id, prediction)
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all hover:shadow-md',
      isLive && 'border-primary ring-2 ring-primary/20',
      isFinished && correct === true && 'border-green-500/50',
      isFinished && correct === false && 'border-destructive/50'
    )}>
      <CardContent className="p-0">
        {/* Match Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal text-xs">
              {match.stage}
              {match.group && ` - Group ${match.group}`}
            </Badge>
            {isLive && (
              <Badge className="bg-red-500 text-white animate-pulse gap-1">
                <Radio className="h-3 w-3" />
                LIVE
              </Badge>
            )}
            {isFinished && correct !== null && (
              <Badge className={cn(
                'gap-1',
                correct ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-destructive/10 text-destructive border-destructive/30'
              )} variant="outline">
                {correct ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {correct ? '+3 pts' : '0 pts'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatMatchDate(match.date)}</span>
            <span className="text-muted-foreground/60">|</span>
            <span>{match.time}</span>
          </div>
        </div>

        {/* Teams & Score */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div className="text-4xl mb-2">{homeTeam.flag}</div>
              <p className="font-semibold text-sm">{homeTeam.name}</p>
            </div>

            {/* Score / VS */}
            <div className="flex flex-col items-center gap-1">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold tabular-nums">{match.homeScore}</span>
                  <span className="text-muted-foreground text-lg">-</span>
                  <span className="text-3xl font-bold tabular-nums">{match.awayScore}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">VS</span>
              )}
              {isFinished && (
                <span className="text-xs text-muted-foreground">Final Score</span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="text-4xl mb-2">{awayTeam.flag}</div>
              <p className="font-semibold text-sm">{awayTeam.name}</p>
            </div>
          </div>
        </div>

        {/* Prediction Selector */}
        {showPrediction && (
          <div className="px-4 pb-4">
            {match.predictionLocked || isFinished ? (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>
                  {isPredicted 
                    ? `You predicted: ${selectedPrediction === 'home' ? homeTeam.name : selectedPrediction === 'away' ? awayTeam.name : 'Draw'}`
                    : 'Predictions locked'
                  }
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={selectedPrediction === 'home' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 h-12',
                    selectedPrediction === 'home' && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handlePrediction('home')}
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-xs opacity-70">Home</span>
                    <span className="font-semibold">{homeTeam.code}</span>
                  </span>
                </Button>
                <Button
                  variant={selectedPrediction === 'draw' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 h-12',
                    selectedPrediction === 'draw' && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handlePrediction('draw')}
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-xs opacity-70">Draw</span>
                    <span className="font-semibold">X</span>
                  </span>
                </Button>
                <Button
                  variant={selectedPrediction === 'away' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 h-12',
                    selectedPrediction === 'away' && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handlePrediction('away')}
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-xs opacity-70">Away</span>
                    <span className="font-semibold">{awayTeam.code}</span>
                  </span>
                </Button>
              </div>
            )}
            {isPredicted && !isFinished && !match.predictionLocked && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Prediction saved. You can change it until the match starts.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact match card for dashboard preview
export function MatchCardCompact({ match }: { match: Match }) {
  const homeTeam = teams[match.homeTeam]
  const awayTeam = teams[match.awayTeam]
  const isPredicted = !!match.userPrediction

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{homeTeam.flag}</span>
            <span className="text-sm font-medium truncate">{homeTeam.code}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center shrink-0">
            <div className="font-medium">{match.time}</div>
            <div>{formatMatchDate(match.date)}</div>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm font-medium truncate">{awayTeam.code}</span>
            <span className="text-xl">{awayTeam.flag}</span>
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <Badge variant={isPredicted ? 'default' : 'secondary'} className={cn(
            'text-xs',
            isPredicted ? 'bg-primary/10 text-primary border-primary/30' : ''
          )}>
            {isPredicted ? 'Predicted' : 'Not Predicted'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
