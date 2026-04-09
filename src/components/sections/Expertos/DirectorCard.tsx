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
      className="mb-14"
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-card via-card to-primary/[0.03] shadow-[var(--shadow-lg)]">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-light to-accent" />

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-10">
          {/* Photo */}
          <div className="relative shrink-0 group">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[1.25rem] blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src={director.imagen}
              alt={director.nombre}
              className="relative w-36 h-36 md:w-44 md:h-44 object-cover rounded-2xl border-2 border-border/60 shadow-[var(--shadow-xl)]"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 144px, 176px"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2.5 rounded-xl shadow-[var(--shadow-md)] ring-2 ring-card">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase rounded-full">
              <Award className="w-3.5 h-3.5" />
              Director de Maestría
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {director.nombre}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              {director.especialidad}
            </p>
            <p className="text-sm text-primary/80 font-medium">
              {director.institucion}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
