/**
 * Video performance metrics — TTFB, time to first frame, rebuffering.
 * Reports per-device via the same /vitals beacon used for Web Vitals.
 *
 * Metric names sent (whitelisted in the edge function):
 *  - VIDEO_TTFB     — ms from src set to first byte of the MP4 (Resource Timing)
 *  - VIDEO_TTFF     — ms from src set to the first painted frame (loadeddata)
 *  - VIDEO_REBUFFER — ms a single waiting/stall event lasted (sent on resume)
 *  - VIDEO_STALLS   — count of waiting events during the video lifetime (sent on cleanup)
 */

const VITALS_ENDPOINT = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/vitals`;

type VideoMetricName = "VIDEO_TTFB" | "VIDEO_TTFF" | "VIDEO_REBUFFER" | "VIDEO_STALLS";

function rating(name: VideoMetricName, value: number): "good" | "needs-improvement" | "poor" {
  switch (name) {
    case "VIDEO_TTFB":
      return value < 400 ? "good" : value < 1200 ? "needs-improvement" : "poor";
    case "VIDEO_TTFF":
      return value < 800 ? "good" : value < 2000 ? "needs-improvement" : "poor";
    case "VIDEO_REBUFFER":
      return value < 200 ? "good" : value < 800 ? "needs-improvement" : "poor";
    case "VIDEO_STALLS":
      return value < 1 ? "good" : value < 3 ? "needs-improvement" : "poor";
  }
}

function send(name: VideoMetricName, value: number, extra: { src: string; variant: "mobile" | "desktop" }) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[video-vitals] ${name}=${Math.round(value)} ${extra.variant} ${extra.src}`);
    return;
  }
  const body = JSON.stringify({
    name,
    value,
    rating: rating(name, value),
    id: `${name}-${Date.now().toString(36)}`,
    url: `${window.location.pathname}#video=${extra.src}|${extra.variant}`,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(VITALS_ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(VITALS_ENDPOINT, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the app */
  }
}

export interface VideoMetricsHandle {
  /** Detach all listeners and flush stall counter. */
  dispose: () => void;
}

/**
 * Attach perf instrumentation to a <video> element. Idempotent: calling
 * `dispose()` removes all listeners and reports the final stall count.
 */
export function instrumentVideo(
  el: HTMLVideoElement,
  opts: { src: string; variant: "mobile" | "desktop"; startedAt?: number },
): VideoMetricsHandle {
  const startedAt = opts.startedAt ?? performance.now();
  let firstFrameSent = false;
  let ttfbSent = false;
  let stalls = 0;
  let stallStartedAt = 0;
  let disposed = false;

  const onLoadedData = () => {
    if (firstFrameSent) return;
    firstFrameSent = true;
    send("VIDEO_TTFF", performance.now() - startedAt, opts);
    // Try to capture TTFB from Resource Timing once the request has completed.
    if (!ttfbSent) {
      try {
        const entries = performance.getEntriesByName(new URL(opts.src, location.href).href);
        const last = entries[entries.length - 1] as PerformanceResourceTiming | undefined;
        if (last && last.responseStart > 0 && last.requestStart > 0) {
          ttfbSent = true;
          send("VIDEO_TTFB", last.responseStart - last.requestStart, opts);
        }
      } catch {
        /* ignore */
      }
    }
  };

  const onWaiting = () => {
    if (disposed) return;
    stallStartedAt = performance.now();
    stalls += 1;
  };

  const onPlaying = () => {
    if (stallStartedAt > 0) {
      const dur = performance.now() - stallStartedAt;
      stallStartedAt = 0;
      // Ignore the first sub-50ms transitions (normal startup).
      if (dur > 50) send("VIDEO_REBUFFER", dur, opts);
    }
  };

  el.addEventListener("loadeddata", onLoadedData);
  el.addEventListener("waiting", onWaiting);
  el.addEventListener("playing", onPlaying);

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      el.removeEventListener("loadeddata", onLoadedData);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      if (stalls > 0) send("VIDEO_STALLS", stalls, opts);
    },
  };
}

/**
 * Programmatically preload the current poster as a high-priority image so the
 * <video> shows its first frame immediately on slow mobile networks.
 * Idempotent — safe to call repeatedly with the same href.
 */
const preloadedPosters = new Set<string>();
export function preloadPoster(href: string): void {
  if (typeof document === "undefined" || preloadedPosters.has(href)) return;
  preloadedPosters.add(href);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  // Hint the browser this is the LCP-class asset of the hero.
  (link as any).fetchPriority = "high";
  document.head.appendChild(link);
}
