/**
 * Vercel Edge Middleware — Open Graph para crawlers sociales.
 *
 * Los bots de WhatsApp/Facebook/LinkedIn/Telegram/X no ejecutan JavaScript,
 * por lo que nunca ven las etiquetas que inyecta react-helmet-async.
 * Este middleware detecta esos user-agents y devuelve un HTML mínimo
 * con las etiquetas OG/Twitter correctas (incluyendo la carátula del
 * contenido leída desde la base de datos). Los navegadores reales pasan
 * de largo y reciben la SPA sin ningún cambio.
 */

import {
  DEFAULT_OG_IMAGE,
  OG_IMAGES,
  SITE_URL,
  sectionOgImage,
  stableOgImage,
} from "./src/lib/ogImages";

export const config = {
  matcher: [
    "/",
    "/ateneos",
    "/ateneos/:path*",
    "/novedades",
    "/novedades/:path*",
    "/foro",
    "/foro/:path*",
    "/nosotros",
    "/contacto",
  ],
};

const SITE_NAME = "Maestría Latinoamericana en Circulación Pulmonar";
const DEFAULT_IMAGE = DEFAULT_OG_IMAGE;

/**
 * Carátulas estables para los ateneos que aún no viven en la base de datos
 * (contenido estático de `src/data/ateneos.ts`). Se sirven desde /public/og
 * como JPEG 1200×630, URL pública y permanente — sin firmas ni expiración.
 */
const STATIC_ATENEOS: Record<string, { title: string; description: string; image: string }> = {
  "1": {
    title: "Ateneo de Hipertensión Arterial Pulmonar: Nuevas Guías 2026",
    description:
      "Revisión de las últimas guías internacionales de diagnóstico y tratamiento de la hipertensión arterial pulmonar.",
    image: `${SITE_URL}/og/ateneo-1.jpg`,
  },
  "2": {
    title: "Caso Clínico: Tromboembolismo Pulmonar Crónico",
    description:
      "Presentación y discusión de un caso complejo de CTEPH con abordaje multidisciplinario.",
    image: `${SITE_URL}/og/ateneo-2.jpg`,
  },
  "3": {
    title: "Actualización en Ecocardiografía y Circulación Pulmonar",
    description:
      "Revisión de las técnicas ecocardiográficas más avanzadas para la evaluación de la función ventricular derecha.",
    image: `${SITE_URL}/og/ateneo-3.jpg`,
  },
  "4": {
    title: "Hipertensión Pulmonar en Enfermedades del Tejido Conectivo",
    description:
      "Análisis del screening y manejo de HP en pacientes con esclerosis sistémica y lupus eritematoso.",
    image: `${SITE_URL}/og/ateneo-4.jpg`,
  },
  "5": {
    title: "Avances en Terapia Génica para Enfermedades Vasculares Pulmonares",
    description:
      "Estado actual de la investigación en terapia génica y su potencial aplicación en hipertensión pulmonar.",
    image: `${SITE_URL}/og/ateneo-5.jpg`,
  },
  "6": {
    title: "Rehabilitación Cardiopulmonar en Hipertensión Pulmonar",
    description:
      "Evidencia y experiencia clínica en programas de rehabilitación para pacientes con HP.",
    image: `${SITE_URL}/og/ateneo-6.jpg`,
  },
};

const SUPABASE_URL = "https://tvgkinrbtnbtseooaiex.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Z2tpbnJidG5idHNlb29haWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODI5MzgsImV4cCI6MjA3NjY1ODkzOH0.ncInMGW1KgaoidXSI9GnsGJ7kIZlORg0Nmn3gIBxBU8";

const CRAWLER_RE =
  /(facebookexternalhit|facebookcatalog|whatsapp|twitterbot|linkedinbot|telegrambot|slackbot|discordbot|pinterest|redditbot|skypeuripreview|vkshare|embedly|quora link preview|outbrain|nuzzel|bitlybot|applebot|bingbot|googlebot|google-inspectiontool|iframely|mastodon|bluesky|threadsbot)/i;

const PAGES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Maestría Latinoamericana en Circulación Pulmonar 2026",
    description:
      "Formación intensiva en circulación pulmonar para internistas, cardiólogos, reumatólogos y neumonólogos. Del 2 al 16 de noviembre de 2026, Buenos Aires.",
  },
  "/ateneos": {
    title: "Ateneos | Maestría Latinoamericana en Circulación Pulmonar",
    description:
      "Ateneos latinoamericanos de hipertensión pulmonar: casos clínicos, abordaje multidisciplinario y últimas novedades. Todos los lunes, 13:00 hs ARG por Zoom.",
  },
  "/novedades": {
    title: "Novedades | Maestría Latinoamericana en Circulación Pulmonar",
    description:
      "Noticias, publicaciones y actualizaciones académicas de la Maestría Latinoamericana en Circulación Pulmonar.",
  },
  "/foro": {
    title: "Foro | Maestría Latinoamericana en Circulación Pulmonar",
    description:
      "Comunidad profesional para discutir casos clínicos, compartir recursos y resolver dudas sobre hipertensión y circulación pulmonar.",
  },
  "/nosotros": {
    title: "Nosotros | Maestría Latinoamericana en Circulación Pulmonar",
    description:
      "Conocé al equipo docente y la trayectoria de la Maestría Latinoamericana en Circulación Pulmonar.",
  },
  "/contacto": {
    title: "Contacto | Maestría Latinoamericana en Circulación Pulmonar",
    description:
      "Inscribite sin costo y comunicate con el equipo de la Maestría Latinoamericana en Circulación Pulmonar.",
  },
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value: string, max = 200): string {
  const text = stripHtml(value);
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/**
 * Solo se aceptan imágenes públicas por HTTPS y estables.
 * Se descartan los bundles de Vite (/assets/*-hash.webp) porque su URL cambia
 * en cada build y WhatsApp/Facebook cachean la anterior.
 */
function safeImage(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith("/assets/")) return fallback;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  if (url.startsWith("https://")) return url;
  return fallback;
}

async function fetchOne(
  table: string,
  filter: string,
  columns: string,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${filter}&select=${columns}&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Record<string, unknown>[];
    return rows?.[0] ?? null;
  } catch {
    return null;
  }
}

type Meta = {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
};

async function resolveMeta(pathname: string): Promise<Meta> {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const url = `${SITE_URL}${clean === "/" ? "/" : clean}`;
  const base = PAGES[clean];
  if (base) {
    return { ...base, image: DEFAULT_IMAGE, url, type: "website" };
  }

  const segments = clean.split("/").filter(Boolean);
  const [section, slug] = segments;

  if (section === "ateneos" && slug) {
    const staticEntry = STATIC_ATENEOS[slug];
    const fallbackImage = staticEntry?.image ?? DEFAULT_IMAGE;
    const row = await fetchOne(
      "ateneos",
      `id=eq.${encodeURIComponent(slug)}&status=eq.published`,
      "titulo,descripcion,imagen",
    );
    if (row) {
      return {
        title: `${String(row.titulo)} | ${SITE_NAME}`,
        description: clamp(
          String(row.descripcion || "") ||
            "Actividad académica de la Maestría Latinoamericana en Circulación Pulmonar.",
        ),
        image: safeImage(row.imagen as string, fallbackImage),
        url,
        type: "article",
      };
    }
    if (staticEntry) {
      return {
        title: `${staticEntry.title} | ${SITE_NAME}`,
        description: clamp(staticEntry.description),
        image: staticEntry.image,
        url,
        type: "article",
      };
    }
    return { ...PAGES["/ateneos"], image: DEFAULT_IMAGE, url, type: "article" };
  }

  if (section === "novedades" && slug) {
    const row = await fetchOne(
      "novedades",
      `slug=eq.${encodeURIComponent(slug)}&status=eq.published`,
      "title,excerpt,content,image_url",
    );
    if (row) {
      return {
        title: `${String(row.title)} | ${SITE_NAME}`,
        description: clamp(String(row.excerpt || row.content || "")),
        image: safeImage(row.image_url as string, DEFAULT_IMAGE),
        url,
        type: "article",
      };
    }
    return { ...PAGES["/novedades"], image: DEFAULT_IMAGE, url, type: "article" };
  }

  if (section === "foro" && slug) {
    const row = await fetchOne(
      "forum_posts",
      `id=eq.${encodeURIComponent(slug)}&status=eq.published`,
      "title,excerpt,content,image_url",
    );
    if (row) {
      return {
        title: `${String(row.title)} | Foro ${SITE_NAME}`,
        description: clamp(String(row.excerpt || row.content || "")),
        image: safeImage(row.image_url as string, DEFAULT_IMAGE),
        url,
        type: "article",
      };
    }
    return { ...PAGES["/foro"], image: DEFAULT_IMAGE, url, type: "article" };
  }

  return { ...PAGES["/"], image: DEFAULT_IMAGE, url, type: "website" };
}

function render(meta: Meta): string {
  const t = esc(meta.title);
  const d = esc(meta.description);
  const i = esc(meta.image);
  const u = esc(meta.url);
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${t}</title>
<meta name="description" content="${d}" />
<link rel="canonical" href="${u}" />
<meta property="og:site_name" content="${esc(SITE_NAME)}" />
<meta property="og:locale" content="es_AR" />
<meta property="og:type" content="${esc(meta.type)}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${u}" />
<meta property="og:image" content="${i}" />
<meta property="og:image:secure_url" content="${i}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${t}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${i}" />
<meta name="twitter:url" content="${u}" />
<meta http-equiv="refresh" content="0; url=${u}" />
</head>
<body><h1>${t}</h1><p>${d}</p><a href="${u}">${u}</a></body>
</html>`;
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get("user-agent") || "";
  if (!CRAWLER_RE.test(ua)) return undefined; // navegadores → SPA intacta

  const { pathname } = new URL(request.url);
  const meta = await resolveMeta(pathname);

  return new Response(render(meta), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=600",
    },
  });
}
