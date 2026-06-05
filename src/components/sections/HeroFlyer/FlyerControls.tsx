import { memo, useEffect, useState } from "react";
import { ExternalLink, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CampusVirtualButton } from "@/components/common/CampusVirtualButton";
import { getTimeLeft } from "./types";

/* ─── Countdown Timer — own state, 60s interval, never causes HeroText re-render ─── */
const CountdownTimer = memo(function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "días" },
    { value: timeLeft.hours, label: "hs" },
    { value: timeLeft.minutes, label: "min" },
  ];

  return (
    <div
      className="mb-5 animate-fade-in-up"
      aria-label="Tiempo restante para el cierre de inscripciones"
      style={{ animationDelay: "450ms", animationDuration: "400ms" }}
    >
      <div className="inline-flex items-center divide-x divide-white/10 rounded-xl border border-white/10 bg-black/20 overflow-hidden max-w-full">
        {units.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center px-2 xs:px-2.5 sm:px-3 py-2 gap-0.5 min-w-[40px] xs:min-w-[44px] sm:min-w-[48px]">
            <span className="text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl tabular-nums leading-none tracking-tight">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-white/35 text-[9px] font-medium uppercase tracking-widest leading-none">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-white/30 text-[10px] font-medium tracking-wide uppercase">
        hasta el cierre de inscripciones
      </p>
    </div>
  );
});

/* ─── CTA Buttons ─── */
const HeroCTAs = memo(function HeroCTAs({
  onReservar,
  className,
}: {
  onReservar: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <Button
        size="lg"
        onClick={onReservar}
        className="btn-hero group min-h-[52px] text-sm"
      >
        <span>🎓 Reservar mi lugar</span>
        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
      </Button>

      <CampusVirtualButton />

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
        className="bg-white/5 border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-6 py-3.5 rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-h-[52px] text-sm group"
      >
        <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
        Hablar con asesor
      </Button>
    </div>
  );
});

/* ─── Hero text — memoized: never re-renders on video rotation ─── */
export const FlyerControls = memo(function FlyerControls({ onReservar }: { onReservar: () => void }) {
  return (
    <div style={{ contain: "layout style" }}>
      {/* Badge: Edición 2026 · Cupos limitados */}
      <div
        className="mb-3 animate-fade-in-up"
        style={{ animationDelay: "100ms", animationDuration: "400ms" }}
      >
        <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
          <span className="text-white/90">Edición 2026 · Cupos limitados</span>
        </span>
      </div>

      {/* Scarcity badge */}
      <div
        className="mb-4 animate-fade-in-up"
        aria-label="Solo 15 cupos anuales disponibles"
        style={{ animationDelay: "200ms", animationDuration: "400ms" }}
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/40 bg-accent/10 shadow-[0_0_16px_hsl(var(--accent)/0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="text-accent-light font-semibold text-sm sm:text-base tracking-wide">
            Solo 15 cupos anuales
          </span>
        </span>
      </div>

      {/* H1 */}
      <h1
        className="text-[1.35rem] xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4 break-words hyphens-auto animate-fade-in-up"
        style={{ animationDelay: "300ms", animationDuration: "450ms" }}
      >
        La experiencia que está transformando la{" "}
        <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
          circulación pulmonar
        </span>
      </h1>

      {/* Date */}
      <div
        className="mb-5 space-y-1 animate-fade-in-up"
        style={{ animationDelay: "350ms", animationDuration: "400ms" }}
      >
        <p className="text-white/60 text-[11px] xs:text-xs sm:text-sm font-medium leading-snug">
          2 al 16 de noviembre de 2026 · Buenos Aires, Argentina
        </p>
        <p className="text-white/45 text-[11px] xs:text-xs sm:text-sm leading-snug">
          Formación presencial intensiva + campus virtual.
        </p>
      </div>

      {/* Countdown */}
      <CountdownTimer />

      {/* CTAs */}
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "500ms", animationDuration: "400ms" }}
      >
        <HeroCTAs onReservar={onReservar} />
      </div>
    </div>
  );
});