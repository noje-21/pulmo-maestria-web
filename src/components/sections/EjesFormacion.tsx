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
  ChevronDown,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const ejes = [
  {
    id: "diagnostico",
    numero: "01",
    icon: Stethoscope,
    titulo: "Diagnóstico Avanzado",
    frase: "Porque cada latido cuenta una historia",
    descripcion: "Domina las herramientas diagnósticas de última generación. Desde el ecocardiograma hasta el cateterismo derecho, desarrolla el ojo clínico que tus pacientes necesitan.",
    temas: [
      "Ecocardiografía enfocada en HP",
      "Cateterismo cardíaco derecho",
      "Interpretación hemodinámica",
      "Pruebas de vasorreactividad"
    ],
    color: "primary" as const
  },
  {
    id: "fisiopatologia",
    numero: "02",
    icon: Heart,
    titulo: "Fisiopatología Profunda",
    frase: "Entiende el por qué, no solo el qué",
    descripcion: "Sumérgete en los mecanismos moleculares y celulares que explican la hipertensión pulmonar. Conocimiento que transforma tu razonamiento clínico.",
    temas: [
      "Remodelado vascular pulmonar",
      "Disfunción endotelial",
      "Mecanismos inflamatorios",
      "Genética y HP"
    ],
    color: "accent" as const
  },
  {
    id: "tratamiento",
    numero: "03",
    icon: Pill,
    titulo: "Estrategias Terapéuticas",
    frase: "Tratamientos que cambian pronósticos",
    descripcion: "Aprende a diseñar esquemas de tratamiento personalizados. Desde la monoterapia hasta las combinaciones avanzadas y el momento del trasplante.",
    temas: [
      "Terapia específica para HP",
      "Estrategias de combinación",
      "Manejo del fallo derecho",
      "Indicaciones de trasplante"
    ],
    color: "primary" as const
  },
  {
    id: "clinica",
    numero: "04",
    icon: Activity,
    titulo: "Escenarios Clínicos",
    frase: "Casos reales, decisiones reales",
    descripcion: "Discute y resuelve casos clínicos complejos con expertos. Desarrolla el criterio para tomar decisiones en situaciones de alta complejidad.",
    temas: [
      "HP en cardiopatías congénitas",
      "HP y enfermedades autoinmunes",
      "Embarazo e HP",
      "Situaciones de emergencia"
    ],
    color: "accent" as const
  },
  {
    id: "investigacion",
    numero: "05",
    icon: Microscope,
    titulo: "Fronteras de la Ciencia",
    frase: "Lo que viene cambiará todo",
    descripcion: "Conoce los últimos avances en investigación. Nuevas moléculas, biomarcadores, y terapias emergentes que definirán el futuro de la especialidad.",
    temas: [
      "Terapias génicas",
      "Nuevos biomarcadores",
      "Inteligencia artificial en HP",
      "Ensayos clínicos actuales"
    ],
    color: "primary" as const
  },
  {
    id: "integracion",
    numero: "06",
    icon: Brain,
    titulo: "Visión Integral",
    frase: "El paciente es más que su enfermedad",
    descripcion: "Aborda la HP desde una perspectiva multidisciplinaria. Calidad de vida, aspectos psicológicos, y el arte de comunicar pronósticos difíciles.",
    temas: [
      "Rehabilitación pulmonar",
      "Cuidados paliativos",
      "Comunicación médico-paciente",
      "Trabajo multidisciplinario"
    ],
    color: "accent" as const
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

interface EjeCardProps {
  eje: typeof ejes[0];
  isExpanded: boolean;
  onToggle: () => void;
}

const EjeCard = ({ eje, isExpanded, onToggle }: EjeCardProps) => {
  const Icon = eje.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      className="group"
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer",
          "bg-card hover:shadow-xl",
          isExpanded 
            ? "border-primary/30 shadow-lg" 
            : "border-border/50 hover:border-primary/20",
          eje.color === "primary" ? "hover:shadow-primary/10" : "hover:shadow-accent/10"
        )}
        onClick={onToggle}
      >
        {/* Signature Accent Bar */}
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full transition-all duration-400",
          eje.color === "primary" ? "bg-primary" : "bg-accent",
          isExpanded ? "w-1.5" : "w-1"
        )} />
        
        {/* Decorative gradient on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          eje.color === "primary" 
            ? "bg-gradient-to-br from-primary/5 via-transparent to-transparent" 
            : "bg-gradient-to-br from-accent/5 via-transparent to-transparent"
        )} />

        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Number Badge */}
            <div className={cn(
              "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-400 group-hover:scale-110",
              eje.color === "primary" 
                ? "bg-primary/10 text-primary group-hover:bg-primary/15" 
                : "bg-accent/10 text-accent group-hover:bg-accent/15"
            )}>
              {eje.numero}
            </div>
            
            {/* Title & Icon */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  eje.color === "primary" ? "text-primary" : "text-accent"
                )} />
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {eje.titulo}
                </h3>
              </div>
              <p className={cn(
                "text-sm font-medium italic",
                eje.color === "primary" ? "text-primary/70" : "text-accent/70"
              )}>
                "{eje.frase}"
              </p>
            </div>
            
            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 p-2 rounded-full bg-muted/50 group-hover:bg-muted transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
            {eje.descripcion}
          </p>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={cn(
                      "w-4 h-4",
                      eje.color === "primary" ? "text-primary" : "text-accent"
                    )} />
                    <span className="text-sm font-semibold text-foreground">Temas clave:</span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {eje.temas.map((tema, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <ArrowRight className={cn(
                          "w-3.5 h-3.5 flex-shrink-0",
                          eje.color === "primary" ? "text-primary" : "text-accent"
                        )} />
                        <span>{tema}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        subtitle="Cada módulo está diseñado para que domines un aspecto esencial de la circulación pulmonar. Sin atajos, sin superficialidades."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto"
      >
        {ejes.map((eje) => (
          <EjeCard
            key={eje.id}
            eje={eje}
            isExpanded={expandedId === eje.id}
            onToggle={() => handleToggle(eje.id)}
          />
        ))}
      </motion.div>

      {/* Scroll invitation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12"
      >
        <p className="text-muted-foreground text-sm italic">
          Haz clic en cada eje para explorar los temas · Continúa scrolleando para conocer a los expertos ↓
        </p>
      </motion.div>
    </Section>
  );
};
