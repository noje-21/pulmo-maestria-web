import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import BlurUpImage from "./BlurUpImage";
import type { YearGallery } from "./types";

interface GalleryYearSectionProps {
  gallery: YearGallery;
  galleryIndex: number;
  onImageClick: (gallery: YearGallery, index: number) => void;
}

const GalleryYearSection = memo(function GalleryYearSection({
  gallery,
  galleryIndex,
  onImageClick,
}: GalleryYearSectionProps) {
  return (
    <motion.div
      key={gallery.year}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: galleryIndex * 0.08 }}
      className="relative"
    >
      {/* Hero banner — CSS Ken Burns via animation class, no JS */}
      <div className="relative h-[280px] sm:h-[380px] md:h-[480px] rounded-3xl overflow-hidden mb-10 group">
        <img
          src={gallery.hero}
          alt={`Edición ${gallery.year}`}
          className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 md:p-8">
          <div className="text-center max-w-4xl">
            <div className="inline-block mb-4 px-6 py-2 bg-primary/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{gallery.year}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight">
              {gallery.title}
            </h3>
            <p className="text-base sm:text-lg font-light mb-1 text-white/90">{gallery.subtitle}</p>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto px-4">
              {gallery.description}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative px-4 sm:px-10 md:px-12">
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
            prevEl: `.swiper-prev-${gallery.year}`,
            nextEl: `.swiper-next-${gallery.year}`,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: `.swiper-pag-${gallery.year}`,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={480}
          grabCursor={true}
          className="pb-14"
        >
          {gallery.images.map((image, index) => (
            <SwiperSlide key={index}>
              <BlurUpImage
                src={image.src}
                alt={image.alt}
                onClick={() => onImageClick(gallery, index)}
                className="h-[240px] sm:h-[300px] md:h-[360px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nav buttons */}
        <button
          className={`swiper-prev-${gallery.year} absolute left-0 sm:left-1 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-200 border border-border/50`}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className={`swiper-next-${gallery.year} absolute right-0 sm:right-1 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-90 transition-all duration-200 border border-border/50`}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination dots */}
        <div className={`swiper-pag-${gallery.year} flex justify-center gap-2 mt-2`} />
      </div>
    </motion.div>
  );
});

export default GalleryYearSection;
