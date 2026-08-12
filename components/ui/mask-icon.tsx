interface MaskIconProps {
  src: string
  className?: string
  color?: string
}

/** Recolors an icon image (PNG/SVG) to a solid CSS color via a mask, ignoring its original colors. */
export function MaskIcon({ src, className, color = 'var(--color-primary)' }: MaskIconProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
