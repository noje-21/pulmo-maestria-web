import { useState } from "react";

/**
 * Detects iOS Safari (iPhone/iPad/iPod, including iPadOS reporting as MacIntel
 * with touch). Stable across renders; computed once on mount to avoid SSR
 * mismatch and repeated UA parsing.
 */
const detectIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = (navigator as any).platform || "";
  const maxTouch = (navigator as any).maxTouchPoints || 0;
  return /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && maxTouch > 1);
};

export function useIsIOS(): boolean {
  // Sync init avoids the extra render cycle (false → true) that would otherwise
  // remount the heavy <video> player on iOS.
  const [isIOS] = useState<boolean>(detectIOS);
  return isIOS;
}

/**
 * Returns true when the device is a low-power / data-saver mobile context where
 * we should aggressively disable heavy GPU effects (backdrop-filter, large
 * blurs, infinite motion loops, secondary <video> elements).
 */
const detectLowPower = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as any).connection;
  const saveData = !!conn?.saveData;
  const slowNet =
    !!conn?.effectiveType && /(^2g$|^slow-2g$|^3g$)/.test(conn.effectiveType);
  const lowMem = ((navigator as any).deviceMemory ?? 8) <= 4;
  return detectIOS() || saveData || slowNet || lowMem;
};

export function useIsLowPowerMobile(): boolean {
  const [low] = useState<boolean>(detectLowPower);
  return low;
}