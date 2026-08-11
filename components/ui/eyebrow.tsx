import { cn } from '@/lib/utils'

interface EyebrowProps {
  label: string
  align?: 'left' | 'center'
  tone?: 'gold' | 'white' | 'accent'
  className?: string
}

/**
 * Site-wide section label: crosshair mark + tracked uppercase text.
 * Replaces the generic pill-badge pattern. The crosshair references
 * Blackshield's intelligence/OSINT positioning (radar, precision, watch).
 */
export function Eyebrow({ label, align = 'left', tone = 'gold', className }: EyebrowProps) {
  const color = tone === 'white' ? 'text-white' : tone === 'accent' ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)]'

  return (
    <div className={cn('flex items-center gap-2.5', align === 'center' && 'justify-center', className)}>
      <svg viewBox="0 0 16 16" className={cn('w-3 h-3 flex-shrink-0', color)} fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1" />
        <path d="M8 0.5v3M8 12.5v3M0.5 8h3M12.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <span className={cn('text-[10px] font-semibold tracking-[0.25em] uppercase', color)}>
        {label}
      </span>
    </div>
  )
}
