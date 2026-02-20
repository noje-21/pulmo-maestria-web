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
 * A/B crossfade player using a single pair of <video> elements.
 * Never unmounts — avoids all ERR_ABORTED storms from React remounting.
 */
const useCinemaPlayer = () => {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);
  const initialized = useRef(false);

  // Seed the first video once on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const v = refA.current;
    if (!v) return;
    v.src = flyerVideos[0].src;
    v.load();
    v.play().catch(() => {});
  }, []);

  const switchTo = useCallback((video: FlyerVideo) => {
    const isA = activeRef.current === "A";
    const incoming = isA ? refB.current : refA.current;
    if (!incoming) return;

    incoming.src = video.src;
    incoming.load();
    incoming.play().catch(() => {});

    if (isA) {
      setOpacityA(0);
      setOpacityB(1);
      activeRef.current = "B";
    } else {
      setOpacityA(1);
      setOpacityB(0);
      activeRef.current = "A";
    }
  }, []);

  const player = (
    <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.6)] border border-white/10 select-none bg-black">
      <video
        ref={refA}
        muted loop playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[1200ms]"
        style={{ opacity: opacityA }}
        aria-hidden="true"
      />
      <video
        ref={refB}
        muted loop playsInline preload="metadata"
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[1200ms]"
        style={{ opacity: opacityB }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );

  return { player, switchTo };
};

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

/* ─── Shared text content (used in both desktop and mobile layouts) ─── */
const HeroText = memo(function HeroText({ onReservar }: { onReservar: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
          <span className="text-white/90">Edición 2026 · Cupos limitados</span>
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
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
        transition={{ duration: 0.6, delay: 0.2 }}
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
        transition={{ duration: 0.6, delay: 0.3 }}
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
  const { player, switchTo } = useCinemaPlayer();

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goTo = useCallback((i: number) => {
    setIdx(i);
    switchTo(flyerVideos[i]);
  }, [switchTo]);

  // Preload via <link rel="preload"> and auto-rotate
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
      const nextIdx = (idx + 1) % flyerVideos.length;
      setIdx(nextIdx);
      switchTo(flyerVideos[nextIdx]);
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(preloadTimer);
      clearTimeout(rotateTimer);
    };
  }, [idx, switchTo]);

  return (
    <section
      id="hero-flyer"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-[hsl(229,50%,6%)]"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
    >
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">

        {/* ── Desktop layout ── */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
          <div className="lg:col-span-2 lg:pt-8 flex flex-col justify-start">
            <HeroText onReservar={() => scrollTo("contacto")} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 h-full flex flex-col items-center justify-center"
          >
            {player}
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {player}
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>

          <div className="text-center px-2">
            <HeroText onReservar={() => scrollTo("contacto")} />
          </div>
        </div>

      </div>
    </section>
  );
};
