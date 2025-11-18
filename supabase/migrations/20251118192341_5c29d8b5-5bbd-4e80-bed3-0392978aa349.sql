-- Add foreign key for forum_comments if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'forum_comments_user_id_fkey'
  ) THEN
    ALTER TABLE public.forum_comments 
      ADD CONSTRAINT forum_comments_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES public.profiles(user_id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for forum_comments for better query performance
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON public.forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON public.forum_comments(post_id);