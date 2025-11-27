-- Add tags table (if not exists, will be handled safely)
-- Tags are already created, so we'll enhance forum_posts and novedades tables

-- Add missing fields to forum_posts
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS excerpt text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published' CHECK (status IN ('draft', 'published')),
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Add comment replies support (parent_comment_id)
ALTER TABLE forum_comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES forum_comments(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent ON forum_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_featured ON forum_posts(featured);

-- Update RLS policies for draft posts
DROP POLICY IF EXISTS "Anyone can view published forum posts" ON forum_posts;

CREATE POLICY "Anyone can view published forum posts"
ON forum_posts FOR SELECT
USING (status = 'published' OR auth.uid() = user_id OR is_admin(auth.uid()));

-- Allow users to create draft posts
CREATE POLICY "Users can create draft posts" ON forum_posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

COMMENT ON COLUMN forum_posts.excerpt IS 'Short description for preview cards';
COMMENT ON COLUMN forum_posts.status IS 'Post status: draft or published';
COMMENT ON COLUMN forum_posts.featured IS 'Featured/highlighted posts appear first';
COMMENT ON COLUMN forum_comments.parent_id IS 'For nested replies to comments';