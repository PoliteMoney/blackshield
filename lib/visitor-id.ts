const STORAGE_KEY = 'bs_visitor_id'

/** Stable anonymous id for this browser, used to scope public post reactions. */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
