/**
 * Contenido de la landing de campaña (/inscripcion).
 *
 * Todos los datos provienen de contenido ya existente en el proyecto
 * (secciones Maestría, Hero, Eventos, EjesFormacion, Nosotros y Contacto).
 * No agregar aquí datos que no estén documentados en el sitio.
 */

export const CAMPAIGN_ROUTE = "/inscripcion";

export const CAMPAIGN_WHATSAPP = "5491159064234";

export const CAMPAIGN_META = {
  title: "Maestría Latinoamericana en Circulación Pulmonar 2026 | Inscripción",
  description:
    "Formación intensiva en circulación pulmonar e hipertensión pulmonar. 12 días presenciales en Buenos Aires + campus virtual. Del 2 al 16 de noviembre de 2026. Solicita información sin costo.",
};

export const heroStats = [
  { value: "12", label: "Días presenciales" },
  { value: "30", label: "Módulos académicos" },
  { value: "9+", label: "Expertos internacionales" },
  { value: "5+", label: "Países participantes" },
];

export const valueProps = [
  {
    title: "Programa intensivo de 12 días",
    description:
      "Formación presencial concentrada del 2 al 16 de noviembre de 2026, sin relleno: 30 módulos y 131 horas académicas.",
  },
  {
    title: "Práctica clínica real",
    description:
      "Ecocardiografía, ECG, hemodinamia y cateterismo cardíaco derecho en instituciones de referencia de Buenos Aires.",
  },
  {
    title: "Campus virtual de apoyo",
    description:
      "Materiales, recursos y seguimiento continuo antes, durante y después de los días presenciales.",
  },
  {
    title: "Comunidad latinoamericana",
    description:
      "Docentes y participantes de distintos países de la región, con ateneos y actividad académica durante todo el año.",
  },
  {
    title: "Certificación oficial",
    description:
      "Respaldada por instituciones médicas de prestigio de Latinoamérica asociadas al programa.",
  },
  {
    title: "Simposio Latinoamericano",
    description:
      "El programa cierra con el Simposio Latinoamericano de Hipertensión Pulmonar y la ceremonia de clausura.",
  },
];

export const audiencias = [
  "Cardiología",
  "Neumonología",
  "Medicina Interna",
  "Reumatología",
];

export const recorrido = [
  {
    fase: "Fundamentos",
    detalle: "Bases conceptuales de la circulación pulmonar, clasificación y fisiopatología.",
  },
  {
    fase: "Herramientas diagnósticas",
    detalle: "Técnicas de evaluación y diagnóstico: imagen, función pulmonar y hemodinamia.",
  },
  {
    fase: "Escenarios clínicos",
    detalle: "Abordaje de poblaciones y contextos especiales.",
  },
  {
    fase: "Estrategias terapéuticas",
    detalle: "Algoritmos de tratamiento específico e inespecífico.",
  },
  {
    fase: "Integración clínica",
    detalle: "Síntesis del conocimiento y aplicación práctica.",
  },
];

export const cronograma = [
  {
    fecha: "2-3 Nov",
    titulo: "Introducción y Fundamentos",
    descripcion:
      "Anatomía y fisiología de la circulación pulmonar. Bases hemodinámicas y grupos de HTP, estudios iniciales y abordaje.",
  },
  {
    fecha: "4-6 Nov",
    titulo: "Circuito Práctico",
    descripcion:
      "Ecocardiografía, ECG, hemodinamia y CCD, intersticiopatías, enfermedades reumatológicas y función pulmonar.",
  },
  {
    fecha: "7-9 Nov",
    titulo: "Diagnóstico y Tratamiento",
    descripcion:
      "Clasificación de riesgos, diagnóstico avanzado, estratificación y manejo terapéutico integral.",
  },
  {
    fecha: "10-12 Nov",
    titulo: "Casos Clínicos y Talleres",
    descripcion:
      "Últimas novedades, avances tecnológicos, IA, bioestadística avanzada e interpretación de trials clínicos.",
  },
  {
    fecha: "13-16 Nov",
    titulo: "Simposio y Clausura",
    descripcion:
      "Simposio Latinoamericano de Hipertensión Pulmonar. Ceremonia de clausura y examen final.",
  },
];

export const instituciones = [
  { nombre: "Centro Gallego de Buenos Aires", rol: "Sede principal del programa" },
  { nombre: "Sanatorio Trinidad de Quilmes", rol: "Centro de práctica clínica" },
  { nombre: "Hospital María Ferrer", rol: "Referente en enfermedades respiratorias" },
  { nombre: "Red BASA", rol: "Red de instituciones de salud" },
];

export const pasos = [
  {
    titulo: "Conoce la propuesta",
    descripcion: "Revisa el programa, las fechas y el perfil profesional al que está dirigido.",
  },
  {
    titulo: "Envía tu solicitud",
    descripcion:
      "Completa el formulario con tus datos y adjunta tu currículum. La inscripción se solicita sin costo.",
  },
  {
    titulo: "Recibe respuesta del equipo",
    descripcion:
      "El equipo académico se comunica contigo por email o WhatsApp para continuar el proceso.",
  },
  {
    titulo: "Comienza tu formación",
    descripcion:
      "Accedes al campus virtual de apoyo y te sumas a los 12 días presenciales en Buenos Aires.",
  },
];

export const faqs = [
  {
    q: "¿Cuándo se dicta la Maestría?",
    a: "La edición 2026 se desarrolla del 2 al 16 de noviembre de 2026.",
  },
  {
    q: "¿Dónde se realiza?",
    a: "En Buenos Aires, Argentina. La sede principal es el Centro Gallego de Buenos Aires, con prácticas en el Sanatorio Trinidad de Quilmes y el Hospital María Ferrer.",
  },
  {
    q: "¿Cuál es la modalidad?",
    a: "12 días presenciales intensivos, acompañados por un campus virtual con materiales, recursos y seguimiento continuo.",
  },
  {
    q: "¿A quién está dirigida?",
    a: "A médicos internistas, cardiólogos, reumatólogos y neumonólogos interesados en circulación pulmonar e hipertensión pulmonar.",
  },
  {
    q: "¿Qué incluye el programa académico?",
    a: "30 módulos y 131 horas académicas organizadas en cinco fases, con circuito práctico y el Simposio Latinoamericano de Hipertensión Pulmonar como cierre.",
  },
  {
    q: "¿Cómo solicito la inscripción?",
    a: "Completando el formulario de esta página con tus datos y tu currículum. También puedes escribirnos por WhatsApp al +54 9 11 5906-4234 o al correo magisterenhipertensionpulmonar@gmail.com.",
  },
  {
    q: "¿Existe certificación?",
    a: "Sí. El programa otorga certificación oficial respaldada por instituciones médicas de prestigio de Latinoamérica.",
  },
  {
    q: "¿Hay campus virtual?",
    a: "Sí, el campus virtual está disponible en campus.maestriacp.com como apoyo a la cursada.",
  },
];

/** Construye el enlace de WhatsApp conservando el origen de campaña (UTM). */
export function buildWhatsAppLink(search: string): string {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source");
  const campaign = params.get("utm_campaign");
  const origen = [source, campaign].filter(Boolean).join(" · ");
  const texto = origen
    ? `Hola, quiero información sobre la Maestría Latinoamericana en Circulación Pulmonar 2026. (Origen: ${origen})`
    : "Hola, quiero información sobre la Maestría Latinoamericana en Circulación Pulmonar 2026.";
  return `https://wa.me/${CAMPAIGN_WHATSAPP}?text=${encodeURIComponent(texto)}`;
}
