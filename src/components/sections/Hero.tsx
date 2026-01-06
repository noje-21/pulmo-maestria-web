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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Sección principal"
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight text-balance"
        >
          Maestría Latinoamericana en
          <br className="hidden sm:block" />
          <span className="text-accent">Circulación Pulmonar</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Formación intensiva de excelencia dirigida a internistas, cardiólogos, 
          reumatólogos y neumonólogos de Latinoamérica
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-10"
        >
          <div 
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            role="text" 
            aria-label="Fecha del evento"
          >
            <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold text-white text-sm sm:text-base">3 - 15 de noviembre 2025</span>
          </div>
          
          <div 
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            role="text" 
            aria-label="Ubicación del evento"
          >
            <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <span className="font-semibold text-white text-sm sm:text-base">Buenos Aires, Argentina</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Button 
            size="lg" 
            onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
            aria-label="Acceder al Campus Virtual"
            className="btn-hero group"
          >
            <span>Ver Campus Virtual</span>
            <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("contacto")}
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-300"
          >
            Solicitar Información
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "9+", label: "Expertos Internacionales" },
            { value: "12", label: "Días de Formación" },
            { value: "100%", label: "Presencial" },
            { value: "5+", label: "Países Participantes" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/80">
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
