import { useEffect, useRef, useState } from "react";

/**
 * Lightweight replacement for framer-motion's `whileInView`.
 * Triggers once when the element enters the viewport.
 *
 * Returns a ref to attach and a boolean that flips to true on intersection.
 * Designed to keep framer-motion out of the critical bundle.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: IntersectionObserverInit = { rootMargin: "-48px" },
): { ref: React.RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      options,
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}