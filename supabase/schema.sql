-- ============================================================
-- Blackshield Global Consulting - Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SITE CONFIGURATION
-- ============================================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  type TEXT DEFAULT 'text', -- text, json, color, image, boolean
  label TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================
-- PAGE CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,       -- home, about, services, sectors, etc.
  section TEXT NOT NULL,    -- hero, features, cta, etc.
  locale TEXT DEFAULT 'es',
  title TEXT,
  subtitle TEXT,
  body TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  extra JSONB,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, locale)
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  features JSONB,
  UNIQUE(service_id, locale)
);

-- ============================================================
-- SECTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sectors_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  UNIQUE(sector_id, locale)
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  UNIQUE(post_id, locale)
);

-- ============================================================
-- FAQs
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT DEFAULT 'general',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faq_id UUID REFERENCES faqs(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  UNIQUE(faq_id, locale)
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  locale TEXT DEFAULT 'es',
  status TEXT DEFAULT 'new', -- new, read, replied, archived
  source TEXT DEFAULT 'contact_form',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  available_days INTEGER[] DEFAULT '{1,2,3,4,5}', -- 0=Sun,1=Mon...6=Sat
  start_time TIME DEFAULT '09:00',
  end_time TIME DEFAULT '18:00',
  slot_duration INTEGER DEFAULT 30, -- minutes
  buffer_time INTEGER DEFAULT 15,   -- minutes between slots
  max_advance_days INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'America/Mexico_City',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  appointment_type TEXT NOT NULL, -- virtual, presencial
  duration INTEGER DEFAULT 30,     -- 30 or 60 minutes
  service_id UUID REFERENCES services(id),
  service_name TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone TEXT DEFAULT 'America/Mexico_City',
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  google_event_id TEXT,
  stripe_payment_id TEXT,
  locale TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  company TEXT,
  role TEXT,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  locale TEXT DEFAULT 'es',
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS (roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT DEFAULT 'editor', -- admin, editor
  full_name TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STRIPE PRODUCTS (for future use)
-- ============================================================
CREATE TABLE IF NOT EXISTS stripe_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_product_id TEXT UNIQUE,
  stripe_price_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price_amount INTEGER, -- in cents
  currency TEXT DEFAULT 'mxn',
  is_active BOOLEAN DEFAULT false, -- disabled by default
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- site_config: public read, admin write
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Admin write site_config" ON site_config FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- page_content: public read, admin write
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write page_content" ON page_content FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- services: public read active, admin all
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all services" ON services FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

ALTER TABLE services_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read service_translations" ON services_translations FOR SELECT USING (true);
CREATE POLICY "Admin all service_translations" ON services_translations FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- sectors
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sectors" ON sectors FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all sectors" ON sectors FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

ALTER TABLE sectors_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sectors_translations" ON sectors_translations FOR SELECT USING (true);
CREATE POLICY "Admin all sectors_translations" ON sectors_translations FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- blog
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all blog_posts" ON blog_posts FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

ALTER TABLE blog_posts_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read blog_translations" ON blog_posts_translations FOR SELECT USING (true);
CREATE POLICY "Admin all blog_translations" ON blog_posts_translations FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all faqs" ON faqs FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

ALTER TABLE faqs_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faq_translations" ON faqs_translations FOR SELECT USING (true);
CREATE POLICY "Admin all faq_translations" ON faqs_translations FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- contact_messages: insert only public, read admin
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact" ON contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- appointments: insert public, admin all
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all appointments" ON appointments FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

ALTER TABLE appointment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read appointment_settings" ON appointment_settings FOR SELECT USING (true);
CREATE POLICY "Admin write appointment_settings" ON appointment_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all team" ON team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

-- admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read profiles" ON admin_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));
CREATE POLICY "Admin manage profiles" ON admin_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_profiles ap WHERE ap.id = auth.uid() AND ap.role = 'admin' AND ap.is_active = true));

-- ============================================================
-- SEED DEFAULT DATA
-- ============================================================

-- Default site config
INSERT INTO site_config (key, value, type, label, category) VALUES
  ('site_name', 'Blackshield Global Consulting', 'text', 'Nombre del sitio', 'branding'),
  ('site_tagline_es', 'Legal Strategy. Powered by Intelligence.', 'text', 'Slogan (ES)', 'branding'),
  ('site_tagline_en', 'Legal Strategy. Powered by Intelligence.', 'text', 'Slogan (EN)', 'branding'),
  ('logo_url', '/images/logo_negro.png', 'image', 'Logo principal', 'branding'),
  ('logo_white_url', '/images/logo_beige.jpeg', 'image', 'Logo claro', 'branding'),
  ('color_primary', '#AD8855', 'color', 'Color primario (Oro)', 'branding'),
  ('color_secondary', '#1A1C1E', 'color', 'Color secundario (Negro)', 'branding'),
  ('color_accent', '#003E4A', 'color', 'Color acento (Azul Petróleo)', 'branding'),
  ('font_heading', 'Cormorant Garamond', 'text', 'Tipografía títulos', 'branding'),
  ('font_body', 'Montserrat', 'text', 'Tipografía cuerpo', 'branding'),
  ('contact_email', 'ceo@blackshieldgc.com', 'text', 'Email corporativo', 'contact'),
  ('whatsapp_number', '+521234567890', 'text', 'WhatsApp Business', 'contact'),
  ('whatsapp_message_es', 'Hola, me interesa conocer más sobre sus servicios de consultoría.', 'text', 'Mensaje WA (ES)', 'contact'),
  ('whatsapp_message_en', 'Hello, I am interested in learning more about your consulting services.', 'text', 'Mensaje WA (EN)', 'contact'),
  ('ga_measurement_id', '', 'text', 'Google Analytics ID', 'analytics'),
  ('meta_pixel_id', '', 'text', 'Meta Pixel ID', 'analytics'),
  ('stripe_enabled', 'false', 'boolean', 'Stripe habilitado', 'payments'),
  ('google_calendar_enabled', 'false', 'boolean', 'Google Calendar', 'integrations'),
  ('terms_es', '', 'text', 'Términos y condiciones (ES)', 'legal'),
  ('terms_en', '', 'text', 'Terms and conditions (EN)', 'legal'),
  ('privacy_es', '', 'text', 'Aviso de privacidad (ES)', 'legal'),
  ('privacy_en', '', 'text', 'Privacy policy (EN)', 'legal'),
  ('cookie_policy_enabled', 'true', 'boolean', 'Banner de cookies', 'legal'),
  ('social_linkedin', '', 'text', 'LinkedIn URL', 'social'),
  ('social_twitter', '', 'text', 'Twitter/X URL', 'social'),
  ('social_facebook', '', 'text', 'Facebook URL', 'social'),
  ('address', '', 'text', 'Dirección', 'contact'),
  ('blog_enabled', 'true', 'boolean', 'Blog habilitado', 'features'),
  ('appointments_enabled', 'true', 'boolean', 'Citas habilitadas', 'features')
ON CONFLICT (key) DO NOTHING;

-- Default appointment settings
INSERT INTO appointment_settings (available_days, start_time, end_time, slot_duration, buffer_time, timezone)
VALUES ('{1,2,3,4,5}', '09:00', '18:00', 30, 15, 'America/Mexico_City')
ON CONFLICT DO NOTHING;

-- Default services
INSERT INTO services (slug, icon, order_index, featured) VALUES
  ('strategic-consulting', 'Target', 1, true),
  ('corporate-security', 'Shield', 2, true),
  ('risk-management', 'AlertTriangle', 3, true),
  ('compliance', 'CheckSquare', 4, false),
  ('business-intelligence', 'BarChart2', 5, false),
  ('institutional-advisory', 'Briefcase', 6, false)
ON CONFLICT (slug) DO NOTHING;

-- Default services translations (ES)
INSERT INTO services_translations (service_id, locale, title, short_description, full_description, features)
SELECT s.id, 'es', t.title, t.short_desc, t.full_desc, t.features::JSONB
FROM services s
JOIN (VALUES
  ('strategic-consulting', 'Consultoría Estratégica',
   'Diseñamos estrategias corporativas de alto impacto alineadas con sus objetivos de negocio.',
   'Nuestro equipo de expertos trabaja directamente con su dirección ejecutiva para diseñar, implementar y supervisar estrategias que posicionen a su organización en ventaja competitiva.',
   '["Análisis situacional 360°","Planeación estratégica","Mapas de ruta ejecutivos","KPIs y métricas de impacto"]'),
  ('corporate-security', 'Seguridad Corporativa',
   'Protegemos su patrimonio, información y personal con soluciones de seguridad de alto nivel.',
   'Implementamos protocolos de seguridad integrales que salvaguardan sus activos más valiosos: información, personal, infraestructura y reputación corporativa.',
   '["Evaluación de vulnerabilidades","Protocolos de seguridad","Seguridad física y lógica","Planes de contingencia"]'),
  ('risk-management', 'Gestión de Riesgos',
   'Identificamos, evaluamos y mitigamos riesgos que pueden afectar su operación.',
   'Aplicamos metodologías probadas para mapear, evaluar y neutralizar riesgos operativos, financieros, reputacionales y regulatorios que enfrenta su organización.',
   '["Matriz de riesgos","Due diligence","Planes de mitigación","Monitoreo continuo"]'),
  ('compliance', 'Cumplimiento Normativo',
   'Aseguramos que su empresa cumpla con todas las regulaciones aplicables.',
   'Nuestros especialistas en compliance le guían a través del complejo entorno regulatorio, asegurando que su organización opere dentro del marco legal y normativo vigente.',
   '["Diagnóstico regulatorio","Programas de compliance","Capacitación y cultura","Auditorías internas"]'),
  ('business-intelligence', 'Inteligencia Empresarial',
   'Transformamos datos en insights estratégicos para la toma de decisiones.',
   'Recopilamos, procesamos y analizamos información estratégica del entorno competitivo para proporcionar inteligencia accionable que apoye sus decisiones ejecutivas.',
   '["Análisis competitivo","Inteligencia de mercado","Reportes ejecutivos","Vigilancia estratégica"]'),
  ('institutional-advisory', 'Asesoría Institucional',
   'Acompañamos a instituciones y dependencias en sus procesos más complejos.',
   'Brindamos asesoría especializada a instituciones públicas y privadas en materia de gobernanza, transparencia, modernización administrativa y gestión institucional.',
   '["Gobernanza corporativa","Relaciones institucionales","Modernización administrativa","Gestión del cambio"]')
) AS t(slug, title, short_desc, full_desc, features)
ON s.slug = t.slug
ON CONFLICT (service_id, locale) DO NOTHING;

-- Default services translations (EN)
INSERT INTO services_translations (service_id, locale, title, short_description, full_description, features)
SELECT s.id, 'en', t.title, t.short_desc, t.full_desc, t.features::JSONB
FROM services s
JOIN (VALUES
  ('strategic-consulting', 'Strategic Consulting',
   'We design high-impact corporate strategies aligned with your business objectives.',
   'Our expert team works directly with your executive leadership to design, implement and oversee strategies that position your organization at a competitive advantage.',
   '["360° situational analysis","Strategic planning","Executive roadmaps","KPIs and impact metrics"]'),
  ('corporate-security', 'Corporate Security',
   'We protect your assets, information and personnel with high-level security solutions.',
   'We implement comprehensive security protocols that safeguard your most valuable assets: information, personnel, infrastructure and corporate reputation.',
   '["Vulnerability assessment","Security protocols","Physical and logical security","Contingency plans"]'),
  ('risk-management', 'Risk Management',
   'We identify, assess and mitigate risks that may affect your operations.',
   'We apply proven methodologies to map, evaluate and neutralize operational, financial, reputational and regulatory risks facing your organization.',
   '["Risk matrix","Due diligence","Mitigation plans","Continuous monitoring"]'),
  ('compliance', 'Regulatory Compliance',
   'We ensure your company complies with all applicable regulations.',
   'Our compliance specialists guide you through the complex regulatory environment, ensuring your organization operates within the current legal and regulatory framework.',
   '["Regulatory diagnosis","Compliance programs","Training and culture","Internal audits"]'),
  ('business-intelligence', 'Business Intelligence',
   'We transform data into strategic insights for decision making.',
   'We collect, process and analyze strategic information from the competitive environment to provide actionable intelligence supporting your executive decisions.',
   '["Competitive analysis","Market intelligence","Executive reports","Strategic surveillance"]'),
  ('institutional-advisory', 'Institutional Advisory',
   'We accompany institutions and agencies in their most complex processes.',
   'We provide specialized advisory services to public and private institutions in governance, transparency, administrative modernization and institutional management.',
   '["Corporate governance","Institutional relations","Administrative modernization","Change management"]')
) AS t(slug, title, short_desc, full_desc, features)
ON s.slug = t.slug
ON CONFLICT (service_id, locale) DO NOTHING;

-- Default sectors
INSERT INTO sectors (slug, icon, order_index) VALUES
  ('private-enterprise', 'Building2', 1),
  ('government', 'Landmark', 2),
  ('financial', 'DollarSign', 3),
  ('healthcare', 'HeartPulse', 4),
  ('energy', 'Zap', 5),
  ('technology', 'Cpu', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sectors_translations (sector_id, locale, title, description)
SELECT s.id, 'es', t.title, t.description
FROM sectors s
JOIN (VALUES
  ('private-enterprise', 'Empresa Privada', 'Corporativos, empresas familiares, grupos empresariales y organizaciones privadas de todos los sectores.'),
  ('government', 'Gobierno y Sector Público', 'Dependencias federales, estatales y municipales, organismos autónomos e instituciones del sector público.'),
  ('financial', 'Sector Financiero', 'Instituciones bancarias, casas de bolsa, aseguradoras, fintechs y entidades del sector financiero.'),
  ('healthcare', 'Salud y Farmacéutico', 'Hospitales, clínicas, laboratorios, farmacéuticas y organizaciones del sector salud.'),
  ('energy', 'Energía e Infraestructura', 'Empresas del sector energético, constructoras, operadores de infraestructura crítica.'),
  ('technology', 'Tecnología e Innovación', 'Startups, empresas tecnológicas, plataformas digitales y organizaciones de base tecnológica.')
) AS t(slug, title, description) ON s.slug = t.slug
ON CONFLICT (sector_id, locale) DO NOTHING;

INSERT INTO sectors_translations (sector_id, locale, title, description)
SELECT s.id, 'en', t.title, t.description
FROM sectors s
JOIN (VALUES
  ('private-enterprise', 'Private Enterprise', 'Corporations, family businesses, business groups and private organizations across all sectors.'),
  ('government', 'Government & Public Sector', 'Federal, state and municipal agencies, autonomous bodies and public sector institutions.'),
  ('financial', 'Financial Sector', 'Banking institutions, brokerage firms, insurance companies, fintechs and financial sector entities.'),
  ('healthcare', 'Healthcare & Pharmaceutical', 'Hospitals, clinics, laboratories, pharmaceutical companies and health sector organizations.'),
  ('energy', 'Energy & Infrastructure', 'Energy sector companies, construction firms, critical infrastructure operators.'),
  ('technology', 'Technology & Innovation', 'Startups, technology companies, digital platforms and technology-based organizations.')
) AS t(slug, title, description) ON s.slug = t.slug
ON CONFLICT (sector_id, locale) DO NOTHING;

-- Default FAQs
INSERT INTO faqs (category, order_index) VALUES
  ('general', 1), ('general', 2), ('general', 3),
  ('services', 4), ('services', 5),
  ('appointments', 6), ('appointments', 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Get site config as JSON object
CREATE OR REPLACE FUNCTION get_site_config()
RETURNS JSONB AS $$
DECLARE result JSONB;
BEGIN
  SELECT jsonb_object_agg(key, value) INTO result FROM site_config;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check available appointment slots
CREATE OR REPLACE FUNCTION get_booked_slots(p_date DATE)
RETURNS TABLE(booked_time TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT a.time FROM appointments a
  WHERE a.date = p_date AND a.status NOT IN ('cancelled');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
