
-- Drop ALL existing CV-related storage policies to avoid name conflicts
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view CVs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage CVs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete CVs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read CVs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload CVs to cvs bucket" ON storage.objects;

CREATE POLICY "cvs_public_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "cvs_admin_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND public.is_admin(auth.uid()));

CREATE POLICY "cvs_admin_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'cvs' AND public.is_admin(auth.uid()));

-- Foreign Keys with CASCADE
ALTER TABLE public.forum_comments
  DROP CONSTRAINT IF EXISTS forum_comments_post_id_fkey,
  ADD CONSTRAINT forum_comments_post_id_fkey
    FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;

ALTER TABLE public.forum_comments
  DROP CONSTRAINT IF EXISTS forum_comments_parent_id_fkey,
  ADD CONSTRAINT forum_comments_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES public.forum_comments(id) ON DELETE CASCADE;

ALTER TABLE public.forum_post_tags
  DROP CONSTRAINT IF EXISTS forum_post_tags_post_id_fkey,
  ADD CONSTRAINT forum_post_tags_post_id_fkey
    FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;

ALTER TABLE public.forum_post_tags
  DROP CONSTRAINT IF EXISTS forum_post_tags_tag_id_fkey,
  ADD CONSTRAINT forum_post_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

ALTER TABLE public.novedad_tags
  DROP CONSTRAINT IF EXISTS novedad_tags_novedad_id_fkey,
  ADD CONSTRAINT novedad_tags_novedad_id_fkey
    FOREIGN KEY (novedad_id) REFERENCES public.novedades(id) ON DELETE CASCADE;

ALTER TABLE public.novedad_tags
  DROP CONSTRAINT IF EXISTS novedad_tags_tag_id_fkey,
  ADD CONSTRAINT novedad_tags_tag_id_fkey
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS forum_post_tags_unique ON public.forum_post_tags(post_id, tag_id);
CREATE UNIQUE INDEX IF NOT EXISTS novedad_tags_unique ON public.novedad_tags(novedad_id, tag_id);
CREATE UNIQUE INDEX IF NOT EXISTS post_reactions_unique ON public.post_reactions(user_id, post_type, post_id, reaction_type);

CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_type, post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Rate limit table
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.contact_rate_limits TO service_role;
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_lookup
  ON public.contact_rate_limits(identifier, kind, created_at DESC);

CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(
  _ip text,
  _email text,
  _ip_limit int DEFAULT 5,
  _email_limit int DEFAULT 3,
  _window interval DEFAULT interval '1 hour'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ip_count int;
  email_count int;
BEGIN
  DELETE FROM public.contact_rate_limits WHERE created_at < now() - interval '24 hours';

  SELECT COUNT(*) INTO ip_count FROM public.contact_rate_limits
    WHERE kind = 'ip' AND identifier = _ip AND created_at > now() - _window;

  SELECT COUNT(*) INTO email_count FROM public.contact_rate_limits
    WHERE kind = 'email' AND identifier = lower(_email) AND created_at > now() - _window;

  IF ip_count >= _ip_limit OR email_count >= _email_limit THEN
    RETURN jsonb_build_object('allowed', false, 'ip_count', ip_count, 'email_count', email_count);
  END IF;

  INSERT INTO public.contact_rate_limits(identifier, kind) VALUES (_ip, 'ip'), (lower(_email), 'email');
  RETURN jsonb_build_object('allowed', true);
END;
$$;
