DROP FUNCTION IF EXISTS public.dashboard_timeseries(integer);

CREATE OR REPLACE FUNCTION public.dashboard_timeseries(_days integer DEFAULT 30)
RETURNS TABLE (
  bucket date,
  users_new bigint,
  visits bigint,
  interactions bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d int := least(greatest(coalesce(_days, 30), 1), 180);
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  WITH days AS (
    SELECT generate_series(
      (date_trunc('day', now()) - make_interval(days => d - 1))::date,
      date_trunc('day', now())::date,
      interval '1 day'
    )::date AS dd
  ),
  u AS (
    SELECT date_trunc('day', p.created_at)::date AS dd, count(*) AS c
    FROM public.profiles p
    WHERE p.created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
    GROUP BY 1
  ),
  v AS (
    SELECT date_trunc('day', w.created_at)::date AS dd,
           count(DISTINCT coalesce(w.metric_id, w.id::text)) AS c
    FROM public.web_vitals w
    WHERE w.metric_name = 'TTFB'
      AND w.created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
    GROUP BY 1
  ),
  i AS (
    SELECT s.dd, sum(s.c) AS c FROM (
      SELECT date_trunc('day', fc.created_at)::date AS dd, count(*) AS c
        FROM public.forum_comments fc
        WHERE fc.created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
      UNION ALL
      SELECT date_trunc('day', pr.created_at)::date, count(*)
        FROM public.post_reactions pr
        WHERE pr.created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
      UNION ALL
      SELECT date_trunc('day', fp.created_at)::date, count(*)
        FROM public.forum_posts fp
        WHERE fp.created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
    ) s GROUP BY s.dd
  )
  SELECT days.dd,
         coalesce(u.c, 0)::bigint,
         coalesce(v.c, 0)::bigint,
         coalesce(i.c, 0)::bigint
  FROM days
  LEFT JOIN u ON u.dd = days.dd
  LEFT JOIN v ON v.dd = days.dd
  LEFT JOIN i ON i.dd = days.dd
  ORDER BY days.dd;
END;
$$;

REVOKE ALL ON FUNCTION public.dashboard_timeseries(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dashboard_timeseries(integer) TO authenticated;