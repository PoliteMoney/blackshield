import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/settings-form'

async function getSettings() {
  const supabase = createClient()
  const { data } = await supabase.from('site_config').select('*').order('category').order('label')
  return data || []
}

export default async function SettingsPage() {
  const settings = await getSettings()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sitio</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
