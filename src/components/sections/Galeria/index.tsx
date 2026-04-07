import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import BlurUpImage from "./BlurUpImage";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño, getMasterSlides } from "./data";
import type { ImageData } from "./types";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

/* ── Constants ── */
const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 50;

/* Fixed card dimensions per breakpoint (applied via CSS) */
const CARD_W_MOBILE = 260;
const CARD_W_SM = 300;
const CARD_W_MD = 340;
const CARD_H_MOBILE = 200;
const CARD_H_SM = 240;
const CARD_H_MD = 280;

/* ── Flyer Showcase Card ── */
interface FlyerCardProps {
  gallery: (typeof galeriasPorAño)[0];
  offset: number; // -2, -1, 0, 1, 2
  onClick: () => void;
  cardWidth: number;
}

const FlyerCard = ({ gallery, offset, onClick, cardWidth }: FlyerCardProps) => {
  const isActive = offset === 0;
  const absOffset = Math.abs(offset);

  const gap = 20;
  const x = offset * (cardWidth * 0.58 + gap);
  const scale = isActive ? 1 : Math.max(0.7, 1 - absOffset * 0.15);
  const opacity = isActive ? 1 : Math.max(0.45, 1 - absOffset * 0.28);
  const zIndex = 10 - absOffset;
  const rotateY = offset * -4;

  return (
    <motion.div
      animate={{
        x,
        scale,
        opacity,
        rotateY,
      }}
      transition={{ duration: 0.6, ease: EASE }}
      onClick={onClick}
      className="absolute left-1/2 top-1/2 cursor-pointer will-change-transform"
      style={{
        width: cardWidth,
        marginLeft: -cardWidth / 2,
        marginTop: "calc(-50%)", // vertically center
        zIndex,
        perspective: 1000,
        transformStyle: "preserve-3d",
        // Prevent filter animation glitches
        filter: isActive ? "grayscale(0)" : `grayscale(${absOffset * 25}%)`,
      }}
    >
      <div
        className={`
          relative w-full overflow-hidden rounded-2xl
          h-[${CARD_H_MOBILE}px] sm:h-[${CARD_H_SM}px] md:h-[${CARD_H_MD}px]
          transition-shadow duration-500
          ${isActive
            ? "shadow-2xl shadow-primary/30 ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
            : "shadow-lg"
          }
        `}
        style={{ height: "100%", aspectRatio: `${cardWidth}/${CARD_H_MD}` }}
      >
        <img
          src={gallery.hero}
          alt={`Edición ${gallery.year}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
          <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
            {gallery.year}
          </span>
          <p className="text-xs sm:text-sm text-white/80 leading-tight mt-1 line-clamp-1">
            {gallery.subtitle}
          </p>
          {gallery.description && isActive && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="text-[11px] text-white/60 mt-1 line-clamp-1"
            >
              {gallery.description}
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
              Viendo
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ── Main Gallery ── */
const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const activeYear = galeriasPorAño[activeIndex].year;

  const masterSlides = useMemo(() => getMasterSlides(galeriasPorAño), []);

  const imageSlides = useMemo(
    () =>
      masterSlides.filter(
        (s): s is ImageData & { type?: "image"; flyerId?: string } =>
          s.type !== "separator"
      ),
    [masterSlides]
  );

  const { slideYearMap, yearToSlideIndex } = useMemo(() => {
    const map: number[] = [];
    const yearIdx: Record<number, number> = {};
    let cur = galeriasPorAño[0].year;
    masterSlides.forEach((slide, i) => {
      if (slide.type === "separator") {
        cur = slide.year;
        yearIdx[slide.year] = i;
      }
      map[i] = cur;
    });
    return { slideYearMap: map, yearToSlideIndex: yearIdx };
  }, [masterSlides]);

  const activeGallery = galeriasPorAño[activeIndex];

  /* ── Navigation ── */
  const goTo = useCallback(
    (idx: number) => {
      const clamped =
        idx < 0
          ? galeriasPorAño.length - 1
          : idx >= galeriasPorAño.length
          ? 0
          : idx;
      setActiveIndex(clamped);
      // Sync image carousel
      const year = galeriasPorAño[clamped].year;
      const slideIdx = yearToSlideIndex[year];
      if (slideIdx !== undefined && swiperRef.current) {
        swiperRef.current.slideToLoop(slideIdx, 600);
      }
    },
    [yearToSlideIndex]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Autoplay: rotate flyers every 6 seconds, pause on hover
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % galeriasPorAño.length;
        const year = galeriasPorAño[next].year;
        const slideIdx = yearToSlideIndex[year];
        if (slideIdx !== undefined && swiperRef.current) {
          swiperRef.current.slideToLoop(slideIdx, 600);
        }
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, yearToSlideIndex]);

  // Swipe support for flyer showcase
  const handlePan = useCallback(
    (_: any, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) goNext();
      else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    },
    [goNext, goPrev]
  );

  // Sync from image carousel back to flyer showcase
  const handleSwiperSlideChange = useCallback(
    (swiper: SwiperType) => {
      const year = slideYearMap[swiper.realIndex];
      if (year) {
        const idx = galeriasPorAño.findIndex((g) => g.year === year);
        if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
      }
    },
    [slideYearMap, activeIndex]
  );

  /* ── Lightbox ── */
  const handleImageClick = useCallback(
    (imageIndex: number) => {
      setCurrentImageIndex(imageIndex);
      setSelectedImage(imageSlides[imageIndex]);
    },
    [imageSlides]
  );
  const handleClose = useCallback(() => setSelectedImage(null), []);
  const handlePrevImage = useCallback(() => {
    const n = currentImageIndex > 0 ? currentImageIndex - 1 : imageSlides.length - 1;
    setCurrentImageIndex(n);
    setSelectedImage(imageSlides[n]);
  }, [currentImageIndex, imageSlides]);
  const handleNextImage = useCallback(() => {
    const n = currentImageIndex < imageSlides.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(n);
    setSelectedImage(imageSlides[n]);
  }, [currentImageIndex, imageSlides]);

  // Visible flyer offsets: show active ± 2
  const visibleFlyers = useMemo(() => {
    const result: { gallery: (typeof galeriasPorAño)[0]; offset: number }[] = [];
    for (let off = -2; off <= 2; off++) {
      let idx = activeIndex + off;
      if (idx < 0) idx += galeriasPorAño.length;
      if (idx >= galeriasPorAño.length) idx -= galeriasPorAño.length;
      result.push({ gallery: galeriasPorAño[idx], offset: off });
    }
    return result;
  }, [activeIndex]);

  let imageCounter = -1;

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
            src={activeGallery.hero}
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

        {/* ── 3D Flyer Showcase ── */}
        <div
          className="relative mb-10 sm:mb-14"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel container — fixed height to prevent layout shifts */}
          <motion.div
            onPanEnd={handlePan}
            className="relative mx-auto overflow-hidden"
            style={{ height: 300 }}
          >
            {visibleFlyers.map(({ gallery, offset }) => (
              <FlyerCard
                key={gallery.year}
                gallery={gallery}
                offset={offset}
                cardWidth={CARD_W_MD}
                onClick={() => {
                  const idx = galeriasPorAño.findIndex((g) => g.year === gallery.year);
                  if (idx !== -1) goTo(idx);
                }}
              />
            ))}
          </motion.div>

          {/* Prev / Next buttons for flyer showcase */}
          <button
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Año anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-background/90 backdrop-blur-md rounded-full shadow-xl hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-300 border border-border/40"
            aria-label="Año siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── Year pills ── */}
        <div className="flex justify-center gap-2 mb-8">
          {galeriasPorAño.map((g, i) => (
            <button
              key={g.year}
              onClick={() => goTo(i)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                i === activeIndex
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {g.year}
            </button>
          ))}
        </div>

        {/* ── Unified image carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative px-2 sm:px-10 md:px-12"
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
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
            onSlideChange={handleSwiperSlideChange}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
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
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="h-[260px] sm:h-[320px] md:h-[380px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 border border-border/30 backdrop-blur-sm"
                    >
                      <div className="text-center px-6">
                        <div className="inline-block mb-3 px-6 py-2 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20">
                          <span className="text-3xl sm:text-4xl font-black text-primary">
                            {slide.year}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">
                          {slide.title}
                        </p>
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