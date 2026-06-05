export interface FlyerVideo {
  id: number;
  srcMobile: string;
  srcDesktop: string;
  poster: string;
  label: string;
}

export const flyerVideos: FlyerVideo[] = [
  {
    id: 0,
    srcMobile: "/videos/flyer-1-mobile.mp4",
    srcDesktop: "/videos/flyer-1-desktop.mp4",
    poster: "/videos/flyer-1-poster.jpg",
    label: "Experiencia académica presencial",
  },
  {
    id: 1,
    srcMobile: "/videos/flyer-2-mobile.mp4",
    srcDesktop: "/videos/flyer-2-desktop.mp4",
    poster: "/videos/flyer-2-poster.jpg",
    label: "Formación con referentes internacionales",
  },
  {
    id: 2,
    srcMobile: "/videos/flyer-3-mobile.mp4",
    srcDesktop: "/videos/flyer-3-desktop.mp4",
    poster: "/videos/flyer-3-poster.jpg",
    label: "Impacto clínico real",
  },
];

export const ROTATION_INTERVAL = 15_000;
export const PRELOAD_AHEAD = 5_000;

// Inscription deadline: day before the program begins (Buenos Aires UTC-3)
export const INSCRIPTION_DEADLINE = new Date("2026-11-01T23:59:59-03:00");

/* iOS Safari + Save-Data detection — used to skip aggressive video preloading
   that iOS does not honor (it re-downloads on <video> creation anyway). */
export const isIOS =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1));

export function shouldSkipPreload(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as any).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && /(^2g$|^slow-2g$|^3g$)/.test(conn.effectiveType)) return true;
  // iOS Safari ignores prefetched video bytes for <video> playback,
  // so prefetching only wastes mobile data and CPU.
  if (isIOS) return true;
  return false;
}

export function getTimeLeft() {
  const diff = INSCRIPTION_DEADLINE.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}