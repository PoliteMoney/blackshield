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
  ('radar_url', '/images/radar.png', 'image', 'Imagen radar (Hero)', 'branding'),
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

-- ============================================================
-- PAGE CONTENT SEED (all sections, ES + EN)
-- ON CONFLICT DO UPDATE makes this safe to re-run.
-- ============================================================

-- ── ESPAÑOL ──────────────────────────────────────────────────

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'nav', 'es', true, '{"home":"Inicio","about":"Quiénes Somos","services":"Servicios","sectors":"Sectores","methodology":"Metodología","blog":"Blog","faq":"Preguntas Frecuentes","contact":"Contacto","book":"Agendar Cita"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'hero', 'es', true, '{"badge":"Consultoría de Alto Nivel","tagline_line1":"Estrategia Legal.","tagline_line2":"Impulsada por Inteligencia.","sub_tagline":"Antes de entrar · Mientras opera · Cuando necesita resolver","subtitle":"Soluciones estratégicas, seguridad corporativa y gestión de riesgos para empresas, ejecutivos e instituciones que exigen excelencia.","cta_primary":"Agendar Consulta","cta_secondary":"Conocer Servicios","scroll":"Explorar","trust_1":"Confidencialidad Total","trust_2":"Alcance Global","trust_3":"Excelencia Comprobada","radar_card1_label":"Inteligencia","radar_card1_desc":"Análisis estratégico en tiempo real","radar_card2_label":"Protección","radar_card2_desc":"Seguridad corporativa integral"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'about', 'es', true, '{"badge":"Quiénes Somos","title":"Una firma de consultoría de élite","subtitle":"Blackshield Global Consulting es una firma especializada en soluciones estratégicas para organizaciones que operan en entornos complejos y de alta exigencia.","mission_title":"Misión","mission_body":"Brindar soluciones de consultoría de élite que impulsen el éxito sostenible de nuestros clientes en entornos complejos.","vision_title":"Visión","vision_body":"Ser la firma de consultoría de referencia para organizaciones líderes que enfrentan los desafíos más exigentes.","values_title":"Valores","values":["Confidencialidad y discreción absoluta","Integridad y ética profesional","Excelencia en cada entregable","Orientación a resultados medibles","Innovación y adaptabilidad","Compromiso con el cliente"],"years_label":"Años de experiencia","clients_label":"Clientes atendidos"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'stats', 'es', true, '{"years":"Años de Experiencia","clients":"Clientes Atendidos","countries":"Países de Operación","satisfaction":"Satisfacción"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'services', 'es', true, '{"badge":"Nuestros Servicios","title":"Soluciones Especializadas","subtitle":"Ofrecemos un portafolio integral de servicios diseñados para los desafíos más complejos del entorno corporativo moderno.","learn_more":"Conocer más","all_services":"Ver todos los servicios"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'sectors', 'es', true, '{"badge":"Sectores","title":"Sectores que Atendemos","subtitle":"Nuestra experiencia abarca múltiples industrias con soluciones adaptadas a las particularidades de cada sector."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'methodology', 'es', true, '{"badge":"Metodología","title":"Nuestro Enfoque","subtitle":"Un proceso probado que garantiza resultados medibles y sostenibles para su organización.","steps":[{"title":"Diagnóstico","desc":"Análisis profundo de su situación actual, identificando fortalezas, vulnerabilidades y oportunidades."},{"title":"Estrategia","desc":"Diseño de un plan de acción personalizado alineado con sus objetivos y recursos disponibles."},{"title":"Implementación","desc":"Ejecución coordinada de las acciones definidas con supervisión y ajuste continuo."},{"title":"Evaluación","desc":"Medición de resultados, lecciones aprendidas y ajustes para la mejora continua."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'cta', 'es', true, '{"title":"¿Listo para transformar su organización?","subtitle":"Agende una consulta confidencial y descubra cómo podemos impulsar su éxito.","button":"Agendar Consulta Ahora","contact":"Contáctenos"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'faq', 'es', true, '{"badge":"FAQ","title":"Preguntas Frecuentes","subtitle":"Respuestas a las preguntas más comunes sobre nuestros servicios."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'contact', 'es', true, '{"badge":"Contacto","title":"Hablemos","subtitle":"Estamos disponibles para atender sus necesidades. Contáctenos por el canal de su preferencia.","form_title":"Envíenos un mensaje","name":"Nombre completo","email":"Correo electrónico","phone":"Teléfono","company":"Empresa","subject":"Asunto","message":"Mensaje","send":"Enviar Mensaje","sending":"Enviando...","success":"Mensaje enviado. Nos pondremos en contacto pronto.","error":"Error al enviar. Por favor intente de nuevo.","whatsapp":"Contactar por WhatsApp","whatsapp_instant":"Respuesta inmediata","contact_info_title":"Información de Contacto","email_label":"Correo Electrónico","phone_label":"Teléfono / WhatsApp","address_label":"Dirección"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'footer', 'es', true, '{"description":"Firma de consultoría especializada en estrategia, seguridad corporativa y gestión de riesgos.","quick_links":"Enlaces Rápidos","services":"Servicios","legal":"Legal","terms":"Términos y Condiciones","privacy":"Aviso de Privacidad","cookies":"Política de Cookies","rights":"Todos los derechos reservados.","made_with":"Hecho con"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'cookies', 'es', true, '{"message":"Utilizamos cookies para mejorar su experiencia. Al continuar navegando, acepta nuestra","policy":"política de cookies","accept":"Aceptar","decline":"Rechazar"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

-- ── ENGLISH ──────────────────────────────────────────────────

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'nav', 'en', true, '{"home":"Home","about":"About Us","services":"Services","sectors":"Sectors","methodology":"Methodology","blog":"Blog","faq":"FAQ","contact":"Contact","book":"Book Appointment"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'hero', 'en', true, '{"badge":"Elite Level Consulting","tagline_line1":"Legal Strategy.","tagline_line2":"Powered by Intelligence.","sub_tagline":"Before you enter · While you operate · When you need to resolve","subtitle":"Strategic solutions, corporate security and risk management for companies, executives and institutions that demand excellence.","cta_primary":"Schedule Consultation","cta_secondary":"Our Services","scroll":"Explore","trust_1":"Total Confidentiality","trust_2":"Global Reach","trust_3":"Proven Excellence","radar_card1_label":"Intelligence","radar_card1_desc":"Strategic analysis in real time","radar_card2_label":"Protection","radar_card2_desc":"Comprehensive corporate security"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'about', 'en', true, '{"badge":"About Us","title":"An elite consulting firm","subtitle":"Blackshield Global Consulting is a firm specialized in strategic solutions for organizations operating in complex, high-demand environments.","mission_title":"Mission","mission_body":"Provide elite consulting solutions that drive the sustainable success of our clients in complex environments.","vision_title":"Vision","vision_body":"To be the reference consulting firm for leading organizations facing the most demanding challenges.","values_title":"Values","values":["Absolute confidentiality and discretion","Integrity and professional ethics","Excellence in every deliverable","Results-oriented approach","Innovation and adaptability","Commitment to the client"],"years_label":"Years of experience","clients_label":"Clients served"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'stats', 'en', true, '{"years":"Years of Experience","clients":"Clients Served","countries":"Operating Countries","satisfaction":"Satisfaction"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'services', 'en', true, '{"badge":"Our Services","title":"Specialized Solutions","subtitle":"We offer a comprehensive portfolio of services designed for the most complex challenges of the modern corporate environment.","learn_more":"Learn more","all_services":"View all services"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'sectors', 'en', true, '{"badge":"Sectors","title":"Sectors We Serve","subtitle":"Our expertise spans multiple industries with solutions tailored to the particularities of each sector."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'methodology', 'en', true, '{"badge":"Methodology","title":"Our Approach","subtitle":"A proven process that guarantees measurable and sustainable results for your organization.","steps":[{"title":"Diagnosis","desc":"Deep analysis of your current situation, identifying strengths, vulnerabilities and opportunities."},{"title":"Strategy","desc":"Design of a personalized action plan aligned with your objectives and available resources."},{"title":"Implementation","desc":"Coordinated execution of defined actions with continuous supervision and adjustment."},{"title":"Evaluation","desc":"Measurement of results, lessons learned and adjustments for continuous improvement."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'cta', 'en', true, '{"title":"Ready to transform your organization?","subtitle":"Schedule a confidential consultation and discover how we can drive your success.","button":"Schedule Consultation Now","contact":"Contact Us"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'faq', 'en', true, '{"badge":"FAQ","title":"Frequently Asked Questions","subtitle":"Answers to the most common questions about our services."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'contact', 'en', true, '{"badge":"Contact","title":"Let''s Talk","subtitle":"We are available to meet your needs. Contact us through your preferred channel.","form_title":"Send us a message","name":"Full name","email":"Email address","phone":"Phone","company":"Company","subject":"Subject","message":"Message","send":"Send Message","sending":"Sending...","success":"Message sent. We will be in touch soon.","error":"Error sending. Please try again.","whatsapp":"Contact via WhatsApp","whatsapp_instant":"Immediate response","contact_info_title":"Contact Information","email_label":"Email Address","phone_label":"Phone / WhatsApp","address_label":"Address"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'footer', 'en', true, '{"description":"Consulting firm specializing in strategy, corporate security and risk management.","quick_links":"Quick Links","services":"Services","legal":"Legal","terms":"Terms & Conditions","privacy":"Privacy Policy","cookies":"Cookie Policy","rights":"All rights reserved.","made_with":"Made with"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'cookies', 'en', true, '{"message":"We use cookies to improve your experience. By continuing to browse, you accept our","policy":"cookie policy","accept":"Accept","decline":"Decline"}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'strategic', 'es', true, '{"title":"Control estratégico en México","paragraph_1":"Con más de 15 años de operación en el mercado mexicano, Blackshield Global Consulting ha desarrollado un profundo conocimiento del entorno legal, regulatorio y empresarial que distingue a México como una plaza de primer nivel.","paragraph_2":"Nuestra red de alianzas estratégicas, combinada con inteligencia de mercado y análisis jurídico de alto nivel, permite a nuestros clientes tomar decisiones informadas y anticipar riesgos antes de que se materialicen.","paragraph_3":"Acompañamos a empresas nacionales e internacionales en cada etapa de su ciclo de vida: desde la entrada al mercado hasta la gestión de crisis y la resolución de conflictos complejos."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'strategic', 'en', true, '{"title":"Strategic Control in Mexico","paragraph_1":"With over 15 years of operation in the Mexican market, Blackshield Global Consulting has developed a deep understanding of the legal, regulatory and business environment that sets Mexico apart as a premier destination.","paragraph_2":"Our network of strategic alliances, combined with market intelligence and high-level legal analysis, enables our clients to make informed decisions and anticipate risks before they materialize.","paragraph_3":"We accompany national and international companies at every stage of their lifecycle: from market entry to crisis management and the resolution of complex disputes."}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'how_we_work', 'es', true, '{"title":"Cómo trabajamos","items":[{"label":"PLANEACIÓN E INTELIGENCIA","description":"Analizamos el entorno real y convertimos información en criterio accionable para decidir mejor.","tagline":"Entender antes de entrar."},{"label":"EJECUCIÓN","description":"Estructuramos y coordinamos la implementación en México. Desde lo legal y cooperativo hasta la operación.","tagline":"Orden, control y alineación."},{"label":"PROTECCIÓN","description":"Damos seguimiento, anticipamos riesgos y mantenemos control del escenario.","tagline":"No reaccionamos tarde."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'when_we_intervene', 'es', true, '{"title":"Cuándo intervenimos","tagline":"Antes de entrar. Mientras opera. Cuando necesita resolver.","items":["Antes de entrar a México","Al operar o expandirse","Para proteger patrimonio","Al enfrentar un conflicto o situación legal","Como aliado local para firmas y asesores internacionales","En situaciones de crisis o contingencia"]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'how_we_work', 'en', true, '{"title":"How we work","items":[{"label":"PLANNING & INTELLIGENCE","description":"We analyze the real environment and turn information into actionable insight to make better decisions.","tagline":"Understand before entering."},{"label":"EXECUTION","description":"We structure and coordinate implementation in Mexico — from the legal and regulatory to the operational.","tagline":"Order, control and alignment."},{"label":"PROTECTION","description":"We monitor, anticipate risks and maintain control of the situation.","tagline":"We don''t react late."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'when_we_intervene', 'en', true, '{"title":"When we intervene","tagline":"Before entering. While operating. When you need to resolve.","items":["Before entering Mexico","When operating or expanding","To protect assets and heritage","When facing a conflict or legal situation","As a local ally for international firms and advisors","In crisis or contingency situations"]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'capacities', 'es', true, '{"title":"Capacidades","items":[{"title":"Representación estratégica","desc":"Presencia, coordinación y ejecución en México con control total."},{"title":"Inteligencia estratégica","desc":"Análisis de contexto, riesgos, actores y escenarios."},{"title":"Entrada y operación","desc":"Estructuración de proyectos, expansión y ejecución en México."},{"title":"Estructuración corporativa y fiscal","desc":"Estructuras eficientes, cumplimiento y control internacional."},{"title":"Protección patrimonial","desc":"Inmuebles, inversiones, acciones y patrimonio personal y empresarial."},{"title":"Dirección de asuntos legales","desc":"Estrategia y control de procesos legales en México y otras jurisdicciones."},{"title":"Representación de víctimas","desc":"Seguimiento, derechos, inteligencia y control del caso en México."},{"title":"Gestión de crisis y reputación","desc":"Control legal, mediático y estratégico en situaciones críticas."},{"title":"Gobernanza y cumplimiento","desc":"Prevención, control y estructura institucional."},{"title":"Propiedad intelectual y contratos","desc":"Protección de marcas, acuerdos y relaciones comerciales."},{"title":"Fortalecimiento institucional","desc":"Capacitación, liderazgo y mejora organizacional."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;

INSERT INTO page_content (page, section, locale, is_active, extra) VALUES
('home', 'capacities', 'en', true, '{"title":"Capabilities","items":[{"title":"Strategic Representation","desc":"Presence, coordination and execution in Mexico with full control."},{"title":"Strategic Intelligence","desc":"Context analysis, risks, actors and scenarios."},{"title":"Market Entry & Operations","desc":"Project structuring, expansion and execution in Mexico."},{"title":"Corporate & Tax Structuring","desc":"Efficient structures, compliance and international control."},{"title":"Asset Protection","desc":"Real estate, investments, shares and personal and business assets."},{"title":"Legal Affairs Management","desc":"Strategy and control of legal processes in Mexico and other jurisdictions."},{"title":"Victim Representation","desc":"Monitoring, rights, intelligence and case control in Mexico."},{"title":"Crisis & Reputation Management","desc":"Legal, media and strategic control in critical situations."},{"title":"Governance & Compliance","desc":"Prevention, control and institutional structure."},{"title":"Intellectual Property & Contracts","desc":"Brand protection, agreements and commercial relations."},{"title":"Institutional Strengthening","desc":"Training, leadership and organizational improvement."}]}')
ON CONFLICT (page, section, locale) DO UPDATE SET extra = EXCLUDED.extra;
