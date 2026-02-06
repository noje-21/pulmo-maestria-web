import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modulo } from "./types";
import { progressionPhases } from "./data";
import { moduleNarratives, getProgressMilestone } from "./moduleTransformations";

interface ReelModuleCardProps {
  modulo: Modulo;
  index: number;
  totalModules: number;
  onExpandSound?: () => void;
  onCollapseSound?: () => void;
}

export const ReelModuleCard = ({ 
  modulo, 
  index, 
  totalModules,
  onExpandSound,
  onCollapseSound
}: ReelModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = modulo.icon;
  const phase = progressionPhases[modulo.phase];
  const narrative = moduleNarratives[modulo.id] || { impact: "", revelation: "" };
  const progressMilestone = getProgressMilestone(index, totalModules);
  const progressPercentage = Math.round(((index + 1) / totalModules) * 100);
  
  const isAccentPhase = modulo.phase === "diagnostico" || modulo.phase === "tratamiento";

  const handleToggle = useCallback(() => {
    if (isExpanded) {
      onCollapseSound?.();
    } else {
      onExpandSound?.();
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded, onExpandSound, onCollapseSound]);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.03
      }}
      className="group w-full will-change-transform"
    >
    <motion.div 
        onClick={handleToggle}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative cursor-pointer overflow-hidden",
          "rounded-2xl sm:rounded-3xl border transition-all duration-300",
          "bg-gradient-to-br from-card via-card to-card/80",
          isExpanded 
            ? "border-primary/40 shadow-xl shadow-primary/10" 
            : "border-border/40 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5",
        )}
      >
        {/* Animated gradient background on hover */}
        <motion.div 
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-700",
            "bg-gradient-to-br",
            isAccentPhase 
              ? "from-accent/5 via-transparent to-primary/5" 
              : "from-primary/5 via-transparent to-accent/5"
          )}
          animate={{ opacity: isExpanded ? 1 : 0 }}
        />
        
        {/* Progress indicator bar - optimized */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-muted/20 overflow-hidden">
          <div 
            style={{ width: `${progressPercentage}%` }}
            className={cn(
              "h-full transition-all duration-500",
              isAccentPhase ? "bg-accent" : "bg-primary"
            )}
          />
        </div>

        {/* Main content */}
        <div className="relative p-4 sm:p-6 lg:p-7">
          
          {/* Top row: Progress + Phase badge */}
          <div className="flex items-center justify-between mb-4">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[11px] sm:text-xs text-muted-foreground/70 font-medium"
            >
              Paso {index + 1} de {totalModules} · {progressMilestone}
            </motion.span>
            <span className={cn(
              "text-[10px] sm:text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider",
              phase.bgColor, phase.color
            )}>
              {phase.label}
            </span>
          </div>

          {/* Hook visual - The emotional punch */}
          <div className="mb-4">
            <p className={cn(
              "text-sm sm:text-base font-bold italic",
              isAccentPhase ? "text-accent" : "text-primary"
            )}>
              "{narrative.impact}"
            </p>
          </div>

          {/* Module header with icon */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            {/* Icon container */}
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center",
              "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl",
              "shadow-md",
              isAccentPhase
                ? "bg-gradient-to-br from-accent/20 to-accent/5 text-accent shadow-accent/15" 
                : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-primary/15"
            )}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            
            {/* Title and subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                  isAccentPhase ? "text-accent/70" : "text-primary/70"
                )}>
                  Módulo {modulo.numero}
                </span>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground leading-tight mb-1">
                {modulo.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {modulo.enfoque}
              </p>
            </div>
          </div>

          {/* Revelation teaser */}
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl mb-4",
            "bg-muted/30 border border-border/20"
          )}>
            <Sparkles className={cn(
              "w-4 h-4 flex-shrink-0",
              isAccentPhase ? "text-accent" : "text-primary"
            )} />
            <p className="text-xs sm:text-sm text-foreground/80 font-medium">
              {narrative.revelation}
            </p>
          </div>

          {/* Expand indicator */}
          <div className="flex items-center justify-center">
            <div className={cn(
              "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full",
              "transition-all duration-200",
              isExpanded 
                ? isAccentPhase ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
            )}>
              <ChevronDown className={cn(
                "w-5 h-5 transition-transform duration-200",
                isExpanded && "rotate-180"
              )} />
            </div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border/30">
                  {/* Section title */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      "w-1 h-4 rounded-full",
                      isAccentPhase ? "bg-accent" : "bg-primary"
                    )} />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Lo que dominarás
                    </span>
                  </div>
                  
                  {/* Topics grid - optimized without stagger */}
                  <div className="grid grid-cols-1 gap-2">
                    {modulo.temas.map((tema, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          "bg-muted/30 border border-border/15"
                        )}
                      >
                        <ArrowRight className={cn(
                          "w-3.5 h-3.5 flex-shrink-0",
                          isAccentPhase ? "text-accent" : "text-primary"
                        )} />
                        <span className="text-sm text-foreground/85 font-medium">
                          {tema}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Transformation message */}
                  <div className={cn(
                    "mt-4 p-3 rounded-lg text-center",
                    "bg-gradient-to-r",
                    isAccentPhase 
                      ? "from-accent/10 to-accent/5 border border-accent/15" 
                      : "from-primary/10 to-primary/5 border border-primary/15"
                  )}>
                    <p className={cn(
                      "text-xs sm:text-sm font-semibold",
                      isAccentPhase ? "text-accent" : "text-primary"
                    )}>
                      ✨ Después de este módulo, tu criterio clínico nunca será el mismo
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap hint for mobile */}
          {!isExpanded && (
            <div className="mt-2 text-center sm:hidden">
              <span className="text-[10px] text-muted-foreground/50 font-medium">
                Toca para explorar →
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
};
