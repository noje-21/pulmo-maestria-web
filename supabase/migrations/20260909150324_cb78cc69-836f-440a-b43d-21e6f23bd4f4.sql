ALTER TABLE public.web_vitals ADD COLUMN IF NOT EXISTS ip text;

CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_created ON public.web_vitals (metric_name, created_at DESC);

CREATE OR REPLACE FUNCTION public.dashboard_timeseries(_days integer DEFAULT 30)
RETURNS TABLE (
  day date,
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
    )::date AS day
  ),
  u AS (
    SELECT date_trunc('day', created_at)::date AS day, count(*) AS c
    FROM public.profiles
    WHERE created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
    GROUP BY 1
  ),
  v AS (
    SELECT date_trunc('day', created_at)::date AS day,
           count(DISTINCT coalesce(metric_id, id::text)) AS c
    FROM public.web_vitals
    WHERE metric_name = 'LCP'
      AND created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
    GROUP BY 1
  ),
  i AS (
    SELECT day, sum(c) AS c FROM (
      SELECT date_trunc('day', created_at)::date AS day, count(*) AS c
        FROM public.forum_comments
        WHERE created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
      UNION ALL
      SELECT date_trunc('day', created_at)::date, count(*)
        FROM public.post_reactions
        WHERE created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
      UNION ALL
      SELECT date_trunc('day', created_at)::date, count(*)
        FROM public.forum_posts
        WHERE created_at >= date_trunc('day', now()) - make_interval(days => d - 1)
        GROUP BY 1
    ) s GROUP BY day
  )
  SELECT days.day,
         coalesce(u.c, 0)::bigint,
         coalesce(v.c, 0)::bigint,
         coalesce(i.c, 0)::bigint
  FROM days
  LEFT JOIN u ON u.day = days.day
  LEFT JOIN v ON v.day = days.day
  LEFT JOIN i ON i.day = days.day
  ORDER BY days.day;
END;
$$;

REVOKE ALL ON FUNCTION public.dashboard_timeseries(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dashboard_timeseries(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.visit_history(_limit integer DEFAULT 100, _offset integer DEFAULT 0, _search text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  page_url text,
  ip text,
  device_type text,
  user_agent text,
  total_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lim int := least(greatest(coalesce(_limit, 100), 1), 500);
  off int := greatest(coalesce(_offset, 0), 0);
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT w.id, w.created_at, w.page_url, w.ip, w.device_type, w.user_agent
    FROM public.web_vitals w
    WHERE w.metric_name = 'LCP'
      AND (_search IS NULL OR _search = '' OR w.page_url ILIKE '%' || _search || '%' OR w.ip ILIKE '%' || _search || '%')
  )
  SELECT b.id, b.created_at, b.page_url, b.ip, b.device_type, b.user_agent,
         (SELECT count(*) FROM base) AS total_count
  FROM base b
  ORDER BY b.created_at DESC
  LIMIT lim OFFSET off;
END;
$$;

REVOKE ALL ON FUNCTION public.visit_history(integer, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.visit_history(integer, integer, text) TO authenticated;