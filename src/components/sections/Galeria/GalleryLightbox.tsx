import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImageData } from "./types";

interface GalleryLightboxProps {
  selectedImage: ImageData | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const GalleryLightbox = memo(function GalleryLightbox({
  selectedImage,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  return (
    <AnimatePresence mode="wait">
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/96 backdrop-blur-2xl z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
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
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <Button
                onClick={onClose}
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
              onClick={onPrev}
              size="icon"
              variant="secondary"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/95 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-95 shadow-xl w-11 h-11 sm:w-14 sm:h-14"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
            </Button>
            <Button
              onClick={onNext}
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
  );
});

export default GalleryLightbox;
