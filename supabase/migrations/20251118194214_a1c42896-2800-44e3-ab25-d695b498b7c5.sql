-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum_post_tags junction table
CREATE TABLE IF NOT EXISTS public.forum_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- Create novedad_tags junction table
CREATE TABLE IF NOT EXISTS public.novedad_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  novedad_id UUID NOT NULL REFERENCES public.novedades(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(novedad_id, tag_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novedad_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Anyone can view tags"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tags"
  ON public.tags FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete tags"
  ON public.tags FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for forum_post_tags
CREATE POLICY "Anyone can view forum post tags"
  ON public.forum_post_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add tags to their posts"
  ON public.forum_post_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forum_posts
      WHERE id = post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all forum post tags"
  ON public.forum_post_tags FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for novedad_tags
CREATE POLICY "Anyone can view novedad tags"
  ON public.novedad_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage novedad tags"
  ON public.novedad_tags FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_forum_post_tags_post_id ON public.forum_post_tags(post_id);
CREATE INDEX idx_forum_post_tags_tag_id ON public.forum_post_tags(tag_id);
CREATE INDEX idx_novedad_tags_novedad_id ON public.novedad_tags(novedad_id);
CREATE INDEX idx_novedad_tags_tag_id ON public.novedad_tags(tag_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create notification for new forum comment
CREATE OR REPLACE FUNCTION public.notify_forum_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author_id UUID;
  post_title TEXT;
  commenter_name TEXT;
BEGIN
  -- Get post author and title
  SELECT user_id, title INTO post_author_id, post_title
  FROM forum_posts WHERE id = NEW.post_id;
  
  -- Get commenter name
  SELECT full_name INTO commenter_name
  FROM profiles WHERE user_id = NEW.user_id;
  
  -- Only notify if comment is not from post author
  IF post_author_id != NEW.user_id THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      post_author_id,
      'forum_comment',
      'Nuevo comentario en tu publicación',
      commenter_name || ' comentó en: ' || post_title,
      '/foro/' || NEW.post_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for forum comments
DROP TRIGGER IF EXISTS trigger_notify_forum_comment ON public.forum_comments;
CREATE TRIGGER trigger_notify_forum_comment
  AFTER INSERT ON public.forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_forum_comment();