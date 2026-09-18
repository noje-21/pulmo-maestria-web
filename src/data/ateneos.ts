import maestria13 from "@/assets/secion/maestria13.webp";

export interface Ateneo {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  fecha: string;
  imagen: string;
  imagenes?: string[];
  videoUrl?: string;
  pdfUrl?: string;
}

const ZOOM_URL =
  "https://us02web.zoom.us/j/85220631979?pwd=M3l1WjNqc0N3Y1h2aTVvWDNYR0crdz09";

/** Próximo lunes (el ateneo se reúne todos los lunes, 13:00 hs ARG). */
function proximoLunes(): string {
  const hoy = new Date();
  const diasHastaLunes = (8 - hoy.getDay()) % 7 || 7;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diasHastaLunes);
  return lunes.toISOString().slice(0, 10);
}

/**
 * Ateneos activos. Actualmente solo se dicta el ateneo de Hipertensión
 * Pulmonar (Ateneos Latinoamericanos 2026), todos los lunes por Zoom.
 */
export const ateneosData: Ateneo[] = [
  {
    id: "1",
    titulo: "Hipertensión Pulmonar — Ateneos Latinoamericanos 2026",
    descripcion:
      "Ateneo semanal de hipertensión pulmonar: discusión de casos clínicos, abordaje multidisciplinario y últimas novedades. Todos los lunes, 13:00 hs ARG, por Zoom.",
    contenido: `<p>Los <strong>Ateneos Latinoamericanos de Hipertensión Pulmonar 2026</strong> se reúnen semanalmente para compartir conocimiento entre especialistas de toda la región.</p>
    <h3>¿Qué hacemos en cada encuentro?</h3>
    <ul>
      <li>Discusión de casos clínicos</li>
      <li>Abordaje multidisciplinario</li>
      <li>Últimas novedades</li>
    </ul>
    <p>¡Te invitamos a participar!</p>
    <h3>Cuándo y dónde</h3>
    <ul>
      <li><strong>Día:</strong> todos los lunes</li>
      <li><strong>Hora:</strong> 13:00 hs ARG</li>
      <li><strong>Plataforma:</strong> Zoom</li>
    </ul>
    <p><strong>Enlace de la reunión:</strong> <a href="${ZOOM_URL}" target="_blank" rel="noopener noreferrer">Unirme al ateneo por Zoom</a></p>
    <p><strong>ID de reunión:</strong> 852 2063 1979<br /><strong>Código de acceso:</strong> 532924</p>`,
    fecha: proximoLunes(),
    imagen: maestria13,
    imagenes: [maestria13],
  },
];
