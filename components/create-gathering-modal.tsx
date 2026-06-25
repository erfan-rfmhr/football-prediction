'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'

interface CreateGatheringModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

export function CreateGatheringModal({ isOpen, onClose, onCreate }: CreateGatheringModalProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setError(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onCreate(name.trim())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ایجاد محفل')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />
      <div className="relative w-full max-w-md bg-card rounded-xl shadow-lg ring-1 ring-foreground/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">ایجاد محفل جدید</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="gathering-name" className="text-sm font-medium">
              نام محفل
            </label>
            <Input
              id="gathering-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: دوستان فوتبال"
              maxLength={50}
              required
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              ایجاد محفل
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}