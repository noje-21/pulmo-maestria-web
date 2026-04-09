import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createPortal } from "react-dom";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "hero-flyer",
    title: "Bienvenido a la Maestría",
    description:
      "Aquí encontrarás los videos destacados de nuestra formación. Desliza para explorar cada experiencia académica.",
    position: "bottom",
  },
  {
    targetId: "galeria",
    title: "Galería de Momentos",
    description:
      "Revive los mejores momentos de ediciones anteriores. Haz clic en cualquier imagen para verla en detalle.",
    position: "top",
  },
  {
    targetId: "contacto",
    title: "¡Reserva tu lugar!",
    description:
      "Completa el formulario para asegurar tu cupo. Nuestro equipo te contactará con toda la información.",
    position: "top",
  },
];

const STORAGE_KEY = "mlcp_tour_completed";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 12;

function getRect(id: string): SpotlightRect | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
  };
}

function tooltipStyle(rect: SpotlightRect, pos: string) {
  const vw = window.innerWidth;
  const base: React.CSSProperties = { position: "absolute", maxWidth: Math.min(360, vw - 32) };
  const centerX = rect.left + rect.width / 2;

  // horizontal centering with clamping
  const tooltipW = Math.min(360, vw - 32);
  let left = centerX - tooltipW / 2;
  left = Math.max(16, Math.min(left, vw - tooltipW - 16));

  if (pos === "bottom") {
    return { ...base, top: rect.top + rect.height + 16, left };
  }
  // default top
  return { ...base, top: rect.top - 16, left, transform: "translateY(-100%)" };
}

export function GuidedTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const rafRef = useRef(0);

  // Show tour only once
  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToStep = useCallback((idx: number) => {
    const s = TOUR_STEPS[idx];
    const el = document.getElementById(s.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Update rect on step change / scroll / resize
  useEffect(() => {
    if (!active) return;

    const update = () => {
      const r = getRect(TOUR_STEPS[step].targetId);
      if (r) setRect(r);
      rafRef.current = requestAnimationFrame(update);
    };

    scrollToStep(step);
    // Small delay for scroll to settle
    const t = setTimeout(() => {
      update();
    }, 400);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, step, scrollToStep]);

  const close = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const next = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) setStep((s) => s + 1);
    else close();
  }, [step, close]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Keyboard
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, close, next, prev]);

  if (!active) return null;

  const current = TOUR_STEPS[step];
  const progress = ((step + 1) / TOUR_STEPS.length) * 100;

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999]"
          style={{ pointerEvents: "auto" }}
        >
          {/* Dark overlay with cutout */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ height: document.documentElement.scrollHeight, top: -window.scrollY }}
          >
            <defs>
              <mask id="tour-mask">
                <rect width="100%" height="100%" fill="white" />
                {rect && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{
                      x: rect.left,
                      y: rect.top,
                      width: rect.width,
                      height: rect.height,
                      opacity: 1,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    rx={16}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.7)"
              mask="url(#tour-mask)"
              style={{ backdropFilter: "blur(2px)" }}
            />
          </svg>

          {/* Spotlight glow ring */}
          {rect && (
            <motion.div
              className="absolute rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                top: rect.top - window.scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              style={{
                boxShadow: "0 0 0 3px hsl(var(--primary) / 0.5), 0 0 30px 4px hsl(var(--primary) / 0.2)",
              }}
            />
          )}

          {/* Click blocker except close */}
          <div className="absolute inset-0" onClick={close} />

          {/* Tooltip */}
          {rect && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: current.position === "bottom" ? -12 : 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                ...tooltipStyle(
                  { ...rect, top: rect.top - window.scrollY },
                  current.position || "bottom"
                ),
              }}
              className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-5 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-base">{current.title}</h3>
                </div>
                <button
                  onClick={close}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {current.description}
              </p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Paso {step + 1} de {TOUR_STEPS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prev}
                  disabled={step === 0}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Anterior
                </Button>
                <Button size="sm" onClick={next} className="gap-1 text-xs">
                  {step === TOUR_STEPS.length - 1 ? "Finalizar" : "Siguiente"}
                  {step < TOUR_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default GuidedTour;
