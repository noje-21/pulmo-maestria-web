import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, ExternalLink, Sparkles, CheckCircle, Users, Award } from "lucide-react";

const benefits = [
  "El criterio clínico que siempre quisiste tener",
  "Una comunidad que te respalda cuando lo necesitas",
  "Casos reales que te preparan para cualquier situación",
  "El conocimiento que tus pacientes merecen",
];

export const CTAFinal = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth",
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 mb-6 shadow-lg">
              <Sparkles className="w-4 h-4 text-accent-light" />
              Edición 2026
            </span>

            {/* Title - Emotional */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Tu próximo paciente
              <span className="text-accent-light block sm:inline"> te necesita preparado</span>
            </h2>

            {/* Storytelling description - Purpose */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 mb-6 leading-relaxed">
              La hipertensión pulmonar no espera. Cada día de formación es un día más cerca de ofrecer respuestas donde
              antes solo había preguntas.
              <span className="block mt-2 font-medium text-white text-sm sm:text-base">
                Toma la decisión que cambiará tu práctica.
              </span>
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <CheckCircle className="w-5 h-5 text-accent-light flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {["AL", "MR", "JC", "DP"][i]}
                  </div>
                ))}
              </div>
              <div className="text-white/80 text-sm">
                <span className="font-semibold text-white">+50 profesionales</span>
                <br />
                formados en 2024
              </div>
            </div>
          </motion.div>

          {/* Right - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl brand-accent-bar"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-accent-light font-semibold mb-4">
                <Award className="w-5 h-5" />
                Próxima Edición
              </div>

              {/* Event info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-white">
                  <div className="p-2.5 rounded-xl bg-white/10">
                    <Calendar className="w-5 h-5 text-accent-light" />
                  </div>
                  <span className="font-semibold text-lg">2 - 16 de noviembre 2026</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white">
                  <div className="p-2.5 rounded-xl bg-white/10">
                    <MapPin className="w-5 h-5 text-accent-light" />
                  </div>
                  <span className="font-semibold text-lg">Buenos Aires, Argentina</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-white/80">
                  <div className="p-2.5 rounded-xl bg-white/10">
                    <Users className="w-5 h-5 text-accent-light" />
                  </div>
                  <span>12 días presenciales intensivos</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="btn-hero group min-h-[56px] w-full brand-cta-glow"
                >
                  <span>Inscribirme Ahora</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => (window.location.href = "https://campus.maestriacp.com/")}
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[52px] w-full"
                >
                  Ver Campus Virtual
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-white/60 text-sm mt-6">Sin compromiso · Respuesta en 24h</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
