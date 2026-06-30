'use client'

import { MatchCard } from '@/components/match-card'
import { convertApiMatchToMatch, type ApiMatch, type ApiPrediction, type Match, type PaginatedResponse } from '@/lib/data'
import { getAuthHeaders } from '@/lib/auth'
import { Calendar, Loader2, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TEHRAN_TZ = 'Asia/Tehran'
const RANGE_DAYS = 3 // days on each side of today

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TEHRAN_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// YYYY-MM-DD in Tehran timezone
function getDateKey(date: Date): string {
  return dateKeyFormatter.format(date)
}

function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCDate(date.getUTCDate() + days)
  return getDateKey(date)
}

function formatDateLabel(key: string, todayKey: string): string {
  if (key === todayKey) return 'امروز'
  if (key === shiftDateKey(todayKey, -1)) return 'دیروز'
  if (key === shiftDateKey(todayKey, 1)) return 'فردا'
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TEHRAN_TZ,
  })
}

function buildDateRange(from: string, to: string): string[] {
  const dates: string[] = []
  let current = from
  let safety = 0
  while (current <= to && safety < 365) {
    dates.push(current)
    current = shiftDateKey(current, 1)
    safety++
  }
  return dates
}

function getInitialRange(): { from: string; to: string } {
  const today = getDateKey(new Date())
  return {
    from: shiftDateKey(today, -RANGE_DAYS),
    to: shiftDateKey(today, RANGE_DAYS),
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeDate, setActiveDate] = useState<string>(() => getDateKey(new Date()))
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>(getInitialRange)

  // Group loaded matches by date key (Tehran timezone)
  const groupedMatches = useMemo(() => {
    const groups = new Map<string, Match[]>()
    for (const match of matches) {
      if (!match.startedAt) continue
      const key = getDateKey(new Date(match.startedAt))
      const existing = groups.get(key)
      if (existing) {
        existing.push(match)
      } else {
        groups.set(key, [match])
      }
    }
    for (const [key, items] of groups) {
      items.sort(
        (a, b) => new Date(a.startedAt!).getTime() - new Date(b.startedAt!).getTime()
      )
    }
    return groups
  }, [matches])

  // All dates in the current range, with their matches (if any)
  const dateTabs = useMemo(() => {
    const dates = buildDateRange(dateRange.from, dateRange.to)
    const todayKey = getDateKey(new Date())
    return dates.map(key => ({
      key,
      label: formatDateLabel(key, todayKey),
      matches: groupedMatches.get(key) || [],
    }))
  }, [dateRange, groupedMatches])

  async function fetchMatches(
    query: string = '',
    range: { from: string; to: string } = dateRange,
    append = false,
    url?: string
  ) {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    try {
      const headers = await getAuthHeaders()
      const fetchUrl =
        url ??
        (() => {
          const u = new URL(`${API_BASE_URL}/api/competitions/matches/`)
          u.searchParams.append('date_from', range.from)
          u.searchParams.append('date_to', range.to)
          if (query.trim()) {
            u.searchParams.append('team_name', query.trim())
          }
          return u.toString()
        })()
      const response = await fetch(fetchUrl, {
        headers: headers as HeadersInit,
      })
      if (response.ok) {
        const data: PaginatedResponse<ApiMatch> = await response.json()
        const converted = data.results.map(convertApiMatchToMatch)
        setMatches(prev => (append ? [...prev, ...converted] : converted))
        setNextPage(data.next)
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchMatches(searchQuery, dateRange)
  }, [searchQuery, dateRange])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Keep active date in sync with the available tabs
  useEffect(() => {
    if (dateTabs.length === 0) {
      if (activeDate !== '') setActiveDate('')
      return
    }
    if (!dateTabs.some(t => t.key === activeDate)) {
      setActiveDate(dateTabs[0].key)
    }
  }, [dateTabs, activeDate])

  const handleTabChange = (key: string) => {
    setActiveDate(key)
    // Extend the window when the user reaches the edge.
    // Only fetch the newly added days; previously fetched matches are kept.
    if (key === dateRange.from) {
      const newFrom = shiftDateKey(dateRange.from, -RANGE_DAYS)
      const fetchFrom = newFrom
      const fetchTo = shiftDateKey(dateRange.from, -1)
      setDateRange(prev => ({ ...prev, from: newFrom }))
      fetchMatches(searchQuery, { from: fetchFrom, to: fetchTo }, true)
    }
    if (key === dateRange.to) {
      const newTo = shiftDateKey(dateRange.to, RANGE_DAYS)
      const fetchFrom = shiftDateKey(dateRange.to, 1)
      const fetchTo = newTo
      setDateRange(prev => ({ ...prev, to: newTo }))
      fetchMatches(searchQuery, { from: fetchFrom, to: fetchTo }, true)
    }
  }

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

  const handleLoadMore = () => {
    if (nextPage) {
      fetchMatches(searchQuery, dateRange, true, nextPage)
    }
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

      {/* Matches by Date */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">هیچ بازی پیدا نشد</h3>
          <p className="text-muted-foreground mt-1">
            مثل این که هیچ بازی نداریم.
          </p>
        </div>
      ) : (
        <Tabs
          value={activeDate}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="relative">
            <TabsList
              variant="line"
              className="w-full justify-start overflow-x-auto flex-nowrap gap-1 pb-1"
            >
              {dateTabs.map(tab => (
                <TabsTrigger key={tab.key} value={tab.key} className="shrink-0">
                  {tab.label}
                  {tab.matches.length > 0 && (
                    <span className="ms-1.5 text-xs text-muted-foreground">
                      ({tab.matches.length})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {dateTabs.map(tab => (
            <TabsContent key={tab.key} value={tab.key} className="pt-4">
              {tab.matches.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tab.matches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onPredict={handlePrediction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  بازی برای این تاریخ پیدا نشد
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Load More */}
      {nextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال بارگذاری...
              </>
            ) : (
              'بارگذاری بیشتر'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
