import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import BlurUpImage from "./BlurUpImage";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño, getMasterSlides } from "./data";
import type { ImageData, MasterSlide } from "./types";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/effect-coverflow";

const showcaseEasing = [0.22, 1, 0.36, 1] as const;

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeYear, setActiveYear] = useState<number>(galeriasPorAño[0].year);
  const swiperRef = useRef<SwiperType | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const masterSlides = useMemo(() => getMasterSlides(galeriasPorAño), []);

  const imageSlides = useMemo(
    () => masterSlides.filter((s): s is ImageData & { type?: "image"; flyerId?: string } => s.type !== "separator"),
    [masterSlides]
  );

  const { slideYearMap, yearToSlideIndex } = useMemo(() => {
    const map: number[] = [];
    const yearIdx: Record<number, number> = {};
    let currentYear = galeriasPorAño[0].year;
    masterSlides.forEach((slide, i) => {
      if (slide.type === "separator") {
        currentYear = slide.year;
        yearIdx[slide.year] = i;
      }
      map[i] = currentYear;
    });
    return { slideYearMap: map, yearToSlideIndex: yearIdx };
  }, [masterSlides]);

  // Active year's hero for dynamic background
  const activeGallery = useMemo(
    () => galeriasPorAño.find((g) => g.year === activeYear) ?? galeriasPorAño[0],
    [activeYear]
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const realIndex = swiper.realIndex;
      const year = slideYearMap[realIndex];
      if (year && year !== activeYear) setActiveYear(year);
    },
    [slideYearMap, activeYear]
  );

  const handleBannerClick = useCallback(
    (year: number) => {
      const slideIndex = yearToSlideIndex[year];
      if (slideIndex !== undefined && swiperRef.current) {
        swiperRef.current.slideToLoop(slideIndex, 600);
        setActiveYear(year);
      }
    },
    [yearToSlideIndex]
  );

  // Auto-scroll active banner into view
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeEl = container.querySelector(`[data-year="${activeYear}"]`) as HTMLElement | null;
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeYear]);

  const handleImageClick = useCallback(
    (imageIndex: number) => {
      setCurrentImageIndex(imageIndex);
      setSelectedImage(imageSlides[imageIndex]);
    },
    [imageSlides]
  );

  const handleClose = useCallback(() => setSelectedImage(null), []);

  const handlePrevImage = useCallback(() => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : imageSlides.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageSlides[newIndex]);
  }, [currentImageIndex, imageSlides]);

  const handleNextImage = useCallback(() => {
    const newIndex = currentImageIndex < imageSlides.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(imageSlides[newIndex]);
  }, [currentImageIndex, imageSlides]);

  let imageCounter = -1;

  return (
    <section id="galeria" className="relative py-20 overflow-hidden">
      {/* ── Dynamic blurred background ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeYear}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: showcaseEasing }}
          className="absolute inset-0 -z-10"
        >
          <img
            src={activeGallery.hero}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-[60px] opacity-30"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </motion.div>
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: showcaseEasing }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Galería de Momentos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revive los mejores momentos de cada año de formación
          </p>
        </motion.div>

        {/* ── Showcase horizontal scroll banners ── */}
        <div className="relative mb-12">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-2 -mx-2 scrollbar-hide"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {galeriasPorAño.map((gallery, i) => {
              const isActive = gallery.year === activeYear;
              return (
                <motion.div
                  key={gallery.year}
                  data-year={gallery.year}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: showcaseEasing }}
                  whileHover={{
                    scale: isActive ? 1.02 : 1.05,
                    rotateY: 3,
                    transition: { duration: 0.4, ease: showcaseEasing },
                  }}
                  onClick={() => handleBannerClick(gallery.year)}
                  className={`
                    relative flex-shrink-0 snap-center cursor-pointer
                    w-[260px] sm:w-[280px] md:w-[300px] h-[180px] sm:h-[200px]
                    rounded-2xl overflow-hidden
                    transition-all duration-500
                    ${isActive
                      ? "ring-2 ring-primary/80 ring-offset-2 ring-offset-background shadow-2xl shadow-primary/25 z-10"
                      : "opacity-60 grayscale-[60%] hover:opacity-80 hover:grayscale-0 shadow-lg"
                    }
                  `}
                  style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                >
                  <img
                    src={gallery.hero}
                    alt={`Edición ${gallery.year}`}
                    className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                      isActive ? "scale-105" : "group-hover:scale-105"
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <span className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
                      {gallery.year}
                    </span>
                    <p className="text-xs sm:text-sm text-white/80 leading-tight mt-0.5 line-clamp-1">
                      {gallery.subtitle}
                    </p>
                  </div>

                  {/* Active badge */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg"
                      >
                        Viendo
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Fade edges for scroll hint */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 md:hidden" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 md:hidden" />
        </div>

        {/* ── Year indicator pills ── */}
        <div className="flex justify-center gap-2 mb-8">
          {galeriasPorAño.map((g) => (
            <button
              key={g.year}
              onClick={() => handleBannerClick(g.year)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                g.year === activeYear
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {g.year}
            </button>
          ))}
        </div>

        {/* ── Unified carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: showcaseEasing }}
          className="relative px-2 sm:px-10 md:px-12"
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
            spaceBetween={14}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 22 },
              1280: { slidesPerView: 3, spaceBetween: 26 },
            }}
            navigation={{
              prevEl: ".swiper-prev-master",
              nextEl: ".swiper-next-master",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: ".swiper-pag-master",
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            loop={true}
            speed={600}
            grabCursor={true}
            className="pb-14"
          >
            {masterSlides.map((slide, index) => {
              if (slide.type === "separator") {
                return (
                  <SwiperSlide key={`sep-${slide.year}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: showcaseEasing }}
                      className="h-[260px] sm:h-[320px] md:h-[380px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 border border-border/30 backdrop-blur-sm"
                    >
                      <div className="text-center px-6">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.1, ease: showcaseEasing }}
                          className="inline-block mb-3 px-6 py-2 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20"
                        >
                          <span className="text-3xl sm:text-4xl font-black text-primary">{slide.year}</span>
                        </motion.div>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">{slide.title}</p>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              }

              imageCounter++;
              const imgIdx = imageCounter;
              return (
                <SwiperSlide key={`${slide.flyerId}-${index}`}>
                  <BlurUpImage
                    src={slide.src}
                    alt={slide.alt}
                    onClick={() => handleImageClick(imgIdx)}
                    className="h-[260px] sm:h-[320px] md:h-[380px]"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Nav buttons */}
          <button
            className="swiper-prev-master absolute left-0 sm:left-1 top-[45%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="swiper-next-master absolute right-0 sm:right-1 top-[45%] -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination */}
          <div className="swiper-pag-master flex justify-center gap-2 mt-3" />
        </motion.div>
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