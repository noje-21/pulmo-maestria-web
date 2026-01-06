import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, ExternalLink, Sparkles } from "lucide-react";

export const CTAFinal = () => {
  const scrollToContact = () => {
    document.getElementById('contacto')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background gradient - Premium Navy */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
      <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-dots-pattern opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-accent-light" />
            Cupos Limitados
          </span>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Transforma tu Carrera en
            <br />
            <span className="text-accent-light">Circulación Pulmonar</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a la próxima generación de especialistas en hipertensión pulmonar. 
            Inscríbete ahora y asegura tu lugar en esta formación de excelencia.
          </p>

          {/* Event info */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mb-12">
            <div className="flex items-center gap-2.5 text-white/85">
              <div className="p-2 rounded-lg bg-white/10">
                <Calendar className="w-5 h-5 text-accent-light" />
              </div>
              <span className="font-medium">3 - 15 de noviembre 2025</span>
            </div>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/40" />
            <div className="flex items-center gap-2.5 text-white/85">
              <div className="p-2 rounded-lg bg-white/10">
                <MapPin className="w-5 h-5 text-accent-light" />
              </div>
              <span className="font-medium">Buenos Aires, Argentina</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="btn-hero group min-h-[56px] w-full sm:w-auto"
            >
              <span>Inscribirme Ahora</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
              className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[56px] w-full sm:w-auto"
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
