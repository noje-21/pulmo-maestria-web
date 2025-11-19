import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import gallery1 from "@/assets/secion/maestria1.jpg";
import gallery12 from "@/assets/secion/maestria12.jpg";
import gallery13 from "@/assets/secion/maestria13.jpg";
import gallery14 from "@/assets/secion/maestria14.jpg";
import gallery15 from "@/assets/secion/maestria15.jpg";
import gallery16 from "@/assets/secion/maestria16.jpg";
import gallery2 from "@/assets/secion/maestria2.jpg";
import gallery22 from "@/assets/secion/maestria22.jpg";
import gallery23 from "@/assets/secion/maestria23.jpg";
import gallery24 from "@/assets/secion/maestria24.jpg";
import gallery25 from "@/assets/secion/maestria25.jpg";
import gallery26 from "@/assets/secion/maestria26.jpg";
import gallery3 from "@/assets/secion/maestria3.jpg";
import gallery32 from "@/assets/secion/maestria32.jpg";
import gallery33 from "@/assets/secion/maestria33.jpg";
import gallery34 from "@/assets/secion/maestria34.jpg";
import gallery35 from "@/assets/secion/maestria35.jpg";
import gallery36 from "@/assets/secion/maestria36.jpg";

interface YearGallery {
  year: string;
  images: string[];
  title: string;
  subtitle: string;
  description: string;
}

const galeriasPorAño: YearGallery[] = [
  {
    year: "2024",
    images: [gallery3, gallery32, gallery33, gallery34, gallery35, gallery36],
    title: "Sesiones Académicas 2024",
    subtitle: "Edición Especial",
    description: "Momentos destacados de nuestras sesiones más recientes"
  },
  {
    year: "2023",
    images: [gallery2, gallery22, gallery23, gallery24, gallery25, gallery26],
    title: "Sesiones Académicas 2023",
    subtitle: "Excelencia Académica",
    description: "Un año de aprendizaje y crecimiento profesional"
  },
  {
    year: "2022",
    images: [gallery1, gallery12, gallery13, gallery14, gallery15, gallery16],
    title: "Sesiones Académicas 2022",
    subtitle: "Inicios Inolvidables",
    description: "Los primeros pasos de nuestra comunidad académica"
  }
];

export const Galeria = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (image: string, images: string[], index: number) => {
    setCurrentImage(image);
    setCurrentImages(images);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % currentImages.length;
    setCurrentIndex(newIndex);
    setCurrentImage(currentImages[newIndex]);
  };

  const goToPrev = () => {
    const newIndex = currentIndex === 0 ? currentImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentImage(currentImages[newIndex]);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `sesion-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="galeria" className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Galería de Momentos
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recuerdos inolvidables de nuestras sesiones académicas a lo largo de los años
          </p>
        </motion.div>

        {/* Flyers por año */}
        {galeriasPorAño.map((yearGallery, yearIndex) => (
          <motion.div
            key={yearGallery.year}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: yearIndex * 0.2 }}
            className="mb-32 last:mb-0"
          >
            {/* Flyer Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 shadow-2xl shadow-primary/10 p-8 md:p-12">
              {/* Background texture */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 87, 87, 0.3) 0%, transparent 50%)',
                }}></div>
              </div>

              {/* Year Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
                className="absolute top-8 right-8 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-xl opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-primary to-accent text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                    <span className="relative">{yearGallery.year}</span>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                {/* Hero Section */}
                <div className="mb-12">
                  <motion.h3
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-4 text-primary"
                  >
                    {yearGallery.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-accent font-semibold mb-2"
                  >
                    {yearGallery.subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg"
                  >
                    {yearGallery.description}
                  </motion.p>
                </div>

                {/* Slider */}
                <Swiper
                  modules={[Autoplay, Navigation, Pagination, EffectFade]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={{
                    prevEl: `.swiper-button-prev-${yearGallery.year}`,
                    nextEl: `.swiper-button-next-${yearGallery.year}`,
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
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      effect: 'slide',
                    },
                    1024: {
                      slidesPerView: 3,
                      effect: 'slide',
                    },
                  }}
                  className="rounded-2xl"
                >
                  {yearGallery.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-primary/20"
                        onClick={() => openModal(image, yearGallery.images, index)}
                      >
                        <img
                          src={image}
                          alt={`Sesión ${yearGallery.year} - ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                          <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="font-bold text-lg">Sesión Académica</p>
                            <p className="text-accent text-sm">{yearGallery.year}</p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-primary font-semibold text-sm">Ver más</span>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    className={`swiper-button-prev-${yearGallery.year} w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center group`}
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    className={`swiper-button-next-${yearGallery.year} w-12 h-12 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center group`}
                  >
                    <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal fullscreen tipo Instagram */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-semibold">Descargar</span>
              </button>

              {/* Image */}
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={currentImage}
                alt="Imagen ampliada"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold">
                {currentIndex + 1} / {currentImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
