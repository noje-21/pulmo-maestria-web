import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Nicolas from "@/assets/nicolas.jpg";
import Fabian from "@/assets/fabiam.jpg";
import Guille from "@/assets/guillermo.jpg";
import Marce from "@/assets/marcelo.jpg";
import Adri from "@/assets/adrien.jpg";
import Alejo from "@/assets/alejandro.jpg";
import Julie from "@/assets/julieta.jpg";
import GuilleS from "@/assets/guillermina.jpg";
import Dora from "@/assets/dora.jpg";

const expertos = [
  {
    nombre: "Dr. Adrián José Lescano",
    cargo: "Director de Maestría",
    especialidad: "Médico Cardiólogo · Magíster en Hipertensión Pulmonar · Especialista en Ultrasonografía Cardiovascular",
    institucion: "Fundación Favaloro · IECS",
    imagen: Adri,
    destacado: true
  },
  {
    nombre: "Dr. Nicolás Caruso",
    cargo: "Especialista en Cardiología",
    especialidad: "Medicina del Deporte",
    institucion: "Sanatorio de La Trinidad Mitre · UBA",
    imagen: Nicolas
  },
  {
    nombre: "Dr. Fabián Caro",
    cargo: "Jefe de Sección EPID",
    especialidad: "Enfermedades Pulmonares Intersticiales Difusas",
    institucion: "Hospital María Ferrer · UBA",
    imagen: Fabian
  },
  {
    nombre: "Dr. Guillermo Bortman",
    cargo: "Jefe de Insuficiencia Cardíaca e HP",
    especialidad: "Ex Director de Transplantes y Cirugía Cardiovascular",
    institucion: "Hospital J.D. Perón · Sanatorio Trinidad",
    imagen: Guille
  },
  {
    nombre: "Dr. Marcelo Nahin",
    cargo: "Jefe de Cirugía Cardiovascular",
    especialidad: "Especialista en Medicina Legal",
    institucion: "Hospital 'El Cruce'",
    imagen: Marce
  },
  {
    nombre: "Dr. Alejandro Nitsche",
    cargo: "Líder Médico en HP y EPI",
    especialidad: "Enfermedades del Tejido Conectivo",
    institucion: "Hospital Alemán · SAPEM · AMA",
    imagen: Alejo
  },
  {
    nombre: "Dra. Julieta Soricetti",
    cargo: "Médica Cardióloga",
    especialidad: "Magíster en HP · Especialista en Insuficiencia Cardíaca",
    institucion: "Universidad de Buenos Aires",
    imagen: Julie
  },
  {
    nombre: "Dra. Guillermina Soracio",
    cargo: "Cardióloga",
    especialidad: "Magíster en Hipertensión Pulmonar",
    institucion: "Pres. Electa Consejo Argentino IC-HP",
    imagen: GuilleS
  },
  {
    nombre: "Dra. Dora Hagg",
    cargo: "Coordinadora IC-HP-Trasplante",
    especialidad: "Especialista en Cardiología Pediátrica",
    institucion: "Hospital Garrahan",
    imagen: Dora
  }
];

/** Single expert card — memoized so re-renders in the parent don't recreate each card */
const ExpertoCard = memo(function ExpertoCard({
  experto,
  index,
}: {
  experto: (typeof expertos)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.38,
        // Tight stagger — capped at 5 cards × 0.06 = 0.30s max delay
        delay: Math.min(index, 5) * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="card-base card-hover h-full group bg-card brand-card-signature">
        <CardContent className="p-5 flex flex-col items-center text-center h-full">
          {/* Photo */}
          <div className="relative mb-4">
            {/* Glow only on hover — opacity-0 baseline, no continuous animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            <img
              src={experto.imagen}
              alt={experto.nombre}
              loading="lazy"
              decoding="async"
              className="relative w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-3 border-border shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h3 className="text-base md:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {experto.nombre}
          </h3>
          <p className="text-accent text-sm font-semibold mb-2">
            {experto.cargo}
          </p>
          <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent mb-2" />
          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
            {experto.especialidad}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-auto">
            {experto.institucion}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export const Expertos = () => {
  const director = expertos.find(e => e.destacado);
  const otrosExpertos = expertos.filter(e => !e.destacado);

  return (
    <section
      id="expertos"
      className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="section-header"
        >
          <h2 className="section-title brand-section-signature-center">Aprende de los mejores</h2>
          <p className="section-subtitle mt-8 max-w-3xl mx-auto">
            No solo son expertos en circulación pulmonar. Son profesionales que entienden 
            los retos de la práctica clínica y saben cómo transmitir ese conocimiento.
          </p>
        </motion.div>

        {/* Director Card - Featured */}
        {director && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12"
          >
            <Card className="card-base overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 brand-accent-bar">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
                    <img
                      src={director.imagen}
                      alt={director.nombre}
                      className="relative w-36 h-36 md:w-44 md:h-44 object-cover rounded-2xl border-4 border-background shadow-xl"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-2 rounded-xl shadow-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                      Director de Maestría
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {director.nombre}
                    </h3>
                    <p className="text-accent font-medium mb-2">
                      {director.especialidad}
                    </p>
                    <p className="text-muted-foreground">
                      {director.institucion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Experts Grid — each card animates independently via whileInView */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {otrosExpertos.map((experto, index) => (
            <ExpertoCard key={experto.nombre} experto={experto} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
