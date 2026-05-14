/**
 * Video source adapter — abstracts the delivery provider so we can migrate
 * from local MP4 (Vercel) to Bunny Stream / Cloudflare Stream / R2+HLS
 * without touching component code.
 *
 * Strategy:
 *  - Set VITE_VIDEO_PROVIDER=bunny  and  VITE_VIDEO_BASE=https://vz-xxx.b-cdn.net/<library>
 *    plus a per-id mapping in BUNNY_IDS below.
 *  - Default ("local") keeps the current /videos/*.mp4 paths.
 *
 * Returned shape lets components pick HLS first (Safari plays it natively)
 * with MP4 fallback for older Chromium that lacks native HLS.
 */

export type VideoVariant = "mobile" | "desktop";

export interface ResolvedVideoSources {
  /** HLS playlist (.m3u8). When present, prefer this on iOS/Safari. */
  hls?: string;
  /** Progressive MP4 fallback. Always present. */
  mp4: string;
  /** Poster image (jpg/webp). */
  poster: string;
}

const PROVIDER = (import.meta.env.VITE_VIDEO_PROVIDER as string) || "local";
const BASE = (import.meta.env.VITE_VIDEO_BASE as string) || "";

/**
 * When/if you migrate to Bunny Stream, populate this map with the GUID
 * Bunny assigns each upload. Same ids are used for Cloudflare Stream.
 */
const REMOTE_IDS: Record<string, string> = {
  // "flyer-1": "abcd1234-...",
  // "flyer-2": "efgh5678-...",
  // "flyer-3": "ijkl9012-...",
};

export function resolveVideoSources(
  id: "flyer-1" | "flyer-2" | "flyer-3",
  variant: VideoVariant,
): ResolvedVideoSources {
  const localMp4 = `/videos/${id}-${variant}.mp4`;
  const localPoster = `/videos/${id}-poster.jpg`;

  if (PROVIDER === "bunny" && BASE && REMOTE_IDS[id]) {
    const guid = REMOTE_IDS[id];
    return {
      hls: `${BASE}/${guid}/playlist.m3u8`,
      mp4: `${BASE}/${guid}/play_${variant === "mobile" ? "360p" : "720p"}.mp4`,
      poster: `${BASE}/${guid}/thumbnail.jpg`,
    };
  }

  if (PROVIDER === "cloudflare" && BASE && REMOTE_IDS[id]) {
    const uid = REMOTE_IDS[id];
    return {
      hls: `${BASE}/${uid}/manifest/video.m3u8`,
      mp4: localMp4, // CF Stream doesn't expose direct MP4 by default
      poster: `${BASE}/${uid}/thumbnails/thumbnail.jpg`,
    };
  }

  return { mp4: localMp4, poster: localPoster };
}

/** True when the active source set includes a usable HLS playlist. */
export function hasHls(sources: ResolvedVideoSources): boolean {
  return !!sources.hls;
}

/** Safari + iOS WebKit play HLS natively via <video src="...m3u8">. */
export function supportsNativeHls(): boolean {
  if (typeof document === "undefined") return false;
  const v = document.createElement("video");
  return (
    v.canPlayType("application/vnd.apple.mpegurl") !== "" ||
    v.canPlayType("application/x-mpegURL") !== ""
  );
}