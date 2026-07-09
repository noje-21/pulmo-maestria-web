
-- 1) Add comments_count to forum_posts and maintain via trigger
ALTER TABLE public.forum_posts
  ADD COLUMN IF NOT EXISTS comments_count integer NOT NULL DEFAULT 0;

-- Backfill from existing comments
UPDATE public.forum_posts p
SET comments_count = COALESCE(sub.c, 0)
FROM (
  SELECT post_id, COUNT(*)::int AS c
  FROM public.forum_comments
  GROUP BY post_id
) sub
WHERE p.id = sub.post_id;

-- Trigger function to keep comments_count in sync
CREATE OR REPLACE FUNCTION public.update_forum_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
      SET comments_count = comments_count + 1
      WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
      SET comments_count = GREATEST(comments_count - 1, 0)
      WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_comments_count ON public.forum_comments;
CREATE TRIGGER trg_forum_comments_count
AFTER INSERT OR DELETE ON public.forum_comments
FOR EACH ROW EXECUTE FUNCTION public.update_forum_comments_count();

-- Also protect comments_count from client-side updates on forum_posts
CREATE OR REPLACE FUNCTION public.protect_forum_post_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    NEW.is_pinned := OLD.is_pinned;
    NEW.featured := OLD.featured;
    NEW.reactions_count := OLD.reactions_count;
    NEW.views_count := OLD.views_count;
    NEW.comments_count := OLD.comments_count;
  END IF;
  RETURN NEW;
END;
$$;

-- 2) Performance indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_status_created
  ON public.forum_posts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status_comments
  ON public.forum_posts (status, comments_count DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status_views
  ON public.forum_posts (status, views_count DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_created
  ON public.forum_comments (post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_novedades_status_published
  ON public.novedades (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ateneos_status_fecha
  ON public.ateneos (status, fecha DESC);

-- 3) Trigram indexes for ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_forum_posts_title_trgm
  ON public.forum_posts USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_novedades_title_trgm
  ON public.novedades USING gin (title gin_trgm_ops);

-- 4) Batch RPC: return which post_ids the current user has reacted to
CREATE OR REPLACE FUNCTION public.get_user_reactions(
  _post_type text,
  _post_ids uuid[]
)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT post_id
  FROM public.post_reactions
  WHERE user_id = auth.uid()
    AND post_type = _post_type
    AND post_id = ANY(_post_ids);
$$;

REVOKE ALL ON FUNCTION public.get_user_reactions(text, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_reactions(text, uuid[]) TO authenticated, service_role;
