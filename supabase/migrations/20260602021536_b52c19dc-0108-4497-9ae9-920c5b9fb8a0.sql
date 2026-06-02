
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS cv_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Public can read CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs');

CREATE POLICY "Admins can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cvs' AND public.is_admin(auth.uid()));
