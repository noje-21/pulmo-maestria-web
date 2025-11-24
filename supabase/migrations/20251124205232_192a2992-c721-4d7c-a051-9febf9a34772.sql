-- Crear bucket de storage para imágenes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'forum-images',
  'forum-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Políticas de storage para forum-images
CREATE POLICY "Usuarios autenticados pueden subir imágenes al foro"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'forum-images');

CREATE POLICY "Imágenes del foro son públicas para ver"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'forum-images');

CREATE POLICY "Usuarios pueden actualizar sus propias imágenes del foro"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuarios pueden eliminar sus propias imágenes del foro"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins pueden eliminar cualquier imagen
CREATE POLICY "Admins pueden eliminar cualquier imagen del foro"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'forum-images' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);