import type { Ateneo } from "./types";

export const mapAteneoRow = (a: any): Ateneo => ({
  id: a.id,
  titulo: a.titulo,
  descripcion: a.descripcion,
  contenido: a.contenido,
  fecha: a.fecha,
  imagen: a.imagen || "",
  imagenes: a.imagenes || [],
  videoUrl: a.video_url || undefined,
  pdfUrl: a.pdf_url || undefined,
  ...(a.categoria ? { categoria: a.categoria } : {}),
} as Ateneo);