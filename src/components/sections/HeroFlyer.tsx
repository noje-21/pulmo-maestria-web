import { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  X,
  ExternalLink,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
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

/* ─── Cinematic single-video player ─── */
const CinemaPlayer = memo(function CinemaPlayer({
  video,
  onExpand,
  onNext,
  onPrev,
  total,
  current,
}: {
  video: FlyerVideo;
  onExpand: () => void;
  onNext: () => void;
  onPrev: () => void;
  total: number;
  current: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setReady(false);
    setEnded(false);
    setPlaying(true);
  }, [video.id]);

  const toggle = useCallback(() => {
    if (!ref.current) return;
    if (ref.current.paused) {
      ref.current.play().catch(() => {});
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.6)] border border-white/10">
      {/* Video */}
      <video
        ref={ref}
        key={video.src}
        src={video.src}
        muted
        playsInline
        preload="metadata"
        onLoadedData={() => {
          setReady(true);
          ref.current?.play().catch(() => {});
        }}
        onEnded={() => setEnded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Loading skeleton */}
      {!ready && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-black/60 animate-pulse" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* End-of-video CTA overlay */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm"
          >
            <p className="text-white/80 text-sm font-medium">¿Listo para dar el siguiente paso?</p>
            <Button
              size="lg"
              onClick={() => scrollTo("contacto")}
              className="btn-hero group"
            >
              <span>🎓 Reservar mi lugar</span>
              <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={() => {
                if (ref.current) {
                  ref.current.currentTime = 0;
                  ref.current.play().catch(() => {});
                  setEnded(false);
                  setPlaying(true);
                }
              }}
              className="text-white/50 hover:text-white/80 text-xs underline underline-offset-4 transition-colors"
            >
              Ver de nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls bar */}
      {!ended && (
        <div className="absolute bottom-0 inset-x-0 z-10 flex items-end justify-between p-3 sm:p-4">
          {/* Label */}
          <p className="text-white/80 text-xs sm:text-sm font-medium truncate max-w-[60%]">
            {video.label}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={onExpand}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
              aria-label="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Prev / Next arrows */}
      {total > 1 && !ended && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors"
            aria-label="Video anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors"
            aria-label="Video siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute top-3 inset-x-0 z-10 flex justify-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === current ? "bg-white w-6" : "bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(false);
  const modalRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => setIdx((i) => (i + 1) % flyerVideos.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + flyerVideos.length) % flyerVideos.length), []);

  const openModal = useCallback(() => {
    setModal(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    modalRef.current?.pause();
    setModal(false);
    document.body.style.overflow = "";
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
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-12 lg:items-start">
          {/* Text: Compact sidebar (2 cols) */}
          <div className="lg:col-span-2 lg:pt-6 flex flex-col justify-start">
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

          {/* Video: Hero protagonist (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <CinemaPlayer
              video={flyerVideos[idx]}
              onExpand={openModal}
              onNext={next}
              onPrev={prev}
              total={flyerVideos.length}
              current={idx}
            />
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
            <CinemaPlayer
              video={flyerVideos[idx]}
              onExpand={openModal}
              onNext={next}
              onPrev={prev}
              total={flyerVideos.length}
              current={idx}
            />
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

      {/* ── Fullscreen Modal ── */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={closeModal}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-5xl rounded-2xl overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                ref={modalRef}
                src={flyerVideos[idx].src}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
