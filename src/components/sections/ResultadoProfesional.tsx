import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { Lightbulb, Crown, TrendingUp, Award } from "lucide-react";

const resultados = [
  {
    icon: Lightbulb,
    title: "Decisiones clínicas con criterio",
    description:
      "Evalúa y trata patologías de circulación pulmonar con seguridad, respaldado por evidencia y experiencia práctica real.",
  },
  {
    icon: Crown,
    title: "Liderazgo en tu institución",
    description:
      "Posiciónate como referente en hipertensión pulmonar dentro de tu hospital, clínica o servicio médico.",
  },
  {
    icon: TrendingUp,
    title: "Actualización real, no teórica",
    description:
      "Domina protocolos y abordajes que se aplican hoy en los centros más avanzados de la región.",
  },
  {
    icon: Award,
    title: "Prestigio profesional",
    description:
      "Certificación avalada por instituciones de primer nivel y una red de colegas en +15 países.",
  },
];

export const ResultadoProfesional = () => {
  return (
    <Section id="resultado" background="default" pattern="none" padding="large">
      <SectionHeader
        badge="Transformación real"
        title="Lo que cambia después de cursar"
        subtitle="No solo aprendes contenido. Transformas tu forma de ejercer la medicina."
      />

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
        {resultados.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="group"
          >
            <div className="card-base card-hover h-full p-6 md:p-7 brand-accent-bar">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-3 rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors duration-300 group-hover:scale-110 transform">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
