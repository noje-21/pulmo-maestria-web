import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, MapPin, ExternalLink, Award, Users, Clock, Globe, Heart, Stethoscope } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const stats = [
    { value: "9+", label: "Expertos Internacionales", icon: Users },
    { value: "12", label: "Días de Formación", icon: Clock },
    { value: "100%", label: "Presencial", icon: Award },
    { value: "5+", label: "Países Participantes", icon: Globe },
  ];

  return (
    <section 
      id="inicio" 
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      aria-label="Sección principal - Maestría en Circulación Pulmonar"
      role="banner"
    >
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Maestría en Circulación Pulmonar - Formación médica especializada" 
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/85 to-primary-dark/95" />
        <div className="absolute inset-0 bg-mesh-pattern" />
        {/* Animated medical icons background */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-full h-full"
          >
            <Stethoscope className="absolute top-1/4 right-1/4 w-96 h-96 text-white" />
          </motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-full h-full"
          >
            <Heart className="absolute bottom-1/4 left-1/4 w-72 h-72 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-[100px] animate-pulse-subtle" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-[80px]" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Problem Statement - Storytelling */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-white/70 text-sm sm:text-base mb-4 max-w-2xl mx-auto px-4"
        >
          La hipertensión pulmonar afecta a millones en Latinoamérica. 
          La formación especializada marca la diferencia.
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] text-balance px-2"
        >
          Maestría Latinoamericana en
          <br className="hidden xs:block" />
          <span className="text-accent-light">Circulación Pulmonar</span>
        </motion.h1>

        {/* Subtitle - Solution Statement */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2"
        >
          <span className="font-semibold">Formación intensiva de excelencia</span> dirigida a internistas, cardiólogos, 
          reumatólogos y neumonólogos de Latinoamérica. 
          <span className="block mt-2 text-accent-light font-medium">
            Transforma tu práctica clínica en 12 días.
          </span>
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col xs:flex-row gap-3 sm:gap-4 items-center justify-center mb-10 sm:mb-12 px-2"
        >
          <div 
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-400 group cursor-default w-full xs:w-auto justify-center"
            role="text" 
            aria-label="Fecha del evento"
          >
            <div className="p-2 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Calendar className="w-5 h-5 text-accent-light" aria-hidden="true" />
            </div>
            <span className="font-semibold text-white text-sm sm:text-base">3 - 15 de noviembre 2025</span>
          </div>
          
          <div 
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-400 group cursor-default w-full xs:w-auto justify-center"
            role="text" 
            aria-label="Ubicación del evento"
          >
            <div className="p-2 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <MapPin className="w-5 h-5 text-accent-light" aria-hidden="true" />
            </div>
            <span className="font-semibold text-white text-sm sm:text-base">Buenos Aires, Argentina</span>
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
            onClick={() => window.location.href = "https://www.maestriacp.com/"}
            aria-label="Acceder al Campus Virtual"
            className="btn-hero group w-full sm:w-auto min-h-[56px] brand-cta-glow"
          >
            <span>Ver Campus Virtual</span>
            <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToSection("contacto")}
            aria-label="Ir a sección de contacto"
            className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-400 w-full sm:w-auto min-h-[56px]"
          >
            Solicitar Información
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-2"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-400 group"
                role="figure"
                aria-label={`${stat.value} ${stat.label}`}
              >
                <Icon className="w-5 h-5 text-accent-light mb-2 mx-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] xs:text-xs sm:text-sm text-white/80 leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        onClick={() => scrollToSection("diferenciales")}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer p-2"
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
