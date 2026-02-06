import { Section, SectionHeader } from "@/components/common/Section";
import { modulos, progressionPhases } from "./data";
import { PhaseTransition } from "./PhaseTransition";
import { ReelModuleCard } from "./ReelModuleCard";
import { CentralMessage } from "./CentralMessage";
import { ContextualCTA } from "./ContextualCTA";

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

      {/* Modules as interactive story cards */}
      <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl mx-auto">
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
              />
            </div>
          );
        })}
      </div>

      {/* Contextual CTA */}
      <ContextualCTA />
    </Section>
  );
};
