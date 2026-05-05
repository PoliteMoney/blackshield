# Blackshield Global Consulting — Sitio Web

Stack: **Next.js 14** (App Router) · **Supabase** · **Tailwind CSS** · **TypeScript**

## Estructura del Proyecto

```
app/
  page.tsx              → Home (todas las secciones)
  blog/                 → Blog público
  agendar/              → Calendario de citas
  terminos/             → Términos y condiciones
  privacidad/           → Aviso de privacidad
  cookies/              → Política de cookies
  admin/                → Panel de administración (protegido)
    login/              → Login del admin
    page.tsx            → Dashboard
    settings/           → Configuración del sitio
    content/            → Editor de contenido por página
    services/           → Gestión de servicios
    blog/               → Editor de blog
    appointments/       → Gestión de citas
    messages/           → Mensajes de contacto
    users/              → Gestión de usuarios
  api/
    contact/            → Formulario de contacto
    appointments/       → Crear cita + slots disponibles
    stripe/checkout/    → Cobro online (preparado, deshabilitado)
    admin/invite/       → Invitar nuevos admins
```

## Configuración Inicial

### 1. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```bash
cp .env.local.example .env.local
```

Variables necesarias para funcionar:
- `NEXT_PUBLIC_SUPABASE_URL` — URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (admin operations)

### 2. Base de datos Supabase

Ejecuta el archivo `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase.

Esto creará todas las tablas, políticas RLS y datos de ejemplo.

### 3. Primer administrador

En Supabase > Authentication > Users, crea un usuario manualmente.
Luego en SQL Editor ejecuta:

```sql
INSERT INTO admin_profiles (id, role, full_name, is_active)
VALUES ('<user-uuid>', 'admin', 'Tu Nombre', true);
```

### 4. Instalar y arrancar

```bash
npm install
npm run dev
```

Visita:
- Sitio público: http://localhost:3000
- Panel admin: http://localhost:3000/admin

## Funcionalidades

| Feature | Estado |
|---------|--------|
| Sitio institucional multisección | ✅ |
| Multilenguaje ES/EN | ✅ |
| Colores y fuentes parametrizables | ✅ |
| Panel de administración | ✅ |
| Editor de contenido por página | ✅ |
| Gestión de servicios | ✅ |
| Blog con publicación | ✅ |
| Calendario de citas (30/60 min) | ✅ |
| Formulario de contacto | ✅ |
| Cookie consent | ✅ |
| Google Analytics | ✅ (config en admin) |
| Meta Pixel | ✅ (config en admin) |
| Módulo Stripe | ✅ preparado (activar en admin) |
| Google Calendar | 🔧 (requiere OAuth config) |
| WhatsApp Business | ✅ (config en admin) |
| Términos y condiciones | ✅ (editar en admin > legal) |
| Aviso de privacidad | ✅ (editar en admin > legal) |

## Integraciones Pendientes (configurar claves)

- **Stripe**: Agregar claves en `.env.local`, habilitar en Admin > Configuración > Pagos
- **Google Analytics**: Pegar el ID `G-XXXXXXXXXX` en Admin > Configuración > Analítica
- **Meta Pixel**: Pegar el ID en Admin > Configuración > Analítica
- **Google Calendar**: Configurar OAuth en Admin > Configuración > Integraciones
- **WhatsApp**: Número en Admin > Configuración > Contacto

## Colores

- **Primario**: `#DDD0C8` (Beige)
- **Secundario**: `#323232` (Gris oscuro)
- **Acento**: `#8B7355` (Dorado oscuro)

Modificables en tiempo real desde Admin > Configuración > Marca e Identidad.
