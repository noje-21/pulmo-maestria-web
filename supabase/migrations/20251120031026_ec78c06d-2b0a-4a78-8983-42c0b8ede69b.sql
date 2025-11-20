-- =====================================================
-- MIGRACIÓN: Corrección de Foreign Keys
-- =====================================================

-- PASO 1: Crear perfiles faltantes para datos huérfanos
INSERT INTO public.profiles (user_id, full_name)
SELECT DISTINCT fp.user_id, 'Usuario'
FROM forum_posts fp
LEFT JOIN profiles p ON fp.user_id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, full_name)
SELECT DISTINCT n.author_id, 'Usuario'
FROM novedades n
LEFT JOIN profiles p ON n.author_id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- PASO 2: Eliminar FKs existentes que apuntan a auth.users
ALTER TABLE public.forum_posts DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;
ALTER TABLE public.forum_comments DROP CONSTRAINT IF EXISTS forum_comments_user_id_fkey;
ALTER TABLE public.novedades DROP CONSTRAINT IF EXISTS novedades_author_id_fkey;
ALTER TABLE public.media_files DROP CONSTRAINT IF EXISTS media_files_uploaded_by_fkey;
ALTER TABLE public.post_reactions DROP CONSTRAINT IF EXISTS post_reactions_user_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey CASCADE;

-- PASO 3: Crear nuevos FKs apuntando a profiles.user_id
ALTER TABLE public.forum_posts 
  ADD CONSTRAINT forum_posts_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

ALTER TABLE public.forum_comments 
  ADD CONSTRAINT forum_comments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

ALTER TABLE public.novedades 
  ADD CONSTRAINT novedades_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

ALTER TABLE public.media_files 
  ADD CONSTRAINT media_files_uploaded_by_fkey 
  FOREIGN KEY (uploaded_by) 
  REFERENCES public.profiles(user_id) 
  ON DELETE SET NULL;

ALTER TABLE public.post_reactions 
  ADD CONSTRAINT post_reactions_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

ALTER TABLE public.notifications 
  ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

-- PASO 4: Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON public.forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_novedades_author_id ON public.novedades(author_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON public.media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_post ON public.post_reactions(user_id, post_id);

-- PASO 5: Asegurar índice único en profiles.user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id_unique ON public.profiles(user_id);