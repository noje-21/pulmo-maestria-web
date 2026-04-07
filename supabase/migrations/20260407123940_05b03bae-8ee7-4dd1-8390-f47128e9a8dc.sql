
-- Fix forum-images INSERT policy to enforce user-scoped uploads
DROP POLICY IF EXISTS "Authenticated users can upload forum images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload forum images" ON storage.objects;

-- Find and drop any existing INSERT policy on forum-images
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND cmd = 'INSERT'
    AND qual IS NOT DISTINCT FROM NULL
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Create properly scoped INSERT policy
CREATE POLICY "Users can upload to own folder in forum-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'forum-images' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
