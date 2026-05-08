'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsProps {
  dict: {
    years: string;         years_value: string;         years_suffix: string
    clients: string;       clients_value: string;       clients_suffix: string
    countries: string;     countries_value: string;     countries_suffix: string
    satisfaction: string;  satisfaction_value: string;  satisfaction_suffix: string
    visible?: boolean
  }
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

  const yearsVal        = parseInt(dict.years_value)        || 15
  const clientsVal      = parseInt(dict.clients_value)      || 500
  const countriesVal    = parseInt(dict.countries_value)    || 12
  const satisfactionVal = parseInt(dict.satisfaction_value) || 98

  const counts = [
    useCountUp(yearsVal,        1500, started),
    useCountUp(clientsVal,      2000, started),
    useCountUp(countriesVal,    1200, started),
    useCountUp(satisfactionVal, 1800, started),
  ]

  const stats = [
    { suffix: dict.years_suffix        ?? '+',  label: dict.years },
    { suffix: dict.clients_suffix      ?? '+',  label: dict.clients },
    { suffix: dict.countries_suffix    ?? '',   label: dict.countries },
    { suffix: dict.satisfaction_suffix ?? '%',  label: dict.satisfaction },
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
