-- Create ateneo category enum
CREATE TYPE public.ateneo_category AS ENUM (
  'caso_clinico',
  'actualizacion',
  'investigacion',
  'rehabilitacion',
  'imaging',
  'general'
);

-- Create ateneo status enum
CREATE TYPE public.ateneo_status AS ENUM ('draft', 'published', 'archived');

-- Create ateneos table
CREATE TABLE public.ateneos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  contenido TEXT NOT NULL DEFAULT '',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria ateneo_category NOT NULL DEFAULT 'general',
  imagen TEXT,
  imagenes TEXT[] DEFAULT '{}',
  video_url TEXT,
  pdf_url TEXT,
  status ateneo_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ateneos ENABLE ROW LEVEL SECURITY;

-- Anyone can view published ateneos
CREATE POLICY "Anyone can view published ateneos"
  ON public.ateneos FOR SELECT
  USING (status = 'published' OR is_admin(auth.uid()));

-- Admins can insert ateneos
CREATE POLICY "Admins can insert ateneos"
  ON public.ateneos FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Admins can update ateneos
CREATE POLICY "Admins can update ateneos"
  ON public.ateneos FOR UPDATE
  USING (is_admin(auth.uid()));

-- Admins can delete ateneos
CREATE POLICY "Admins can delete ateneos"
  ON public.ateneos FOR DELETE
  USING (is_admin(auth.uid()));

-- Timestamp trigger
CREATE TRIGGER update_ateneos_updated_at
  BEFORE UPDATE ON public.ateneos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();