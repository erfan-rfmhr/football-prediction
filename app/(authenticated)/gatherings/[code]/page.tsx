'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import {
  getGathering,
  type Gathering,
  type LeaderboardEntry,
} from '@/lib/gatherings'
import {
  ArrowRight,
  Share2,
  Users,
  Crown,
  Trophy,
  Medal,
  Loader2,
  AlertCircle,
  Copy,
} from 'lucide-react'

export default function GatheringDetailPage() {
  const params = useParams<{ code: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [gathering, setGathering] = useState<Gathering | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const code = params?.code ?? ''
  
  useEffect(() => {
    if (!code) return
    
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getGathering(code)
        console.log(data.leaderboard)
        setGathering(data)
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در بارگذاری محفل')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [code])

  const handleShare = async () => {
    if (!gathering) return
    const baseURL = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${baseURL}/gatherings/join/${gathering.code}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('لینک دعوت را کپی کنید:', link)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !gathering) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/profile')} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          بازگشت به پروفایل
        </Button>
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-medium">محفل پیدا نشد</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error || 'ممکن است کد دعوت نامعتبر باشد یا دسترسی نداشته باشید'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const owner = gathering.is_owner
  const memberCount = gathering.member_count
  const invitationLink =
    typeof window !== 'undefined' ? `${window.location.origin}/gatherings/join/${gathering.code}` : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => router.push('/profile')} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          <span className="hidden sm:inline">بازگشت به پروفایل</span>
        </Button>
        <Button onClick={handleShare} className="gap-2">
          {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? 'کپی شد!' : 'دعوت'}
        </Button>
      </div>

      {/* Gathering Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{gathering.name}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {memberCount} عضو
                </span>
                <span>·</span>
                <span className="font-mono text-xs" dir="rtl">کد: {gathering.code}</span>
              </div>
            </div>
            {owner && (
              <Badge variant="default" className="gap-1">
                <Crown className="h-3 w-3" />
                شما مالک هستید
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground mb-1">لینک دعوت:</p>
            <code className="text-xs break-all" dir="ltr">{invitationLink}</code>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">جدول رتبه‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              هنوز رتبه‌بندی‌ای ثبت نشده است
            </p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = user && entry.username === user.name
                return (
                  <div
                    key={`${entry.username}-${index}`}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                      isCurrentUser ? 'bg-primary/5 border-primary/30' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <RankBadge rank={index + 1} />
                      <span className="font-medium truncate">{entry.username}</span>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">شما</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold tabular-nums shrink-0">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>{entry.total_points}</span>
                      <span className="text-xs text-muted-foreground">امتیاز</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
        <Trophy className="h-4 w-4" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-400/20 text-zinc-600 dark:text-zinc-300">
        <Medal className="h-4 w-4" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-500">
        <Medal className="h-4 w-4" />
      </div>
    )
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
      {rank}
    </div>
  )
}