REVOKE EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text, text, text, jsonb) TO service_role;