import { useEffect, useState } from "react";

/**
 * Returns false on the first paint, then flips to true once the browser is
 * idle (or after `fallbackMs`). Use to delay mounting heavy components
 * (videos, carousels, decorative motion) so the initial frame contains
 * only critical, above-the-fold UI.
 *
 * Why: on iPhone/WebKit, mounting <video>, IntersectionObserver, Framer
 * Motion entry animations and ambient blur layers in the same tick as the
 * page boots blocks the main thread for ~300–800 ms (white screen / freeze).
 * Splitting that work into a second frame restores instant first paint.
 */
export function useDeferredMount(fallbackMs = 600): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const flip = () => {
      if (!cancelled) setReady(true);
    };

    // Wait one paint, then queue idle work.
    const raf = requestAnimationFrame(() => {
      const ric = (window as any).requestIdleCallback as
        | ((cb: () => void, opts?: { timeout: number }) => number)
        | undefined;
      if (ric) ric(flip, { timeout: fallbackMs });
      else setTimeout(flip, fallbackMs);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [fallbackMs]);

  return ready;
}
