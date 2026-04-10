import { memo } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { Experto } from "./data";

interface ExpertoCardProps {
  experto: Experto;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const ExpertoCard = memo(function ExpertoCard({ experto }: ExpertoCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group cursor-pointer"
    >
      <div className="relative h-full rounded-xl border border-border/60 bg-card overflow-hidden shadow-[var(--shadow-sm)] group-hover:shadow-[var(--shadow-xl)] group-hover:border-primary/25 transition-all duration-300">
        {/* Animated top accent bar — grows on hover */}
        <div className="h-0.5 group-hover:h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] group-hover:animate-[shimmer_2s_linear_infinite] opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        <div className="relative p-5 flex flex-col items-center text-center h-full">
          {/* Photo with ring animation */}
          <div className="relative mb-4">
            {/* Outer glow ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 opacity-0 group-hover:opacity-70 blur-lg transition-opacity duration-500" />
            {/* Inner ring highlight */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary to-accent opacity-0 group-hover:opacity-30 transition-opacity duration-400" />
            <img
              src={experto.imagen}
              alt={experto.nombre}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 80px, 96px"
              className="relative w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-2 border-border/50 shadow-[var(--shadow-sm)] group-hover:border-primary/40 group-hover:scale-110 transition-all duration-400"
            />
          </div>

          {/* Name */}
          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200 leading-snug">
            {experto.nombre}
          </h3>

          {/* Role badge — accent pop on hover */}
          <span className="inline-block px-2.5 py-0.5 bg-accent/8 text-accent text-xs font-semibold rounded-full mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
            {experto.cargo}
          </span>

          {/* Divider — widens on hover */}
          <div className="w-8 group-hover:w-12 h-px bg-border/60 group-hover:bg-primary/40 mb-3 transition-all duration-300" />

          {/* Specialty */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-2 flex-1">
            {experto.especialidad}
          </p>

          {/* Institution */}
          <div className="flex items-center gap-1.5 mt-auto pt-1 group-hover:text-primary/60 transition-colors duration-200">
            <Building2 className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary/50 shrink-0 transition-colors duration-200" />
            <p className="text-[11px] text-muted-foreground/60 group-hover:text-muted-foreground leading-tight transition-colors duration-200">
              {experto.institucion}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
