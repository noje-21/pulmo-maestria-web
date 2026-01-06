import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
    color: "primary"
  },
  {
    icon: Globe,
    title: "Enfoque Latinoamericano",
    description: "Contenido adaptado a la realidad clínica y epidemiológica de nuestra región.",
    color: "accent"
  },
  {
    icon: Users,
    title: "Networking Profesional",
    description: "Conecta con especialistas de toda Latinoamérica y construye relaciones duraderas.",
    color: "primary"
  },
  {
    icon: Award,
    title: "Certificación Reconocida",
    description: "Título avalado por instituciones médicas de prestigio internacional.",
    color: "accent"
  },
  {
    icon: BookOpen,
    title: "Metodología Práctica",
    description: "Combinación de teoría y práctica con casos clínicos reales y simulaciones.",
    color: "primary"
  },
  {
    icon: HeartPulse,
    title: "Actualización Continua",
    description: "Acceso a las últimas investigaciones y avances en hipertensión pulmonar.",
    color: "accent"
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
  hidden: { opacity: 0, y: 20 },
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
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {diferenciales.map((item, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className="card-base card-hover h-full group bg-card">
              <CardContent className="p-6 h-full flex flex-col">
                <div className={`inline-flex p-3 rounded-xl mb-4 w-fit transition-all duration-300 group-hover:scale-110 ${
                  item.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'primary' ? 'text-primary' : 'text-accent'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
