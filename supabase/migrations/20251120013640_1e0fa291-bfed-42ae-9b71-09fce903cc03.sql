-- Fix profiles RLS policy to allow viewing author names
CREATE POLICY "Anyone can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Create atomic view counter function
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE forum_posts 
  SET views_count = views_count + 1 
  WHERE id = post_id;
END;
$$;

-- Add comment length constraint
ALTER TABLE forum_comments 
ADD CONSTRAINT comment_length_check 
CHECK (length(content) > 0 AND length(content) <= 2000);