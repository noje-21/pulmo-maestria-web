import type { Metric } from "web-vitals";

/**
 * Lightweight Web Vitals reporter.
 * Sends metrics via `navigator.sendBeacon` to avoid blocking navigation.
 * In dev mode, logs to console instead.
 */
function sendToAnalytics(metric: Metric) {
  if (import.meta.env.DEV) return; // silent in dev

  // Beacon to analytics endpoint (configure when ready)
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.pathname,
  });

  // Use sendBeacon for non-blocking delivery
  if (navigator.sendBeacon) {
    // Placeholder: replace with your analytics endpoint
    // navigator.sendBeacon("/api/vitals", body);
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