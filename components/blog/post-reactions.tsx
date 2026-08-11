'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getVisitorId } from '@/lib/visitor-id'
import { cn } from '@/lib/utils'

interface PostReactionsProps {
  postId: string
  initialCount: number
  className?: string
}

/** Instagram-style single "like" reaction — anonymous, toggleable, scoped by visitor id. */
export function PostReactions({ postId, initialCount, className }: PostReactionsProps) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return
    const supabase = createClient()
    supabase
      .from('post_reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_id', visitorId)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data))
  }, [postId])

  async function toggle(e: React.MouseEvent) {
    // Reactions are often nested inside a card that links to the post — never navigate on click.
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    const visitorId = getVisitorId()
    const wasLiked = liked
    setLiked(!wasLiked)
    setCount(c => c + (wasLiked ? -1 : 1))

    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('toggle_post_reaction', {
        p_post_id: postId,
        p_visitor_id: visitorId,
      })
      if (error) throw error
      setLiked(!!data)
    } catch {
      setLiked(wasLiked)
      setCount(c => c + (wasLiked ? 1 : -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? 'Quitar reacción' : 'Reaccionar a esta publicación'}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors',
        liked
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
          : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
        className
      )}
    >
      <Heart className={cn('w-4 h-4 transition-transform', liked && 'fill-current scale-110')} />
      <span className="text-sm font-medium tabular-nums">{count}</span>
    </button>
  )
}
