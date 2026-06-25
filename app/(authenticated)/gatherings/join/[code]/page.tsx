'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  joinGathering,
  type Gathering,
} from '@/lib/gatherings'
import {
  CheckCircle2,
  Users,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
} from 'lucide-react'

export default function JoinGatheringPage() {
  const params = useParams<{ code: string }>()
  const [gathering, setGathering] = useState<Gathering | null>(null)
  const [isJoining, setIsJoining] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const code = params?.code ?? ''

  useEffect(() => {
    if (!code) return

    const join = async () => {
      setIsJoining(true)
      setError(null)
      try {
        const data = await joinGathering(code)
        setGathering(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در پیوستن به محفل')
      } finally {
        setIsJoining(false)
      }
    }
    join()
  }, [code])

  if (isJoining) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">در حال پیوستن به محفل...</p>
      </div>
    )
  }

  if (error || !gathering) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-lg">خطا در پیوستن</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error || 'کد دعوت نامعتبر است یا محفل وجود ندارد'}
              </p>
            </div>
            <Link href="/profile" className="mt-2">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                بازگشت به پروفایل
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardContent className="py-10 flex flex-col items-center gap-4 text-center">
          <div className="p-3 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold">
              شما به محفل {gathering.name} پیوستید
            </h1>
            <p className="text-sm text-muted-foreground">
              اکنون می‌توانید با اعضای این محفل رقابت کنید
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Users className="h-4 w-4" />
            <span>{gathering.member_count} عضو</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full pt-4">
            <Link href={`/gatherings/${gathering.code}`} className="flex-1">
              <Button className="w-full gap-2">
                <Eye className="h-4 w-4" />
                مشاهده جزئیات محفل
              </Button>
            </Link>
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full">
                بازگشت به پروفایل
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}