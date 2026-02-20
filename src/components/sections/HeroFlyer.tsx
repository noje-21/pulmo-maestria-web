import { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const ROTATION_INTERVAL = 15_000; // ms
const PRELOAD_AHEAD = 5_000;      // start loading next video 5s before switch

/* Ken Burns animation variants — each video gets a different pan direction */
const kenBurnsVariants = [
  { scale: [1, 1.03], x: ["0%", "-0.5%"], y: ["0%", "-0.3%"] },
  { scale: [1, 1.04], x: ["0%", "0.5%"], y: ["0%", "0.3%"] },
  { scale: [1, 1.03], x: ["0.3%", "-0.3%"], y: ["-0.3%", "0.3%"] },
];

/* ─── Invisible preloader: mounts a hidden video to start buffering ─── */
const VideoPreloader = memo(function VideoPreloader({ src }: { src: string }) {
  return (
    <video
      key={src}
      src={src}
      preload="auto"
      muted
      playsInline
      style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
});

/* ─── Pure visual video loop with crossfade + Ken Burns ─── */
const CinemaPlayer = memo(function CinemaPlayer({
  video,
  isFirst,
}: {
  video: FlyerVideo;
  isFirst: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const kb = kenBurnsVariants[video.id % kenBurnsVariants.length];

  useEffect(() => {
    setReady(false);
  }, [video.id]);

  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-none select-none bg-black"
    >
      {/* Ken Burns wrapper */}
      <motion.div
        initial={{ scale: kb.scale[0], x: kb.x[0], y: kb.y[0] }}
        animate={{ scale: kb.scale[1], x: kb.x[1], y: kb.y[1] }}
        transition={{ duration: 15, ease: "linear" }}
        className="absolute inset-0"
      >
        <video
          ref={ref}
          key={video.src}
          src={video.src}
          muted
          loop
          autoPlay
          playsInline
          /* First video loads fully for instant playback;
             subsequent videos were pre-buffered by VideoPreloader */
          preload={isFirst ? "auto" : "metadata"}
          onLoadedData={() => {
            setReady(true);
            ref.current?.play().catch(() => {});
          }}
          onError={() => setReady(true)}
          className={cn(
            "w-full h-full object-contain transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      </motion.div>

      {/* Loading skeleton */}
      {!ready && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-black/60 animate-pulse" />
      )}

      {/* Subtle bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
});

/* ─── CTA Buttons (shared between desktop + mobile) ─── */
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

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const [idx, setIdx] = useState(0);
  // Track which video indices have been "unlocked" for preloading
  const [preloadIdx, setPreloadIdx] = useState<number | null>(null);
  // Track which indices have already been preloaded so we don't duplicate
  const preloadedSet = useRef<Set<number>>(new Set([0]));

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    // 5 s before each rotation, unlock preload for the next video
    const preloadTimer = setTimeout(() => {
      const next = (idx + 1) % flyerVideos.length;
      if (!preloadedSet.current.has(next)) {
        preloadedSet.current.add(next);
        setPreloadIdx(next);
      }
    }, ROTATION_INTERVAL - PRELOAD_AHEAD);

    // Rotate to next video
    const rotateTimer = setTimeout(() => {
      setIdx((i) => (i + 1) % flyerVideos.length);
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
      {/* Invisible preloader for the next video — renders off-screen */}
      {preloadIdx !== null && (
        <VideoPreloader src={flyerVideos[preloadIdx].src} />
      )}

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">

        {/* ── Desktop: Asymmetric grid (video dominant) ── */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
          {/* Text: Compact sidebar (2 cols) */}
          <div className="lg:col-span-2 lg:pt-8 flex flex-col justify-start">
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
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4 text-left"
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
              <HeroCTAs onReservar={() => scrollTo("contacto")} />
            </motion.div>
          </div>

          {/* Video: Hero protagonist (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 h-full flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <CinemaPlayer video={flyerVideos[idx]} isFirst={idx === 0} />
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Mobile: Vertical stack (video first) ── */}
        <div className="lg:hidden flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <CinemaPlayer video={flyerVideos[idx]} isFirst={idx === 0} />
            </AnimatePresence>
          </motion.div>

          <div className="text-center px-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
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
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-2xl sm:text-3xl font-bold text-white leading-[1.15] mb-4 text-balance"
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
              <p className="text-white/50 text-xs">
                Formación presencial intensiva + campus virtual.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <HeroCTAs onReservar={() => scrollTo("contacto")} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
