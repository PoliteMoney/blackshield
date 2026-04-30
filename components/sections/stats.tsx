'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsProps {
  dict: { years: string; clients: string; countries: string; satisfaction: string }
}

function useCountUp(end: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, started])
  return count
}

export function Stats({ dict }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: 15, suffix: '+', label: dict.years },
    { value: 500, suffix: '+', label: dict.clients },
    { value: 12, suffix: '', label: dict.countries },
    { value: 98, suffix: '%', label: dict.satisfaction },
  ]

  const counts = [
    useCountUp(15, 1500, started),
    useCountUp(500, 2000, started),
    useCountUp(12, 1200, started),
    useCountUp(98, 1800, started),
  ]

  return (
    <section ref={ref} className="py-16 bg-[var(--color-accent)]">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-4xl lg:text-5xl font-light mb-2 text-white"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {counts[i]}{stat.suffix}
              </div>
              <div className="text-white/60 text-xs font-semibold tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
