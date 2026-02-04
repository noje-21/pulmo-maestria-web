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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const ejes = [
  {
    id: "diagnostico",
    numero: "I",
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
    ]
  },
  {
    id: "fisiopatologia",
    numero: "II",
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
    ]
  },
  {
    id: "tratamiento",
    numero: "III",
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
    ]
  },
  {
    id: "clinica",
    numero: "IV",
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
    ]
  },
  {
    id: "investigacion",
    numero: "V",
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
    ]
  },
  {
    id: "integracion",
    numero: "VI",
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
    ]
  }
];

interface EjeCardProps {
  eje: typeof ejes[0];
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

const EjeCard = ({ eje, isExpanded, onToggle, index }: EjeCardProps) => {
  const Icon = eje.icon;
  const isEven = index % 2 === 0;
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
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
        
        {/* Signature accent line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-all duration-500",
          isEven ? "bg-primary" : "bg-accent",
          isExpanded ? "opacity-100" : "opacity-60 group-hover:opacity-100"
        )} />

        {/* Main content */}
        <div className="relative p-6 sm:p-8 lg:p-10">
          {/* Header row */}
          <div className="flex items-start gap-5 mb-6">
            {/* Eje identifier */}
            <div className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center",
              "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
              "transition-all duration-500 group-hover:scale-105",
              isEven 
                ? "bg-primary/10 text-primary" 
                : "bg-accent/10 text-accent"
            )}>
              <span className="text-xs font-medium uppercase tracking-wider opacity-70">Eje</span>
              <span className="text-2xl sm:text-3xl font-bold">{eje.numero}</span>
            </div>
            
            {/* Title and icon */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isEven ? "text-primary" : "text-accent"
                )} />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                  {eje.titulo}
                </h3>
              </div>
              <p className={cn(
                "text-sm sm:text-base font-medium",
                isEven ? "text-primary/80" : "text-accent/80"
              )}>
                {eje.enfoque}
              </p>
            </div>
            
            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                "transition-colors duration-300",
                isExpanded 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Impact phrase */}
          <blockquote className={cn(
            "relative pl-4 mb-6 border-l-2 transition-colors",
            isEven ? "border-primary/40" : "border-accent/40"
          )}>
            <p className="text-lg sm:text-xl italic text-muted-foreground">
              "{eje.frase}"
            </p>
          </blockquote>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
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
                <div className="pt-6 mt-6 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className={cn(
                      "w-4 h-4",
                      isEven ? "text-primary" : "text-accent"
                    )} />
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Competencias Clave
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
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
                          isEven ? "bg-primary" : "bg-accent"
                        )} />
                        <span className="text-sm sm:text-base text-foreground/90">
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
          <p className={cn(
            "text-xs text-muted-foreground/60 mt-4 text-center sm:hidden transition-opacity",
            isExpanded ? "opacity-0" : "opacity-100"
          )}>
            Toca para explorar
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export const EjesFormacion = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <Section 
      id="ejes-formacion" 
      background="gradient" 
      pattern="grid" 
      padding="large"
    >
      <SectionHeader
        badge="6 Ejes de Formación"
        title="Un programa que lo cubre todo"
        subtitle="Cada eje está diseñado para que domines un aspecto esencial de la circulación pulmonar. Sin atajos, sin superficialidades."
      />

      {/* Single column for maximum protagonist effect */}
      <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
        {ejes.map((eje, index) => (
          <EjeCard
            key={eje.id}
            eje={eje}
            index={index}
            isExpanded={expandedId === eje.id}
            onToggle={() => handleToggle(eje.id)}
          />
        ))}
      </div>

      {/* Scroll invitation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <p className="text-muted-foreground text-sm">
          Explora cada eje para descubrir las competencias · Continúa para conocer a los expertos ↓
        </p>
      </motion.div>
    </Section>
  );
};
