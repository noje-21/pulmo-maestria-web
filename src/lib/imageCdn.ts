/**
 * Image CDN adapter — provider-agnostic helpers for responsive images.
 *
 * Default provider is "identity" (returns the original URL untouched), so it is
 * 100% safe to drop in without breaking existing images. Switch to a real
 * provider by setting VITE_IMAGE_CDN to "cloudinary" | "imgix" | "imagekit"
 * and the corresponding base env var.
 *
 * Usage:
 *   <img
 *     src={cdnUrl(src, { width: 800 })}
 *     srcSet={cdnSrcSet(src, [400, 800, 1200])}
 *     sizes="(max-width: 768px) 100vw, 800px"
 *     loading="lazy"
 *     decoding="async"
 *   />
 */

type Provider = "identity" | "cloudinary" | "imgix" | "imagekit";

export interface CdnOptions {
  width?: number;
  height?: number;
  quality?: number; // 1–100
  format?: "auto" | "avif" | "webp" | "jpg";
  fit?: "cover" | "contain" | "crop" | "scale";
  dpr?: number;
}

const PROVIDER = (import.meta.env.VITE_IMAGE_CDN as Provider) ?? "identity";
const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE; // e.g. https://res.cloudinary.com/<cloud>/image/fetch
const IMGIX_BASE = import.meta.env.VITE_IMGIX_BASE; // e.g. https://<source>.imgix.net
const IMAGEKIT_BASE = import.meta.env.VITE_IMAGEKIT_BASE; // e.g. https://ik.imagekit.io/<id>

/** Default widths used by `cdnSrcSet` when none are provided. */
export const DEFAULT_WIDTHS = [320, 480, 768, 1024, 1280, 1600] as const;

/** Returns true when the URL is an absolute external one we shouldn't rewrite. */
function isExternal(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

/** Local assets in /public or built assets — safe to rewrite via CDN fetch. */
function toAbsolute(src: string): string {
  if (isExternal(src)) return src;
  if (typeof window === "undefined") return src;
  return new URL(src, window.location.origin).toString();
}

function cloudinary(src: string, opts: CdnOptions): string {
  if (!CLOUDINARY_BASE) return src;
  const parts: string[] = [];
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  if (opts.quality) parts.push(`q_${opts.quality}`);
  parts.push(`f_${opts.format ?? "auto"}`);
  if (opts.fit === "cover") parts.push("c_fill");
  if (opts.fit === "contain") parts.push("c_fit");
  if (opts.dpr) parts.push(`dpr_${opts.dpr}`);
  const t = parts.join(",");
  return `${CLOUDINARY_BASE}/${t}/${encodeURIComponent(toAbsolute(src))}`;
}

function imgix(src: string, opts: CdnOptions): string {
  if (!IMGIX_BASE) return src;
  const url = new URL(isExternal(src) ? src : `${IMGIX_BASE}${src.startsWith("/") ? "" : "/"}${src}`);
  if (opts.width) url.searchParams.set("w", String(opts.width));
  if (opts.height) url.searchParams.set("h", String(opts.height));
  if (opts.quality) url.searchParams.set("q", String(opts.quality));
  url.searchParams.set("auto", opts.format === "auto" || !opts.format ? "format,compress" : "compress");
  if (opts.format && opts.format !== "auto") url.searchParams.set("fm", opts.format);
  if (opts.fit) url.searchParams.set("fit", opts.fit);
  if (opts.dpr) url.searchParams.set("dpr", String(opts.dpr));
  return url.toString();
}

function imagekit(src: string, opts: CdnOptions): string {
  if (!IMAGEKIT_BASE) return src;
  const tr: string[] = [];
  if (opts.width) tr.push(`w-${opts.width}`);
  if (opts.height) tr.push(`h-${opts.height}`);
  if (opts.quality) tr.push(`q-${opts.quality}`);
  if (opts.format && opts.format !== "auto") tr.push(`f-${opts.format}`);
  if (opts.fit === "cover") tr.push("c-maintain_ratio");
  if (opts.dpr) tr.push(`dpr-${opts.dpr}`);
  const path = src.startsWith("/") ? src : `/${src}`;
  const transform = tr.length ? `tr:${tr.join(",")}` : "";
  return `${IMAGEKIT_BASE}${transform ? `/${transform}` : ""}${path}`;
}

/** Build a single CDN URL. Falls back to original src if no provider configured. */
export function cdnUrl(src: string, opts: CdnOptions = {}): string {
  if (!src) return src;
  switch (PROVIDER) {
    case "cloudinary":
      return cloudinary(src, opts);
    case "imgix":
      return imgix(src, opts);
    case "imagekit":
      return imagekit(src, opts);
    default:
      return src;
  }
}

/** Build a `srcSet` string for the supplied widths. */
export function cdnSrcSet(
  src: string,
  widths: readonly number[] = DEFAULT_WIDTHS,
  opts: Omit<CdnOptions, "width"> = {}
): string {
  if (PROVIDER === "identity") return ""; // no-op when no CDN configured
  return widths.map((w) => `${cdnUrl(src, { ...opts, width: w })} ${w}w`).join(", ");
}

/** Convenience: returns an object ready to spread into <img>. */
export function responsiveImageProps(
  src: string,
  opts: { widths?: readonly number[]; sizes?: string; quality?: number } = {}
) {
  const widths = opts.widths ?? DEFAULT_WIDTHS;
  return {
    src: cdnUrl(src, { width: widths[Math.floor(widths.length / 2)], quality: opts.quality, format: "auto" }),
    srcSet: cdnSrcSet(src, widths, { quality: opts.quality, format: "auto" }) || undefined,
    sizes: opts.sizes ?? "(max-width: 768px) 100vw, 50vw",
  };
}

export const isCdnEnabled = PROVIDER !== "identity";
export const cdnProvider: Provider = PROVIDER;