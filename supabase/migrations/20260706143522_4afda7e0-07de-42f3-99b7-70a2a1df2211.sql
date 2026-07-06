GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, integer, integer, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) TO authenticated, service_role;