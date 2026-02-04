import { Section, SectionHeader } from "@/components/common/Section";
import { modulos, progressionPhases } from "./data";
import { PhaseIndicator } from "./PhaseIndicator";
import { ModuloCard } from "./ModuloCard";
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

      {/* Central Message */}
      <CentralMessage />

      {/* Modules grouped by phase */}
      <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
        {modulos.map((modulo, index) => {
          const phaseKey = getPhaseForIndex(index);
          
          return (
            <div key={modulo.id}>
              {/* Phase indicator for first of each phase */}
              {phaseKey && (
                <PhaseIndicator phase={progressionPhases[phaseKey]} />
              )}
              
              <ModuloCard
                modulo={modulo}
                index={index}
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
