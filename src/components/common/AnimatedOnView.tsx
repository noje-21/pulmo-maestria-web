import { memo, PropsWithChildren } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Lightweight viewport-triggered fade-up.
 * Pure IntersectionObserver + CSS transition — keeps framer-motion out of
 * the critical bundle on the landing page.
 */
const AnimatedOnView = memo(function AnimatedOnView({ children }: PropsWithChildren) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "-48px" });
  return (
    <div ref={ref} className={`reveal-up${inView ? " is-visible" : ""}`}>
      {children}
    </div>
  );
});

export default AnimatedOnView;