'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Globe, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

// ── Field schema ──────────────────────────────────────────────────────────────

type FieldType = 'text' | 'textarea' | 'string-array' | 'step-array' | 'work-array' | 'image-url' | 'toggle'

interface FieldDef {
  key: string
  label: string
  type: FieldType
  placeholder?: string
}

const SCHEMAS: Record<string, { label: string; fields: FieldDef[]; page?: string }> = {
  hero: {
    label: 'Hero',
    fields: [
      { key: 'badge',           label: 'Badge / etiqueta superior',   type: 'text' },
      { key: 'tagline_line1',   label: 'Título – línea 1',            type: 'text' },
      { key: 'tagline_line2',   label: 'Título – línea 2 (énfasis)',  type: 'text' },
      { key: 'sub_tagline',     label: 'Sub-tagline',                 type: 'text' },
      { key: 'subtitle',        label: 'Descripción',                 type: 'textarea' },
      { key: 'cta_primary',     label: 'Botón principal',             type: 'text' },
      { key: 'cta_secondary',   label: 'Botón secundario',            type: 'text' },
      { key: 'scroll',          label: 'Texto indicador de scroll',   type: 'text' },
      { key: 'trust_1',         label: 'Indicador de confianza 1',    type: 'text' },
      { key: 'trust_2',         label: 'Indicador de confianza 2',    type: 'text' },
      { key: 'trust_3',         label: 'Indicador de confianza 3',    type: 'text' },
      { key: 'radar_card1_label', label: 'Tarjeta radar 1 – etiqueta',     type: 'text' },
      { key: 'radar_card1_desc',  label: 'Tarjeta radar 1 – descripción',  type: 'text' },
      { key: 'radar_card2_label', label: 'Tarjeta radar 2 – etiqueta',     type: 'text' },
      { key: 'radar_card2_desc',  label: 'Tarjeta radar 2 – descripción',  type: 'text' },
    ],
  },
  about: {
    label: 'Quiénes Somos',
    fields: [
      { key: 'badge',         label: 'Badge / etiqueta superior', type: 'text' },
      { key: 'title',         label: 'Título',                    type: 'text' },
      { key: 'subtitle',      label: 'Subtítulo',                 type: 'textarea' },
      { key: 'mission_title', label: 'Título – Misión',           type: 'text' },
      { key: 'mission_body',  label: 'Texto – Misión',            type: 'textarea' },
      { key: 'vision_title',  label: 'Título – Visión',           type: 'text' },
      { key: 'vision_body',   label: 'Texto – Visión',            type: 'textarea' },
      { key: 'values_title',  label: 'Título – Valores',          type: 'text' },
      { key: 'values',        label: 'Valores (un valor por línea)', type: 'string-array', placeholder: 'Confidencialidad y discreción\nIntegridad y ética\n...' },
      { key: 'years_label',   label: 'Etiqueta – Años de experiencia', type: 'text' },
      { key: 'clients_label', label: 'Etiqueta – Clientes atendidos',  type: 'text' },
    ],
  },
  stats: {
    label: 'Estadísticas',
    fields: [
      { key: 'visible',            label: 'Mostrar sección',           type: 'toggle' },
      { key: 'years_value',        label: 'Años — número',             type: 'text', placeholder: '15' },
      { key: 'years_suffix',       label: 'Años — sufijo',             type: 'text', placeholder: '+' },
      { key: 'years',              label: 'Años — etiqueta',           type: 'text' },
      { key: 'clients_value',      label: 'Clientes — número',         type: 'text', placeholder: '500' },
      { key: 'clients_suffix',     label: 'Clientes — sufijo',         type: 'text', placeholder: '+' },
      { key: 'clients',            label: 'Clientes — etiqueta',       type: 'text' },
      { key: 'countries_value',    label: 'Países — número',           type: 'text', placeholder: '12' },
      { key: 'countries_suffix',   label: 'Países — sufijo',           type: 'text', placeholder: '(vacío)' },
      { key: 'countries',          label: 'Países — etiqueta',         type: 'text' },
      { key: 'satisfaction_value', label: 'Satisfacción — número',     type: 'text', placeholder: '98' },
      { key: 'satisfaction_suffix',label: 'Satisfacción — sufijo',     type: 'text', placeholder: '%' },
      { key: 'satisfaction',       label: 'Satisfacción — etiqueta',   type: 'text' },
    ],
  },
  services: {
    label: 'Servicios',
    fields: [
      { key: 'badge',        label: 'Badge / etiqueta superior',      type: 'text' },
      { key: 'title',        label: 'Título',                         type: 'text' },
      { key: 'subtitle',     label: 'Subtítulo',                      type: 'textarea' },
      { key: 'learn_more',   label: 'Botón "conocer más"',           type: 'text' },
      { key: 'all_services', label: 'Botón "ver todos los servicios"', type: 'text' },
    ],
  },
  sectors: {
    label: 'Sectores',
    fields: [
      { key: 'badge',    label: 'Badge / etiqueta superior', type: 'text' },
      { key: 'title',    label: 'Título',                    type: 'text' },
      { key: 'subtitle', label: 'Subtítulo',                 type: 'textarea' },
    ],
  },
  methodology: {
    label: 'Metodología',
    fields: [
      { key: 'badge',    label: 'Badge / etiqueta superior', type: 'text' },
      { key: 'title',    label: 'Título',                    type: 'text' },
      { key: 'subtitle', label: 'Subtítulo',                 type: 'textarea' },
      { key: 'steps',    label: 'Pasos (título + descripción)', type: 'step-array' },
    ],
  },
  cta: {
    label: 'Llamada a la acción',
    fields: [
      { key: 'title',    label: 'Título',            type: 'text' },
      { key: 'subtitle', label: 'Subtítulo',         type: 'textarea' },
      { key: 'button',   label: 'Botón principal',   type: 'text' },
      { key: 'contact',  label: 'Botón secundario',  type: 'text' },
    ],
  },
  faq: {
    label: 'Preguntas Frecuentes',
    fields: [
      { key: 'badge',    label: 'Badge / etiqueta superior', type: 'text' },
      { key: 'title',    label: 'Título',                    type: 'text' },
      { key: 'subtitle', label: 'Subtítulo',                 type: 'textarea' },
    ],
  },
  contact: {
    label: 'Contacto',
    fields: [
      { key: 'badge',              label: 'Badge / etiqueta superior',   type: 'text' },
      { key: 'title',              label: 'Título',                      type: 'text' },
      { key: 'subtitle',           label: 'Subtítulo',                   type: 'textarea' },
      { key: 'form_title',         label: 'Título del formulario',       type: 'text' },
      { key: 'name',               label: 'Label: Nombre',               type: 'text' },
      { key: 'email',              label: 'Label: Email',                type: 'text' },
      { key: 'phone',              label: 'Label: Teléfono',             type: 'text' },
      { key: 'company',            label: 'Label: Empresa',              type: 'text' },
      { key: 'subject',            label: 'Label: Asunto',               type: 'text' },
      { key: 'message',            label: 'Label: Mensaje',              type: 'text' },
      { key: 'send',               label: 'Botón enviar',                type: 'text' },
      { key: 'success',            label: 'Mensaje de éxito',            type: 'text' },
      { key: 'error',              label: 'Mensaje de error',            type: 'text' },
      { key: 'whatsapp',           label: 'Texto botón WhatsApp',        type: 'text' },
      { key: 'whatsapp_instant',   label: 'Sub-texto WhatsApp',          type: 'text' },
      { key: 'contact_info_title', label: 'Título – Información de contacto', type: 'text' },
      { key: 'email_label',        label: 'Label Email (info)',          type: 'text' },
      { key: 'phone_label',        label: 'Label Teléfono (info)',       type: 'text' },
      { key: 'address_label',      label: 'Label Dirección (info)',      type: 'text' },
    ],
  },
  nav: {
    label: 'Navegación',
    fields: [
      { key: 'home',        label: 'Inicio',             type: 'text' },
      { key: 'about',       label: 'Quiénes Somos',      type: 'text' },
      { key: 'services',    label: 'Servicios',           type: 'text' },
      { key: 'sectors',     label: 'Sectores',            type: 'text' },
      { key: 'methodology', label: 'Metodología',         type: 'text' },
      { key: 'blog',        label: 'Blog',                type: 'text' },
      { key: 'faq',         label: 'FAQ',                 type: 'text' },
      { key: 'contact',     label: 'Contacto',            type: 'text' },
      { key: 'book',        label: 'Agendar Cita',        type: 'text' },
    ],
  },
  footer: {
    label: 'Pie de página',
    fields: [
      { key: 'description',  label: 'Descripción de la empresa',    type: 'textarea' },
      { key: 'quick_links',  label: 'Título – Enlaces rápidos',     type: 'text' },
      { key: 'services',     label: 'Título – Servicios',           type: 'text' },
      { key: 'legal',        label: 'Título – Legal',               type: 'text' },
      { key: 'terms',        label: 'Términos y condiciones',       type: 'text' },
      { key: 'privacy',      label: 'Aviso de privacidad',          type: 'text' },
      { key: 'cookies',      label: 'Política de cookies',          type: 'text' },
      { key: 'rights',       label: 'Texto derechos reservados',    type: 'text' },
    ],
  },
  capacities: {
    label: 'Capacidades',
    fields: [
      { key: 'title', label: 'Título de sección', type: 'text' },
      { key: 'items', label: 'Items (título + descripción)', type: 'step-array' },
    ],
  },
  how_we_work: {
    label: 'Cómo Trabajamos',
    fields: [
      { key: 'title', label: 'Título de sección', type: 'text' },
      { key: 'items', label: 'Items (etiqueta + descripción + tagline)', type: 'work-array' },
    ],
  },
  when_we_intervene: {
    label: 'Cuándo Intervenimos',
    fields: [
      { key: 'title',   label: 'Título de sección',    type: 'text' },
      { key: 'tagline', label: 'Tagline inferior',      type: 'text' },
      { key: 'items',   label: 'Items (un label por línea)', type: 'string-array' },
    ],
  },
  strategic: {
    label: 'Sección Estratégica (México)',
    fields: [
      { key: 'title',       label: 'Título',                                    type: 'text' },
      { key: 'paragraph_1', label: 'Párrafo 1',                                 type: 'textarea' },
      { key: 'paragraph_2', label: 'Párrafo 2',                                 type: 'textarea' },
      { key: 'paragraph_3', label: 'Párrafo 3',                                 type: 'textarea' },
      { key: 'image_url',   label: 'Imagen derecha (URL)',                       type: 'image-url', placeholder: '/images/mi-imagen.png  ó  https://...' },
    ],
  },
  cookies: {
    label: 'Banner de cookies',
    fields: [
      { key: 'message', label: 'Mensaje del banner',     type: 'textarea' },
      { key: 'policy',  label: 'Texto del enlace',       type: 'text' },
      { key: 'accept',  label: 'Botón aceptar',          type: 'text' },
      { key: 'decline', label: 'Botón rechazar',         type: 'text' },
    ],
  },

  // ── Capacity detail pages ──────────────────────────────────────────────────
  'representacion-estrategica': {
    label: 'Cap: Representación estratégica',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'inteligencia-estrategica': {
    label: 'Cap: Inteligencia estratégica',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'entrada-y-operacion': {
    label: 'Cap: Entrada y operación',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'estructuracion-corporativa': {
    label: 'Cap: Estructuración corporativa',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'proteccion-patrimonial': {
    label: 'Cap: Protección patrimonial',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'asuntos-legales': {
    label: 'Cap: Asuntos legales',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'representacion-de-victimas': {
    label: 'Cap: Representación de víctimas',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'gestion-de-crisis': {
    label: 'Cap: Gestión de crisis',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'gobernanza': {
    label: 'Cap: Gobernanza y cumplimiento',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'propiedad-intelectual': {
    label: 'Cap: Propiedad intelectual',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
  'fortalecimiento-institucional': {
    label: 'Cap: Fortalecimiento institucional',
    page: 'capacidades',
    fields: [
      { key: 'title',      label: 'Título de la página',            type: 'text' },
      { key: 'paragraphs', label: 'Párrafos (uno por línea)',        type: 'string-array' },
    ],
  },
}

const SECTION_KEYS = Object.keys(SCHEMAS)
const LOCALES = [
  { code: 'es', label: '🇲🇽 Español' },
  { code: 'en', label: '🇺🇸 English' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildInitialData(rows: any[]): Record<string, Record<string, Record<string, any>>> {
  const result: Record<string, Record<string, Record<string, any>>> = { es: {}, en: {} }
  for (const row of rows) {
    const loc: string = row.locale || 'es'
    const sec: string = row.section
    if (!result[loc]) result[loc] = {}
    result[loc][sec] = { ...(row.extra || {}) }
  }
  return result
}

// ── Main component ────────────────────────────────────────────────────────────

export function ContentEditor({ content: initial }: { content: any[] }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [activeLocale, setActiveLocale]   = useState('es')
  const [data, setData] = useState(() => buildInitialData(initial))
  const [saving, setSaving] = useState(false)

  const schema = SCHEMAS[activeSection]
  const current: Record<string, any> = data[activeLocale]?.[activeSection] ?? {}

  function getValue(key: string): any {
    return current[key] ?? ''
  }

  function setValue(key: string, val: any) {
    setData(prev => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [activeSection]: { ...(prev[activeLocale]?.[activeSection] ?? {}), [key]: val },
      },
    }))
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    try {
      const extra = data[activeLocale]?.[activeSection] ?? {}
      const page = SCHEMAS[activeSection]?.page ?? 'home'
      const { error } = await supabase.from('page_content').upsert(
        { page, section: activeSection, locale: activeLocale, is_active: true, extra },
        { onConflict: 'page,section,locale' }
      )
      if (error) throw error
      toast.success('Guardado correctamente')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar — sections */}
      <div className="w-52 flex-shrink-0 space-y-0.5">
        {SECTION_KEYS.map((key, idx) => {
          const isCapPage = SCHEMAS[key].page === 'capacidades'
          const prevIsCapPage = idx > 0 && SCHEMAS[SECTION_KEYS[idx - 1]].page === 'capacidades'
          const showDivider = isCapPage && !prevIsCapPage
          return (
            <div key={key}>
              {showDivider && (
                <div className="px-2 pt-4 pb-1">
                  <div className="h-px bg-gray-200 mb-2" />
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 px-2">
                    Páginas de Capacidades
                  </p>
                </div>
              )}
              <button
                onClick={() => setActiveSection(key)}
                className={cn(
                  'w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                  activeSection === key
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {SCHEMAS[key].label}
              </button>
            </div>
          )
        })}
      </div>

      {/* Editor panel */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {LOCALES.map(loc => (
              <button
                key={loc.code}
                onClick={() => setActiveLocale(loc.code)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                  activeLocale === loc.code
                    ? 'bg-[var(--color-secondary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                {loc.label}
              </button>
            ))}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            Guardar
          </button>
        </div>

        {/* Fields card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
            <h3 className="font-semibold text-gray-800">{schema?.label}</h3>
            <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
              {activeLocale.toUpperCase()}
            </span>
          </div>

          <div className="space-y-5">
            {(schema?.fields ?? []).map(field => (
              <FieldInput
                key={`${activeLocale}-${activeSection}-${field.key}`}
                def={field}
                value={getValue(field.key)}
                onChange={val => setValue(field.key, val)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Field renderers ───────────────────────────────────────────────────────────

function FieldInput({
  def,
  value,
  onChange,
}: {
  def: FieldDef
  value: any
  onChange: (val: any) => void
}) {
  if (def.type === 'toggle') {
    const checked = value === true || value === 'true' || (value === undefined || value === '')
    return (
      <div className="flex items-center justify-between py-1">
        <label className="text-xs font-medium text-gray-500">{def.label}</label>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
            checked ? 'bg-[var(--color-accent)]' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    )
  }

  if (def.type === 'string-array') {
    const text = Array.isArray(value) ? value.join('\n') : (value ?? '')
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{def.label}</label>
        <textarea
          value={text}
          onChange={e => onChange(e.target.value.split('\n'))}
          rows={6}
          placeholder={def.placeholder ?? 'Un elemento por línea'}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-gray-400 resize-y"
        />
        <p className="text-[11px] text-gray-400 mt-1">Un elemento por línea</p>
      </div>
    )
  }

  if (def.type === 'work-array') {
    const items: Array<{ label: string; description: string; tagline: string }> = Array.isArray(value) ? value : []
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">{def.label}</label>
        <div className="space-y-3">
          {items.map((item, i) => (
            <WorkItemRow
              key={i}
              index={i}
              item={item}
              onChange={updated => onChange(items.map((s, j) => j === i ? updated : s))}
              onRemove={() => onChange(items.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange([...items, { label: '', description: '', tagline: '' }])}
            className="flex items-center gap-2 w-full px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors justify-center"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar item
          </button>
        </div>
      </div>
    )
  }

  if (def.type === 'step-array') {
    const steps: Array<{ title: string; desc: string }> = Array.isArray(value) ? value : []
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">{def.label}</label>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <StepRow
              key={i}
              index={i}
              step={step}
              onChange={updated => onChange(steps.map((s, j) => j === i ? updated : s))}
              onRemove={() => onChange(steps.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange([...steps, { title: '', desc: '' }])}
            className="flex items-center gap-2 w-full px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors justify-center"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar paso
          </button>
        </div>
      </div>
    )
  }

  if (def.type === 'image-url') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{def.label}</label>
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={def.placeholder ?? 'https:// ó /images/...'}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 font-mono"
        />
        {value && (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full max-h-48 object-contain" />
          </div>
        )}
        <p className="text-[11px] text-gray-400 mt-1">
          Sube la imagen a <strong>/public/images/</strong> y escribe <strong>/images/nombre.png</strong>, o pega una URL externa. Dejar vacío usa el SVG por defecto.
        </p>
      </div>
    )
  }

  if (def.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{def.label}</label>
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={3}
          placeholder={def.placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-y"
        />
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{def.label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={def.placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
      />
    </div>
  )
}

function StepRow({
  index,
  step,
  onChange,
  onRemove,
}: {
  index: number
  step: { title: string; desc: string }
  onChange: (updated: { title: string; desc: string }) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-500">Paso {index + 1}</span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setOpen(o => !o)} className="text-gray-400 hover:text-gray-600 p-1">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <input
            type="text"
            value={step.title}
            onChange={e => onChange({ ...step, title: e.target.value })}
            placeholder="Título del paso"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
          <textarea
            value={step.desc}
            onChange={e => onChange({ ...step, desc: e.target.value })}
            placeholder="Descripción del paso"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>
      )}
    </div>
  )
}

function WorkItemRow({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number
  item: { label: string; description: string; tagline: string }
  onChange: (updated: { label: string; description: string; tagline: string }) => void
  onRemove: () => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-500">Item {index + 1}</span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setOpen(o => !o)} className="text-gray-400 hover:text-gray-600 p-1">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <input
            type="text"
            value={item.label}
            onChange={e => onChange({ ...item, label: e.target.value })}
            placeholder="Etiqueta (en mayúsculas)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
          <textarea
            value={item.description}
            onChange={e => onChange({ ...item, description: e.target.value })}
            placeholder="Descripción"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
          />
          <input
            type="text"
            value={item.tagline}
            onChange={e => onChange({ ...item, tagline: e.target.value })}
            placeholder="Tagline / frase clave"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      )}
    </div>
  )
}
