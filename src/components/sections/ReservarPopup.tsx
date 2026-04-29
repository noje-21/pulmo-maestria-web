import { memo, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Sparkles, CheckCircle, Users, Award, X } from "lucide-react";
import { CampusVirtualButton } from "@/components/common/CampusVirtualButton";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const duration = 800;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#213ECC", "#CE2020", "#FFFFFF"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#213ECC", "#CE2020", "#FFFFFF"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  }, [isOpen]);

  // Body scroll lock + focus management + keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus close button on next tick (after mount + animation start)
    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        // Focus trap
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservar-popup-title"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-dark shadow-2xl border border-white/10"
            style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {/* Close button */}
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="sticky top-3 sm:top-4 float-right mr-3 sm:mr-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 px-4 pt-2 pb-8 sm:px-8 sm:pt-4 sm:pb-10 md:px-10">
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
                    id="reservar-popup-title"
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

                      <CampusVirtualButton fullWidth />
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
