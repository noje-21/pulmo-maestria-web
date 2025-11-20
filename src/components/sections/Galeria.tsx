import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Optimized image imports
import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery2 from "@/assets/secion/maestria2.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery16 from "@/assets/secion/maestria16.jpg";
import gallery22 from "@/assets/secion/maestria22.jpg";
import gallery23 from "@/assets/secion/maestria23.jpg";
import gallery24 from "@/assets/secion/maestria24.jpg";
import gallery25 from "@/assets/secion/maestria25.jpg";
import gallery26 from "@/assets/secion/maestria26.jpg";
import gallery32 from "@/assets/secion/maestria32.jpg";
import gallery33 from "@/assets/secion/maestria33.jpg";
import gallery34 from "@/assets/secion/maestria34.jpg";
import gallery35 from "@/assets/secion/maestria35.jpg";
import gallery36 from "@/assets/secion/maestria36.jpg";

interface ImageData {
  src: string;
  alt: string;
  category?: string;
}

interface YearGallery {
  year: number;
  title: string;
  subtitle: string;
  description: string;
  hero: string;
  images: ImageData[];
}

const galeriasPorAño: YearGallery[] = [
  {
    year: 2024,
    title: "Sesiones 2024",
    subtitle: "Innovación y Excelencia",
    description: "Un año de aprendizaje intensivo y casos clínicos destacados",
    hero: gallery3,
    images: [
      { src: gallery1, alt: "Maestría 2024 - Sesión 1", category: "Clases presenciales" },
      { src: gallery12, alt: "Maestría 2024 - Sesión 2", category: "Workshops" },
      { src: gallery13, alt: "Maestría 2024 - Sesión 3", category: "Casos clínicos" },
      { src: gallery14, alt: "Maestría 2024 - Sesión 4", category: "Clases presenciales" },
      { src: gallery15, alt: "Maestría 2024 - Sesión 5", category: "Workshops" },
      { src: gallery16, alt: "Maestría 2024 - Sesión 6", category: "Backstage" },
    ],
  },
  {
    year: 2023,
    title: "Sesiones 2023",
    subtitle: "Crecimiento y Desarrollo",
    description: "Consolidando conocimientos y experiencias clínicas",
    hero: gallery2,
    images: [
      { src: gallery2, alt: "Maestría 2023 - Sesión 1", category: "Clases presenciales" },
      { src: gallery22, alt: "Maestría 2023 - Sesión 2", category: "Workshops" },
      { src: gallery23, alt: "Maestría 2023 - Sesión 3", category: "Casos clínicos" },
      { src: gallery24, alt: "Maestría 2023 - Sesión 4", category: "Clases presenciales" },
      { src: gallery25, alt: "Maestría 2023 - Sesión 5", category: "Workshops" },
      { src: gallery26, alt: "Maestría 2023 - Sesión 6", category: "Backstage" },
    ],
  },
  {
    year: 2022,
    title: "Sesiones 2022",
    subtitle: "Fundamentos y Bases",
    description: "Comenzando el viaje hacia la excelencia profesional",
    hero: gallery1,
    images: [
      { src: gallery3, alt: "Maestría 2022 - Sesión 1", category: "Clases presenciales" },
      { src: gallery32, alt: "Maestría 2022 - Sesión 2", category: "Workshops" },
      { src: gallery33, alt: "Maestría 2022 - Sesión 3", category: "Casos clínicos" },
      { src: gallery34, alt: "Maestría 2022 - Sesión 4", category: "Clases presenciales" },
      { src: gallery35, alt: "Maestría 2022 - Sesión 5", category: "Workshops" },
      { src: gallery36, alt: "Maestría 2022 - Sesión 6", category: "Backstage" },
    ],
  },
];

// Memoized image component for performance
const GalleryImage = memo(
  ({ src, alt, onClick, className = "" }: { src: string; alt: string; onClick: () => void; className?: string }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  ),
);

GalleryImage.displayName = "GalleryImage";

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState<YearGallery | null>(null);

  const handleImageClick = useCallback((gallery: YearGallery, index: number) => {
    setCurrentYear(gallery);
    setCurrentImageIndex(index);
    setSelectedImage(gallery.images[index]);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    setCurrentYear(null);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (!currentYear) return;
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentYear.images.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentYear.images[newIndex]);
  }, [currentImageIndex, currentYear]);

  const handleNextImage = useCallback(() => {
    if (!currentYear) return;
    const newIndex = currentImageIndex < currentYear.images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentYear.images[newIndex]);
  }, [currentImageIndex, currentYear]);

  const handleDownload = useCallback(() => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage.src;
    link.download = selectedImage.alt || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedImage]);

  return (
    <section id="galeria" className="py-24 px-4 md:px-8 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Galería de Momentos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revive los mejores momentos de cada año de formación
          </p>
        </motion.div>

        <div className="space-y-24">
          {galeriasPorAño.map((gallery, galleryIndex) => (
            <motion.div
              key={gallery.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: galleryIndex * 0.1 }}
              className="relative"
            >
              {/* Hero Section */}
              <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 group">
                <img
                  src={gallery.hero}
                  alt={`Hero ${gallery.year}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center"
                  >
                    <motion.div
                      className="inline-block mb-6 px-8 py-3 bg-primary/20 backdrop-blur-xl rounded-full border border-white/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-6xl font-black tracking-tight">{gallery.year}</span>
                    </motion.div>
                    <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{gallery.title}</h3>
                    <p className="text-xl md:text-2xl font-light mb-2 text-white/90">{gallery.subtitle}</p>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">{gallery.description}</p>
                  </motion.div>
                </div>
              </div>

              {/* Optimized Swiper Slider */}
              <div className="relative px-12">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                  }}
                  navigation={{
                    prevEl: `.swiper-button-prev-${gallery.year}`,
                    nextEl: `.swiper-button-next-${gallery.year}`,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={true}
                  speed={600}
                  className="pb-12"
                  onSwiper={(swiper: SwiperType) => {
                    // Preload next/prev slides
                    swiper.on("slideChange", () => {
                      const nextSlide = swiper.slides[swiper.activeIndex + 1];
                      const prevSlide = swiper.slides[swiper.activeIndex - 1];
                      [nextSlide, prevSlide].forEach((slide) => {
                        if (slide) {
                          const img = slide.querySelector("img");
                          if (img && !img.complete) {
                            img.loading = "eager";
                          }
                        }
                      });
                    });
                  }}
                >
                  {gallery.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <GalleryImage
                        src={image.src}
                        alt={image.alt}
                        onClick={() => handleImageClick(gallery, index)}
                        className="h-[300px] md:h-[400px]"
                      />
                      {image.category && (
                        <div className="mt-3 text-center">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {image.category}
                          </span>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button
                  className={`swiper-button-prev-${gallery.year} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className={`swiper-button-next-${gallery.year} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optimized Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="relative flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  loading="eager"
                  draggable={false}
                />
              </div>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  onClick={handleDownload}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleClose}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/90 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation */}
              <Button
                onClick={handlePrevImage}
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all w-14 h-14"
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                onClick={handleNextImage}
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all w-14 h-14"
              >
                <ChevronRight className="w-7 h-7" />
              </Button>

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <p className="text-white text-lg font-medium bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                  {selectedImage.alt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria;
