'use client'

import { MatchCard } from '@/components/match-card'
import { convertApiMatchToMatch, type ApiMatch, type ApiPrediction, type Match } from '@/lib/data'
import { getAuthHeaders } from '@/lib/auth'
import { Calendar, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { Input } from '@/components/ui/input'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchMatches(query: string = '') {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const url = new URL(`${API_BASE_URL}/api/competitions/matches/`)
      if (query.trim()) {
        url.searchParams.append('team_name', query.trim())
      }
      const response = await fetch(url.toString(), {
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
    fetchMatches(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const filteredMatches = matches

  const handlePrediction = (matchId: string, saved: ApiPrediction) => {
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? {
              ...m,
              userPrediction: {
                id: saved.id,
                homeScore: saved.home_score,
                awayScore: saved.away_score,
              },
            }
          : m
      )
    )
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  return (
    <div className="space-y-6 pt-10 pb-10 px-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">مسابقات</h1>
        <p className="text-muted-foreground mt-1">
          از اینجا میتونی لیست بازی ها رو ببینی و پیش‌بینی کنی
        </p>
      </div>

      {/* Search Box */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="جستجو بر اساس نام تیم..."
          value={searchInput}
          onChange={handleSearchChange}
          className="pr-10 text-right"
        />
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
