'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MatchCard } from '@/components/match-card'
import { matches } from '@/lib/data'
import { Calendar, Radio, CheckCircle2 } from 'lucide-react'

type FilterType = 'all' | 'upcoming' | 'live' | 'finished'

export default function MatchesPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true
    return match.status === filter
  })

  const upcomingCount = matches.filter(m => m.status === 'upcoming').length
  const liveCount = matches.filter(m => m.status === 'live').length
  const finishedCount = matches.filter(m => m.status === 'finished').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Matches</h1>
        <p className="text-muted-foreground mt-1">
          Make your predictions for upcoming World Cup matches
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all" className="gap-2">
            All
            <span className="hidden sm:inline text-xs text-muted-foreground">({matches.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Upcoming</span>
            <span className="text-xs text-muted-foreground">({upcomingCount})</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            <Radio className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Live</span>
            <span className="text-xs text-muted-foreground">({liveCount})</span>
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-2">
            <CheckCircle2 className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Finished</span>
            <span className="text-xs text-muted-foreground">({finishedCount})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Matches Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">No matches found</h3>
          <p className="text-muted-foreground mt-1">
            {filter === 'live' && 'No matches are currently live'}
            {filter === 'upcoming' && 'No upcoming matches scheduled'}
            {filter === 'finished' && 'No finished matches yet'}
          </p>
        </div>
      )}
    </div>
  )
}
