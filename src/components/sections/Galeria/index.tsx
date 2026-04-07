import { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import BlurUpImage from "./BlurUpImage";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño, getMasterSlides } from "./data";
import type { ImageData, YearGallery, MasterSlide } from "./types";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeYear, setActiveYear] = useState<number>(galeriasPorAño[0].year);

  const masterSlides = useMemo(() => getMasterSlides(galeriasPorAño), []);

  const imageSlides = useMemo(
    () => masterSlides.filter((s): s is ImageData & { type?: "image"; flyerId?: string } => s.type !== "separator"),
    [masterSlides]
  );

  // Build a map: slide index → year
  const slideYearMap = useMemo(() => {
    const map: number[] = [];
    let currentYear = galeriasPorAño[0].year;
    masterSlides.forEach((slide, i) => {
      if (slide.type === "separator") currentYear = slide.year;
      map[i] = currentYear;
    });
    return map;
  }, [masterSlides]);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      const realIndex = swiper.realIndex;
      const year = slideYearMap[realIndex];
      if (year && year !== activeYear) setActiveYear(year);
    },
    [slideYearMap, activeYear]
  );

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
    <section id="galeria" className="py-20 px-4 md:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Galería de Momentos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revive los mejores momentos de cada año de formación
          </p>
        </motion.div>

        {/* Hero banners grid — active year highlighted */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {galeriasPorAño.map((gallery, i) => {
            const isActive = gallery.year === activeYear;
            return (
              <motion.div
                key={gallery.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative h-[160px] sm:h-[200px] rounded-2xl overflow-hidden group transition-all duration-500 ${
                  isActive
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.03] shadow-lg shadow-primary/20"
                    : "opacity-50 grayscale hover:opacity-70 hover:grayscale-0"
                }`}
              >
                <img
                  src={gallery.hero}
                  alt={`Edición ${gallery.year}`}
                  className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  <span className="text-2xl sm:text-3xl font-black">{gallery.year}</span>
                  <p className="text-xs sm:text-sm text-white/80 leading-tight mt-0.5">{gallery.subtitle}</p>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Viendo
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Single unified carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative px-4 sm:px-10 md:px-12"
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
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={handleSlideChange}
            loop={true}
            speed={480}
            grabCursor={true}
            className="pb-14"
          >
            {masterSlides.map((slide, index) => {
              if (slide.type === "separator") {
                return (
                  <SwiperSlide key={`sep-${slide.year}`}>
                    <div className="h-[240px] sm:h-[300px] md:h-[360px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 border border-border/30">
                      <div className="text-center px-6">
                        <div className="inline-block mb-3 px-5 py-1.5 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/20">
                          <span className="text-3xl sm:text-4xl font-black text-primary">{slide.year}</span>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">{slide.title}</p>
                      </div>
                    </div>
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
                    className="h-[240px] sm:h-[300px] md:h-[360px]"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            className="swiper-prev-master absolute left-0 sm:left-1 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-200 border border-border/50"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="swiper-next-master absolute right-0 sm:right-1 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-200 border border-border/50"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="swiper-pag-master flex justify-center gap-2 mt-2" />
        </motion.div>
      </div>

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
