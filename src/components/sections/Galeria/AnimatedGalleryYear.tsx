import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { ImageData, YearGallery } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

interface AnimatedGalleryYearProps {
  gallery: YearGallery;
  onImageClick: (gallery: YearGallery, index: number) => void;
  onYearClick?: (year: number) => void;
}

const AnimatedGalleryYear = memo(function AnimatedGalleryYear({
  gallery,
  onImageClick,
  onYearClick,
}: AnimatedGalleryYearProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleMouseEnter = useCallback((i: number) => setHoveredIdx(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIdx(null), []);

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
          <button
            onClick={() => onYearClick?.(gallery.year)}
            className="inline-flex items-center px-5 py-2 bg-primary/15 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-lg shadow-primary/5 cursor-pointer hover:bg-primary/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {gallery.year}
            </span>
          </button>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {gallery.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {gallery.subtitle} · {gallery.images.length} fotos
            </p>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-4 h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent origin-left"
        />
      </div>

      {/* Staggered image grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      >
        {gallery.images.map((image, index) => {
          const isFocused = hoveredIdx === null || hoveredIdx === index;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => onImageClick(gallery, index)}
              className="relative cursor-pointer group"
              style={{ zIndex: hoveredIdx === index ? 20 : 1 }}
            >
              <motion.div
                animate={{
                  opacity: isFocused ? 1 : 0.45,
                  scale: hoveredIdx === index ? 1.06 : 1,
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
                />

                {/* Hover rotation + gradient overlay */}
                <motion.div
                  animate={{
                    rotate: hoveredIdx === index ? 0.5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Caption on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <span className="text-xs sm:text-sm text-white font-medium line-clamp-1 drop-shadow-lg">
                    {image.alt}
                  </span>
                  {image.category && (
                    <span className="text-[10px] text-white/60 font-medium">
                      {image.category}
                    </span>
                  )}
                </div>

                {/* Frame number */}
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/30 bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
});

export default AnimatedGalleryYear;
