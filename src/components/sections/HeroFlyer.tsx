import { useRef, useState, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
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

/* ─── Cinematic fullscreen player ─── */
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
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setReady(false);
    setPlaying(true);
  }, [video.id]);

  // Auto-hide controls after 3s
  useEffect(() => {
    if (showControls) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(hideTimer.current);
  }, [showControls]);

  const revealControls = useCallback(() => setShowControls(true), []);

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

  return (
    <div
      className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group"
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      onClick={onExpand}
    >
      {/* Video */}
      <video
        ref={ref}
        key={video.src}
        src={video.src}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => {
          setReady(true);
          ref.current?.play().catch(() => {});
        }}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700",
          ready ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Loading */}
      {!ready && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-black/60 animate-pulse" />
      )}

      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* Controls — fade in/out */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {/* Bottom bar */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between p-4 sm:p-5 pointer-events-auto">
          <p className="text-white/70 text-xs sm:text-sm font-medium truncate max-w-[55%]">
            {video.label}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggle(); }}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label={playing ? "Pausar" : "Reproducir"}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-colors pointer-events-auto"
              aria-label="Video anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:bg-black/50 transition-colors pointer-events-auto"
              aria-label="Video siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute top-4 inset-x-0 flex justify-center gap-1.5 pointer-events-auto">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === current ? "bg-white w-8" : "bg-white/30 w-4"
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
});

/* ─── Main: Pure cinematic hero ─── */
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

  return (
    <section
      id="hero-flyer"
      className="relative h-[85svh] sm:h-[90svh] lg:h-[92svh] overflow-hidden bg-black"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
    >
      {/* Full-bleed video player */}
      <div className="absolute inset-0">
        <CinemaPlayer
          video={flyerVideos[idx]}
          onExpand={openModal}
          onNext={next}
          onPrev={prev}
          total={flyerVideos.length}
          current={idx}
        />
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={closeModal}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-6xl rounded-2xl overflow-hidden bg-black shadow-[0_0_120px_rgba(0,0,0,0.9)]"
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
