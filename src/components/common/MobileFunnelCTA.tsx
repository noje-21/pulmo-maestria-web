import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GraduationCap, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MobileFunnelCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (500px)
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 500) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe lg:hidden"
        >
          <div className="relative bg-gradient-to-r from-accent to-accent-dark rounded-2xl shadow-2xl shadow-accent/30 p-4 border border-accent-light/20">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background shadow-lg flex items-center justify-center border border-border"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">
                  Maestría 2026
                </p>
                <p className="text-white/80 text-xs">
                  ¡Cupos limitados!
                </p>
              </div>

              <Button
                onClick={scrollToContact}
                size="sm"
                className="bg-white text-accent hover:bg-white/90 font-bold rounded-xl px-4 shadow-lg gap-1.5 flex-shrink-0"
              >
                <span className="hidden xs:inline">Inscribirme</span>
                <span className="xs:hidden">¡Sí!</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFunnelCTA;
