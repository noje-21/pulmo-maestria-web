-- Fix function search path security warning with CASCADE
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$;

-- Recreate RLS policies that depend on is_admin function
-- For user_roles table
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can modify roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- For contact_submissions table
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin(auth.uid()));

-- For site_content table
CREATE POLICY "Admins can update site content"
  ON public.site_content FOR ALL
  USING (public.is_admin(auth.uid()));