import { motion } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import ImageLazy from "@/components/common/ImageLazy";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import {
  GraduationCap, Target, Eye, Heart, Users,
  BookOpen, ExternalLink, ArrowRight,
} from "lucide-react";
import {
  equipoData,
  trabajosData,
  publicacionesData,
} from "@/data/nosotros";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" as const },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nosotros - Maestría en Circulación Pulmonar"
        description="Conoce al equipo, misión, visión y trayectoria de la Maestría Latinoamericana en Circulación Pulmonar."
        keywords="nosotros, equipo, misión, visión, circulación pulmonar, hipertensión pulmonar"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Nosotros - Maestría Latinoamericana en Circulación Pulmonar",
          description: "Equipo, misión, visión y trayectoria de la Maestría Latinoamericana en Circulación Pulmonar.",
          url: "https://www.maestriacp.com/nosotros",
          mainEntity: {
            "@type": "EducationalOrganization",
            name: "Maestría Latinoamericana en Circulación Pulmonar",
          },
        }}
      />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" aria-hidden="true" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="brand-badge-accent mb-4 inline-flex text-xs sm:text-sm">
                <GraduationCap className="w-3.5 h-3.5" />
                Nuestra Historia
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                Nosotros
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Somos un equipo multidisciplinario de especialistas latinoamericanos comprometidos con la formación de excelencia en circulación pulmonar y enfermedades vasculares del pulmón.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quiénes somos */}
        <AnimatedOnView>
          <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">Quiénes Somos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    La Maestría Latinoamericana en Circulación Pulmonar es un programa de formación intensiva que reúne a los principales referentes en hipertensión pulmonar y enfermedades vasculares del pulmón de toda Latinoamérica.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Desde nuestra fundación, hemos formado a más de 500 profesionales de la salud de 15 países, contribuyendo significativamente al avance del conocimiento y la mejora en la atención de pacientes con enfermedades vasculares pulmonares en la región.
                  </p>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border/50">
                  <ImageLazy
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
                    alt="Equipo de la Maestría en Circulación Pulmonar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        </AnimatedOnView>

        {/* Misión & Visión */}
        <AnimatedOnView>
          <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="card-base p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Misión</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Formar profesionales de excelencia en el diagnóstico, tratamiento y seguimiento de las enfermedades vasculares pulmonares, promoviendo la investigación colaborativa y la mejora continua de la atención de nuestros pacientes en Latinoamérica.
                </p>
              </div>
              <div className="card-base p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-accent/10 rounded-xl">
                    <Eye className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Visión</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Ser el programa de referencia en formación en circulación pulmonar de Latinoamérica, reconocido por su rigor científico, innovación pedagógica y contribución al desarrollo de la especialidad en la región.
                </p>
              </div>
            </div>
          </section>
        </AnimatedOnView>

        {/* Equipo */}
        <AnimatedOnView>
          <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <span className="brand-badge-accent mb-3 inline-flex text-xs sm:text-sm">
                  <Users className="w-3.5 h-3.5" />
                  Nuestro Equipo
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">Equipo Directivo</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {equipoData.map((m, i) => (
                  <motion.div
                    key={m.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                    className="card-base card-hover overflow-hidden text-center group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <ImageLazy
                        src={m.imagen}
                        alt={m.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-1">{m.nombre}</h3>
                      <p className="text-primary text-sm font-medium mb-2">{m.rol}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{m.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedOnView>

        {/* Trabajos Realizados */}
        <AnimatedOnView>
          <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <span className="brand-badge-accent mb-3 inline-flex text-xs sm:text-sm">
                  <Heart className="w-3.5 h-3.5" />
                  Trayectoria
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">Trabajos Realizados</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {trabajosData.map((t, i) => (
                  <motion.div
                    key={t.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                    className="card-base card-hover overflow-hidden group"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <ImageLazy
                        src={t.imagenes[0]}
                        alt={t.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground mb-2">{t.fecha}</p>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{t.titulo}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{t.descripcion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedOnView>

        {/* Publicaciones */}
        <AnimatedOnView>
          <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <span className="brand-badge-accent mb-3 inline-flex text-xs sm:text-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                  Producción Científica
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">Publicaciones</h2>
              </div>
              <div className="space-y-4">
                {publicacionesData.map((p, i) => (
                  <motion.div
                    key={p.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                    className="card-base card-hover p-5 sm:p-6 flex items-start gap-4 group"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">{p.titulo}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-1">{p.autores}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">{p.revista}</span> · {p.año}
                      </p>
                    </div>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                        aria-label={`Ver publicación: ${p.titulo}`}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedOnView>
      </main>

      <Footer />
    </div>
  );
};

export default Nosotros;