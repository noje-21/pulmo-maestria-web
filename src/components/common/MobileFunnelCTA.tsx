import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GraduationCap, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MobileFunnelCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

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

  // Pulse effect every few seconds
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

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
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-safe lg:hidden"
        >
          {/* Glassmorphism container */}
          <div className="relative bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-2xl shadow-primary/40 p-4 border border-primary-light/20 backdrop-blur-lg overflow-hidden">
            {/* Animated glow effect */}
            {showPulse && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 bg-accent/20 rounded-2xl pointer-events-none"
              />
            )}
            
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background shadow-lg flex items-center justify-center border border-border z-10"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="relative flex items-center gap-3">
              {/* Icon with animation */}
              <motion.div 
                className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-light animate-pulse" />
                  <p className="text-white font-bold text-sm leading-tight">
                    Maestría 2026
                  </p>
                </div>
                <p className="text-white/80 text-xs">
                  Inscripciones abiertas
                </p>
              </div>

              <Button
                onClick={scrollToContact}
                size="sm"
                className="bg-accent hover:bg-accent-dark text-white font-bold rounded-xl px-4 shadow-lg gap-1.5 flex-shrink-0 transition-all duration-300 hover:scale-105"
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
