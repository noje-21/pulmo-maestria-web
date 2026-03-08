import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MapPin, Calendar, Play, ExternalLink, Building, CheckCircle } from "lucide-react";

const instituciones = [
  { nombre: "Centro Gallego de Buenos Aires", rol: "Sede principal del programa" },
  { nombre: "Sanatorio Trinidad de Quilmes", rol: "Centro de práctica clínica" },
  { nombre: "Hospital María Ferrer", rol: "Referente en enfermedades respiratorias" },
  { nombre: "Red BASA", rol: "Red de instituciones de salud" }
];

const features = [
  {
    icon: BookOpen,
    title: "Modalidad",
    description: "12 días presenciales intensivos + campus virtual de apoyo con materiales, recursos y seguimiento continuo.",
    color: "primary"
  },
  {
    icon: Calendar,
    title: "Fechas",
    description: "Del 2 al 16 de noviembre de 2026. Formación intensiva presencial con los mejores especialistas.",
    color: "accent"
  },
  {
    icon: MapPin,
    title: "Ubicación e Instituciones",
    description: "Buenos Aires, Argentina. Sede: ",
    color: "primary",
    expandable: true
  },
  {
    icon: Building,
    title: "Certificación",
    description: "Certificación oficial respaldada por instituciones médicas de prestigio de Latinoamérica.",
    color: "accent"
  }
];

export const Maestria = memo(function Maestria() {
  return (
    <section id="maestria" className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      <div className="section-container relative z-10">
        {/* Section Header with Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">¿Por qué esta Maestría?</h2>
          <div className="section-divider" />
          <p className="section-subtitle max-w-3xl mx-auto">
            Porque la circulación pulmonar requiere un enfoque integral que pocos programas ofrecen. 
            Aquí encontrarás la profundidad clínica que tus pacientes merecen.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="card-base card-hover group bg-card"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'primary' ? 'text-primary' : 'text-accent'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                {'expandable' in feature && feature.expandable && (
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {instituciones.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>
                          <span className="font-medium text-foreground">{inst.nombre}</span>
                          <span className="text-muted-foreground"> — {inst.rol}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="card-base overflow-hidden bg-card">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Video con Autoplay Optimizado */}
                <div className="lg:w-2/3 relative">
                  <video 
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls 
                    preload="metadata" 
                    className="w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] object-cover"
                  >
                    <source src="/video.mp4" type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                
                {/* Video Info */}
                <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="inline-flex items-center gap-2 text-accent font-semibold mb-3">
                    <Play className="w-5 h-5" />
                    <span>Video Informativo</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    Conoce nuestra Maestría
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Descubre todo sobre el programa, los docentes, y cómo esta formación puede impulsar tu carrera médica.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-fit"
                    onClick={() => window.open("https://www.maestriacp.com/", "_blank")}
                  >
                    Más Información
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </section>
  );
});
