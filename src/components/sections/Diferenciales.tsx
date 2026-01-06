import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { 
  GraduationCap, 
  Globe, 
  Users, 
  Award, 
  BookOpen, 
  HeartPulse 
} from "lucide-react";

const diferenciales = [
  {
    icon: GraduationCap,
    title: "Formación que transforma",
    description: "No es solo teoría. Cada módulo está diseñado para que al día siguiente tengas nuevas herramientas en tu consulta.",
    color: "primary" as const
  },
  {
    icon: Globe,
    title: "Pensado para Latinoamérica",
    description: "Entendemos los desafíos de nuestra región: recursos limitados, casos complejos, pacientes que llegan tarde. Formamos para esa realidad.",
    color: "accent" as const
  },
  {
    icon: Users,
    title: "Una comunidad que acompaña",
    description: "Aquí no termina cuando acaban las clases. Construyes conexiones con colegas que enfrentan los mismos retos.",
    color: "primary" as const
  },
  {
    icon: Award,
    title: "Respaldo institucional",
    description: "Certificación avalada por instituciones que conocen el valor de la formación seria y comprometida.",
    color: "accent" as const
  },
  {
    icon: BookOpen,
    title: "Aprender haciendo",
    description: "Casos clínicos reales, discusiones que desafían tu criterio, simulaciones que te preparan para lo inesperado.",
    color: "primary" as const
  },
  {
    icon: HeartPulse,
    title: "Siempre actualizado",
    description: "La circulación pulmonar evoluciona rápido. Nosotros también. Acceso a lo último en investigación y práctica clínica.",
    color: "accent" as const
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const Diferenciales = () => {
  return (
    <Section id="diferenciales" background="gradient" pattern="dots" padding="large">
      <SectionHeader
        badge="Lo que nos hace diferentes"
        title="¿Por qué esta Maestría?"
        subtitle="Porque sabemos lo que significa buscar formación de verdad útil. Esto es lo que encontrarás aquí."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {diferenciales.map((item, index) => (
          <motion.div 
            key={index} 
            variants={cardVariants}
            className="group"
          >
            <div className="card-base card-hover h-full p-6 md:p-7 brand-card-signature">
              {/* Icon with gradient background */}
              <div className={`inline-flex p-3.5 rounded-2xl mb-5 transition-all duration-400 group-hover:scale-110 ${
                item.color === 'primary' 
                  ? 'bg-primary/10 group-hover:bg-primary/15' 
                  : 'bg-accent/10 group-hover:bg-accent/15'
              }`}>
                <item.icon className={`w-6 h-6 ${
                  item.color === 'primary' ? 'text-primary' : 'text-accent'
                }`} />
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
