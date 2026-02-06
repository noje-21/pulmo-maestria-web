import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { modulos, progressionPhases } from "./data";
import { PhaseTransition } from "./PhaseTransition";
import { ReelModuleCard } from "./ReelModuleCard";
import { CentralMessage } from "./CentralMessage";
import { ContextualCTA } from "./ContextualCTA";
import { ViewModeToggle, ViewMode } from "./ViewModeToggle";
import { CompactModuleView } from "./CompactModuleView";
import { useSoundEffects } from "./hooks/useSoundEffects";

// Group modules by phase for rendering
const getPhaseForIndex = (index: number): string | null => {
  const currentModulo = modulos[index];
  const prevModulo = modulos[index - 1];
  
  if (index === 0 || currentModulo.phase !== prevModulo?.phase) {
    return currentModulo.phase;
  }
  return null;
};

export const EjesFormacion = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const { playExpandSound, playCollapseSound, playToggleSound } = useSoundEffects();

  return (
    <Section 
      id="ejes-formacion" 
      background="gradient" 
      pattern="grid" 
      padding="large"
    >
      <SectionHeader
        badge="Programa Académico 2025"
        title="30 Módulos. Un propósito."
        subtitle="Cada módulo es un paso en tu transformación como especialista en circulación pulmonar."
      />

      {/* Central Message - Emotional hook */}
      <CentralMessage />

      {/* View Mode Toggle */}
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode}
        onToggleSound={playToggleSound}
      />

      {/* Modules display based on view mode */}
      <AnimatePresence mode="wait">
        {viewMode === "detailed" ? (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3 sm:gap-5 max-w-3xl mx-auto"
          >
            {modulos.map((modulo, index) => {
              const phaseKey = getPhaseForIndex(index);
              
              return (
                <div key={modulo.id}>
                  {/* Phase transition indicator */}
                  {phaseKey && (
                    <PhaseTransition 
                      phase={progressionPhases[phaseKey]} 
                      phaseKey={phaseKey}
                      isFirst={index === 0}
                    />
                  )}
                  
                  <ReelModuleCard
                    modulo={modulo}
                    index={index}
                    totalModules={modulos.length}
                    onExpandSound={playExpandSound}
                    onCollapseSound={playCollapseSound}
                  />
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <CompactModuleView 
              modulos={modulos}
              onExpandSound={playExpandSound}
              onCollapseSound={playCollapseSound}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual CTA */}
      <ContextualCTA />
    </Section>
  );
};

