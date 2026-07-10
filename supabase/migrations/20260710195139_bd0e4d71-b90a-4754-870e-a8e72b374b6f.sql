
-- Public-read tables: anon SELECT + authenticated full access
GRANT SELECT ON public.ateneos, public.forum_posts, public.forum_comments, public.forum_post_tags, public.novedades, public.novedad_tags, public.site_content, public.tags TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ateneos, public.forum_posts, public.forum_comments, public.forum_post_tags, public.novedades, public.novedad_tags, public.site_content, public.tags, public.notifications, public.media_files, public.profiles, public.contact_submissions, public.audit_log, public.user_roles, public.web_vitals TO authenticated;

-- Service role: full access on everything
GRANT ALL ON public.ateneos, public.audit_log, public.contact_rate_limits, public.contact_submissions, public.forum_comments, public.forum_post_tags, public.forum_posts, public.media_files, public.notifications, public.novedad_tags, public.novedades, public.post_reactions, public.profiles, public.site_content, public.tags, public.user_roles, public.web_vitals TO service_role;
