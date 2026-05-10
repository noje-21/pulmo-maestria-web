CREATE TABLE public.web_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value double precision NOT NULL,
  metric_rating text,
  metric_delta double precision,
  metric_id text,
  navigation_type text,
  page_url text,
  device_type text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
CREATE INDEX idx_web_vitals_metric_name ON public.web_vitals (metric_name);

ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert web vitals"
  ON public.web_vitals FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view web vitals"
  ON public.web_vitals FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete web vitals"
  ON public.web_vitals FOR DELETE
  USING (is_admin(auth.uid()));