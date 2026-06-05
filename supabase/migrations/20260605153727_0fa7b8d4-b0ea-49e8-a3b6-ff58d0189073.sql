
REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, int, int, interval) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(text, text, int, int, interval) TO service_role;
