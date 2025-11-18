-- Crear tabla de reacciones para foro y novedades
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL CHECK (post_type IN ('forum', 'novedad')),
  post_id UUID NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'celebrate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_type, post_id)
);

-- Habilitar RLS
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Políticas para reacciones
CREATE POLICY "Anyone can view reactions"
ON public.post_reactions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add reactions"
ON public.post_reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
ON public.post_reactions FOR DELETE
USING (auth.uid() = user_id);

-- Agregar contador de reacciones a forum_posts
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;

-- Agregar contador de reacciones a novedades
ALTER TABLE public.novedades ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;

-- Función para actualizar contador de reacciones
CREATE OR REPLACE FUNCTION public.update_reactions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_type = 'forum' THEN
      UPDATE forum_posts SET reactions_count = reactions_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.post_type = 'novedad' THEN
      UPDATE novedades SET reactions_count = reactions_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_type = 'forum' THEN
      UPDATE forum_posts SET reactions_count = GREATEST(reactions_count - 1, 0) WHERE id = OLD.post_id;
    ELSIF OLD.post_type = 'novedad' THEN
      UPDATE novedades SET reactions_count = GREATEST(reactions_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger para actualizar contador automáticamente
DROP TRIGGER IF EXISTS update_reactions_count_trigger ON public.post_reactions;
CREATE TRIGGER update_reactions_count_trigger
AFTER INSERT OR DELETE ON public.post_reactions
FOR EACH ROW EXECUTE FUNCTION public.update_reactions_count();

-- Agregar índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_post ON public.post_reactions(user_id, post_type, post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post ON public.post_reactions(post_type, post_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_novedades_status ON public.novedades(status);
CREATE INDEX IF NOT EXISTS idx_novedades_published_at ON public.novedades(published_at DESC);