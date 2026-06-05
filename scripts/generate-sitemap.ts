/**
 * Runs before `vite dev` and `vite build` (predev/prebuild hooks);
 * writes public/sitemap.xml with static + dynamic content (Supabase).
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.maestriacp.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/nosotros", changefreq: "monthly", priority: "0.8" },
  { path: "/ateneos", changefreq: "weekly", priority: "0.8" },
  { path: "/novedades", changefreq: "weekly", priority: "0.7" },
  { path: "/foro", changefreq: "daily", priority: "0.6" },
];

async function fetchRows(table: string, query: string): Promise<Array<Record<string, unknown>>> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function toIsoDate(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const dynamic: SitemapEntry[] = [];

  // Published ateneos
  const ateneos = await fetchRows(
    "ateneos",
    "select=id,updated_at&status=eq.published&order=updated_at.desc&limit=500",
  );
  for (const a of ateneos) {
    dynamic.push({
      path: `/ateneos/${a.id}`,
      lastmod: toIsoDate(a.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // Published novedades
  const novedades = await fetchRows(
    "novedades",
    "select=slug,updated_at&status=eq.published&order=updated_at.desc&limit=500",
  );
  for (const n of novedades) {
    if (!n.slug) continue;
    dynamic.push({
      path: `/novedades/${n.slug}`,
      lastmod: toIsoDate(n.updated_at),
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  // Published forum posts
  const posts = await fetchRows(
    "forum_posts",
    "select=id,updated_at&status=eq.published&order=updated_at.desc&limit=500",
  );
  for (const p of posts) {
    dynamic.push({
      path: `/foro/${p.id}`,
      lastmod: toIsoDate(p.updated_at),
      changefreq: "weekly",
      priority: "0.5",
    });
  }

  const all = [...staticEntries, ...dynamic];
  const xml = generateSitemap(all);
  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${all.length} entries · ${dynamic.length} dynamic)`);
}

main().catch((e) => {
  console.error("sitemap generation failed:", e);
  // Don't fail the build — fall back to whatever sitemap.xml exists.
  process.exit(0);
});