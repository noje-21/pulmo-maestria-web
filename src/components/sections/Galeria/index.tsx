import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import GalleryYearSection from "./GalleryYearSection";
import GalleryLightbox from "./GalleryLightbox";
import { galeriasPorAño } from "./data";
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

        {/* Year galleries */}
        <div className="space-y-16">
          {galeriasPorAño.map((gallery, galleryIndex) => (
            <GalleryYearSection
              key={gallery.year}
              gallery={gallery}
              galleryIndex={galleryIndex}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
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
