import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = 'es-MX') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}
