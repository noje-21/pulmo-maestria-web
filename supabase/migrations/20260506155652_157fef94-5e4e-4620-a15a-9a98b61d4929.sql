
-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Site images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Admin-only upload
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images'
  AND public.is_admin(auth.uid())
);

-- Admin-only update
CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-images'
  AND public.is_admin(auth.uid())
);

-- Admin-only delete
CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-images'
  AND public.is_admin(auth.uid())
);
