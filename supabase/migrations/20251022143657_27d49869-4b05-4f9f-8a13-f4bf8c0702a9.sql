-- Add admin policies for profiles table
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (is_admin(auth.uid()));

-- Add admin policies for user_roles to allow admin management
CREATE POLICY "Admins can insert roles"
ON user_roles FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Update site_content with all necessary fields
INSERT INTO site_content (section, content) VALUES
('hero', '{"title": "Maestría Latinoamericana en Circulación Pulmonar 2025", "subtitle": "Primera edición presencial en Latinoamérica", "description": "Un programa académico de excelencia diseñado para profesionales de la salud especializados en enfermedades cardiovasculares y respiratorias.", "dates": "Abril - Diciembre 2025", "location": "Buenos Aires, Argentina", "cta": "Preinscripción", "warning": "¡Cupos limitados! Solo 30 participantes"}'),
('maestria', '{"title": "Sobre la Maestría", "description": "La Maestría Latinoamericana en Circulación Pulmonar es un programa académico integral que combina teoría avanzada con práctica clínica, diseñado para formar especialistas de excelencia en el diagnóstico y tratamiento de enfermedades de la circulación pulmonar."}'),
('expertos', '{"title": "Nuestros Expertos", "description": "Un equipo de reconocidos profesionales con vasta experiencia en el campo de la circulación pulmonar."}'),
('eventos', '{"title": "Próximos Eventos", "description": "Mantente informado sobre nuestros eventos, seminarios y conferencias."}'),
('quienes_somos', '{"title": "Quiénes Somos", "description": "Somos una institución dedicada a la formación de profesionales de excelencia en el área de la circulación pulmonar."}'),
('contacto', '{"title": "Contacto", "email": "info@maestriacirculacionpulmonar.com", "whatsapp": "+5491234567890", "instagram": "@maestriacirculacionpulmonar", "website": "www.maestriacp.com"}')
ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;