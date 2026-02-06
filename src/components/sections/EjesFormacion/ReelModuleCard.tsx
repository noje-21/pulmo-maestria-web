import { useState } from "react";
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
}

export const ReelModuleCard = ({ modulo, index, totalModules }: ReelModuleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = modulo.icon;
  const phase = progressionPhases[modulo.phase];
  const narrative = moduleNarratives[modulo.id] || { impact: "", revelation: "" };
  const progressMilestone = getProgressMilestone(index, totalModules);
  const progressPercentage = Math.round(((index + 1) / totalModules) * 100);
  
  const isAccentPhase = modulo.phase === "diagnostico" || modulo.phase === "tratamiento";
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.7, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.05
      }}
      className="group w-full"
    >
      <motion.div 
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative cursor-pointer overflow-hidden",
          "rounded-3xl border transition-all duration-500",
          "bg-gradient-to-br from-card via-card to-card/80",
          isExpanded 
            ? "border-primary/50 shadow-2xl shadow-primary/15" 
            : "border-border/40 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
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
        
        {/* Progress indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPercentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className={cn(
              "h-full",
              isAccentPhase ? "bg-accent" : "bg-primary"
            )}
          />
        </div>

        {/* Main content */}
        <div className="relative p-5 sm:p-7 lg:p-8">
          
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
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-5"
          >
            <p className={cn(
              "text-sm sm:text-base font-bold italic",
              isAccentPhase ? "text-accent" : "text-primary"
            )}>
              "{narrative.impact}"
            </p>
          </motion.div>

          {/* Module header with icon */}
          <div className="flex items-start gap-4 mb-4">
            {/* Icon container with glow effect */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                "flex-shrink-0 flex items-center justify-center",
                "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl",
                "transition-all duration-500",
                "shadow-lg",
                isAccentPhase
                  ? "bg-gradient-to-br from-accent/20 to-accent/5 text-accent shadow-accent/20" 
                  : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-primary/20"
              )}
            >
              <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
            
            {/* Title and subtitle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-xs font-bold uppercase tracking-widest",
                  isAccentPhase ? "text-accent/70" : "text-primary/70"
                )}>
                  Módulo {modulo.numero}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground leading-tight mb-1">
                {modulo.titulo}
              </h3>
              <p className="text-sm text-muted-foreground">
                {modulo.enfoque}
              </p>
            </div>
          </div>

          {/* Revelation teaser */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className={cn(
              "flex items-center gap-3 p-3 sm:p-4 rounded-2xl mb-4",
              "bg-muted/40 border border-border/30"
            )}
          >
            <Sparkles className={cn(
              "w-4 h-4 flex-shrink-0",
              isAccentPhase ? "text-accent" : "text-primary"
            )} />
            <p className="text-sm text-foreground/80 font-medium">
              {narrative.revelation}
            </p>
          </motion.div>

          {/* Expand indicator */}
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: isExpanded ? 180 : 0,
                scale: isExpanded ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "transition-colors duration-300",
                isExpanded 
                  ? isAccentPhase ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
              )}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t border-border/40">
                  {/* Section title */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn(
                      "w-1 h-5 rounded-full",
                      isAccentPhase ? "bg-accent" : "bg-primary"
                    )} />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                      Lo que dominarás
                    </span>
                  </div>
                  
                  {/* Topics grid */}
                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    {modulo.temas.map((tema, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 + 0.15 }}
                        className={cn(
                          "flex items-center gap-3 p-3 sm:p-4 rounded-xl",
                          "bg-gradient-to-r from-muted/50 to-muted/30",
                          "border border-border/20",
                          "transition-all duration-300 hover:border-primary/30 hover:bg-muted/60"
                        )}
                      >
                        <ArrowRight className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isAccentPhase ? "text-accent" : "text-primary"
                        )} />
                        <span className="text-sm sm:text-base text-foreground/90 font-medium">
                          {tema}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Transformation message */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={cn(
                      "mt-5 p-4 rounded-xl text-center",
                      "bg-gradient-to-r",
                      isAccentPhase 
                        ? "from-accent/10 to-accent/5 border border-accent/20" 
                        : "from-primary/10 to-primary/5 border border-primary/20"
                    )}
                  >
                    <p className={cn(
                      "text-sm font-semibold",
                      isAccentPhase ? "text-accent" : "text-primary"
                    )}>
                      ✨ Después de este módulo, tu criterio clínico nunca será el mismo
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap hint for mobile */}
          <motion.div 
            animate={{ opacity: isExpanded ? 0 : 1 }}
            className={cn(
              "mt-2 text-center sm:hidden transition-all duration-300",
              isExpanded && "h-0 overflow-hidden"
            )}
          >
            <span className="text-[11px] text-muted-foreground/50 font-medium">
              Toca para explorar →
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  );
};
