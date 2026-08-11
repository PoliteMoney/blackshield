-- Run this once against the live database to pick up the footer social-icon change:
-- Twitter -> X (keeps any URL already saved under social_twitter), and adds Instagram.

UPDATE site_config
SET key = 'social_x', label = 'X (Twitter) URL'
WHERE key = 'social_twitter'
  AND NOT EXISTS (SELECT 1 FROM site_config WHERE key = 'social_x');

INSERT INTO site_config (key, value, type, label, category) VALUES
  ('social_x', '', 'text', 'X (Twitter) URL', 'social'),
  ('social_instagram', '', 'text', 'Instagram URL', 'social')
ON CONFLICT (key) DO NOTHING;
