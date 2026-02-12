import { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlyerVideo {
  id: number;
  src: string;
  label: string;
}

const flyerVideos: FlyerVideo[] = [
  { id: 1, src: "/videos/flyer-1.mp4", label: "Experiencia académica presencial" },
  { id: 2, src: "/videos/flyer-2.mp4", label: "Formación con referentes internacionales" },
  { id: 3, src: "/videos/flyer-3.mp4", label: "Impacto clínico real" },
];

/* ─── Pure visual video loop with smooth crossfade ─── */
const CinemaPlayer = memo(function CinemaPlayer({
  video,
}: {
  video: FlyerVideo;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [video.id]);

  return (
    <motion.div
      key={video.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.6)] border border-white/10 pointer-events-none select-none"
    >
      <video
        ref={ref}
        key={video.src}
        src={video.src}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        onLoadedData={() => {
          setReady(true);
          ref.current?.play().catch(() => {});
        }}
        onError={() => {
          setReady(true);
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Loading skeleton */}
      {!ready && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-black/60 animate-pulse" />
      )}

      {/* Subtle bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
});

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const [idx, setIdx] = useState(0);

  // Auto-rotate videos every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % flyerVideos.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero-flyer"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-[hsl(229,50%,6%)]"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
    >
      {/* Ambient */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* ── Desktop: Asymmetric grid (video dominant) ── */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-10 lg:items-start">
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
              className="flex flex-col gap-2.5"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("contacto")}
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
            </motion.div>
          </div>

          {/* Video: Hero protagonist (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <AnimatePresence mode="wait">
              <CinemaPlayer video={flyerVideos[idx]} />
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Mobile: Vertical stack (video first) ── */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Video first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <CinemaPlayer video={flyerVideos[idx]} />
            </AnimatePresence>
          </motion.div>

          {/* Text stacked below on mobile */}
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
              className="flex flex-col gap-3"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("contacto")}
                className="btn-hero group min-h-[52px]"
              >
                <span>🎓 Reservar mi lugar</span>
                <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
                className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[52px] group"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Hablar con asesor académico
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
};
