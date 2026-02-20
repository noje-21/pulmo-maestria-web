import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modulo } from "./types";
import { progressionPhases } from "./data";
import { moduleNarratives } from "./moduleTransformations";
import { CompactModuleChip } from "./CompactModuleChip";

interface CompactModuleViewProps {
  modulos: Modulo[];
  onExpandSound?: () => void;
  onCollapseSound?: () => void;
}

export const CompactModuleView = ({ 
  modulos, 
  onExpandSound, 
  onCollapseSound 
}: CompactModuleViewProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  
  const selectedModule = modulos.find(m => m.id === selectedModuleId);
  const selectedIndex = modulos.findIndex(m => m.id === selectedModuleId);

  // Group modules by phase
  const modulesByPhase = modulos.reduce((acc, modulo) => {
    if (!acc[modulo.phase]) {
      acc[modulo.phase] = [];
    }
    acc[modulo.phase].push(modulo);
    return acc;
  }, {} as Record<string, Modulo[]>);

  const handleModuleClick = useCallback((moduleId: string) => {
    if (selectedModuleId === moduleId) {
      onCollapseSound?.();
      setSelectedModuleId(null);
    } else {
      onExpandSound?.();
      setSelectedModuleId(moduleId);
      // Auto-scroll to detail panel after animation starts
      requestAnimationFrame(() => {
        setTimeout(() => {
          detailPanelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 80);
      });
    }
  }, [selectedModuleId, onExpandSound, onCollapseSound]);

  return (
    <div className="space-y-6">
      {/* Selected module detail panel — appears at top for easy access on mobile */}
      <AnimatePresence mode="wait">
        {selectedModule && (
          <motion.div
            ref={detailPanelRef}
            key={selectedModule.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ 
              duration: 0.28, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <ModuleDetailPanel 
              modulo={selectedModule} 
              index={selectedIndex}
              totalModules={modulos.length}
              onClose={() => {
                onCollapseSound?.();
                setSelectedModuleId(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chips grid by phase */}
      {Object.entries(modulesByPhase).map(([phaseKey, phaseModulos]) => {
        const phase = progressionPhases[phaseKey];
        const isAccentPhase = phaseKey === "diagnostico" || phaseKey === "tratamiento";
        
        return (
          <motion.div
            key={phaseKey}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-3"
          >
            {/* Phase header */}
            <div className="flex items-center gap-2 px-2">
              <div className={cn(
                "w-1 h-4 rounded-full",
                isAccentPhase ? "bg-accent" : "bg-primary"
              )} />
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                phase.color
              )}>
                {phase.label}
              </span>
              <span className="text-xs text-muted-foreground">
                ({phaseModulos.length} módulos)
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {phaseModulos.map((modulo) => {
                const globalIndex = modulos.findIndex(m => m.id === modulo.id);
                return (
                  <CompactModuleChip
                    key={modulo.id}
                    modulo={modulo}
                    index={globalIndex}
                    isSelected={selectedModuleId === modulo.id}
                    onClick={() => handleModuleClick(modulo.id)}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Detail panel for selected module
interface ModuleDetailPanelProps {
  modulo: Modulo;
  index: number;
  totalModules: number;
  onClose: () => void;
}

const ModuleDetailPanel = ({ modulo, index, totalModules, onClose }: ModuleDetailPanelProps) => {
  const Icon = modulo.icon;
  const phase = progressionPhases[modulo.phase];
  const narrative = moduleNarratives[modulo.id] || { impact: "", revelation: "" };
  const isAccentPhase = modulo.phase === "diagnostico" || modulo.phase === "tratamiento";
  const progressPercentage = Math.round(((index + 1) / totalModules) * 100);

  return (
    <motion.div 
      className={cn(
        "relative p-5 sm:p-6 rounded-2xl border",
        "bg-gradient-to-br from-card via-card to-card/80",
        isAccentPhase 
          ? "border-accent/30 shadow-xl shadow-accent/10" 
          : "border-primary/30 shadow-xl shadow-primary/10"
      )}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 rounded-t-2xl overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full", isAccentPhase ? "bg-accent" : "bg-primary")}
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-3 right-3 p-2 rounded-full",
          "bg-muted/60 hover:bg-muted transition-colors",
          "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Cerrar detalle"
      >
        <ChevronRight className="w-4 h-4 rotate-90" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center",
          "w-12 h-12 rounded-xl",
          isAccentPhase
            ? "bg-gradient-to-br from-accent/20 to-accent/5 text-accent"
            : "bg-gradient-to-br from-primary/20 to-primary/5 text-primary"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              phase.bgColor, phase.color
            )}>
              {phase.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Módulo {modulo.numero}
            </span>
          </div>
          <h4 className="text-lg font-bold text-foreground leading-tight">
            {modulo.titulo}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {modulo.enfoque}
          </p>
        </div>
      </div>

      {/* Impact quote */}
      {narrative.impact && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl mb-4",
          "bg-muted/40 border border-border/30"
        )}>
          <Sparkles className={cn(
            "w-4 h-4 flex-shrink-0",
            isAccentPhase ? "text-accent" : "text-primary"
          )} />
          <p className="text-sm font-medium text-foreground/90">
            {narrative.revelation}
          </p>
        </div>
      )}

      {/* Topics */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contenido
        </span>
        <div className="grid gap-2">
          {modulo.temas.map((tema, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm text-foreground/80"
            >
              <ArrowRight className={cn(
                "w-3 h-3 flex-shrink-0",
                isAccentPhase ? "text-accent" : "text-primary"
              )} />
              {tema}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
