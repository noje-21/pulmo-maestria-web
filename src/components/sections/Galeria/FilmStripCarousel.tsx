import { memo, useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import type { ImageData, YearGallery } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const SCROLL_SPEED = 0.5; // px per frame

interface FilmStripCarouselProps {
  gallery: YearGallery;
  onImageClick: (gallery: YearGallery, index: number) => void;
}

const FilmStripCarousel = memo(function FilmStripCarousel({
  gallery,
  onImageClick,
}: FilmStripCarouselProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Duplicate images for seamless loop
  const loopImages = [...gallery.images, ...gallery.images];

  // Auto-scroll loop
  useEffect(() => {
    const el = stripRef.current;
    if (!el || isPaused) return;

    const halfWidth = el.scrollWidth / 2;

    const tick = () => {
      el.scrollLeft += SCROLL_SPEED;
      // Reset to start for seamless loop
      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setHoveredIdx(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: EASE }}
      className="mb-16 sm:mb-24"
    >
      {/* Year header */}
      <div className="relative mb-8 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex items-center gap-4"
        >
          <div className="inline-flex items-center px-5 py-2 bg-primary/15 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
            <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {gallery.year}
            </span>
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {gallery.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {gallery.subtitle} · {gallery.images.length} fotos
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/15">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Reproducción automática</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-4 h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent origin-left"
        />
      </div>

      {/* Film strip container */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Film perforations top */}
        <div className="flex items-center gap-3 px-2 mb-2 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="w-3 h-1.5 rounded-sm bg-primary/10 flex-shrink-0" />
          ))}
        </div>

        {/* Scrolling strip */}
        <div
          ref={stripRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto cursor-grab active:cursor-grabbing py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loopImages.map((image, index) => {
            const realIdx = index % gallery.images.length;
            const isFocused = hoveredIdx === null || hoveredIdx === index;

            return (
              <motion.div
                key={`${realIdx}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: EASE }}
                onMouseEnter={() => setHoveredIdx(index)}
                onClick={() => onImageClick(gallery, realIdx)}
                className="relative flex-shrink-0 cursor-pointer group"
              >
                <motion.div
                  animate={{
                    opacity: isFocused ? 1 : 0.4,
                    scale: hoveredIdx === index ? 1.08 : 1,
                    rotate: hoveredIdx === index ? 0.5 : 0,
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative w-[240px] sm:w-[300px] md:w-[360px] aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 border border-border/30 group-hover:border-primary/30"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <span className="text-xs sm:text-sm text-white font-medium line-clamp-1 drop-shadow-lg">
                      {image.alt}
                    </span>
                    {image.category && (
                      <span className="text-[10px] text-white/60">{image.category}</span>
                    )}
                  </div>

                  {/* Frame number */}
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-white/40 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {String(realIdx + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Film perforations bottom */}
        <div className="flex items-center gap-3 px-2 mt-2 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="w-3 h-1.5 rounded-sm bg-primary/10 flex-shrink-0" />
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </motion.div>
  );
});

export default FilmStripCarousel;
