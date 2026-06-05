import { memo, useEffect, useRef, useState } from "react";
import { instrumentVideo, preloadPoster } from "@/lib/videoMetrics";

/* ─── Ambient glows — memoized, GPU-composited ─── */
export const AmbientGlows = memo(function AmbientGlows({ light = false }: { light?: boolean }) {
  // iOS Safari paints `filter: blur(150px)` on every compositor pass — kills FPS
  // and triggers thermal throttling. Fall back to a static radial-gradient.
  if (light) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, hsl(var(--primary)/0.10), transparent 70%), radial-gradient(50% 45% at 75% 85%, hsl(var(--accent)/0.07), transparent 70%)",
        }}
      />
    );
  }
  return (
    <>
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full pointer-events-none transform-gpu"
        style={{ filter: "blur(150px)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full pointer-events-none transform-gpu"
        style={{ filter: "blur(120px)" }}
      />
    </>
  );
});

/* ─── Video Player — A/B crossfade, self-contained ─── */
export const FlyerVideo = memo(function FlyerVideo({
  currentSrc,
  poster,
  currentLabel,
  isMobile,
  isIOS,
  onHoverStart,
  onHoverEnd,
}: {
  currentSrc: string;
  poster: string;
  currentLabel: string;
  isMobile: boolean;
  isIOS?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const [opacities, setOpacities] = useState<{ a: number; b: number }>({ a: 1, b: 0 });
  const initializedSrc = useRef<string>("");
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // iOS: render only one <video>. Two simultaneous decoders cause stutter,
  // memory spikes and thermal throttling on Safari.
  const singleVideoMode = !!isIOS;
  const variant: "mobile" | "desktop" = isMobile ? "mobile" : "desktop";
  // Active perf instrumentation handle — replaced on every src swap.
  const metricsRef = useRef<{ dispose: () => void } | null>(null);

  // Preload the current poster as high-priority image so the <video>
  // paints its first frame immediately on slow mobile networks.
  useEffect(() => {
    preloadPoster(poster);
  }, [poster]);

  useEffect(() => {
    const v = refA.current;
    if (!v || initializedSrc.current) return;
    initializedSrc.current = currentSrc;
    v.src = currentSrc;
    v.load();
    v.play().catch(() => {});
    metricsRef.current?.dispose();
    metricsRef.current = instrumentVideo(v, { src: currentSrc, variant });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause/resume videos based on viewport visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = activeRef.current === "A" ? refA.current : refB.current;
        if (!active) return;
        if (entry.isIntersecting) {
          active.play().catch(() => {});
        } else {
          active.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!initializedSrc.current || currentSrc === initializedSrc.current) return;
    initializedSrc.current = currentSrc;

    if (singleVideoMode) {
      const v = refA.current;
      if (!v) return;
      setTransitioning(true);
      v.style.transition = "opacity 350ms ease";
      v.style.opacity = "0";
      const swap = window.setTimeout(() => {
        v.src = currentSrc;
        v.load();
        v.play().catch(() => {});
        v.style.opacity = "1";
        metricsRef.current?.dispose();
        metricsRef.current = instrumentVideo(v, { src: currentSrc, variant });
      }, 360);
      const done = window.setTimeout(() => setTransitioning(false), 900);
      return () => {
        clearTimeout(swap);
        clearTimeout(done);
      };
    }

    const isA = activeRef.current === "A";
    const incoming = isA ? refB.current : refA.current;
    if (!incoming) return;

    incoming.src = currentSrc;
    incoming.load();
    incoming.play().catch(() => {});
    metricsRef.current?.dispose();
    metricsRef.current = instrumentVideo(incoming, { src: currentSrc, variant });

    setTransitioning(true);

    if (isA) {
      activeRef.current = "B";
      setOpacities({ a: 0, b: 1 });
    } else {
      activeRef.current = "A";
      setOpacities({ a: 1, b: 0 });
    }

    // Clear willChange after crossfade completes
    const tid = setTimeout(() => setTransitioning(false), 1500);
    return () => clearTimeout(tid);
  }, [currentSrc, singleVideoMode, variant]);

  // Final cleanup: flush stall counter when the player unmounts.
  useEffect(() => {
    return () => {
      metricsRef.current?.dispose();
      metricsRef.current = null;
    };
  }, []);

  const crossfadeTransition = "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
  const videoWillChange = transitioning ? "opacity" : "auto";

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black transform-gpu ${
        isMobile ? "" : "hover-scale-3"
      }`}
      style={{
        contain: "layout style paint",
        boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Ken Burns — disabled on mobile for GPU savings */}
      <div className={`absolute inset-0 transform-gpu ${isMobile ? "" : "kenburns"}`}>
        <video
          ref={refA}
          autoPlay
          muted
          loop
          playsInline
          preload={isMobile ? "none" : "metadata"}
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: opacities.a, transition: crossfadeTransition, willChange: videoWillChange }}
          aria-hidden="true"
        />
        {!singleVideoMode && (
          <video
            ref={refB}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: opacities.b, transition: crossfadeTransition, willChange: videoWillChange }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

      {/* Dynamic video label — re-mounts on label change via key, CSS fade-in
          replaces the previous AnimatePresence wrapper. Exit anim is dropped:
          the new label simply fades over the previous (~250 ms perceptual gap). */}
      <div
        key={currentLabel}
        className="absolute bottom-4 left-4 z-10 pointer-events-none animate-fade-in-up"
        style={{ animationDuration: "450ms" }}
      >
        <span className="inline-block px-3 py-1.5 rounded-lg text-white/70 text-xs font-medium bg-black/40 border border-white/5 lg:backdrop-blur-md lg:bg-black/30">
          {currentLabel}
        </span>
      </div>
    </div>
  );
});

/** Hero-lite placeholder used while the heavy video is deferred on mobile/iOS. */
export function FlyerPoster({ poster, label }: { poster: string; label: string }) {
  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black"
      style={{ contain: "layout style paint", boxShadow: "0 30px 100px rgba(0,0,0,0.8)" }}
      aria-label={label}
    >
      <img
        src={poster}
        alt=""
        decoding="async"
        {...({ fetchpriority: "high" } as any)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
    </div>
  );
}