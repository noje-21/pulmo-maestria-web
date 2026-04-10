import { memo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import type { Experto } from "./data";

interface DirectorCardProps {
  director: Experto;
}

export const DirectorCard = memo(function DirectorCard({ director }: DirectorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="mb-14 group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-card via-card to-primary/[0.03] shadow-[var(--shadow-lg)] group-hover:shadow-[0_25px_60px_-12px_hsl(var(--primary)/0.25)] group-hover:border-primary/30 transition-all duration-400">
        {/* Top accent line — shimmer on hover */}
        <div className="absolute top-0 inset-x-0 h-1 group-hover:h-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] group-hover:animate-[shimmer_2s_linear_infinite] transition-all duration-300" />

        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-10">
          {/* Photo with enhanced hover */}
          <div className="relative shrink-0">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/25 via-accent/15 to-primary/25 rounded-[1.5rem] blur-xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            {/* Inner ring highlight */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-accent opacity-0 group-hover:opacity-25 transition-opacity duration-400" />
            <img
              src={director.imagen}
              alt={director.nombre}
              className="relative w-36 h-36 md:w-44 md:h-44 object-cover rounded-2xl border-2 border-border/60 shadow-[var(--shadow-xl)] group-hover:border-primary/40 group-hover:scale-105 transition-all duration-400"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 144px, 176px"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl shadow-[var(--shadow-md)] ring-2 ring-card group-hover:scale-110 group-hover:shadow-[0_4px_20px_hsl(var(--primary)/0.4)] transition-all duration-300">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Award className="w-3.5 h-3.5" />
              Director de Maestría
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              {director.nombre}
            </h3>

            {/* Divider — widens on hover */}
            <div className="w-12 group-hover:w-20 h-0.5 bg-border/60 group-hover:bg-primary/40 mx-auto md:mx-0 transition-all duration-300" />

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {director.especialidad}
            </p>
            <p className="text-sm text-primary/80 font-medium group-hover:text-primary transition-colors duration-200">
              {director.institucion}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
