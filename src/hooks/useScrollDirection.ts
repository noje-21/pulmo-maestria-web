import { useEffect, useRef, useState } from "react";

export default function useScrollDirection() {
  const [direction, setDirection] = useState<number>(1); // 1 down, -1 up
  const lastY = useRef<number>(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) < 10) {
        ticking.current = false;
        return;
      }
      setDirection(y > lastY.current ? 1 : -1);
      lastY.current = y > 0 ? y : 0;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}
