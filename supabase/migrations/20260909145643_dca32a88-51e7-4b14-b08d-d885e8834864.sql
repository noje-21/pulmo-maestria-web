CREATE OR REPLACE FUNCTION public.dashboard_live_stats()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  users_total int;
  users_prev int;
  visits_today int;
  visits_yesterday int;
  inter_today int;
  inter_yesterday int;
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT count(*) INTO users_total FROM public.profiles;
  SELECT count(*) INTO users_prev FROM public.profiles WHERE created_at < date_trunc('day', now());

  SELECT count(DISTINCT coalesce(metric_id, id::text)) INTO visits_today
    FROM public.web_vitals
    WHERE metric_name = 'LCP' AND created_at >= date_trunc('day', now());

  SELECT count(DISTINCT coalesce(metric_id, id::text)) INTO visits_yesterday
    FROM public.web_vitals
    WHERE metric_name = 'LCP'
      AND created_at >= date_trunc('day', now()) - interval '1 day'
      AND created_at < date_trunc('day', now());

  SELECT
    (SELECT count(*) FROM public.forum_comments WHERE created_at >= date_trunc('day', now()))
    + (SELECT count(*) FROM public.post_reactions WHERE created_at >= date_trunc('day', now()))
    + (SELECT count(*) FROM public.forum_posts WHERE created_at >= date_trunc('day', now()))
  INTO inter_today;

  SELECT
    (SELECT count(*) FROM public.forum_comments WHERE created_at >= date_trunc('day', now()) - interval '1 day' AND created_at < date_trunc('day', now()))
    + (SELECT count(*) FROM public.post_reactions WHERE created_at >= date_trunc('day', now()) - interval '1 day' AND created_at < date_trunc('day', now()))
    + (SELECT count(*) FROM public.forum_posts WHERE created_at >= date_trunc('day', now()) - interval '1 day' AND created_at < date_trunc('day', now()))
  INTO inter_yesterday;

  RETURN jsonb_build_object(
    'users_total', users_total,
    'users_new_today', users_total - users_prev,
    'visits_today', visits_today,
    'visits_yesterday', visits_yesterday,
    'interactions_today', inter_today,
    'interactions_yesterday', inter_yesterday,
    'generated_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.dashboard_live_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dashboard_live_stats() TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.web_vitals;