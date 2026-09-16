# Landing de campaña para redes sociales

Nueva página independiente en **`/inscripcion`**, pensada como destino de anuncios, publicaciones, WhatsApp y códigos QR. No se toca el sitio actual: ni menú, ni home, ni formularios existentes.

## Qué verá quien llegue desde un anuncio

1. **Portada (hero)** — nombre completo de la Maestría, edición 2026, fechas reales (2 al 16 de noviembre de 2026), sede Buenos Aires, frase de valor y dos botones: "Solicitar información" (lleva al formulario de la misma página) y "Escribir por WhatsApp".
2. **Cifras reales** — 12 días presenciales, 30 módulos, 9+ expertos internacionales, 5+ países, campus virtual.
3. **Qué es la Maestría** — texto tomado de la sección actual "¿Por qué esta Maestría?": modalidad (12 días presenciales + campus virtual), fechas, sede e instituciones, certificación.
4. **A quién está dirigida** — las especialidades que ya figuran en el sitio: medicina interna, cardiología, reumatología y neumonología.
5. **Recorrido académico** — las 5 fases reales del programa (Fundamentos, Herramientas diagnósticas, Escenarios clínicos, Estrategias terapéuticas, Integración clínica) y el cronograma por días que ya existe, cerrando con el Simposio Latinoamericano de Hipertensión Pulmonar.
6. **Actividad académica / Ateneos** — tres ateneos destacados tomados del contenido real (se leen de la base igual que la página de Ateneos, con el contenido fijo como respaldo), con enlace a la sección de Ateneos.
7. **Dirección académica** — director y algunos miembros del equipo con sus fotos reales.
8. **Respaldo institucional** — Centro Gallego de Buenos Aires, Sanatorio Trinidad de Quilmes, Hospital María Ferrer y Red BASA (solo texto: no hay logos de esas instituciones en el proyecto).
9. **Galería** — algunas fotos reales de ediciones anteriores, en tira horizontal.
10. **Cómo funciona** — cuatro pasos basados en el proceso real: conocer la propuesta, enviar la solicitud con tus datos y CV, recibir respuesta del equipo, comenzar la formación.
11. **Llamado a la acción intermedio** — banda azul institucional con botón.
12. **Preguntas frecuentes** — solo con datos documentados (fechas, sede, modalidad, a quién va dirigida, cómo inscribirse, contacto, campus virtual, certificación). Sin inventar precios, cupos ni requisitos.
13. **Formulario de inscripción** — se reutiliza tal cual el formulario actual "Inscríbete sin costo" con carga de CV, más los datos de contacto reales (WhatsApp, email, redes, campus).
14. **Pie de página propio y mínimo** — logo, nombre, contacto y un enlace discreto al sitio principal.

## Aislamiento y comportamiento

- Ruta nueva fuera del layout con menú: se abre directa desde cualquier enlace o QR, sin pasar por el inicio.
- No se agrega a menú, pie, home ni al sitemap público.
- Los parámetros de campaña (`utm_source`, `utm_medium`, etc.) se conservan en la URL y se adjuntan al mensaje de WhatsApp para poder identificar el origen. No se instalan herramientas externas.

## Vista previa al compartir

- Se genera una carátula nueva y específica de campaña (1200×630) en `public/og/campana.jpg`, con la identidad azul/rojo de la Maestría.
- Se registra la ruta en el sistema de carátulas existente para que WhatsApp, Facebook, LinkedIn y Messenger muestren la tarjeta correcta.

## Detalles técnicos

- Nuevos archivos: `src/pages/CampaignLanding.tsx` y componentes en `src/components/campaign/`.
- `src/App.tsx`: una ruta más (`/inscripcion`), cargada de forma diferida y fuera de `PublicLayout`.
- `src/lib/ogImages.ts`: entrada `inscripcion` + caso en `sectionOgImage`.
- `middleware.ts`: `/inscripcion` agregado al `matcher` con título y descripción propios.
- `public/robots.txt`: se permite el rastreo de la ruta; no se añade al sitemap.
- Reutiliza `useContactForm`, `ContactForm`, `contactInfo`, `ateneosData`/`useAteneosList`, `equipoData`, imágenes existentes en WebP e `ImageLazy`. Sin vídeos pesados; Framer Motion solo en apariciones suaves.
- Verificación final: typecheck, build, revisión en móvil/tablet/escritorio con navegador y consola limpia.

## Dato a confirmar

En el sitio conviven dos vías de contacto por WhatsApp (+54 9 11 5906-4234 y +57 300 414 2568). Para el botón principal de campaña usaré el argentino (+54), marcado como principal en el sitio; se puede cambiar si prefieres el otro.
