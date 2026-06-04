'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { predictions, teams } from '@/lib/data'
import { Search, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'pending' | 'correct' | 'incorrect'

export default function PredictionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredPredictions = predictions.filter(pred => {
    const home = teams[pred.match.homeTeam]
    const away = teams[pred.match.awayTeam]
    const matchText = `${home.name} vs ${away.name}`.toLowerCase()
    const matchesSearch = matchText.includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pred.result === statusFilter
    return matchesSearch && matchesStatus
  })

  const getResultIcon = (result?: 'correct' | 'incorrect' | 'pending') => {
    switch (result) {
      case 'correct':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'incorrect':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getResultBadge = (result?: 'correct' | 'incorrect' | 'pending') => {
    switch (result) {
      case 'correct':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/30" variant="outline">Correct</Badge>
      case 'incorrect':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30" variant="outline">Incorrect</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">My Predictions</h1>
        <p className="text-muted-foreground mt-1">
          Track all your predictions and see how you&apos;re performing
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="correct">Correct</SelectItem>
            <SelectItem value="incorrect">Incorrect</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Your Prediction</TableHead>
              <TableHead>Final Result</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPredictions.map((pred) => {
              const home = teams[pred.match.homeTeam]
              const away = teams[pred.match.awayTeam]
              const predictionText = pred.prediction === 'home' 
                ? `${home.name} Win` 
                : pred.prediction === 'away' 
                  ? `${away.name} Win` 
                  : 'Draw'
              
              return (
                <TableRow key={pred.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{home.flag}</span>
                      <span className="font-medium">{home.code}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-medium">{away.code}</span>
                      <span className="text-lg">{away.flag}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {predictionText}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {pred.match.status === 'finished' ? (
                      <span className="font-semibold tabular-nums">
                        {pred.match.homeScore} - {pred.match.awayScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'font-semibold tabular-nums',
                      pred.result === 'correct' && 'text-green-600',
                      pred.result === 'incorrect' && 'text-red-500'
                    )}>
                      {pred.pointsEarned !== undefined ? `+${pred.pointsEarned}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getResultBadge(pred.result)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredPredictions.map((pred) => {
          const home = teams[pred.match.homeTeam]
          const away = teams[pred.match.awayTeam]
          const predictionText = pred.prediction === 'home' 
            ? `${home.name} Win` 
            : pred.prediction === 'away' 
              ? `${away.name} Win` 
              : 'Draw'
          
          return (
            <div key={pred.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{home.flag}</span>
                  <span className="font-medium text-sm">{home.code}</span>
                  <span className="text-muted-foreground text-sm">vs</span>
                  <span className="font-medium text-sm">{away.code}</span>
                  <span className="text-lg">{away.flag}</span>
                </div>
                {getResultBadge(pred.result)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Your prediction: </span>
                  <span className="font-medium">{predictionText}</span>
                </div>
                {pred.match.status === 'finished' && (
                  <div>
                    <span className="text-muted-foreground">Result: </span>
                    <span className="font-semibold">{pred.match.homeScore} - {pred.match.awayScore}</span>
                  </div>
                )}
              </div>
              {pred.pointsEarned !== undefined && (
                <div className={cn(
                  'text-sm font-semibold',
                  pred.result === 'correct' ? 'text-green-600' : 'text-red-500'
                )}>
                  {pred.result === 'correct' ? `+${pred.pointsEarned} points` : 'No points'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredPredictions.length === 0 && (
        <div className="text-center py-16">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No predictions found</h3>
          <p className="text-muted-foreground mt-1">
            {search ? 'Try adjusting your search' : 'Start making predictions to see them here'}
          </p>
        </div>
      )}
    </div>
  )
}
