import Image from 'next/image'
import type { MediaItem } from '@/components/blog/types'
import { cn } from '@/lib/utils'

interface PostMediaGalleryProps {
  media: MediaItem[]
  title: string
}

/** Facebook-style gallery grid for a post's attached photos/videos. */
export function PostMediaGallery({ media, title }: PostMediaGalleryProps) {
  if (media.length === 0) return null

  const gridClass =
    media.length === 1 ? 'grid-cols-1' :
    media.length === 2 ? 'grid-cols-2' :
    'grid-cols-2 sm:grid-cols-3'

  return (
    <div className={cn('grid gap-2 mb-12', gridClass)}>
      {media.map((item, i) => (
        <div
          key={item.url}
          className={cn(
            'relative rounded-lg overflow-hidden bg-[var(--color-muted)]',
            media.length === 1 ? 'aspect-video' : 'aspect-square'
          )}
        >
          {item.type === 'video' ? (
            <video src={item.url} controls className="w-full h-full object-cover bg-black" />
          ) : (
            <Image
              src={item.url}
              alt={`${title} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          )}
        </div>
      ))}
    </div>
  )
}
