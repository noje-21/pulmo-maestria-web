import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, ExternalLink } from "lucide-react";

export const CTAFinal = () => {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-dark" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Cupos Limitados
          </span>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Transforma tu Carrera en
            <br />
            <span className="text-accent">Circulación Pulmonar</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
            Únete a la próxima generación de especialistas en hipertensión pulmonar. 
            Inscríbete ahora y asegura tu lugar en esta formación de excelencia.
          </p>

          {/* Event info */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10">
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-5 h-5 text-accent" />
              <span>3 - 15 de noviembre 2025</span>
            </div>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5 text-accent" />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="btn-hero group bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <span>Inscribirme Ahora</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-300"
            >
              Ver Campus Virtual
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
