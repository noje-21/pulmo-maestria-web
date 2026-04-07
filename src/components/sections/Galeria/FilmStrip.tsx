import { memo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageData } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

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

  const scroll = useCallback((dir: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="relative pt-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              {title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {images.length} fotos
              </span>
            </h3>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Film strip container */}
        <div className="relative group">
          {/* Film strip perforations — top */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-foreground/5 z-10 flex items-center gap-3 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="w-2 h-1.5 rounded-[1px] bg-foreground/10 flex-shrink-0" />
            ))}
          </div>

          {/* Film strip perforations — bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-foreground/5 z-10 flex items-center gap-3 px-4 overflow-hidden pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="w-2 h-1.5 rounded-[1px] bg-foreground/10 flex-shrink-0" />
            ))}
          </div>

          {/* Scroll buttons */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll(-1)}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border/40"
                aria-label="Scroll izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
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
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 border border-border/40"
                aria-label="Scroll derecha"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* The strip */}
          <div
            ref={stripRef}
            className="flex gap-3 overflow-x-auto py-5 px-4 md:px-8 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 60, rotateZ: 2 }}
                animate={{ opacity: 1, x: 0, rotateZ: 0 }}
                transition={{
                  delay: 0.15 + i * 0.06,
                  duration: 0.5,
                  ease: EASE,
                }}
                onClick={() => onImageClick(img, i)}
                className="relative flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group/img shadow-lg hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.05, y: -4 }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />
                {img.category && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-[10px] text-white/90 font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {img.category}
                    </span>
                  </div>
                )}
                {/* Frame number */}
                <div className="absolute top-1.5 left-2 pointer-events-none">
                  <span className="text-[9px] font-mono text-white/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </motion.div>
  );
});

export default FilmStrip;
