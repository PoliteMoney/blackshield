'use client'

import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format, addDays, isWeekend } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { Calendar, Clock, Video, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  dict: Record<string, string>
  services: { id: string; title: string }[]
  settings: any
  locale: string
}

function generateSlots(start: string, end: string, duration: number, buffer: number): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let mins = sh * 60 + sm
  const endMins = eh * 60 + em
  while (mins + duration <= endMins) {
    const h = Math.floor(mins / 60).toString().padStart(2, '0')
    const m = (mins % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    mins += duration + buffer
  }
  return slots
}

export function BookingForm({ dict, services, settings, locale }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '',
    appointment_type: 'virtual', duration: 30,
    service_id: '', date: '', time: '', notes: ''
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const daysDiff = settings?.available_days || [1, 2, 3, 4, 5]
  const slotDuration = settings?.slot_duration || 30
  const bufferTime = settings?.buffer_time || 15
  const maxDays = settings?.max_advance_days || 60
  const startTime = settings?.start_time?.slice(0, 5) || '09:00'
  const endTime = settings?.end_time?.slice(0, 5) || '18:00'

  const allSlots = generateSlots(startTime, endTime, form.duration, bufferTime)
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

  async function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    if (!date) return
    setForm(p => ({ ...p, date: format(date, 'yyyy-MM-dd'), time: '' }))
    const res = await fetch(`/api/appointments/slots?date=${format(date, 'yyyy-MM-dd')}`)
    if (res.ok) {
      const data = await res.json()
      setBookedSlots(data.booked || [])
    }
  }

  function isDisabled(date: Date) {
    const day = date.getDay()
    const today = new Date(); today.setHours(0,0,0,0)
    return date < today || date > addDays(today, maxDays) || !daysDiff.includes(day)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      if (res.ok) {
        toast.success(dict.success)
        setStep(4)
      } else {
        toast.error(dict.error)
      }
    } catch {
      toast.error(dict.error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 4) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-3">{dict.success}</h2>
        <p className="text-[var(--color-muted-foreground)]">
          {locale === 'es' ? `Cita: ${form.date} a las ${form.time}` : `Appointment: ${form.date} at ${form.time}`}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Progress */}
      <div className="flex border-b border-[var(--color-border)]">
        {[1, 2, 3].map(s => (
          <div key={s} className={cn(
            'flex-1 py-4 text-center text-sm font-medium transition-colors',
            step === s ? 'bg-[var(--color-secondary)] text-white' :
            step > s ? 'bg-[var(--color-primary)]/20 text-[var(--color-accent)]' :
            'text-[var(--color-muted-foreground)]'
          )}>
            {s === 1 && (locale === 'es' ? '1. Información' : '1. Info')}
            {s === 2 && (locale === 'es' ? '2. Fecha y Hora' : '2. Date & Time')}
            {s === 3 && (locale === 'es' ? '3. Confirmar' : '3. Confirm')}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.name} *</label>
                <input type="text" required value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.email} *</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.phone}</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.company}</label>
                <input type="text" value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-3">{dict.type}</label>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { value: 'virtual', icon: Video, label: dict.virtual },
                  { value: 'presencial', icon: MapPin, label: dict.presencial },
                ].map(({ value, icon: Icon, label }) => (
                  <button key={value} type="button"
                    onClick={() => setForm(p => ({ ...p, appointment_type: value }))}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                      form.appointment_type === value
                        ? 'border-[var(--color-accent)] bg-[var(--color-muted)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    )}>
                    <Icon className={cn('w-5 h-5', form.appointment_type === value ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted-foreground)]')} />
                    <span className="font-medium text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-3">{dict.duration}</label>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { value: 30, label: dict.duration_30 },
                  { value: 60, label: dict.duration_60 },
                ].map(({ value, label }) => (
                  <button key={value} type="button"
                    onClick={() => setForm(p => ({ ...p, duration: value }))}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
                      form.duration === value
                        ? 'border-[var(--color-accent)] bg-[var(--color-muted)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    )}>
                    <Clock className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                    <span className="font-medium text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service */}
            {services.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.service}</label>
                <select value={form.service_id}
                  onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm bg-white">
                  <option value="">{dict.select_service}</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
            )}

            <button type="button" onClick={() => form.full_name && form.email ? setStep(2) : toast.error(locale === 'es' ? 'Complete los campos requeridos' : 'Fill required fields')}
              className="w-full py-4 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
              {locale === 'es' ? 'Continuar' : 'Continue'} →
            </button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {dict.date}
                </p>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDisabled}
                  locale={locale === 'es' ? es : enUS}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), maxDays)}
                  classNames={{
                    root: 'w-full',
                    months: 'w-full',
                    month: 'w-full',
                    table: 'w-full',
                    head_cell: 'text-[var(--color-muted-foreground)] text-xs font-medium p-2',
                    cell: 'p-1',
                    button: 'w-full h-9 rounded-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors text-sm',
                    day_selected: 'bg-[var(--color-secondary)] text-white',
                    day_disabled: 'text-[var(--color-muted-foreground)] opacity-30 cursor-not-allowed',
                    day_today: 'font-bold border border-[var(--color-accent)]',
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {dict.time}
                </p>
                {!selectedDate ? (
                  <p className="text-[var(--color-muted-foreground)] text-sm">{dict.select_date}</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-[var(--color-muted-foreground)] text-sm">{dict.no_slots}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map(slot => (
                      <button key={slot} type="button"
                        onClick={() => setForm(p => ({ ...p, time: slot }))}
                        className={cn(
                          'py-2 px-3 rounded-lg text-sm font-medium border transition-all',
                          form.time === slot
                            ? 'bg-[var(--color-secondary)] text-white border-transparent'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-secondary)]'
                        )}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-4 border border-[var(--color-border)] text-[var(--color-secondary)] font-medium rounded-lg hover:bg-[var(--color-muted)] transition-colors">
                ← {locale === 'es' ? 'Atrás' : 'Back'}
              </button>
              <button type="button"
                onClick={() => form.date && form.time ? setStep(3) : toast.error(locale === 'es' ? 'Seleccione fecha y hora' : 'Select date and time')}
                className="flex-1 py-4 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                {locale === 'es' ? 'Continuar' : 'Continue'} →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <div className="bg-[var(--color-muted)] rounded-lg p-6 mb-6 space-y-3">
              <h3 className="font-semibold text-[var(--color-secondary)] mb-4">{locale === 'es' ? 'Resumen de su cita' : 'Appointment Summary'}</h3>
              {[
                { label: locale === 'es' ? 'Nombre' : 'Name', value: form.full_name },
                { label: 'Email', value: form.email },
                { label: locale === 'es' ? 'Tipo' : 'Type', value: form.appointment_type },
                { label: locale === 'es' ? 'Duración' : 'Duration', value: `${form.duration} min` },
                { label: locale === 'es' ? 'Fecha' : 'Date', value: form.date },
                { label: locale === 'es' ? 'Hora' : 'Time', value: form.time },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">{item.label}</span>
                  <span className="font-medium text-[var(--color-secondary)]">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">{dict.notes}</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm resize-none" />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 py-4 border border-[var(--color-border)] text-[var(--color-secondary)] font-medium rounded-lg hover:bg-[var(--color-muted)] transition-colors">
                ← {locale === 'es' ? 'Atrás' : 'Back'}
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-4 bg-[var(--color-secondary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? dict.booking : dict.book}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
