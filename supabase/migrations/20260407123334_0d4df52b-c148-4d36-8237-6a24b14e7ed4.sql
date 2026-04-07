
-- 1. Fix notifications: remove the dangerous public INSERT policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- 2. Protect forum_posts admin-only fields with a trigger
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
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_forum_post_fields_trigger ON public.forum_posts;
CREATE TRIGGER protect_forum_post_fields_trigger
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_forum_post_fields();

-- 3. Restrict post_reactions SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.post_reactions;
CREATE POLICY "Authenticated users can view reactions"
  ON public.post_reactions
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Restrict profiles public SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
CREATE POLICY "Authenticated users can view basic profile info"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);
