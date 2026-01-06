import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/common/Section";
import { 
  ClipboardCheck, 
  GraduationCap, 
  Award,
  ArrowRight
} from "lucide-react";

const pasos = [
  {
    numero: "01",
    icon: ClipboardCheck,
    titulo: "Inscripción",
    descripcion: "Completa el formulario de inscripción y envía tu documentación. Nuestro equipo evaluará tu perfil profesional.",
    color: "primary"
  },
  {
    numero: "02",
    icon: GraduationCap,
    titulo: "Formación Intensiva",
    descripcion: "Participa en 12 días de formación presencial con clases teóricas, talleres prácticos y discusión de casos clínicos.",
    color: "accent"
  },
  {
    numero: "03",
    icon: Award,
    titulo: "Certificación",
    descripcion: "Aprueba la evaluación final y recibe tu certificación oficial como especialista en circulación pulmonar.",
    color: "primary"
  }
];

export const ComoFunciona = () => {
  return (
    <Section id="como-funciona" background="muted" pattern="grid" padding="large">
      <SectionHeader
        badge="Proceso de Inscripción"
        title="¿Cómo Funciona?"
        subtitle="Tres simples pasos para transformar tu carrera profesional"
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Línea conectora - Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent -translate-y-1/2 z-0" />

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {pasos.map((paso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <Card className="card-base card-hover h-full group bg-card relative z-10 brand-card-signature">
                <CardContent className="p-6 md:p-8 text-center">
                  {/* Número */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto transition-transform duration-300 group-hover:scale-110 ${
                    paso.color === 'primary' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    <span className="text-2xl font-bold">{paso.numero}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    paso.color === 'primary' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    <paso.icon className={`w-6 h-6 ${
                      paso.color === 'primary' ? 'text-primary' : 'text-accent'
                    }`} />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {paso.titulo}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {paso.descripcion}
                  </p>
                </CardContent>
              </Card>

              {/* Flecha entre pasos - Mobile */}
              {index < pasos.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
