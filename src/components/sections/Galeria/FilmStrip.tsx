import { memo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ImageData } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const AUTO_ADVANCE_MS = 4000;

interface FilmStripProps {
  images: ImageData[];
  year: number;
  title: string;
  onClose: () => void;
  onImageClick: (img: ImageData, index: number) => void;
}

const FilmStrip = memo(function FilmStrip({
  images,
  year,
  title,
  onClose,
  onImageClick,
}: FilmStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance active photo
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused, images.length]);

  // Scroll strip to keep active thumb visible
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const thumb = el.children[activeIdx] as HTMLElement | undefined;
    if (!thumb) return;
    const left = thumb.offsetLeft - el.clientWidth / 2 + thumb.clientWidth / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [activeIdx]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setActiveIdx((p) => (p - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIdx((p) => (p + 1) % images.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, images.length]);

  const activeImage = images[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-50 flex flex-col"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative z-10 flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
              <span className="text-sm font-bold text-primary-foreground tracking-wider">{year}</span>
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
              <p className="text-xs text-white/40">
                {activeIdx + 1} / {images.length} · {activeImage?.category || ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label={isPaused ? "Reproducir" : "Pausar"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-destructive hover:text-destructive-foreground text-white transition-all duration-200"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured image — large with fade */}
        <div
          className="flex-1 relative flex items-center justify-center px-4 sm:px-16 py-2 min-h-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Prev/Next overlays */}
          <button
            onClick={() => setActiveIdx((p) => (p - 1 + images.length) % images.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setActiveIdx((p) => (p + 1) % images.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-white/10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center cursor-pointer"
              onClick={() => onImageClick(activeImage, activeIdx)}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-4 right-4 sm:left-16 sm:right-16 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              key={`${activeIdx}-${isPaused}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isPaused ? undefined : 1 }}
              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
              className="h-full bg-primary origin-left"
            />
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="relative py-3 px-2">
          {/* Film perforations */}
          <div className="absolute top-0 left-0 right-0 h-2 flex items-center gap-3 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-[1px] bg-white/[0.06] flex-shrink-0" />
            ))}
          </div>

          <div
            ref={stripRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto px-4 sm:px-8 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((img, i) => {
              const isActive = i === activeIdx;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EASE }}
                  onClick={() => { setActiveIdx(i); setIsPaused(true); }}
                  className={`relative flex-shrink-0 w-[70px] sm:w-[90px] md:w-[110px] aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-black scale-105 shadow-lg shadow-primary/30"
                      : "opacity-50 hover:opacity-80 ring-1 ring-white/5"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Frame number */}
                  <span className="absolute top-0.5 left-1 text-[8px] font-mono text-white/30 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom perforations */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex items-center gap-3 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-[1px] bg-white/[0.06] flex-shrink-0" />
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </motion.div>
  );
});

export default FilmStrip;
