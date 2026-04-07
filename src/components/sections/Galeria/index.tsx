import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryLightbox from "./GalleryLightbox";
import FilmStrip from "./FilmStrip";
import { galeriasPorAño } from "./data";
import type { ImageData, YearGallery } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface GaleriaProps {
  galleries?: YearGallery[];
}

const YEAR_LABELS: Record<number, { label: string; subtitle: string }> = {
  2022: { label: "Los Cimientos", subtitle: "Donde todo comenzó" },
  2023: { label: "Consolidación", subtitle: "Crecimiento exponencial" },
  2024: { label: "Innovación", subtitle: "Nuevas fronteras clínicas" },
  2025: { label: "Excelencia", subtitle: "Impacto internacional" },
};

const Galeria = ({ galleries }: GaleriaProps = {}) => {
  const data = useMemo(
    () => (galleries ?? galeriasPorAño).map((g) => ({ ...g, images: [...g.images] })),
    [galleries]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [cardW, setCardW] = useState(340);

  // Lightbox state
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<ImageData[]>([]);

  // Responsive card width
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setCardW(vw < 640 ? 280 : vw < 1024 ? 320 : 380);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const gap = 24;
  const totalW = cardW + gap;

  const scrollToIdx = useCallback(
    (i: number) => {
      const container = scrollRef.current;
      if (!container) return;
      const containerW = container.clientWidth;
      const target = i * totalW - (containerW / 2 - cardW / 2);
      container.scrollTo({ left: target, behavior: "smooth" });
      setActive(i);
    },
    [totalW, cardW]
  );

  // Track scroll to update active
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const containerW = el.clientWidth;
      const center = el.scrollLeft + containerW / 2;
      const idx = Math.round((center - cardW / 2) / totalW);
      setActive(Math.max(0, Math.min(data.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalW, cardW, data.length]);

  useEffect(() => {
    setTimeout(() => scrollToIdx(0), 100);
  }, [scrollToIdx]);

  // Click year card → toggle film strip
  const handleYearClick = useCallback(
    (i: number) => {
      if (i === active) {
        setOpenYear((prev) => (prev === data[i].year ? null : data[i].year));
      } else {
        scrollToIdx(i);
      }
    },
    [active, data, scrollToIdx]
  );

  // Film strip image click → open lightbox
  const handleFilmImageClick = useCallback(
    (yearIdx: number, img: ImageData, imgIdx: number) => {
      setLightboxImages(data[yearIdx].images);
      setCurrentImageIndex(imgIdx);
      setSelectedImage(img);
    },
    [data]
  );

  // Lightbox nav
  const handleClose = useCallback(() => setSelectedImage(null), []);
  const handlePrevImage = useCallback(() => {
    const n = currentImageIndex > 0 ? currentImageIndex - 1 : lightboxImages.length - 1;
    setCurrentImageIndex(n);
    setSelectedImage(lightboxImages[n]);
  }, [currentImageIndex, lightboxImages]);
  const handleNextImage = useCallback(() => {
    const n = currentImageIndex < lightboxImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(n);
    setSelectedImage(lightboxImages[n]);
  }, [currentImageIndex, lightboxImages]);

  // Dynamic background from active year
  const activeHero = data[active]?.hero;

  return (
    <section id="galeria" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Dynamic blurred background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={data[active]?.year}
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
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-[60px] opacity-20"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 sm:mb-14 px-4"
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-2">
            Una historia de excelencia
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-3">
            Galería de Momentos
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Haz clic en un año para explorar todas sus fotos
          </p>
        </motion.div>

        {/* Year cards carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-6 cursor-grab active:cursor-grabbing"
          style={{
            paddingLeft: `calc(50% - ${cardW / 2}px)`,
            paddingRight: `calc(50% - ${cardW / 2}px)`,
            gap: `${gap}px`,
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {data.map((g, i) => {
            const isActive = i === active;
            const isOpen = openYear === g.year;
            const labels = YEAR_LABELS[g.year] || { label: g.title, subtitle: g.subtitle };
            return (
              <motion.div
                key={g.year}
                className="snap-center flex-shrink-0"
                style={{ width: cardW }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                onClick={() => handleYearClick(i)}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.88,
                    opacity: isActive ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  whileHover={{ scale: isActive ? 1.03 : 0.92 }}
                  className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer group"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={g.hero}
                    alt={g.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 pointer-events-none" />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500" />
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.6, y: isActive ? 0 : 8 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <span className="inline-block px-3 py-1 mb-2 bg-primary/25 backdrop-blur-sm rounded-full border border-primary/30">
                        <span className="text-xs font-bold text-primary-foreground tracking-wider">
                          Programa Académico
                        </span>
                      </span>
                      <span className="block text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
                        {g.year}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {labels.label}
                      </h3>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.35 }}
                          className="text-sm text-white/70 mt-0.5"
                        >
                          {labels.subtitle}
                        </motion.p>
                      )}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 text-xs font-medium"
                        >
                          <span>{isOpen ? "▲ Cerrar" : "▼ Ver"} {g.images.length} fotos</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Active ring */}
                  {isActive && (
                    <motion.div
                      layoutId="year-ring"
                      className="absolute inset-0 rounded-2xl ring-2 ring-primary/60 ring-offset-2 ring-offset-background pointer-events-none"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-2">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIdx(i)}
              aria-label={`Ir a ${data[i].year}`}
              className={`rounded-full transition-all duration-400 ${
                i === active
                  ? "w-8 h-2.5 bg-primary shadow-md shadow-primary/30"
                  : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Timeline */}
        <div className="hidden sm:flex justify-center mt-6 px-8">
          <div className="flex items-center gap-0 max-w-xl w-full">
            {data.map((g, i) => (
              <div key={i} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    scrollToIdx(i);
                    setOpenYear(g.year);
                  }}
                  className={`relative z-10 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                    i === active
                      ? "bg-primary border-primary scale-125 shadow-lg shadow-primary/40"
                      : i < active
                      ? "bg-primary/60 border-primary/60"
                      : "bg-muted border-border hover:border-primary/40"
                  }`}
                />
                {i < data.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-500 ${
                      i < active ? "bg-primary/50" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex justify-center mt-1 px-8 mb-6">
          <div className="flex items-center max-w-xl w-full">
            {data.map((g, i) => (
              <div key={i} className="flex-1 first:text-left last:text-right text-center">
                <span
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    i === active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {g.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Film strip expansion */}
        <AnimatePresence>
          {openYear !== null && (
            <FilmStrip
              key={openYear}
              images={data.find((g) => g.year === openYear)?.images || []}
              year={openYear}
              title={data.find((g) => g.year === openYear)?.title || ""}
              onClose={() => setOpenYear(null)}
              onImageClick={(img, imgIdx) => {
                const yearIdx = data.findIndex((g) => g.year === openYear);
                if (yearIdx >= 0) handleFilmImageClick(yearIdx, img, imgIdx);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        selectedImage={selectedImage}
        onClose={handleClose}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />

      <style>{`.snap-x::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default Galeria;
