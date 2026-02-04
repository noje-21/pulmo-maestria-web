import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modulo } from "./types";
import { progressionPhases } from "./data";

interface ModuloCardProps {
  modulo: Modulo;
  index: number;
}

export const ModuloCard = ({ modulo, index }: ModuloCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = modulo.icon;
  const phase = progressionPhases[modulo.phase];
  const isAccentPhase = modulo.phase === "diagnostico" || modulo.phase === "tratamiento";
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group"
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "relative cursor-pointer overflow-hidden",
          "rounded-3xl border-2 transition-all duration-500",
          "bg-card/80 backdrop-blur-sm",
          isExpanded 
            ? "border-primary shadow-2xl shadow-primary/10" 
            : "border-border/30 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        )}
      >
        {/* Gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
          "group-hover:opacity-100"
        )} />
        
        {/* Signature accent line with phase color */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-500",
          isAccentPhase ? "bg-accent" : "bg-primary",
          isExpanded ? "opacity-100" : "opacity-60 group-hover:opacity-100"
        )} />

        {/* Main content */}
        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Chapter indicator for mobile */}
          <div className="flex items-center justify-between mb-5 sm:hidden">
            <span className={cn(
              "text-sm font-bold uppercase tracking-wider",
              phase.color
            )}>
              Módulo {modulo.numero}
            </span>
            <span className={cn(
              "text-[11px] px-3 py-1 rounded-full font-medium",
              phase.bgColor, phase.color
            )}>
              {phase.label}
            </span>
          </div>

          {/* Header row */}
          <div className="flex items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
            {/* Module identifier */}
            <div className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center",
              "w-14 h-14 sm:w-20 sm:h-20 rounded-2xl",
              "transition-all duration-500 group-hover:scale-105",
              isAccentPhase
                ? "bg-accent/10 text-accent" 
                : "bg-primary/10 text-primary"
            )}>
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-70">Mod</span>
              <span className="text-xl sm:text-3xl font-bold">{modulo.numero}</span>
            </div>
            
            {/* Title and icon */}
            <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <Icon className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors",
                  isAccentPhase ? "text-accent" : "text-primary"
                )} />
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {modulo.titulo}
                </h3>
              </div>
              <p className={cn(
                "text-xs sm:text-base font-medium",
                isAccentPhase ? "text-accent/80" : "text-primary/80"
              )}>
                {modulo.enfoque}
              </p>
            </div>
            
            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                "transition-colors duration-300",
                isExpanded 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className={cn(
                      "w-4 h-4",
                      isAccentPhase ? "text-accent" : "text-primary"
                    )} />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                      Contenidos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {modulo.temas.map((tema, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.2 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl",
                          "bg-muted/40 border border-border/30",
                          "transition-colors hover:bg-muted/60"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          isAccentPhase ? "bg-accent" : "bg-primary"
                        )} />
                        <span className="text-sm text-foreground/90">
                          {tema}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tap hint for mobile */}
          <div className={cn(
            "mt-6 text-center sm:hidden transition-all duration-300",
            isExpanded ? "opacity-0 h-0" : "opacity-100"
          )}>
            <span className="text-xs text-muted-foreground/50 font-medium">
              Toca para ver contenidos →
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
