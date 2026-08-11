'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, Heart } from 'lucide-react'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SourceBadge } from '@/components/blog/source-badge'
import { formatDate } from '@/lib/utils'

interface InsightPost {
  id: string
  slug: string
  image_url?: string | null
  category?: string | null
  published_at?: string | null
  source_platform?: string | null
  source_url?: string | null
  title: string
  excerpt?: string
  reactionCount: number
}

interface InsightsSectionProps {
  dict: { badge: string; title: string; subtitle: string; read_more: string; all_articles: string }
  posts: InsightPost[]
  locale: string
}

export function InsightsSection({ dict, posts, locale }: InsightsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (posts.length === 0) return null

  function scroll(direction: 'left' | 'right') {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth ?? 320
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 24) : cardWidth + 24, behavior: 'smooth' })
  }

  return (
    <section id="insights" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow label={dict.badge} className="mb-5" />
            <h2 className="display-heading text-4xl lg:text-5xl xl:text-6xl text-[var(--color-secondary)]">
              {dict.title}
            </h2>
            <p className="text-[var(--color-muted-foreground)] text-lg mt-4 max-w-xl">{dict.subtitle}</p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-[var(--color-accent)] text-sm font-medium hover:opacity-75 transition-opacity whitespace-nowrap"
            >
              {dict.all_articles}
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Anterior"
                className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Siguiente"
                className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              data-card
              className="card-flat group bg-white overflow-hidden flex-shrink-0 w-[300px] sm:w-[340px] snap-start"
            >
              <div className="aspect-video bg-[var(--color-muted)] relative overflow-hidden">
                {post.image_url ? (
                  <Image src={post.image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-[var(--color-navy-deep)] flex items-center justify-center">
                    <span className="text-[var(--color-primary)] font-heading text-base font-semibold px-4 text-center">{post.title}</span>
                  </div>
                )}
                {post.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--color-primary)] text-[var(--color-secondary)] text-[10px] font-semibold rounded">
                    {post.category}
                  </span>
                )}
                {post.source_platform !== 'native' && (
                  <div className="absolute top-3 right-3">
                    <SourceBadge platform={post.source_platform} className="bg-white/90 backdrop-blur-sm" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[var(--color-secondary)] text-base mb-2 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[var(--color-muted-foreground)] text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-[var(--color-muted-foreground)] text-xs">
                  {post.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.published_at, locale === 'es' ? 'es-MX' : 'en-US')}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> {post.reactionCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
