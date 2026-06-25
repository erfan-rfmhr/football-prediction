'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateGatheringModal } from '@/components/create-gathering-modal'
import {
  listGatherings,
  createGathering,
  type Gathering,
} from '@/lib/gatherings'
import { Users, Plus, Share2, Eye, Crown, Loader2, AlertCircle } from 'lucide-react'

export function GatheringsSection() {
  const [gatherings, setGatherings] = useState<Gathering[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const fetchGatherings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listGatherings()
      setGatherings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری محفل‌ها')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGatherings()
  }, [])

  const handleCreate = async (name: string) => {
    await createGathering(name)
    await fetchGatherings()
  }

  const handleInvite = async (gathering: Gathering) => {
    const baseURL = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${baseURL}/gatherings/join/${gathering.code}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedCode(gathering.code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      // Fallback: prompt
      window.prompt('لینک دعوت را کپی کنید:', link)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">محفل‌ها</h2>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">ایجاد محفل جدید</span>
          <span className="sm:hidden">محفل جدید</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchGatherings}>
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      ) : gatherings.length === 0 ? (
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">هنوز محفلی نداری</p>
              <p className="text-sm text-muted-foreground mt-1">
                یک محفل بساز و دوستانت رو دعوت کن
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              ایجاد اولین محفل
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {gatherings.map((gathering) => (
            <GatheringCard
              key={gathering.id}
              gathering={gathering}
              copiedCode={copiedCode}
              onInvite={handleInvite}
            />
          ))}
        </div>
      )}

      <CreateGatheringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

interface GatheringCardProps {
  gathering: Gathering
  copiedCode: string | null
  onInvite: (gathering: Gathering) => void
}

function GatheringCard({ gathering, copiedCode, onInvite }: GatheringCardProps) {
  const owner = gathering.is_owner
  const memberCount = gathering.member_count
  const isCopied = copiedCode === gathering.code

  return (
    <Card className="hover:ring-foreground/20 transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{gathering.name}</h3>
              {owner && (
                <Badge variant="default" className="gap-1">
                  <Crown className="h-3 w-3" />
                  مالک
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {memberCount} عضو
              </span>
              <span className="font-mono text-xs" dir="ltr">{gathering.code}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/gatherings/${gathering.code}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              جزئیات
            </Button>
          </Link>
          <Button
            variant={isCopied ? 'secondary' : 'default'}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onInvite(gathering)}
          >
            <Share2 className="h-3.5 w-3.5" />
            {isCopied ? 'کپی شد!' : 'دعوت'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}