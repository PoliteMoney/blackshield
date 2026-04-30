import { createClient } from '@/lib/supabase/server'

export async function getHomeContent(locale: string): Promise<Record<string, Record<string, any>>> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('page_content')
      .select('section, extra')
      .eq('page', 'home')
      .eq('locale', locale)
      .eq('is_active', true)

    const result: Record<string, Record<string, any>> = {}
    for (const row of data || []) {
      if (row.extra && typeof row.extra === 'object') {
        result[row.section] = row.extra
      }
    }
    return result
  } catch {
    return {}
  }
}
