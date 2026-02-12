import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Monitor,
  BookOpen,
  Users,
  Bot,
  HeadphonesIcon,
  Play,
  ExternalLink,
  Calendar,
  MapPin,
  Building,
} from "lucide-react";

const experiencias = [
  {
    icon: GraduationCap,
    title: "12 días presenciales intensivos",
    description: "Formación cara a cara con expertos internacionales en Buenos Aires. Casos clínicos, talleres y simulaciones.",
    badge: "Presencial",
    color: "primary" as const,
  },
  {
    icon: Monitor,
    title: "Campus virtual de apoyo",
    description: "Acceso a materiales, clases grabadas y recursos antes, durante y después de la instancia presencial.",
    badge: "Online",
    color: "accent" as const,
  },
  {
    icon: BookOpen,
    title: "Biblioteca especializada",
    description: "Papers, guías clínicas y material actualizado disponible las 24 horas desde cualquier lugar.",
    badge: "Recursos",
    color: "primary" as const,
  },
  {
    icon: Users,
    title: "Comunidad activa",
    description: "Foro exclusivo de profesionales, discusiones de casos y networking continuo con colegas de +15 países.",
    badge: "Networking",
    color: "accent" as const,
  },
  {
    icon: Bot,
    title: "Asistente IA académico",
    description: "Consultas inmediatas sobre contenido del programa, bibliografía y orientación personalizada.",
    badge: "Innovación",
    color: "primary" as const,
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte humano dedicado",
    description: "Equipo académico disponible por WhatsApp y email para resolver cualquier duda o necesidad.",
    badge: "Acompañamiento",
    color: "accent" as const,
  },
];

const infoCards = [
  { icon: Calendar, label: "2 al 16 de noviembre de 2026" },
  { icon: MapPin, label: "Buenos Aires, Argentina" },
  { icon: Building, label: "Centro Gallego de Buenos Aires" },
];

export const ExperienciaFormativa = () => {
  return (
    <Section id="experiencia" background="muted" pattern="grid" padding="large">
      <SectionHeader
        badge="Más que un programa"
        title="La experiencia no termina en los 12 días"
        subtitle="Un ecosistema completo que te acompaña en cada etapa de tu formación."
      />

      {/* Info strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 md:mb-16"
      >
        {infoCards.map((info, i) => {
          const Icon = info.icon;
          return (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/40 text-sm font-medium text-foreground shadow-sm"
            >
              <Icon className="w-4 h-4 text-accent" />
              {info.label}
            </div>
          );
        })}
      </motion.div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mb-12">
        {experiencias.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
          >
            <Card className="card-base card-hover h-full group brand-card-signature">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      exp.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                    }`}
                  >
                    <exp.icon
                      className={`w-5 h-5 ${
                        exp.color === "primary" ? "text-primary" : "text-accent"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                    </div>
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                        exp.color === "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {exp.badge}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video promo */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="card-base overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 relative">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] object-cover"
                >
                  <source src="/video.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="lg:w-1/3 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="inline-flex items-center gap-2 text-accent font-semibold mb-3">
                  <Play className="w-5 h-5" />
                  <span>Video Informativo</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Conoce la experiencia completa
                </h3>
                <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
                  Descubre cómo se vive la maestría: docentes, sede, programa y comunidad.
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
    </Section>
  );
};
