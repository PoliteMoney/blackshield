-- Run this once against the live database to enable social reposts and post reactions.

-- Social repost fields on blog_posts (native | facebook | linkedin | instagram | x)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS source_platform TEXT NOT NULL DEFAULT 'native',
  ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Anonymous "like" reactions (Instagram-style single heart reaction)
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  reaction TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, visitor_id)
);

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read post_reactions" ON post_reactions;
CREATE POLICY "Public read post_reactions" ON post_reactions FOR SELECT USING (true);

-- No direct public INSERT/DELETE policies: all writes go through the function below,
-- so an anon visitor can only toggle their own (post_id, visitor_id) row, never anyone else's.
CREATE OR REPLACE FUNCTION toggle_post_reaction(p_post_id UUID, p_visitor_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE liked BOOLEAN;
BEGIN
  IF EXISTS (SELECT 1 FROM post_reactions WHERE post_id = p_post_id AND visitor_id = p_visitor_id) THEN
    DELETE FROM post_reactions WHERE post_id = p_post_id AND visitor_id = p_visitor_id;
    liked := false;
  ELSE
    INSERT INTO post_reactions (post_id, visitor_id) VALUES (p_post_id, p_visitor_id)
      ON CONFLICT (post_id, visitor_id) DO NOTHING;
    liked := true;
  END IF;
  RETURN liked;
END;
$$;

GRANT EXECUTE ON FUNCTION toggle_post_reaction(UUID, TEXT) TO anon, authenticated;
