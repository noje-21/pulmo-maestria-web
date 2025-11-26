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
    title: "Programa Académico 2024",
    subtitle: "Innovación en Circulación Pulmonar",
    description: "Avances en hemodinamia y cateterismo cardiaco derecho",
    hero: gallery3,
    images: [
      { src: gallery1, alt: "Evaluación Hemodinámica Avanzada", category: "Hemodinamia" },
      { src: gallery12, alt: "Técnicas de Cateterismo Derecho", category: "Procedimientos" },
      { src: gallery13, alt: "Análisis de Casos Complejos", category: "Casos Clínicos" },
      { src: gallery14, alt: "Fisiopatología de la Circulación Pulmonar", category: "Bases Teóricas" },
      { src: gallery15, alt: "Interpretación de Estudios Hemodinámicos", category: "Diagnóstico" },
      { src: gallery16, alt: "Actualización en Hipertensión Pulmonar", category: "Formación Continua" },
    ],
  },
  {
    year: 2023,
    title: "Programa Académico 2023",
    subtitle: "Consolidación del Conocimiento",
    description: "Diagnóstico y manejo de patologías cardiopulmonares",
    hero: gallery2,
    images: [
      { src: gallery2, alt: "Monitorización Cardiorrespiratoria en UCI", category: "Cuidados Críticos" },
      { src: gallery22, alt: "Ecocardiografía Transesofágica", category: "Imagenología" },
      { src: gallery23, alt: "Manejo Invasivo del Shock Cardiogénico", category: "Emergencias" },
      { src: gallery24, alt: "Valoración del Ventrículo Derecho", category: "Función Ventricular" },
      { src: gallery25, alt: "Estratificación de Riesgo Cardiovascular", category: "Evaluación Clínica" },
      { src: gallery26, alt: "Simposio de Cardiología Intervencionista", category: "Congresos" },
    ],
  },
  {
    year: 2022,
    title: "Programa Académico 2022",
    subtitle: "Bases en Cardiología Avanzada",
    description: "Fundamentos de la circulación pulmonar y hemodinámica",
    hero: gallery1,
    images: [
      { src: gallery3, alt: "Introducción a la Hemodinamia", category: "Fundamentos" },
      { src: gallery32, alt: "Anatomía y Fisiología del Corazón Derecho", category: "Bases Anatómicas" },
      { src: gallery33, alt: "Electrocardiografía en Patología Pulmonar", category: "Electrocardiografía" },
      { src: gallery34, alt: "Pruebas de Función Respiratoria", category: "Diagnóstico Funcional" },
      { src: gallery35, alt: "Metodología de Investigación Clínica", category: "Investigación" },
      { src: gallery36, alt: "Ceremonia de Apertura Académica", category: "Eventos Institucionales" },
    ],
  },
];

// Memoized image component with professional medical aesthetic
const GalleryImage = memo(
  ({ src, alt, onClick, className = "" }: { src: string; alt: string; onClick: () => void; className?: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-white font-semibold text-sm md:text-base line-clamp-2">{alt}</p>
      </div>
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
              {/* Hero Section - Professional Medical Style */}
              <div className="relative h-[350px] sm:h-[450px] md:h-[550px] rounded-3xl overflow-hidden mb-12 group">
                <motion.img
                  src={gallery.hero}
                  alt={`Hero ${gallery.year}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-center max-w-4xl"
                  >
                    <motion.div
                      className="inline-block mb-4 sm:mb-6 px-6 sm:px-8 py-2 sm:py-3 bg-primary/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--primary), 0.3)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">{gallery.year}</span>
                    </motion.div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight leading-tight">{gallery.title}</h3>
                    <p className="text-lg sm:text-xl md:text-2xl font-light mb-2 text-white/90">{gallery.subtitle}</p>
                    <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-4">{gallery.description}</p>
                  </motion.div>
                </div>
              </div>

              {/* Professional Carousel with Fade + Zoom Animation */}
              <div className="relative px-4 sm:px-8 md:px-12">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                    1280: { slidesPerView: 3, spaceBetween: 28 },
                  }}
                  navigation={{
                    prevEl: `.swiper-button-prev-${gallery.year}`,
                    nextEl: `.swiper-button-next-${gallery.year}`,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    el: `.swiper-pagination-${gallery.year}`,
                  }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={true}
                  speed={800}
                  effect="slide"
                  className="pb-16"
                  onSwiper={(swiper: SwiperType) => {
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
                    <SwiperSlide key={index} className="transition-opacity duration-500">
                      <GalleryImage
                        src={image.src}
                        alt={image.alt}
                        onClick={() => handleImageClick(gallery, index)}
                        className="h-[280px] sm:h-[340px] md:h-[400px]"
                      />
                      {image.category && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 text-center"
                        >
                          <span className="inline-block px-4 py-1.5 text-xs sm:text-sm font-semibold bg-primary/15 text-primary rounded-full border border-primary/20 shadow-sm">
                            {image.category}
                          </span>
                        </motion.div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Professional Navigation Controls */}
                <button
                  className={`swiper-button-prev-${gallery.year} absolute left-0 sm:left-2 top-[40%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 border border-border/50`}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>
                <button
                  className={`swiper-button-next-${gallery.year} absolute right-0 sm:right-2 top-[40%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-background/95 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 border border-border/50`}
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </button>

                {/* Custom Pagination Dots */}
                <div className={`swiper-pagination-${gallery.year} flex justify-center gap-2 mt-2`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Professional Medical Modal with Smooth Animations */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/96 backdrop-blur-2xl z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", damping: 28, stiffness: 300 }}
              className="relative max-w-7xl max-h-[95vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container with Fade + Zoom */}
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  loading="eager"
                  draggable={false}
                />
              </motion.div>

              {/* Professional Controls */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2"
              >
                <Button
                  onClick={handleDownload}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-xl w-10 h-10 sm:w-12 sm:h-12"
                  aria-label="Descargar imagen"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  onClick={handleClose}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/95 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-110 shadow-xl w-10 h-10 sm:w-12 sm:h-12"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>

              {/* Smooth Navigation */}
              <Button
                onClick={handlePrevImage}
                size="icon"
                variant="secondary"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </Button>
              <Button
                onClick={handleNextImage}
                size="icon"
                variant="secondary"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </Button>

              {/* Professional Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-center max-w-[90%] sm:max-w-2xl"
              >
                <p className="text-white text-sm sm:text-base md:text-lg font-semibold bg-black/70 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 shadow-2xl">
                  {selectedImage.alt}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria;
