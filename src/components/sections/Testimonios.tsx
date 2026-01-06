import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { Avatar } from "@/components/common/Avatar";
import { Quote, Star } from "lucide-react";

const testimonios = [
  {
    nombre: "Dr. Carlos Mendoza",
    cargo: "Cardiólogo",
    pais: "México",
    imagen: null,
    texto: "La maestría superó todas mis expectativas. La calidad de los docentes y el enfoque práctico me permitieron aplicar inmediatamente lo aprendido en mi práctica clínica.",
    rating: 5
  },
  {
    nombre: "Dra. Patricia Vargas",
    cargo: "Neumóloga",
    pais: "Colombia",
    imagen: null,
    texto: "Una experiencia transformadora. El networking con colegas de toda Latinoamérica y el acceso a casos clínicos reales enriquecieron enormemente mi formación.",
    rating: 5
  },
  {
    nombre: "Dr. Alejandro Ruiz",
    cargo: "Internista",
    pais: "Perú",
    imagen: null,
    texto: "El programa me dio las herramientas necesarias para diagnosticar y tratar la hipertensión pulmonar con confianza. Altamente recomendado.",
    rating: 5
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

export const Testimonios = () => {
  return (
    <Section id="testimonios" background="default" pattern="none" padding="large">
      <SectionHeader
        badge="Testimonios"
        title="Lo Que Dicen Nuestros Egresados"
        subtitle="Profesionales de toda Latinoamérica comparten su experiencia"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonios.map((testimonio, index) => (
          <motion.div key={index} variants={cardVariants}>
            <div className="card-base card-hover h-full group relative overflow-hidden p-6 md:p-7 brand-card-signature">
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400">
                <Quote className="w-20 h-20 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(testimonio.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1 relative z-10">
                "{testimonio.texto}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-border/40">
                <Avatar name={testimonio.nombre} size="lg" />
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {testimonio.nombre}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonio.cargo} · {testimonio.pais}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};
