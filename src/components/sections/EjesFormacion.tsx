import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Microscope,
  Brain,
  Pill,
  ChevronRight,
  Sparkles,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Narrative progression phases
const progressionPhases = {
  inicio: {
    label: "Punto de Partida",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Construye las bases del diagnóstico experto"
  },
  profundizacion: {
    label: "Profundización",
    color: "text-accent",
    bgColor: "bg-accent/10",
    description: "Domina los mecanismos y estrategias"
  },
  integracion: {
    label: "Integración Clínica",
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Aplica el conocimiento con criterio experto"
  }
};

const ejes = [
  {
    id: "diagnostico",
    numero: "I",
    phase: "inicio",
    icon: Stethoscope,
    titulo: "Diagnóstico Avanzado",
    enfoque: "Del síntoma a la certeza diagnóstica",
    frase: "Porque cada latido cuenta una historia",
    descripcion: "Domina las herramientas diagnósticas de última generación. Desde el ecocardiograma hasta el cateterismo derecho, desarrolla el ojo clínico que tus pacientes necesitan.",
    temas: [
      "Ecocardiografía enfocada en HP",
      "Cateterismo cardíaco derecho",
      "Interpretación hemodinámica",
      "Pruebas de vasorreactividad"
    ],
    narrativeLink: null
  },
  {
    id: "fisiopatologia",
    numero: "II",
    phase: "inicio",
    icon: Heart,
    titulo: "Fisiopatología Profunda",
    enfoque: "Los mecanismos que transforman tu razonamiento",
    frase: "Entiende el por qué, no solo el qué",
    descripcion: "Sumérgete en los mecanismos moleculares y celulares que explican la hipertensión pulmonar. Conocimiento que transforma tu razonamiento clínico.",
    temas: [
      "Remodelado vascular pulmonar",
      "Disfunción endotelial",
      "Mecanismos inflamatorios",
      "Genética y HP"
    ],
    narrativeLink: "Ahora, el conocimiento se convierte en acción →"
  },
  {
    id: "tratamiento",
    numero: "III",
    phase: "profundizacion",
    icon: Pill,
    titulo: "Estrategias Terapéuticas",
    enfoque: "Personaliza cada tratamiento",
    frase: "Tratamientos que cambian pronósticos",
    descripcion: "Aprende a diseñar esquemas de tratamiento personalizados. Desde la monoterapia hasta las combinaciones avanzadas y el momento del trasplante.",
    temas: [
      "Terapia específica para HP",
      "Estrategias de combinación",
      "Manejo del fallo derecho",
      "Indicaciones de trasplante"
    ],
    narrativeLink: null
  },
  {
    id: "clinica",
    numero: "IV",
    phase: "profundizacion",
    icon: Activity,
    titulo: "Escenarios Clínicos",
    enfoque: "Decisiones complejas, criterio experto",
    frase: "Casos reales, decisiones reales",
    descripcion: "Discute y resuelve casos clínicos complejos con expertos. Desarrolla el criterio para tomar decisiones en situaciones de alta complejidad.",
    temas: [
      "HP en cardiopatías congénitas",
      "HP y enfermedades autoinmunes",
      "Embarazo e HP",
      "Situaciones de emergencia"
    ],
    narrativeLink: "Preparándote para lo que viene →"
  },
  {
    id: "investigacion",
    numero: "V",
    phase: "integracion",
    icon: Microscope,
    titulo: "Fronteras de la Ciencia",
    enfoque: "Lo que viene cambiará la especialidad",
    frase: "Lo que viene cambiará todo",
    descripcion: "Conoce los últimos avances en investigación. Nuevas moléculas, biomarcadores, y terapias emergentes que definirán el futuro de la especialidad.",
    temas: [
      "Terapias génicas",
      "Nuevos biomarcadores",
      "Inteligencia artificial en HP",
      "Ensayos clínicos actuales"
    ],
    narrativeLink: null
  },
  {
    id: "integracion",
    numero: "VI",
    phase: "integracion",
    icon: Brain,
    titulo: "Visión Integral",
    enfoque: "El paciente como centro de todo",
    frase: "El paciente es más que su enfermedad",
    descripcion: "Aborda la HP desde una perspectiva multidisciplinaria. Calidad de vida, aspectos psicológicos, y el arte de comunicar pronósticos difíciles.",
    temas: [
      "Rehabilitación pulmonar",
      "Cuidados paliativos",
      "Comunicación médico-paciente",
      "Trabajo multidisciplinario"
    ],
    narrativeLink: null
  }
];

interface EjeCardProps {
  eje: typeof ejes[0];
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
  isFirstOfPhase: boolean;
}

// Phase indicator component
const PhaseIndicator = ({ phase }: { phase: keyof typeof progressionPhases }) => {
  const phaseData = progressionPhases[phase];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        phaseData.bgColor
      )}>
        <div className={cn("w-2 h-2 rounded-full bg-current", phaseData.color)} />
        <span className={cn("text-sm font-semibold uppercase tracking-wider", phaseData.color)}>
          {phaseData.label}
        </span>
      </div>
      <p className="text-muted-foreground text-sm mt-2 ml-1">
        {phaseData.description}
      </p>
    </motion.div>
  );
};

// Narrative link between cards - more subtle and minimal
const NarrativeLink = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="flex items-center justify-center py-10 md:py-14"
  >
    <p className="text-xs sm:text-sm text-muted-foreground/50 font-medium tracking-wide">
      {text}
    </p>
  </motion.div>
);

const EjeCard = ({ eje, isExpanded, onToggle, index, isFirstOfPhase }: EjeCardProps) => {
  const Icon = eje.icon;
  const isEven = index % 2 === 0;
  const phase = progressionPhases[eje.phase as keyof typeof progressionPhases];
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="group"
    >
      <div 
        onClick={onToggle}
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
          eje.phase === "profundizacion" ? "bg-accent" : "bg-primary",
          isExpanded ? "opacity-100" : "opacity-60 group-hover:opacity-100"
        )} />

        {/* Main content - enhanced mobile spacing */}
        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Chapter indicator for mobile - more prominent */}
          <div className="flex items-center justify-between mb-5 sm:hidden">
            <span className={cn(
              "text-sm font-bold uppercase tracking-wider",
              phase.color
            )}>
              Capítulo {eje.numero}
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
            {/* Eje identifier */}
            <div className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center",
              "w-14 h-14 sm:w-20 sm:h-20 rounded-2xl",
              "transition-all duration-500 group-hover:scale-105",
              eje.phase === "profundizacion"
                ? "bg-accent/10 text-accent" 
                : "bg-primary/10 text-primary"
            )}>
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-70">Eje</span>
              <span className="text-xl sm:text-3xl font-bold">{eje.numero}</span>
            </div>
            
            {/* Title and icon */}
            <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <Icon className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors",
                  eje.phase === "profundizacion" ? "text-accent" : "text-primary"
                )} />
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {eje.titulo}
                </h3>
              </div>
              <p className={cn(
                "text-xs sm:text-base font-medium",
                eje.phase === "profundizacion" ? "text-accent/80" : "text-primary/80"
              )}>
                {eje.enfoque}
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

          {/* Impact phrase */}
          <blockquote className={cn(
            "relative pl-3 sm:pl-4 mb-4 sm:mb-6 border-l-2 transition-colors",
            eje.phase === "profundizacion" ? "border-accent/40" : "border-primary/40"
          )}>
            <p className="text-base sm:text-xl italic text-muted-foreground">
              "{eje.frase}"
            </p>
          </blockquote>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-lg mb-3 sm:mb-4">
            {eje.descripcion}
          </p>

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
                      eje.phase === "profundizacion" ? "text-accent" : "text-primary"
                    )} />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                      Competencias Clave
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {eje.temas.map((tema, idx) => (
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
                          eje.phase === "profundizacion" ? "bg-accent" : "bg-primary"
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

          {/* Tap hint for mobile - more elegant */}
          <div className={cn(
            "mt-6 text-center sm:hidden transition-all duration-300",
            isExpanded ? "opacity-0 h-0" : "opacity-100"
          )}>
            <span className="text-xs text-muted-foreground/50 font-medium">
              Toca para explorar →
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// Central message component - refined for brevity and human connection
const CentralMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16 md:mb-20 max-w-2xl mx-auto px-4"
  >
    {/* Icon */}
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex justify-center mb-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <GraduationCap className="w-7 h-7 text-primary" />
      </div>
    </motion.div>
    
    {/* Main message - concise and memorable */}
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
      De la teoría al{" "}
      <span className="text-primary">criterio clínico</span>
    </h3>
    
    <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
      Un recorrido en 6 capítulos que transforma tu forma de pensar y decidir.
    </p>

    {/* Minimal journey indicator */}
    <div className="flex items-center justify-center gap-3 mt-8 text-xs sm:text-sm text-muted-foreground/60">
      <span className="text-primary font-medium">Inicio</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-accent font-medium">Profundización</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-primary font-medium">Integración</span>
    </div>
  </motion.div>
);

// Contextual CTA component
const ContextualCTA = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-12 md:mt-16"
    >
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl" />
        <div className="relative bg-card/60 backdrop-blur-sm border border-primary/20 rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Has explorado el recorrido completo. Ahora imagina recorrerlo junto a expertos de toda Latinoamérica.
          </p>
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6 sm:px-8 gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            <GraduationCap className="w-5 h-5" />
            Comenzar mi formación
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const EjesFormacion = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Group ejes by phase for rendering
  const getPhaseForIndex = (index: number): keyof typeof progressionPhases | null => {
    const eje = ejes[index];
    const prevEje = ejes[index - 1];
    
    if (index === 0 || eje.phase !== prevEje?.phase) {
      return eje.phase as keyof typeof progressionPhases;
    }
    return null;
  };

  return (
    <Section 
      id="ejes-formacion" 
      background="gradient" 
      pattern="grid" 
      padding="large"
    >
      <SectionHeader
        badge="Tu Recorrido Formativo"
        title="6 Ejes. Un propósito."
        subtitle="Cada eje es un capítulo en tu transformación como especialista en circulación pulmonar."
      />

      {/* Central Message */}
      <CentralMessage />

      {/* Single column for maximum protagonist effect */}
      {/* Cards with enhanced mobile spacing */}
      <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
        {ejes.map((eje, index) => {
          const phaseToShow = getPhaseForIndex(index);
          
          return (
            <div key={eje.id}>
              {/* Phase indicator for first of each phase */}
              {phaseToShow && (
                <PhaseIndicator phase={phaseToShow} />
              )}
              
              <EjeCard
                eje={eje}
                index={index}
                isExpanded={expandedId === eje.id}
                onToggle={() => handleToggle(eje.id)}
                isFirstOfPhase={!!phaseToShow}
              />
              
              {/* Narrative link after each card (except the last) */}
              {eje.narrativeLink && (
                <NarrativeLink text={eje.narrativeLink} />
              )}
            </div>
          );
        })}
      </div>

      {/* Contextual CTA */}
      <ContextualCTA />
    </Section>
  );
};
