-- Create admin users table with role-based security
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can modify roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  specialty TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact submissions
CREATE POLICY "Anyone can create contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Site content management table
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.user_roles(user_id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for site content
CREATE POLICY "Anyone can view site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_content_timestamp
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert initial admin user (will be created after first signup)
-- User needs to sign up first with email leandro1234567890es@gmail.com
-- Then we'll manually set their role to admin

-- Insert default site content
INSERT INTO public.site_content (section, content) VALUES
  ('hero', '{"title": "Maestría Latinoamericana en Circulación Pulmonar 2025", "subtitle": "Buenos Aires", "dates": "Del 3 al 15 de noviembre 2025"}'::jsonb),
  ('about', '{"description": "Formación intensiva en circulación pulmonar dirigida a internistas, cardiólogos, reumatólogos y neumonólogos."}'::jsonb),
  ('contact', '{"email": "magisterenhipertensionpulmonar@gmail.com", "whatsapp": "+57 3004142568", "instagram": "@magisterenhipertensionpulmonar", "website": "www.circulacionpulmonar.com"}'::jsonb);