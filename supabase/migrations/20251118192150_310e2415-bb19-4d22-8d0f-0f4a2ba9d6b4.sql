-- Add missing foreign keys (skip if already exists)
-- Add foreign key for novedades if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'novedades_author_id_fkey'
  ) THEN
    ALTER TABLE public.novedades 
      ADD CONSTRAINT novedades_author_id_fkey 
      FOREIGN KEY (author_id) 
      REFERENCES public.profiles(user_id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key for media_files if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'media_files_uploaded_by_fkey'
  ) THEN
    ALTER TABLE public.media_files 
      ADD CONSTRAINT media_files_uploaded_by_fkey 
      FOREIGN KEY (uploaded_by) 
      REFERENCES public.profiles(user_id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_novedades_author_id ON public.novedades(author_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON public.media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_novedades_status ON public.novedades(status);