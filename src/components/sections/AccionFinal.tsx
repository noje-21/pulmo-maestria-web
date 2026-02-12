import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

export const AccionFinal = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
      <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-accent-light" />
            Edición 2026 · Cupos limitados
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
        >
          Tu próximo paciente{" "}
          <span className="text-accent-light">te necesita preparado</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto"
        >
          Toma la decisión que cambiará tu práctica clínica. Inscríbete y
          forma parte de la próxima generación de especialistas.
        </motion.p>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-10"
        >
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-accent-light" />
            <span className="font-semibold">2 - 16 de noviembre 2026</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5 text-accent-light" />
            <span className="font-semibold">Buenos Aires, Argentina</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-5 h-5 text-accent-light" />
            <span>12 días presenciales</span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={scrollToContact}
            className="btn-hero group min-h-[56px] brand-cta-glow"
          >
            <span>🎓 Inscribirme Ahora</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              window.open(
                "https://wa.me/5491159064234?text=" +
                  encodeURIComponent(
                    "Hola, quiero información sobre la Maestría en Circulación Pulmonar 2026."
                  ),
                "_blank"
              )
            }
            className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[56px] group"
          >
            <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Hablar con asesor académico
          </Button>
        </motion.div>

        <p className="text-white/50 text-sm mt-8">
          Sin compromiso · Respuesta en 24h
        </p>
      </div>
    </section>
  );
};
