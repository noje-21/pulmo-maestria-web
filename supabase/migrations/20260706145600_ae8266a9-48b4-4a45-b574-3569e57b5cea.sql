-- 1) Fix overly-permissive profiles read policy
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;

CREATE POLICY "Authenticated can view content authors"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.forum_posts fp WHERE fp.user_id = profiles.user_id)
  OR EXISTS (SELECT 1 FROM public.forum_comments fc WHERE fc.user_id = profiles.user_id)
  OR EXISTS (SELECT 1 FROM public.novedades n WHERE n.author_id = profiles.user_id)
  OR EXISTS (SELECT 1 FROM public.ateneos a WHERE a.created_by = profiles.user_id)
);

-- 2) Lock down SECURITY DEFINER functions: revoke from PUBLIC/anon,
--    grant only to roles that legitimately need to invoke via API.
REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO service_role;

REVOKE EXECUTE ON FUNCTION public.prune_web_vitals(integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prune_web_vitals(integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_web_vitals(integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, integer, integer, interval) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, integer, integer, interval) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, integer, integer, interval) TO service_role;

REVOKE EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.increment_post_views(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_views(uuid) TO anon, authenticated, service_role;