import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { Globe, Stethoscope, Users, BookOpen, Lock } from "lucide-react";

const puntos = [
  {
    icon: Globe,
    title: "Referentes internacionales",
    description: "9+ especialistas de primer nivel que lideran la investigación y práctica clínica en circulación pulmonar.",
  },
  {
    icon: Stethoscope,
    title: "Formación práctica real",
    description: "Casos clínicos reales, simulaciones y talleres que transforman tu criterio desde el primer día.",
  },
  {
    icon: Users,
    title: "Red profesional latinoamericana",
    description: "Conecta con colegas de +15 países que enfrentan los mismos desafíos clínicos.",
  },
  {
    icon: BookOpen,
    title: "Campus virtual continuo",
    description: "Materiales, recursos y seguimiento antes, durante y después de la instancia presencial.",
  },
  {
    icon: Lock,
    title: "Cupos limitados",
    description: "Grupos reducidos para garantizar atención personalizada y experiencia de élite.",
  },
];

export const Diferencial = () => {
  return (
    <Section id="diferencial" background="gradient" pattern="dots" padding="large">
      <SectionHeader
        badge="Lo que nos hace únicos"
        title="¿Por qué esta maestría es diferente?"
        subtitle="No es solo un curso más. Es la formación que transforma tu práctica clínica."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 max-w-6xl mx-auto">
        {puntos.map((punto, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="group"
          >
            <div className="card-base card-hover h-full p-5 md:p-6 text-center brand-card-signature">
              <div className="inline-flex p-3 rounded-2xl mb-4 bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300 group-hover:scale-110 transform">
                <punto.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {punto.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {punto.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
