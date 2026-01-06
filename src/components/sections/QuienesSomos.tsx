import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Building2, Handshake, CheckCircle } from "lucide-react";
import logoMaestria from "@/assets/logo-maestria.jpg";

const instituciones = [
  { nombre: "Centro Gallego de Buenos Aires", rol: "Sede principal del programa" },
  { nombre: "Sanatorio Trinidad de Quilmes", rol: "Centro de práctica clínica" },
  { nombre: "Hospital María Ferrer", rol: "Referente en enfermedades respiratorias" },
  { nombre: "Red BASA", rol: "Red de instituciones de salud" }
];

const valores = [
  {
    icon: Target,
    titulo: "Nuestro Propósito",
    descripcion: "Sabemos que detrás de cada diagnóstico hay una persona que confía en ti. Por eso formamos médicos que no solo tratan enfermedades, sino que transforman vidas con conocimiento de vanguardia y criterio clínico sólido.",
    color: "primary"
  },
  {
    icon: Handshake,
    titulo: "Nuestro Compromiso Contigo",
    descripcion: "No solo compartimos conocimiento: te acompañamos en tu crecimiento profesional. Aquí encontrarás mentores que entienden los desafíos de la práctica clínica real y una comunidad que te respalda.",
    color: "accent"
  }
];

export const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      
      <div className="section-container relative z-10">
        {/* Section Header with Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">El equipo detrás de tu formación</h2>
          <div className="section-divider" />
          <p className="section-subtitle max-w-3xl mx-auto">
            Somos un grupo de especialistas que vivimos los mismos desafíos que tú enfrentas. 
            Por eso creamos el programa que hubiéramos querido tener.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <img 
              src={logoMaestria} 
              alt="Logo Maestría Latinoamericana en Circulación Pulmonar" 
              className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-background group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
            />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 order-1 lg:order-2"
          >
            {/* Mission & Commitment Cards */}
            {valores.map((valor, index) => (
              <Card key={index} className="card-base card-hover group bg-card">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      valor.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      <valor.icon className={`w-6 h-6 ${
                        valor.color === 'primary' ? 'text-primary' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                        {valor.titulo}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {valor.descripcion}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Institutions Card */}
            <Card className="card-base bg-card">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">
                    Instituciones Colaboradoras
                  </h3>
                </div>
                <ul className="space-y-3">
                  {instituciones.map((inst, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                          {inst.nombre}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          — {inst.rol}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
