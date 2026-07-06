
-- Restrict profiles public read
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;
CREATE POLICY "Authenticated users can view basic profile info" ON public.profiles
FOR SELECT TO authenticated USING (true);

-- Restrict media_files SELECT to authenticated
DROP POLICY IF EXISTS "Anyone can view media files" ON public.media_files;
CREATE POLICY "Authenticated users can view media files" ON public.media_files
FOR SELECT TO authenticated USING (true);

-- Scope post_reactions policies to authenticated role
DROP POLICY IF EXISTS "Authenticated users can add reactions" ON public.post_reactions;
CREATE POLICY "Authenticated users can add reactions" ON public.post_reactions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reactions" ON public.post_reactions;
CREATE POLICY "Users can delete their own reactions" ON public.post_reactions
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Remove public read on cvs bucket (admins retain access via cvs_admin_select)
DROP POLICY IF EXISTS "Public can read CVs" ON storage.objects;

-- Remove broad SELECT policies on public buckets to prevent LIST
-- (public file URLs continue to work because public buckets bypass RLS for direct object fetch)
DROP POLICY IF EXISTS "Imágenes del foro son públicas para ver" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for email assets" ON storage.objects;
DROP POLICY IF EXISTS "Site images are publicly accessible" ON storage.objects;

-- Revoke EXECUTE from SECURITY DEFINER functions that should not be callable from the API
REVOKE ALL ON FUNCTION public.protect_forum_post_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_forum_comment() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_reactions_count() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_contact_rate_limit(text, text, integer, integer, interval) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_post_views(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.prune_web_vitals(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM PUBLIC, anon;
-- Note: public.is_admin(uuid) EXECUTE is retained because RLS policies invoke it as the calling role.
