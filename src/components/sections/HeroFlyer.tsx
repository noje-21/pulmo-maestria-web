import { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlyerVideo {
  id: number;
  src: string;
  label: string;
}

const flyerVideos: FlyerVideo[] = [
  { id: 0, src: "/videos/flyer-1.mp4", label: "Experiencia académica presencial" },
  { id: 1, src: "/videos/flyer-2.mp4", label: "Formación con referentes internacionales" },
  { id: 2, src: "/videos/flyer-3.mp4", label: "Impacto clínico real" },
];

const ROTATION_INTERVAL = 15_000;
const PRELOAD_AHEAD = 5_000;

/**
 * Self-contained A/B crossfade video player.
 * Each layout (desktop/mobile) owns its own instance → no shared ref conflicts.
 * Receives `currentSrc` as prop and handles crossfade internally.
 */
const VideoPlayer = memo(function VideoPlayer({ currentSrc }: { currentSrc: string }) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const [opacities, setOpacities] = useState<{ a: number; b: number }>({ a: 1, b: 0 });
  const initializedSrc = useRef<string>("");

  // On mount: start first video immediately
  useEffect(() => {
    const v = refA.current;
    if (!v || initializedSrc.current) return;
    initializedSrc.current = currentSrc;
    v.src = currentSrc;
    v.load();
    v.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When src changes externally: crossfade to new video
  useEffect(() => {
    if (!initializedSrc.current || currentSrc === initializedSrc.current) return;
    initializedSrc.current = currentSrc;

    const isA = activeRef.current === "A";
    const incoming = isA ? refB.current : refA.current;
    if (!incoming) return;

    incoming.src = currentSrc;
    incoming.load();
    incoming.play().catch(() => {});

    if (isA) {
      activeRef.current = "B";
      setOpacities({ a: 0, b: 1 });
    } else {
      activeRef.current = "A";
      setOpacities({ a: 1, b: 0 });
    }
  }, [currentSrc]);

  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.6)] border border-white/10 select-none bg-black">
      <video
        ref={refA}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          opacity: opacities.a,
          transition: "opacity 1200ms ease-in-out",
          willChange: "opacity",
        }}
        aria-hidden="true"
      />
      <video
        ref={refB}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          opacity: opacities.b,
          transition: "opacity 1200ms ease-in-out",
          willChange: "opacity",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

/* ─── CTA Buttons ─── */
const HeroCTAs = memo(function HeroCTAs({
  onReservar,
  className,
}: {
  onReservar: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <Button
        size="lg"
        onClick={onReservar}
        className="btn-hero group min-h-[52px] text-sm"
      >
        <span>🎓 Reservar mi lugar</span>
        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={() =>
          window.open(
            "https://wa.me/5491159064234?text=" +
              encodeURIComponent(
                "Hola, quiero información sobre la Maestría en Circulación Pulmonar 2026."
              ),
            "_blank"
          )
        }
        className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-6 py-3.5 rounded-full transition-all duration-400 min-h-[52px] text-sm group"
      >
        <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Hablar con asesor
      </Button>
    </div>
  );
});

/* ─── Progress dots ─── */
const ProgressDots = memo(function ProgressDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 justify-center mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Video ${i + 1}`}
          className={cn(
            "rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            i === current
              ? "w-6 h-2 bg-accent"
              : "w-2 h-2 bg-white/30 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  );
});

/* ─── Shared text content ─── */
const HeroText = memo(function HeroText({ onReservar }: { onReservar: () => void }) {
  return (
    <>
      {/* Badge: Edición 2026 · Cupos limitados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
          <span className="text-white/90">Edición 2026 · Cupos limitados</span>
        </span>
      </motion.div>

      {/* Escasez: Solo 15 cupos anuales */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="text-accent-light font-bold text-base sm:text-lg tracking-wide mb-4"
        aria-label="Solo 15 cupos anuales disponibles"
      >
        Solo 15 cupos anuales
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4"
      >
        La experiencia que está transformando la{" "}
        <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
          circulación pulmonar
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mb-6 space-y-2"
      >
        <p className="text-white/60 text-sm font-medium">
          2 al 16 de noviembre de 2026 · Buenos Aires, Argentina
        </p>
        <p className="text-white/50 text-sm">
          Formación presencial intensiva + campus virtual.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <HeroCTAs onReservar={onReservar} />
      </motion.div>
    </>
  );
});

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const [idx, setIdx] = useState(0);
  const preloadedSet = useRef<Set<number>>(new Set([0]));

  const currentSrc = flyerVideos[idx].src;

  const scrollToContacto = useCallback(() => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goTo = useCallback((i: number) => {
    setIdx(i);
  }, []);

  // Preload next video ahead of time + auto-rotate
  useEffect(() => {
    const next = (idx + 1) % flyerVideos.length;

    const preloadTimer = setTimeout(() => {
      if (!preloadedSet.current.has(next)) {
        preloadedSet.current.add(next);
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.href = flyerVideos[next].src;
        document.head.appendChild(link);
      }
    }, ROTATION_INTERVAL - PRELOAD_AHEAD);

    const rotateTimer = setTimeout(() => {
      setIdx((prev) => (prev + 1) % flyerVideos.length);
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(preloadTimer);
      clearTimeout(rotateTimer);
    };
  }, [idx]);

  return (
    <section
      id="hero-flyer"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-[hsl(229,50%,6%)]"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">

        {/* ── Desktop layout: own VideoPlayer instance ── */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
          <div className="lg:col-span-2 lg:pt-8 flex flex-col justify-start">
            <HeroText onReservar={scrollToContacto} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-5 h-full flex flex-col items-center justify-center"
            style={{ willChange: "transform, opacity" }}
          >
            <VideoPlayer currentSrc={currentSrc} />
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>
        </div>

        {/* ── Mobile layout: own VideoPlayer instance ── */}
        <div className="lg:hidden flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ willChange: "transform, opacity" }}
          >
            <VideoPlayer currentSrc={currentSrc} />
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>

          <div className="text-center px-2">
            <HeroText onReservar={scrollToContacto} />
          </div>
        </div>

      </div>
    </section>
  );
};
