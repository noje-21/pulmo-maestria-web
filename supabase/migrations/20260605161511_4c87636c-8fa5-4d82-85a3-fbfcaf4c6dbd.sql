
-- ============================================
-- Phase 5: Scaling preparation
-- ============================================

-- 1. CONTACT SUBMISSIONS: status, updated_at, indexes
DO $$ BEGIN
  CREATE TYPE public.contact_status AS ENUM ('nuevo', 'leido', 'respondido', 'spam');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS status public.contact_status NOT NULL DEFAULT 'nuevo',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Allow admins to update contact submissions (status changes)
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER trg_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions (lower(email));
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions (status);

-- 2. WEB VITALS: retention + indexes
CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON public.web_vitals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_name ON public.web_vitals (metric_name);

-- Retention function: keep last 30 days
CREATE OR REPLACE FUNCTION public.prune_web_vitals(_days integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE deleted_count int;
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  DELETE FROM public.web_vitals WHERE created_at < now() - make_interval(days => _days);
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.prune_web_vitals(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_web_vitals(integer) TO authenticated, service_role;

-- Schedule daily pruning via pg_cron if available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('prune-web-vitals-daily')
      WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'prune-web-vitals-daily');
    PERFORM cron.schedule(
      'prune-web-vitals-daily',
      '0 3 * * *',
      $cron$DELETE FROM public.web_vitals WHERE created_at < now() - interval '30 days';$cron$
    );
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. AUDIT LOG
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit log" ON public.audit_log;
CREATE POLICY "Admins can view audit log"
  ON public.audit_log FOR SELECT
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated can insert audit log" ON public.audit_log;
CREATE POLICY "Authenticated can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (auth.uid() = actor_id OR is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log (entity_type, entity_id);

-- Helper function to record audit events (server-side use)
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _action text,
  _entity_type text DEFAULT NULL,
  _entity_id text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _id uuid;
BEGIN
  INSERT INTO public.audit_log(actor_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), _action, _entity_type, _entity_id, COALESCE(_metadata, '{}'::jsonb))
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) TO authenticated, service_role;

-- 4. STATS: admin overview optimized view-like function
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN jsonb_build_object(
    'contacts_total', (SELECT count(*) FROM public.contact_submissions),
    'contacts_nuevo', (SELECT count(*) FROM public.contact_submissions WHERE status = 'nuevo'),
    'contacts_leido', (SELECT count(*) FROM public.contact_submissions WHERE status = 'leido'),
    'contacts_respondido', (SELECT count(*) FROM public.contact_submissions WHERE status = 'respondido'),
    'contacts_spam', (SELECT count(*) FROM public.contact_submissions WHERE status = 'spam'),
    'contacts_last_7d', (SELECT count(*) FROM public.contact_submissions WHERE created_at > now() - interval '7 days'),
    'forum_posts', (SELECT count(*) FROM public.forum_posts),
    'novedades', (SELECT count(*) FROM public.novedades),
    'ateneos', (SELECT count(*) FROM public.ateneos),
    'web_vitals_24h', (SELECT count(*) FROM public.web_vitals WHERE created_at > now() - interval '24 hours')
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated, service_role;
