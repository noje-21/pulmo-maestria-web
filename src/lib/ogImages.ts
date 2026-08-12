/**
 * Fuente única de verdad para las carátulas Open Graph (compartir enlaces).
 *
 * Estas imágenes son EXCLUSIVAMENTE para og:image / twitter:image.
 * No se usan en la interfaz de la plataforma.
 *
 * Requisitos: JPEG 1200×630, públicas, sin firmar y con URL permanente
 * (viven en /public/og/, por lo que no cambian de hash entre builds).
 *
 * Consumido por `src/components/common/SEO.tsx` (navegador) y por
 * `middleware.ts` (crawlers sociales) para que ambos coincidan siempre.
 */

export const SITE_URL = "https://www.maestriacp.com";

export const OG_IMAGES = {
  home: `${SITE_URL}/og/home.jpg`,
  ateneos: `${SITE_URL}/og/ateneos.jpg`,
  novedades: `${SITE_URL}/og/novedades.jpg`,
  foro: `${SITE_URL}/og/foro.jpg`,
  nosotros: `${SITE_URL}/og/nosotros.jpg`,
  contacto: `${SITE_URL}/og/contacto.jpg`,
} as const;

export const DEFAULT_OG_IMAGE = OG_IMAGES.home;

/** Carátula de sección según la primera parte de la ruta. */
export function sectionOgImage(pathname: string): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/") return OG_IMAGES.home;
  const [section] = clean.split("/").filter(Boolean);
  switch (section) {
    case "ateneos":
      return OG_IMAGES.ateneos;
    case "novedades":
      return OG_IMAGES.novedades;
    case "foro":
      return OG_IMAGES.foro;
    case "nosotros":
      return OG_IMAGES.nosotros;
    case "contacto":
      return OG_IMAGES.contacto;
    default:
      return DEFAULT_OG_IMAGE;
  }
}

/**
 * Normaliza una imagen a URL absoluta https estable.
 * Descarta los bundles de Vite (/assets/*-hash.ext) porque su URL cambia en
 * cada build y las plataformas cachean la anterior.
 */
export function stableOgImage(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith("/assets/")) return fallback;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  if (url.startsWith("http://")) return url.replace(/^http:\/\//, "https://");
  if (url.startsWith("https://")) return url;
  return fallback;
}
