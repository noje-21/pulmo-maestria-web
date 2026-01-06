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
    texto: "La maestría superó todas mis expectativas. La calidad de los docentes y el enfoque práctico me permitieron aplicar inmediatamente lo aprendido. Hoy diagnostico con mayor seguridad.",
    rating: 5,
    año: "2024"
  },
  {
    nombre: "Dra. Patricia Vargas",
    cargo: "Neumóloga",
    pais: "Colombia",
    imagen: null,
    texto: "Una experiencia que cambió mi forma de ver la circulación pulmonar. El networking con colegas de toda Latinoamérica sigue siendo valioso años después.",
    rating: 5,
    año: "2023"
  },
  {
    nombre: "Dr. Alejandro Ruiz",
    cargo: "Internista",
    pais: "Perú",
    imagen: null,
    texto: "Antes de la maestría, la hipertensión pulmonar me generaba incertidumbre. Ahora tengo herramientas concretas para diagnosticar y tratar con confianza.",
    rating: 5,
    año: "2023"
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
        badge="Voces de nuestros egresados"
        title="Historias que inspiran"
        subtitle="Cada testimonio refleja una transformación profesional. Descubre cómo esta formación impactó sus carreras."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonios.map((testimonio, index) => (
          <motion.article 
            key={index} 
            variants={cardVariants}
            aria-label={`Testimonio de ${testimonio.nombre}`}
          >
            <div className="card-base card-hover h-full group relative overflow-hidden p-6 md:p-7">
              {/* Brand Signature Corner */}
              <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-0.5 h-5 bg-accent rounded-br-sm" />
              
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400">
                <Quote className="w-20 h-20 text-primary" />
              </div>

              {/* Year Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1" aria-label={`Calificación: ${testimonio.rating} de 5 estrellas`}>
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Promoción {testimonio.año}
                </span>
              </div>

              {/* Texto */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 flex-1 relative z-10 text-sm sm:text-base">
                "{testimonio.texto}"
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-4 pt-5 border-t border-border/40">
                <Avatar name={testimonio.nombre} size="lg" />
                <div>
                  <cite className="font-semibold text-foreground group-hover:text-primary transition-colors not-italic">
                    {testimonio.nombre}
                  </cite>
                  <p className="text-sm text-muted-foreground">
                    {testimonio.cargo} · {testimonio.pais}
                  </p>
                </div>
              </footer>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
};
