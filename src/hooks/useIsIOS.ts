import { useEffect, useState } from "react";

/**
 * Detects iOS Safari (iPhone/iPad/iPod, including iPadOS reporting as MacIntel
 * with touch). Stable across renders; computed once on mount to avoid SSR
 * mismatch and repeated UA parsing.
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    const platform = (navigator as any).platform || "";
    const maxTouch = (navigator as any).maxTouchPoints || 0;
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === "MacIntel" && maxTouch > 1);
    setIsIOS(ios);
  }, []);

  return isIOS;
}

/**
 * Returns true when the device is a low-power / data-saver mobile context where
 * we should aggressively disable heavy GPU effects (backdrop-filter, large
 * blurs, infinite motion loops, secondary <video> elements).
 */
export function useIsLowPowerMobile(): boolean {
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    const platform = (navigator as any).platform || "";
    const maxTouch = (navigator as any).maxTouchPoints || 0;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === "MacIntel" && maxTouch > 1);
    const conn = (navigator as any).connection;
    const saveData = !!conn?.saveData;
    const slowNet =
      !!conn?.effectiveType && /(^2g$|^slow-2g$|^3g$)/.test(conn.effectiveType);
    const lowMem = ((navigator as any).deviceMemory ?? 8) <= 4;
    setLow(isIOS || saveData || slowNet || lowMem);
  }, []);

  return low;
}