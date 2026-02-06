import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modulo } from "./types";
import { progressionPhases } from "./data";

interface CompactModuleChipProps {
  modulo: Modulo;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export const CompactModuleChip = ({ 
  modulo, 
  index, 
  isSelected, 
  onClick 
}: CompactModuleChipProps) => {
  const Icon = modulo.icon;
  const phase = progressionPhases[modulo.phase];
  const isAccentPhase = modulo.phase === "diagnostico" || modulo.phase === "tratamiento";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.02,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 rounded-xl",
        "border transition-all duration-300",
        "text-left min-w-0",
        isSelected
          ? isAccentPhase
            ? "bg-accent/20 border-accent/50 shadow-lg shadow-accent/10"
            : "bg-primary/20 border-primary/50 shadow-lg shadow-primary/10"
          : "bg-card/80 border-border/40 hover:border-primary/30 hover:bg-card"
      )}
      aria-label={`Módulo ${modulo.numero}: ${modulo.titulo}`}
    >
      {/* Module number badge */}
      <span className={cn(
        "flex-shrink-0 flex items-center justify-center",
        "w-7 h-7 rounded-lg text-xs font-bold",
        isSelected
          ? isAccentPhase
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}>
        {modulo.numero}
      </span>

      {/* Icon */}
      <Icon className={cn(
        "w-4 h-4 flex-shrink-0",
        isSelected
          ? isAccentPhase ? "text-accent" : "text-primary"
          : "text-muted-foreground"
      )} />

      {/* Title - truncated */}
      <span className={cn(
        "text-sm font-medium truncate",
        isSelected ? "text-foreground" : "text-foreground/80"
      )}>
        {modulo.titulo}
      </span>

      {/* Phase indicator dot */}
      <span className={cn(
        "absolute -top-1 -right-1 w-2 h-2 rounded-full",
        phase.bgColor.replace("/10", "")
      )} />
    </motion.button>
  );
};
