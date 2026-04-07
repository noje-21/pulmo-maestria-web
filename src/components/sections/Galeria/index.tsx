import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import BlurUpImage from "./BlurUpImage";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño, getMasterSlides } from "./data";
import type { ImageData, YearGallery } from "./types";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const masterSlides = useMemo(() => getMasterSlides(galeriasPorAño), []);

  // Build a fake YearGallery for the lightbox navigation
  const masterGallery = useMemo<YearGallery>(
    () => ({
      year: 0,
      title: "",
      subtitle: "",
      description: "",
      hero: "",
      images: masterSlides,
    }),
    [masterSlides]
  );

  const handleImageClick = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      setSelectedImage(masterSlides[index]);
    },
    [masterSlides]
  );

  const handleClose = useCallback(() => setSelectedImage(null), []);

  const handlePrevImage = useCallback(() => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : masterSlides.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(masterSlides[newIndex]);
  }, [currentImageIndex, masterSlides]);

  const handleNextImage = useCallback(() => {
    const newIndex = currentImageIndex < masterSlides.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(masterSlides[newIndex]);
  }, [currentImageIndex, masterSlides]);

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
            loop={true}
            speed={480}
            grabCursor={true}
            className="pb-14"
          >
            {masterSlides.map((image, index) => (
              <SwiperSlide key={`${image.flyerId}-${index}`}>
                <BlurUpImage
                  src={image.src}
                  alt={image.alt}
                  onClick={() => handleImageClick(index)}
                  className="h-[240px] sm:h-[300px] md:h-[360px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nav buttons */}
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

          {/* Pagination dots */}
          <div className="swiper-pag-master flex justify-center gap-2 mt-2" />
        </motion.div>
      </div>

      {/* Lightbox modal */}
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
