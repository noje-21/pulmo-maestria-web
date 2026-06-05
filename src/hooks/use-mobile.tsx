import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/** Initial value computed synchronously so consumers don't render twice
 *  (once with undefined → false, then again with the real value). */
const getInitial = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitial);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile((prev) => {
        const next = window.innerWidth < MOBILE_BREAKPOINT;
        return prev === next ? prev : next;
      });
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
