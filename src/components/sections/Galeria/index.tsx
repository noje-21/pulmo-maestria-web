import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryLightbox from "./GalleryLightbox";
import FilmStrip from "./FilmStrip";
import AnimatedGalleryYear from "./AnimatedGalleryYear";
import { galeriasPorAño } from "./data";
import type { ImageData, YearGallery } from "./types";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface GaleriaProps {
  galleries?: YearGallery[];
}

const Galeria = ({ galleries }: GaleriaProps = {}) => {
  const data = useMemo(
    () => (galleries ?? galeriasPorAño).map((g) => ({ ...g, images: [...g.images] })),
    [galleries]
  );

  // Film strip popup state
  const [openYear, setOpenYear] = useState<number | null>(null);

  // Lightbox state
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<ImageData[]>([]);

  // Click image in grid → open film strip popup for that year at that image
  const handleImageClick = useCallback(
    (gallery: YearGallery, index: number) => {
      setLightboxImages(gallery.images);
      setCurrentImageIndex(index);
      setSelectedImage(gallery.images[index]);
    },
    []
  );

  // Click year header → open film strip
  const handleYearClick = useCallback((year: number) => {
    setOpenYear((prev) => (prev === year ? null : year));
  }, []);

  // Film strip image click → open lightbox
  const handleFilmImageClick = useCallback(
    (img: ImageData, imgIdx: number) => {
      const yearData = data.find((g) => g.year === openYear);
      if (!yearData) return;
      setLightboxImages(yearData.images);
      setCurrentImageIndex(imgIdx);
      setSelectedImage(img);
    },
    [data, openYear]
  );

  // Lightbox nav
  const handleClose = useCallback(() => setSelectedImage(null), []);
  const handlePrevImage = useCallback(() => {
    const n = currentImageIndex > 0 ? currentImageIndex - 1 : lightboxImages.length - 1;
    setCurrentImageIndex(n);
    setSelectedImage(lightboxImages[n]);
  }, [currentImageIndex, lightboxImages]);
  const handleNextImage = useCallback(() => {
    const n = currentImageIndex < lightboxImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(n);
    setSelectedImage(lightboxImages[n]);
  }, [currentImageIndex, lightboxImages]);

  return (
    <section id="galeria" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            Una historia de excelencia
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-4">
            Galería de Momentos
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Revive cada edición a través de imágenes que capturan la esencia de nuestra formación
          </p>
        </motion.div>

        {/* Year sections with staggered grids */}
        {data.map((gallery) => (
          <AnimatedGalleryYear
            key={gallery.year}
            gallery={gallery}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* Film strip popup */}
      <AnimatePresence>
        {openYear !== null && (
          <FilmStrip
            key={openYear}
            images={data.find((g) => g.year === openYear)?.images || []}
            year={openYear}
            title={data.find((g) => g.year === openYear)?.title || ""}
            onClose={() => setOpenYear(null)}
            onImageClick={handleFilmImageClick}
          />
        )}
      </AnimatePresence>

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
