import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Representative hero images from each year gallery
import img2022 from "@/assets/secion/maestria1.jpg";
import img2023 from "@/assets/secion/maestria2.jpg";
import img2024 from "@/assets/secion/maestria3.jpg";
import img2025a from "@/assets/secion/maestria_2025_13.jpg";
import img2025b from "@/assets/secion/maestria_2025_1.jpg";

interface FlyerSlide {
  src: string;
  label: string;
  subtitle: string;
  year: string;
}

const slides: FlyerSlide[] = [
  { src: img2022, label: "Los Cimientos", subtitle: "Donde todo comenzó", year: "2022" },
  { src: img2023, label: "Consolidación", subtitle: "Crecimiento exponencial", year: "2023" },
  { src: img2024, label: "Innovación", subtitle: "Nuevas fronteras clínicas", year: "2024" },
  { src: img2025a, label: "Excelencia", subtitle: "Impacto internacional", year: "2025" },
  { src: img2025b, label: "El Futuro", subtitle: "La próxima generación", year: "2026" },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const FlyersCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cardW, setCardW] = useState(340);

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

  // Scroll to center active card
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
      setActive(Math.max(0, Math.min(slides.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalW, cardW]);

  // Initial center
  useEffect(() => {
    setTimeout(() => scrollToIdx(0), 100);
  }, [scrollToIdx]);

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
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
          100 Años de Formación
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Cada edición marca un capítulo en la historia de la circulación pulmonar
        </p>
      </motion.div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing pb-8"
        style={{
          paddingLeft: `calc(50% - ${cardW / 2}px)`,
          paddingRight: `calc(50% - ${cardW / 2}px)`,
          gap: `${gap}px`,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <motion.div
              key={slide.year}
              className="snap-center flex-shrink-0"
              style={{ width: cardW }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              onClick={() => scrollToIdx(i)}
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
                {/* Image */}
                <img
                  src={slide.src}
                  alt={slide.label}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 pointer-events-none" />

                {/* Depth: side darkening for non-active */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500" />
                )}

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.6, y: isActive ? 0 : 8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="inline-block px-3 py-1 mb-2 bg-primary/25 backdrop-blur-sm rounded-full border border-primary/30">
                      <span className="text-xs font-bold text-primary-foreground tracking-wider">
                        {slide.year}
                      </span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 drop-shadow-lg">
                      {slide.label}
                    </h3>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.35 }}
                        className="text-sm text-white/70"
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Active ring */}
                {isActive && (
                  <motion.div
                    layoutId="flyer-ring"
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
      <div className="flex justify-center gap-2 mt-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            aria-label={`Ir a ${slides[i].label}`}
            className={`rounded-full transition-all duration-400 ${
              i === active
                ? "w-8 h-2.5 bg-primary shadow-md shadow-primary/30"
                : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Timeline connector */}
      <div className="hidden sm:flex justify-center mt-8 px-8">
        <div className="flex items-center gap-0 max-w-xl w-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex items-center flex-1">
              <button
                onClick={() => scrollToIdx(i)}
                className={`relative z-10 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                  i === active
                    ? "bg-primary border-primary scale-125 shadow-lg shadow-primary/40"
                    : i < active
                    ? "bg-primary/60 border-primary/60"
                    : "bg-muted border-border hover:border-primary/40"
                }`}
              />
              {i < slides.length - 1 && (
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

      {/* Year labels under timeline */}
      <div className="hidden sm:flex justify-center mt-1 px-8">
        <div className="flex items-center max-w-xl w-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex-1 first:text-left last:text-right text-center">
              <span
                className={`text-xs font-semibold transition-colors duration-300 ${
                  i === active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {slide.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
};

export default FlyersCarousel;
