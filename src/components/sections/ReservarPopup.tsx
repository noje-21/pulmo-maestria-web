import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, ExternalLink, Sparkles, CheckCircle, Users, Award, X } from "lucide-react";

const benefits = [
  "El criterio clínico que siempre quisiste tener",
  "Una comunidad que te respalda cuando lo necesitas",
  "Casos reales que te preparan para cualquier situación",
  "El conocimiento que tus pacientes merecen",
];

interface ReservarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservarPopup = memo(function ReservarPopup({ isOpen, onClose }: ReservarPopupProps) {
  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-dark shadow-2xl border border-white/10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-center lg:text-left"
                >
                  {/* Badge */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold border border-white/20 mb-6 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-accent-light" />
                    Edición 2026
                  </motion.span>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                  >
                    Tu próximo paciente
                    <span className="text-accent-light block sm:inline"> te necesita preparado</span>
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-sm sm:text-base text-white/85 mb-6 leading-relaxed"
                  >
                    La hipertensión pulmonar no espera. Cada día de formación es un día más cerca de ofrecer respuestas donde
                    antes solo había preguntas.
                    <span className="block mt-2 font-medium text-white text-sm sm:text-base">
                      Toma la decisión que cambiará tu práctica.
                    </span>
                  </motion.p>

                  {/* Benefits list */}
                  <ul className="space-y-3 mb-6">
                    {benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + index * 0.08 }}
                        className="flex items-center gap-3 text-white/90 text-sm sm:text-base"
                      >
                        <CheckCircle className="w-5 h-5 text-accent-light flex-shrink-0" />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Social proof */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 justify-center lg:justify-start"
                  >
                    <div className="flex -space-x-2">
                      {["AL", "MR", "JC", "DP"].map((initials, i) => (
                        <div
                          key={i}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-light border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                    <div className="text-white/80 text-sm">
                      <span className="font-semibold text-white">+50 profesionales</span>
                      <br />
                      formados en 2024
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right - CTA Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl brand-accent-bar"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-accent-light font-semibold mb-4">
                      <Award className="w-5 h-5" />
                      Próxima Edición
                    </div>

                    {/* Event info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center gap-3 text-white">
                        <div className="p-2 rounded-xl bg-white/10">
                          <Calendar className="w-5 h-5 text-accent-light" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg">2 - 16 de noviembre 2026</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-white">
                        <div className="p-2 rounded-xl bg-white/10">
                          <MapPin className="w-5 h-5 text-accent-light" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg">Buenos Aires, Argentina</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-white/80">
                        <div className="p-2 rounded-xl bg-white/10">
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
                        className="btn-hero group min-h-[52px] w-full brand-cta-glow"
                      >
                        <span>Inscribirme Ahora</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => (window.location.href = "https://campus.maestriacp.com/")}
                        className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[48px] w-full"
                      >
                        Ver Campus Virtual
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <p className="text-white/60 text-sm mt-5">Sin compromiso · Respuesta en 24h</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
