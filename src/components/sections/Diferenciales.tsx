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
    title: "Formación de Excelencia",
    description: "Programa académico riguroso diseñado por expertos internacionales en circulación pulmonar.",
    color: "primary" as const
  },
  {
    icon: Globe,
    title: "Enfoque Latinoamericano",
    description: "Contenido adaptado a la realidad clínica y epidemiológica de nuestra región.",
    color: "accent" as const
  },
  {
    icon: Users,
    title: "Networking Profesional",
    description: "Conecta con especialistas de toda Latinoamérica y construye relaciones duraderas.",
    color: "primary" as const
  },
  {
    icon: Award,
    title: "Certificación Reconocida",
    description: "Título avalado por instituciones médicas de prestigio internacional.",
    color: "accent" as const
  },
  {
    icon: BookOpen,
    title: "Metodología Práctica",
    description: "Combinación de teoría y práctica con casos clínicos reales y simulaciones.",
    color: "primary" as const
  },
  {
    icon: HeartPulse,
    title: "Actualización Continua",
    description: "Acceso a las últimas investigaciones y avances en hipertensión pulmonar.",
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
        badge="¿Por qué elegirnos?"
        title="Nuestros Diferenciales"
        subtitle="Descubre qué hace única a nuestra maestría en Latinoamérica"
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
            <div className="card-base card-hover h-full p-6 md:p-7">
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
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              {/* Accent line */}
              <div className={`w-10 h-0.5 rounded-full mb-3 transition-all duration-300 group-hover:w-14 ${
                item.color === 'primary' ? 'bg-primary/30' : 'bg-accent/30'
              }`} />
              
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
