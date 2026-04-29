import { useRef, useState, useCallback, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReservarPopup } from "./ReservarPopup";
import { CampusVirtualButton } from "@/components/common/CampusVirtualButton";

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

// Inscription deadline: day before the program begins (Buenos Aires UTC-3)
const INSCRIPTION_DEADLINE = new Date("2026-11-01T23:59:59-03:00");

function getTimeLeft() {
  const diff = INSCRIPTION_DEADLINE.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

/* ─── Ambient glows — memoized, GPU-composited ─── */
const AmbientGlows = memo(function AmbientGlows() {
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

/* ─── Countdown Timer — own state, 60s interval, never causes HeroText re-render ─── */
const CountdownTimer = memo(function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "días" },
    { value: timeLeft.hours, label: "hs" },
    { value: timeLeft.minutes, label: "min" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="mb-5"
      aria-label="Tiempo restante para el cierre de inscripciones"
      style={{ willChange: "auto" }}
    >
      <div className="inline-flex items-center divide-x divide-white/10 rounded-xl border border-white/10 bg-black/20 overflow-hidden max-w-full">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center px-2 xs:px-2.5 sm:px-3 py-2 gap-0.5 min-w-[40px] xs:min-w-[44px] sm:min-w-[48px]">
            <span className="text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl tabular-nums leading-none tracking-tight">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-white/35 text-[9px] font-medium uppercase tracking-widest leading-none">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-white/30 text-[10px] font-medium tracking-wide uppercase">
        hasta el cierre de inscripciones
      </p>
    </motion.div>
  );
});

/* ─── Video Player — A/B crossfade, self-contained ─── */
const VideoPlayer = memo(function VideoPlayer({
  currentSrc,
  currentLabel,
  isMobile,
  onHoverStart,
  onHoverEnd,
}: {
  currentSrc: string;
  currentLabel: string;
  isMobile: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");
  const [opacities, setOpacities] = useState<{ a: number; b: number }>({ a: 1, b: 0 });
  const initializedSrc = useRef<string>("");
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const v = refA.current;
    if (!v || initializedSrc.current) return;
    initializedSrc.current = currentSrc;
    v.src = currentSrc;
    v.load();
    v.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initializedSrc.current || currentSrc === initializedSrc.current) return;
    initializedSrc.current = currentSrc;

    const isA = activeRef.current === "A";
    const incoming = isA ? refB.current : refA.current;
    if (!incoming) return;

    incoming.src = currentSrc;
    incoming.load();
    incoming.play().catch(() => {});

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
  }, [currentSrc]);

  const crossfadeTransition = "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)";

  // Only promote to GPU layer during active crossfade
  const videoWillChange = transitioning ? "opacity" : "auto";

  return (
    <motion.div
      className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black transform-gpu"
      style={{
        contain: "layout style paint",
        boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={isMobile ? undefined : { scale: 1.03 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Ken Burns — disabled on mobile for GPU savings */}
      <motion.div
        className="absolute inset-0 transform-gpu"
        animate={isMobile ? undefined : { scale: [1, 1.02, 1] }}
        transition={isMobile ? undefined : { duration: 8, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
      >
        <video
          ref={refA}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: opacities.a, transition: crossfadeTransition, willChange: videoWillChange }}
          aria-hidden="true"
        />
        <video
          ref={refB}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: opacities.b, transition: crossfadeTransition, willChange: videoWillChange }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

      {/* Dynamic video label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-4 left-4 z-10 pointer-events-none"
        >
          <span className="inline-block px-3 py-1.5 rounded-lg text-white/70 text-xs font-medium bg-black/40 border border-white/5 lg:backdrop-blur-md lg:bg-black/30">
            {currentLabel}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
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
        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
      </Button>

      <CampusVirtualButton />

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
        className="bg-white/5 border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-6 py-3.5 rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-h-[52px] text-sm group"
      >
        <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
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
            "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            "transition-[width,height,background-color,box-shadow] duration-500",
            i === current
              ? "w-8 h-2.5 bg-accent shadow-[0_0_12px_hsl(var(--accent)/0.5)]"
              : "w-2 h-2 bg-white/30 hover:bg-white/60"
          )}
        />
      ))}
    </div>
  );
});

/* ─── Hero text — memoized: never re-renders on video rotation ─── */
const HeroText = memo(function HeroText({ onReservar }: { onReservar: () => void }) {
  return (
    <div style={{ contain: "layout style" }}>
      {/* Badge: Edición 2026 · Cupos limitados */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        className="mb-3"
        style={{ willChange: "auto" }}
      >
        <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
          <span className="text-white/90">Edición 2026 · Cupos limitados</span>
        </span>
      </motion.div>

      {/* Scarcity badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="mb-4"
        aria-label="Solo 15 cupos anuales disponibles"
        style={{ willChange: "auto" }}
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/40 bg-accent/10 shadow-[0_0_16px_hsl(var(--accent)/0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="text-accent-light font-semibold text-sm sm:text-base tracking-wide">
            Solo 15 cupos anuales
          </span>
        </span>
      </motion.div>

      {/* H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="text-[1.35rem] xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4 break-words hyphens-auto"
        style={{ willChange: "auto" }}
      >
        La experiencia que está transformando la{" "}
        <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
          circulación pulmonar
        </span>
      </motion.h1>

      {/* Date */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="mb-5 space-y-1"
        style={{ willChange: "auto" }}
      >
        <p className="text-white/60 text-[11px] xs:text-xs sm:text-sm font-medium leading-snug">
          2 al 16 de noviembre de 2026 · Buenos Aires, Argentina
        </p>
        <p className="text-white/45 text-[11px] xs:text-xs sm:text-sm leading-snug">
          Formación presencial intensiva + campus virtual.
        </p>
      </motion.div>

      {/* Countdown */}
      <CountdownTimer />

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: "auto" }}
      >
        <HeroCTAs onReservar={onReservar} />
      </motion.div>
    </div>
  );
});

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const [idx, setIdx] = useState(0);
  const preloadedSet = useRef<Set<number>>(new Set([0]));
  const hoveringRef = useRef(false);
  const isMobile = useIsMobile();

  const currentVideo = flyerVideos[idx];

  const [showReservar, setShowReservar] = useState(false);

  const openReservar = useCallback(() => {
    setShowReservar(true);
  }, []);

  const goTo = useCallback((i: number) => {
    setIdx(i);
  }, []);

  const handleHoverStart = useCallback(() => {
    hoveringRef.current = true;
  }, []);

  const handleHoverEnd = useCallback(() => {
    hoveringRef.current = false;
  }, []);

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
      if (!hoveringRef.current) {
        setIdx((prev) => (prev + 1) % flyerVideos.length);
      }
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
      style={{ contain: "layout style" }}
    >
      <AmbientGlows />

      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
          <div className="lg:col-span-2 lg:pt-8 flex flex-col justify-start">
            <HeroText onReservar={openReservar} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-5 h-full flex flex-col items-center justify-center"
            style={{ willChange: "auto" }}
          >
            <VideoPlayer
              currentSrc={currentVideo.src}
              currentLabel={currentVideo.label}
              isMobile={false}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: "auto" }}
          >
            <VideoPlayer
              currentSrc={currentVideo.src}
              currentLabel={currentVideo.label}
              isMobile={true}
            />
            <ProgressDots total={flyerVideos.length} current={idx} onSelect={goTo} />
          </motion.div>

          <div className="text-center px-2">
            <HeroText onReservar={openReservar} />
          </div>
        </div>

      </div>

      <ReservarPopup isOpen={showReservar} onClose={() => setShowReservar(false)} />
    </section>
  );
};
