import { Facebook, Linkedin, Instagram } from 'lucide-react'
import { XIcon } from '@/components/ui/x-icon'

export const SOURCE_PLATFORMS = [
  { value: 'native', label: 'Publicación propia' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X' },
] as const

export type SourcePlatform = (typeof SOURCE_PLATFORMS)[number]['value']

const PLATFORM_META: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  facebook: { label: 'Facebook', Icon: Facebook, color: '#1877F2' },
  linkedin: { label: 'LinkedIn', Icon: Linkedin, color: '#0A66C2' },
  instagram: { label: 'Instagram', Icon: Instagram, color: '#E1306C' },
  x: { label: 'X', Icon: XIcon, color: '#000000' },
}

interface SourceBadgeProps {
  platform?: string | null
  className?: string
}

/**
 * Small, purely visual badge showing which social network a post was reposted from.
 * Deliberately not a link itself — callers that need "view original" should wrap this
 * in their own <a> only where it isn't nested inside another link (e.g. the post detail
 * page), never inside a card that's already a <Link> to the post.
 */
export function SourceBadge({ platform, className }: SourceBadgeProps) {
  if (!platform || platform === 'native') return null
  const meta = PLATFORM_META[platform]
  if (!meta) return null
  const { label, Icon, color } = meta

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${className || ''}`}
      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}0D` }}
    >
      <Icon className="w-3 h-3" />
      Repost de {label}
    </span>
  )
}
