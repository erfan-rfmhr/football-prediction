'use client'

import { useState, useEffect } from 'react'
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
import { type ApiPrediction, getPredictions } from '@/lib/data'
import { Search, ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'pending' | 'correct' | 'incorrect'

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<ApiPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const data = await getPredictions()
        setPredictions(data)
      } catch (error) {
        console.error('Failed to fetch predictions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPredictions()
  }, [])

  const getResultStatus = (prediction: ApiPrediction): 'correct' | 'incorrect' | 'pending' => {
    if (prediction.points === null || prediction.points === undefined) return 'pending'
    return prediction.points > 0 ? 'correct' : 'incorrect'
  }

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
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/30" variant="outline">درست</Badge>
      case 'incorrect':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30" variant="outline">نادرست</Badge>
      default:
        return <Badge variant="secondary">در انتظار</Badge>
    }
  }

  const filteredPredictions = predictions.filter(pred => {
    const homeName = typeof pred.match === 'object' ? pred.match.home_team?.name : ''
    const awayName = typeof pred.match === 'object' ? pred.match.away_team?.name : ''
    const matchText = `${homeName || ''} ${awayName || ''}`.toLowerCase()
    const matchesSearch = matchText.includes(search.toLowerCase())
    const result = getResultStatus(pred)
    const matchesStatus = statusFilter === 'all' || result === statusFilter
    return matchesSearch && matchesStatus
  })

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
        <h1 className="text-2xl sm:text-3xl font-bold">پیش‌بینی‌های من</h1>
        <p className="text-muted-foreground mt-1">
          مشاهده پیش‌بینی‌های انجام شده و تاریخچه نتایج
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی بازی‌ها..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="فیلتر بر اساس وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="pending">در انتظار</SelectItem>
            <SelectItem value="correct">درست</SelectItem>
            <SelectItem value="incorrect">نادرست</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>بازی</TableHead>
              <TableHead className='text-center'>پیشبینی شما</TableHead>
              <TableHead className='text-center'>نتیجه نهایی</TableHead>
              <TableHead className="text-center">امتیاز</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPredictions.map((pred) => {
              const homeName = typeof pred.match === 'object' ? pred.match.home_team?.name : ''
              const awayName = typeof pred.match === 'object' ? pred.match.away_team?.name : ''
              const homeScore = typeof pred.match === 'object' ? pred.match.home_score : null
              const awayScore = typeof pred.match === 'object' ? pred.match.away_score : null
              const result = getResultStatus(pred)
              
              return (
                <TableRow key={pred.id}>
                  <TableCell className='text-center'>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium">{homeName}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-medium">{awayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge variant="outline" className="font-medium">
                      {pred.home_score} - {pred.away_score}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    {homeScore !== null && awayScore !== null ? (
                      <span className="font-semibold tabular-nums">
                        {homeScore} - {awayScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'font-semibold tabular-nums',
                      result === 'correct' && 'text-green-600',
                      result === 'incorrect' && 'text-red-500'
                    )}>
                      {pred.points !== null && pred.points !== undefined ? `+${pred.points}` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getResultBadge(result)}
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
          const homeName = typeof pred.match === 'object' ? pred.match.home_team?.name : ''
          const awayName = typeof pred.match === 'object' ? pred.match.away_team?.name : ''
          const homeScore = typeof pred.match === 'object' ? pred.match.home_score : null
          const awayScore = typeof pred.match === 'object' ? pred.match.away_score : null
          const result = getResultStatus(pred)
          
          return (
            <div key={pred.id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{homeName}</span>
                  <span className="text-muted-foreground text-sm">vs</span>
                  <span className="font-medium text-sm">{awayName}</span>
                </div>
                {getResultBadge(result)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">پیش‌بینی شما: </span>
                  <span className="font-medium">{pred.home_score} - {pred.away_score}</span>
                </div>
                {homeScore !== null && awayScore !== null && (
                  <div>
                    <span className="text-muted-foreground">نتیجه: </span>
                    <span className="font-semibold">{homeScore} - {awayScore}</span>
                  </div>
                )}
              </div>
              {pred.points !== null && pred.points !== undefined && (
                <div className={cn(
                  'text-sm font-semibold',
                  result === 'correct' ? 'text-green-600' : 'text-red-500'
                )}>
                  {result === 'correct' ? `+${pred.points} امتیاز` : 'بدون امتیاز'}
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
          <h3 className="text-lg font-semibold">پیش‌بینی یافت نشد</h3>
          <p className="text-muted-foreground mt-1">
            {search ? 'عبارت دیگری را جستجو کنید' : 'برای مشاهده لیست، پیش‌بینی‌های خود را ثبت کنید'}
          </p>
        </div>
      )}
    </div>
  )
}