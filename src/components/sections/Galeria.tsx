import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

/**
 * GalleryImage — optimized for mobile:
 * - No whileHover (irrelevant on touch, wastes listeners)
 * - No scale animation on mount (avoids layout recalculation)
 * - CSS-only hover for desktop via group classes
 * - img loading="lazy" with decoding="async"
 */
const GalleryImage = memo(function GalleryImage({
  src,
  alt,
  onClick,
  className = "",
}: {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        draggable={false}
      />
      {/* CSS-only overlay — zero JS cost */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
        <p className="text-white font-semibold text-sm line-clamp-2">{alt}</p>
      </div>
    </div>
  );
});

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

        {/* Year galleries — reduced spacing (was space-y-24) */}
        <div className="space-y-16">
          {galeriasPorAño.map((gallery, galleryIndex) => (
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
                      <GalleryImage
                        src={image.src}
                        alt={image.alt}
                        onClick={() => handleImageClick(gallery, index)}
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
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/96 backdrop-blur-2xl z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, type: "spring", damping: 30, stiffness: 320 }}
              className="relative max-w-7xl max-h-[95vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  loading="eager"
                  decoding="sync"
                  draggable={false}
                />
              </div>

              {/* Controls top-right */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2">
                <Button
                  onClick={handleDownload}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-xl w-10 h-10 sm:w-12 sm:h-12"
                  aria-label="Descargar imagen"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  onClick={handleClose}
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-background/95 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 shadow-xl w-10 h-10 sm:w-12 sm:h-12"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Prev / Next */}
              <Button
                onClick={handlePrevImage}
                size="icon"
                variant="secondary"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-xl w-11 h-11 sm:w-14 sm:h-14"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              </Button>
              <Button
                onClick={handleNextImage}
                size="icon"
                variant="secondary"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-xl w-11 h-11 sm:w-14 sm:h-14"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
              </Button>

              {/* Caption */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-center max-w-[90%] sm:max-w-2xl">
                <p className="text-white text-sm sm:text-base font-semibold bg-black/70 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full border border-white/10 shadow-2xl">
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
