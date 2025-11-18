-- Create enum for forum categories
CREATE TYPE public.forum_category AS ENUM ('general', 'clinical_questions', 'case_discussions', 'shared_resources');

-- Create enum for novedad status
CREATE TYPE public.novedad_status AS ENUM ('draft', 'published', 'archived');

-- Create forum_posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category forum_category NOT NULL DEFAULT 'general',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false
);

-- Create forum_comments table
CREATE TABLE public.forum_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create novedades table
CREATE TABLE public.novedades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status novedad_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_files table
CREATE TABLE public.media_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_posts
CREATE POLICY "Anyone can view published forum posts"
ON public.forum_posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create forum posts"
ON public.forum_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts"
ON public.forum_posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any forum post"
ON public.forum_posts FOR DELETE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own forum posts"
ON public.forum_posts FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for forum_comments
CREATE POLICY "Anyone can view forum comments"
ON public.forum_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.forum_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.forum_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment"
ON public.forum_comments FOR DELETE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own comments"
ON public.forum_comments FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for novedades
CREATE POLICY "Anyone can view published novedades"
ON public.novedades FOR SELECT
USING (status = 'published' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert novedades"
ON public.novedades FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update novedades"
ON public.novedades FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete novedades"
ON public.novedades FOR DELETE
USING (public.is_admin(auth.uid()));

-- RLS Policies for media_files
CREATE POLICY "Anyone can view media files"
ON public.media_files FOR SELECT
USING (true);

CREATE POLICY "Admins can upload media files"
ON public.media_files FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete media files"
ON public.media_files FOR DELETE
USING (public.is_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON public.forum_comments(user_id);
CREATE INDEX idx_novedades_status ON public.novedades(status);
CREATE INDEX idx_novedades_slug ON public.novedades(slug);
CREATE INDEX idx_novedades_published_at ON public.novedades(published_at DESC);

-- Create trigger for updated_at
CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_forum_comments_updated_at
  BEFORE UPDATE ON public.forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_novedades_updated_at
  BEFORE UPDATE ON public.novedades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();