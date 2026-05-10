import type { Metric } from "web-vitals";

const VITALS_ENDPOINT = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/vitals`;

/**
 * Lightweight Web Vitals reporter.
 * Sends metrics via `navigator.sendBeacon` to avoid blocking navigation.
 * In dev mode, logs to console instead.
 */
function sendToAnalytics(metric: Metric) {
  if (import.meta.env.DEV) return; // silent in dev

  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.pathname,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(VITALS_ENDPOINT, blob);
      return;
    }
    // Fallback for browsers without sendBeacon
    fetch(VITALS_ENDPOINT, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* swallow — never let analytics break the app */
  }
}

export async function reportWebVitals() {
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import("web-vitals");
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}