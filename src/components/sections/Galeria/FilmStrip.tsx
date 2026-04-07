import { memo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ImageData } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const AUTO_SCROLL_SPEED = 0.6; // px per frame
const AUTO_SCROLL_DELAY = 1500; // ms before autoplay starts

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
  const animFrameRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  // Auto-scroll animation
  useEffect(() => {
    const el = stripRef.current;
    if (!el || isPaused) return;

    const timeout = setTimeout(() => {
      const tick = () => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = 0; // loop back
        } else {
          el.scrollLeft += AUTO_SCROLL_SPEED;
        }
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    }, AUTO_SCROLL_DELAY);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const scroll = useCallback((dir: number) => {
    const el = stripRef.current;
    if (!el) return;
    setIsPaused(true);
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      {/* Content container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 w-full max-w-[95vw] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
            className="flex items-center gap-3"
          >
            <span className="inline-flex items-center px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
              <span className="text-sm font-bold text-primary-foreground tracking-wider">{year}</span>
            </span>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-white/50">
                {images.length} fotos · Desliza o usa las flechas
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onClick={() => setIsPaused((p) => !p)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label={isPaused ? "Reproducir" : "Pausar"}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </motion.button>
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-destructive hover:text-destructive-foreground text-white transition-all duration-200"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Film strip */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Film perforations — top */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/[0.03] z-10 flex items-center gap-4 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2 rounded-[2px] bg-white/[0.08] flex-shrink-0" />
            ))}
          </div>

          {/* Film perforations — bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/[0.03] z-10 flex items-center gap-4 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2 rounded-[2px] bg-white/[0.08] flex-shrink-0" />
            ))}
          </div>

          {/* Nav buttons */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-white/10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-white/10"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Edge fades */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

          {/* Scrollable strip */}
          <div
            ref={stripRef}
            className="flex gap-4 overflow-x-auto py-7 px-8 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  delay: 0.1 + i * 0.07,
                  duration: 0.55,
                  ease: EASE,
                }}
                onClick={() => onImageClick(img, i)}
                className="relative flex-shrink-0 w-[220px] sm:w-[280px] md:w-[340px] aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group/img ring-1 ring-white/10"
                style={{ perspective: 800 }}
                whileHover={{ scale: 1.06, y: -6, rotateY: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Category on hover */}
                {img.category && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-xs text-white font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {img.category}
                    </span>
                  </div>
                )}

                {/* Frame number */}
                <div className="absolute top-2 left-2.5 pointer-events-none">
                  <span className="text-[10px] font-mono text-white/30 tabular-nums bg-black/30 px-1.5 py-0.5 rounded">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image count indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
          className="text-center mt-3"
        >
          <span className="text-xs text-white/30 font-medium">
            Haz clic en cualquier foto para verla en grande
          </span>
        </motion.div>
      </motion.div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </motion.div>
  );
});

export default FilmStrip;
