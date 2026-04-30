-- ============================================================
-- FIX: Infinite recursion in admin_profiles RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create a SECURITY DEFINER helper function
--    It runs as the DB owner, bypassing RLS on admin_profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;

-- 2. Drop all existing policies that cause the recursion
DROP POLICY IF EXISTS "Public read site_config"         ON site_config;
DROP POLICY IF EXISTS "Admin write site_config"         ON site_config;
DROP POLICY IF EXISTS "Public read page_content"        ON page_content;
DROP POLICY IF EXISTS "Admin write page_content"        ON page_content;
DROP POLICY IF EXISTS "Public read services"            ON services;
DROP POLICY IF EXISTS "Admin all services"              ON services;
DROP POLICY IF EXISTS "Public read service_translations" ON services_translations;
DROP POLICY IF EXISTS "Admin all service_translations"  ON services_translations;
DROP POLICY IF EXISTS "Public read sectors"             ON sectors;
DROP POLICY IF EXISTS "Admin all sectors"               ON sectors;
DROP POLICY IF EXISTS "Public read sectors_translations" ON sectors_translations;
DROP POLICY IF EXISTS "Admin all sectors_translations"  ON sectors_translations;
DROP POLICY IF EXISTS "Public read published posts"     ON blog_posts;
DROP POLICY IF EXISTS "Admin all blog_posts"            ON blog_posts;
DROP POLICY IF EXISTS "Public read blog_translations"   ON blog_posts_translations;
DROP POLICY IF EXISTS "Admin all blog_translations"     ON blog_posts_translations;
DROP POLICY IF EXISTS "Public read faqs"                ON faqs;
DROP POLICY IF EXISTS "Admin all faqs"                  ON faqs;
DROP POLICY IF EXISTS "Public read faq_translations"    ON faqs_translations;
DROP POLICY IF EXISTS "Admin all faq_translations"      ON faqs_translations;
DROP POLICY IF EXISTS "Public insert contact"           ON contact_messages;
DROP POLICY IF EXISTS "Admin read contact"              ON contact_messages;
DROP POLICY IF EXISTS "Public insert appointments"      ON appointments;
DROP POLICY IF EXISTS "Admin all appointments"          ON appointments;
DROP POLICY IF EXISTS "Public read appointment_settings" ON appointment_settings;
DROP POLICY IF EXISTS "Admin write appointment_settings" ON appointment_settings;
DROP POLICY IF EXISTS "Public read testimonials"        ON testimonials;
DROP POLICY IF EXISTS "Admin all testimonials"          ON testimonials;
DROP POLICY IF EXISTS "Public read team"                ON team_members;
DROP POLICY IF EXISTS "Admin all team"                  ON team_members;
DROP POLICY IF EXISTS "Admin read profiles"             ON admin_profiles;
DROP POLICY IF EXISTS "Admin manage profiles"           ON admin_profiles;

-- 3. Recreate all policies using is_admin() / is_super_admin()
--    (these functions bypass RLS, no more recursion)

-- site_config
CREATE POLICY "Public read site_config"  ON site_config FOR SELECT USING (true);
CREATE POLICY "Admin write site_config"  ON site_config FOR ALL  USING (is_admin());

-- page_content
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write page_content" ON page_content FOR ALL  USING (is_admin());

-- services
CREATE POLICY "Public read services"     ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all services"       ON services FOR ALL    USING (is_admin());

CREATE POLICY "Public read service_translations" ON services_translations FOR SELECT USING (true);
CREATE POLICY "Admin all service_translations"   ON services_translations FOR ALL    USING (is_admin());

-- sectors
CREATE POLICY "Public read sectors"      ON sectors FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all sectors"        ON sectors FOR ALL    USING (is_admin());

CREATE POLICY "Public read sectors_translations" ON sectors_translations FOR SELECT USING (true);
CREATE POLICY "Admin all sectors_translations"   ON sectors_translations FOR ALL    USING (is_admin());

-- blog
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all blog_posts"        ON blog_posts FOR ALL    USING (is_admin());

CREATE POLICY "Public read blog_translations" ON blog_posts_translations FOR SELECT USING (true);
CREATE POLICY "Admin all blog_translations"   ON blog_posts_translations FOR ALL    USING (is_admin());

-- faqs
CREATE POLICY "Public read faqs"         ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all faqs"           ON faqs FOR ALL    USING (is_admin());

CREATE POLICY "Public read faq_translations" ON faqs_translations FOR SELECT USING (true);
CREATE POLICY "Admin all faq_translations"   ON faqs_translations FOR ALL    USING (is_admin());

-- contact_messages
CREATE POLICY "Public insert contact"    ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact"       ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admin update contact"     ON contact_messages FOR UPDATE USING (is_admin());

-- appointments
CREATE POLICY "Public insert appointments"  ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all appointments"      ON appointments FOR ALL    USING (is_admin());

CREATE POLICY "Public read appointment_settings" ON appointment_settings FOR SELECT USING (true);
CREATE POLICY "Admin write appointment_settings" ON appointment_settings FOR ALL    USING (is_admin());

-- testimonials
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all testimonials"   ON testimonials FOR ALL    USING (is_admin());

-- team_members
CREATE POLICY "Public read team"         ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all team"           ON team_members FOR ALL    USING (is_admin());

-- admin_profiles (uses is_admin() which is SECURITY DEFINER → no recursion)
CREATE POLICY "Admin read profiles"      ON admin_profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admin manage profiles"    ON admin_profiles FOR ALL    USING (is_super_admin());
