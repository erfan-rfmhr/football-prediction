'use client'

import { MatchCard } from '@/components/match-card'
import { convertApiMatchToMatch, type ApiMatch, type Match } from '@/lib/data'
import { getAuthHeaders } from '@/lib/auth'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  async function fetchMatches() {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/api/competitions/matches/`, {
        headers: headers as HeadersInit,
      })
      if (response.ok) {
        const data: ApiMatch[] = await response.json()
        setMatches(data.map(convertApiMatchToMatch))
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [refreshKey])

  const filteredMatches = matches

  const handlePrediction = () => {
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">مسابقات</h1>
        <p className="text-muted-foreground mt-1">
          از اینجا میتونی لیست بازی ها رو ببینی و پیش‌بینی کنی
        </p>
      </div>

      {/* Matches Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} onPredict={handlePrediction} />
        ))}
      </div>

      {/* Empty State */}
      {filteredMatches.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">هیچ بازی پیدا نشد</h3>
          <p className="text-muted-foreground mt-1">
            مثل این که هیچ بازی نداریم.
          </p>
        </div>
      )}
    </div>
  )
}
