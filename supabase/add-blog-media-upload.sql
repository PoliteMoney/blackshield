-- Run this once against the live database to enable multi-image/video uploads on blog posts.
-- The 'blog-media' storage bucket itself has already been created (public, 25MB/file limit).

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Only admins can upload/delete inside the blog-media bucket.
-- Reads are public because the bucket itself is public (no SELECT policy needed for that).
DROP POLICY IF EXISTS "Admin upload blog-media" ON storage.objects;
CREATE POLICY "Admin upload blog-media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-media' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));

DROP POLICY IF EXISTS "Admin delete blog-media" ON storage.objects;
CREATE POLICY "Admin delete blog-media" ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-media' AND EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = true));
