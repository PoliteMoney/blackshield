'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, Play, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { MediaItem } from '@/components/blog/types'

export type { MediaItem }

const MAX_SIZE_BYTES = 25 * 1024 * 1024 // matches the blog-media bucket limit
const BUCKET = 'blog-media'

function pathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  return idx === -1 ? null : url.slice(idx + marker.length)
}

interface MediaUploaderProps {
  value: MediaItem[]
  onChange: (media: MediaItem[]) => void
}

/** Facebook-style composer: drag/drop or pick multiple photos and videos, preview grid, remove. */
export function MediaUploader({ value, onChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files)
    const valid = list.filter(f => {
      if (!/^image\/|^video\//.test(f.type)) {
        toast.error(`${f.name}: solo se permiten imágenes o videos`)
        return false
      }
      if (f.size > MAX_SIZE_BYTES) {
        toast.error(`${f.name}: supera el límite de 25MB`)
        return false
      }
      return true
    })
    if (valid.length === 0) return

    setUploading(n => n + valid.length)
    const supabase = createClient()
    const uploaded: MediaItem[] = []

    for (const file of valid) {
      const ext = file.name.split('.').pop() || 'bin'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
      if (error) {
        toast.error(`Error al subir ${file.name}`)
        setUploading(n => n - 1)
        continue
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      uploaded.push({ url: data.publicUrl, type: file.type.startsWith('video/') ? 'video' : 'image' })
      setUploading(n => n - 1)
    }

    if (uploaded.length) onChange([...value, ...uploaded])
  }

  async function remove(index: number) {
    const item = value[index]
    onChange(value.filter((_, i) => i !== index))
    const path = pathFromPublicUrl(item.url)
    if (path) {
      const supabase = createClient()
      await supabase.storage.from(BUCKET).remove([path])
    }
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault()
          setDragOver(false)
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center',
          dragOver ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <ImagePlus className="w-6 h-6 text-gray-400" />
        <p className="text-sm text-gray-600">
          Arrastra fotos o videos aquí, o <span className="text-[var(--color-accent)] font-medium">haz clic para elegir</span>
        </p>
        <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP, MP4, WebM — máx. 25MB por archivo</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={e => { if (e.target.files) uploadFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {(value.length > 0 || uploading > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {value.map((item, i) => (
            <div key={item.url} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              {item.type === 'video' ? (
                <>
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Quitar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                  Portada
                </span>
              )}
            </div>
          ))}
          {Array.from({ length: uploading }).map((_, i) => (
            <div key={`loading-${i}`} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
