import { memo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { Experto } from "./data";

interface ExpertoCardProps {
  experto: Experto;
  index: number;
}

export const ExpertoCard = memo(function ExpertoCard({ experto, index }: ExpertoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 5) * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
    >
      <div className="relative h-full rounded-xl border border-border/60 bg-card overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1">
        {/* Top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-5 flex flex-col items-center text-center h-full">
          {/* Photo */}
          <div className="relative mb-4">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-400" />
            <img
              src={experto.imagen}
              alt={experto.nombre}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 80px, 96px"
              className="relative w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-border/50 shadow-[var(--shadow-sm)] group-hover:border-primary/30 group-hover:scale-[1.03] transition-all duration-300"
            />
          </div>

          {/* Name */}
          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200 leading-snug">
            {experto.nombre}
          </h3>

          {/* Role badge */}
          <span className="inline-block px-2.5 py-0.5 bg-accent/8 text-accent text-xs font-semibold rounded-full mb-3">
            {experto.cargo}
          </span>

          {/* Divider */}
          <div className="w-8 h-px bg-border/60 mb-3" />

          {/* Specialty */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2 flex-1">
            {experto.especialidad}
          </p>

          {/* Institution */}
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            <Building2 className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            <p className="text-[11px] text-muted-foreground/60 leading-tight">
              {experto.institucion}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
