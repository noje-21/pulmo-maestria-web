import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, MapPin, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Sección principal - Maestría en Circulación Pulmonar"
      role="banner"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Maestría en Circulación Pulmonar - Formación médica especializada" 
          className="w-full h-full object-cover scale-105"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/75 to-background/95" />
        <div className="absolute inset-0 bg-dots-pattern opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Inscripciones Abiertas 2025
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight text-balance px-2"
        >
          Maestría Latinoamericana en
          <br className="hidden xs:block" />
          <span className="text-accent">Circulación Pulmonar</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
        >
          Formación intensiva de excelencia dirigida a internistas, cardiólogos, 
          reumatólogos y neumonólogos de Latinoamérica
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 items-center justify-center mb-8 sm:mb-10 px-2"
        >
          <div 
            className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            role="text" 
            aria-label="Fecha del evento"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent" aria-hidden="true" />
            </div>
            <span className="font-semibold text-white text-xs sm:text-sm md:text-base">3 - 15 de noviembre 2025</span>
          </div>
          
          <div 
            className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            role="text" 
            aria-label="Ubicación del evento"
          >
            <div className="p-1.5 sm:p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" aria-hidden="true" />
            </div>
            <span className="font-semibold text-white text-xs sm:text-sm md:text-base">Buenos Aires, Argentina</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center px-2"
        >
          <Button 
            size="lg" 
            onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
            aria-label="Acceder al Campus Virtual (abre en nueva ventana)"
            className="btn-hero group w-full sm:w-auto text-sm sm:text-base"
          >
            <span>Ver Campus Virtual</span>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("contacto")}
            aria-label="Ir a sección de contacto"
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-6 sm:px-8 py-4 sm:py-5 rounded-full transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
          >
            Solicitar Información
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-2"
        >
          {[
            { value: "9+", label: "Expertos Internacionales" },
            { value: "12", label: "Días de Formación" },
            { value: "100%", label: "Presencial" },
            { value: "5+", label: "Países Participantes" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
              role="figure"
              aria-label={`${stat.value} ${stat.label}`}
            >
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-white/80 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        onClick={() => scrollToSection("maestria")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="Desplazarse hacia abajo"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
};
