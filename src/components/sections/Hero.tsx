import { motion } from "framer-motion";
import { ChevronDown, Calendar, MapPin, Award, Users, Clock, Globe, Sparkles } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "9+", label: "Expertos Internacionales", icon: Users },
    { value: "12", label: "Días Presenciales", icon: Clock },
    { value: "+", label: "Campus Virtual", icon: Award },
    { value: "5+", label: "Países Participantes", icon: Globe },
  ];

  return (
    <section
      id="inicio"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-background"
      aria-label="Información principal - Maestría en Circulación Pulmonar"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Problem Statement - Emotional Hook */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-white/85 text-sm sm:text-base mb-5 sm:mb-6 max-w-2xl mx-auto px-3 leading-relaxed"
        >
          Cada día, miles de pacientes con hipertensión pulmonar en Latinoamérica
          necesitan médicos que entiendan su complejidad.{" "}
          <span className="font-semibold text-primary-foreground">
            Tú puedes ser ese profesional.
          </span>
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] text-balance px-2"
        >
          Forma parte del cambio en
          <br className="hidden xs:block" />
          <span className="block sm:inline text-primary-foreground">
            Circulación Pulmonar
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-3"
        >
          <span className="font-semibold">
            Una formación diseñada para quienes creen
          </span>{" "}
          que la excelencia clínica transforma vidas.
          <span className="block mt-2 sm:mt-3 text-accent-light font-medium text-sm sm:text-base md:text-lg">
            12 días que marcarán tu carrera y la vida de tus pacientes.
          </span>
        </motion.p>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
            <span className="font-semibold text-white text-sm sm:text-base">
              2 - 16 de noviembre 2026
            </span>
          </div>

          <div
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-400 group cursor-default w-full xs:w-auto justify-center"
            role="text"
            aria-label="Ubicación del evento"
          >
            <div className="p-2 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <MapPin className="w-5 h-5 text-accent-light" aria-hidden="true" />
            </div>
            <span className="font-semibold text-white text-sm sm:text-base">
              Buenos Aires, Argentina
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 max-w-4xl mx-auto px-2"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-400 group"
                role="figure"
                aria-label={`${stat.value} ${stat.label}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light mb-1.5 sm:mb-2 mx-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] xs:text-xs sm:text-sm text-white/80 leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 sm:mt-14"
        >
          <button
            onClick={() => scrollToSection("diferenciales")}
            className="text-white/60 hover:text-white/90 text-sm font-medium transition-colors cursor-pointer inline-flex flex-col items-center gap-2"
            aria-label="Desplazarse hacia abajo"
          >
            Descubre lo que te espera
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
