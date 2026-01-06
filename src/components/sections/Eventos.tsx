import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, Stethoscope, Users, Award } from "lucide-react";

const eventos = [
  {
    fecha: "3-4 Nov",
    titulo: "Introducción y Fundamentos",
    descripcion: "Anatomía y fisiología de la circulación pulmonar. Bases hemodinámicas y grupos de HTP, estudios iniciales y abordaje.",
    icon: BookOpen,
    color: "primary"
  },
  {
    fecha: "5-7 Nov",
    titulo: "Circuito Práctico",
    descripcion: "Ecocardiografía, ECG, Hemodinámica y CCD, intersticiopatías, enfermedades reumatológicas, estudios de función pulmonar.",
    icon: Stethoscope,
    color: "accent"
  },
  {
    fecha: "8-10 Nov",
    titulo: "Diagnóstico y Tratamiento",
    descripcion: "Clasificación de riesgos, diagnóstico avanzado, estratificación de riesgo y manejo terapéutico integral.",
    icon: Stethoscope,
    color: "primary"
  },
  {
    fecha: "11-13 Nov",
    titulo: "Casos Clínicos y Talleres",
    descripcion: "Últimas novedades, avances tecnológicos, IA, bioestadística avanzada e interpretación de Trials clínicos.",
    icon: Users,
    color: "accent"
  },
  {
    fecha: "14-15 Nov",
    titulo: "Simposio y Clausura",
    descripcion: "Simposio Latinoamericano de Hipertensión Pulmonar. Ceremonia de clausura y examen final.",
    icon: Award,
    color: "primary"
  }
];

export const Eventos = () => {
  return (
    <section id="eventos" className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">Calendario Académico</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Programa intensivo del 3 al 15 de noviembre 2025
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line - Desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30 -translate-x-1/2" />
          
          {/* Events */}
          <div className="space-y-6 md:space-y-0">
            {eventos.map((evento, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative md:flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-0' : 'md:pl-0'}`}>
                  <Card className="card-base card-hover group bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Date Badge */}
                        <div className={`shrink-0 w-20 md:w-24 flex flex-col items-center justify-center p-3 ${
                          evento.color === 'primary' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent text-accent-foreground'
                        }`}>
                          <Calendar className="w-5 h-5 mb-1 opacity-80" />
                          <span className="text-sm font-bold text-center leading-tight">
                            {evento.fecha}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-4 md:p-5">
                          <div className="flex items-start gap-3">
                            <div className={`shrink-0 p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                              evento.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                            }`}>
                              <evento.icon className={`w-5 h-5 ${
                                evento.color === 'primary' ? 'text-primary' : 'text-accent'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {evento.titulo}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {evento.descripcion}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Dot - Desktop only */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary z-10" />
                
                {/* Spacer for alternate side */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            12 días de formación intensiva con certificación oficial
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold">
            <Calendar className="w-5 h-5" />
            <span>Buenos Aires, Argentina · Noviembre 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
