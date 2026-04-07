import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño } from "./data";
import type { ImageData, YearGallery } from "./types";

/* ── Constants ── */
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Unified Slide type ── */
interface UnifiedSlide {
  src: string;
  alt: string;
  year: number;
  title: string;
  category?: string;
  galleryIdx: number;
  imageIdx: number;
}

/* ── Props ── */
interface GaleriaProps {
  galleries?: YearGallery[];
}

/* ── Main Gallery ── */
const Galeria = ({ galleries }: GaleriaProps = {}) => {
  const data = useMemo(
    () => (galleries ?? galeriasPorAño).map((g) => ({ ...g, images: [...g.images] })),
    [galleries]
  );

  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build unified slides array
  const allSlides = useMemo(() => {
    const slides: UnifiedSlide[] = [];
    data.forEach((g, gi) => {
      g.images.forEach((img, ii) => {
        slides.push({
          src: img.src,
          alt: img.alt,
          year: g.year,
          title: g.title,
          category: img.category,
          galleryIdx: gi,
          imageIdx: ii,
        });
      });
    });
    return slides;
  }, [data]);

  const total = allSlides.length;

  const goTo = useCallback((idx: number) => {
    setActiveSlide((idx % total + total) % total);
  }, [total]);

  const goPrev = useCallback(() => goTo(activeSlide - 1), [activeSlide, goTo]);
  const goNext = useCallback(() => goTo(activeSlide + 1), [activeSlide, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Current active year for background
  const activeYear = allSlides[activeSlide]?.year;
  const activeHero = data.find((g) => g.year === activeYear)?.hero || allSlides[activeSlide]?.src;

  // Visible slides: show 5 centered on active
  const visibleSlides = useMemo(() => {
    const result: { slide: UnifiedSlide; offset: number; index: number }[] = [];
    for (let off = -2; off <= 2; off++) {
      let idx = (activeSlide + off + total) % total;
      result.push({ slide: allSlides[idx], offset: off, index: idx });
    }
    return result;
  }, [activeSlide, allSlides, total]);

  // Responsive card size
  const [cardWidth, setCardWidth] = useState(380);
  const [cardHeight, setCardHeight] = useState(280);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 640) { setCardWidth(280); setCardHeight(200); }
      else if (vw < 1024) { setCardWidth(340); setCardHeight(240); }
      else { setCardWidth(420); setCardHeight(300); }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Lightbox ── */
  const handleImageClick = useCallback(
    (idx: number) => {
      const slide = allSlides[idx];
      setCurrentImageIndex(idx);
      setSelectedImage({ src: slide.src, alt: slide.alt, category: slide.category });
    },
    [allSlides]
  );
  const handleClose = useCallback(() => setSelectedImage(null), []);
  const handlePrevImage = useCallback(() => {
    const n = currentImageIndex > 0 ? currentImageIndex - 1 : total - 1;
    setCurrentImageIndex(n);
    const s = allSlides[n];
    setSelectedImage({ src: s.src, alt: s.alt, category: s.category });
  }, [currentImageIndex, allSlides, total]);
  const handleNextImage = useCallback(() => {
    const n = currentImageIndex < total - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(n);
    const s = allSlides[n];
    setSelectedImage({ src: s.src, alt: s.alt, category: s.category });
  }, [currentImageIndex, allSlides, total]);

  // Year quick-nav
  const yearIndices = useMemo(() => {
    const map: { year: number; firstSlide: number }[] = [];
    const seen = new Set<number>();
    allSlides.forEach((s, i) => {
      if (!seen.has(s.year)) {
        seen.add(s.year);
        map.push({ year: s.year, firstSlide: i });
      }
    });
    return map;
  }, [allSlides]);

  const GAP = 18;

  return (
    <section id="galeria" className="relative py-16 sm:py-20 overflow-hidden">
      {/* ── Dynamic blurred background ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeYear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={activeHero}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-[60px] opacity-25"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Galería de Momentos
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Revive los mejores momentos de cada año de formación
          </p>
        </motion.div>

        {/* ── Unified 3D Showcase ── */}
        <div
          ref={containerRef}
          className="relative mb-8 sm:mb-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="relative mx-auto overflow-hidden"
            style={{ height: cardHeight + 30 }}
          >
            {visibleSlides.map(({ slide, offset, index }) => {
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);
              const step = cardWidth + GAP;
              const x = offset * step * 0.55;
              const scale = isActive ? 1 : Math.max(0.82, 1 - absOffset * 0.09);
              const opacity = isActive ? 1 : Math.max(0.5, 1 - absOffset * 0.25);
              const zIndex = 10 - absOffset;
              const rotateY = offset * -4;
              const blurPx = isActive ? 0 : absOffset * 2;

              return (
                <motion.div
                  key={`slide-${offset}`}
                  animate={{ x, scale, opacity, rotateY }}
                  transition={{ duration: 0.5, ease: EASE }}
                  onClick={() => {
                    if (isActive) {
                      handleImageClick(index);
                    } else {
                      goTo(index);
                    }
                  }}
                  className="absolute cursor-pointer will-change-transform"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    left: "50%",
                    top: "50%",
                    marginLeft: -cardWidth / 2,
                    marginTop: -cardHeight / 2,
                    zIndex,
                    perspective: 1200,
                    filter: `blur(${blurPx}px) grayscale(${isActive ? 0 : absOffset * 15}%)`,
                  }}
                >
                  <div
                    className={`
                      relative w-full h-full overflow-hidden rounded-2xl
                      transition-shadow duration-500
                      ${isActive
                        ? "shadow-2xl shadow-primary/30 ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
                        : "shadow-lg"
                      }
                    `}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* Year & title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
                      <div className="inline-block mb-1.5 px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          Programa Académico
                        </span>
                      </div>
                      <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                        {slide.year}
                      </span>
                      {isActive && slide.category && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.35 }}
                          className="text-[11px] sm:text-xs text-white/70 mt-1 line-clamp-1"
                        >
                          {slide.category}
                        </motion.p>
                      )}
                    </div>

                    {/* Active badge */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.25 }}
                          className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg"
                        >
                          {allSlides.filter(s => s.year === slide.year).findIndex(s => s === slide) + 1} / {allSlides.filter(s => s.year === slide.year).length}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Nav buttons */}
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Year pills ── */}
        <div className="flex justify-center gap-2 mb-6">
          {yearIndices.map(({ year, firstSlide }) => (
            <button
              key={year}
              onClick={() => goTo(firstSlide)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeYear === year
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div className="text-center text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{activeSlide + 1}</span>
          <span className="mx-1">/</span>
          <span>{total}</span>
        </div>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        selectedImage={selectedImage}
        onClose={handleClose}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />
    </section>
  );
};

export default Galeria;
