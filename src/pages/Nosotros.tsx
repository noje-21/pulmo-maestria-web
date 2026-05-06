import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/common/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import ImageLazy from "@/components/common/ImageLazy";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import {
  GraduationCap, Target, Eye, Heart, Users,
  BookOpen, ExternalLink, FileText,
} from "lucide-react";
import {
  equipoData,
  trabajosData,
  publicacionesData,
} from "@/data/nosotros";
import heroImage from "@/assets/secion/maestria_2025_1.jpg";
import type { Publicacion } from "@/data/nosotros";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" as const },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const Nosotros = () => {
  const [modulos, setModulos] = useState<Publicacion[]>(publicacionesData);
  const [pdfSource, setPdfSource] = useState("/MAESTRIA_CP_2025.pdf");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("section", "modulos_destacados")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) {
          const c = data.content as any;
          if (c.items?.length) setModulos(c.items);
          if (c.pdfSource) setPdfSource(c.pdfSource.startsWith("/") ? c.pdfSource : `/${c.pdfSource}`);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Equipo Directivo y Trayectoria — Maestría en Circulación Pulmonar"
        description="Conocé al Dr. Adrián Lescano y al equipo directivo de la Maestría Latinoamericana en Circulación Pulmonar: 9 especialistas, 30 módulos y 131 horas académicas confirmadas."
        keywords="equipo directivo, Adrián Lescano, maestría circulación pulmonar, hipertensión pulmonar, estructura docente"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Equipo Directivo — Maestría Latinoamericana en Circulación Pulmonar",
          description: "Director: Dr. Adrián José Lescano. Estructura docente con 9 especialistas en hipertensión pulmonar y circulación pulmonar. 30 módulos, 131 horas académicas.",
          url: "https://www.campus.maestriacp.com/nosotros",
          mainEntity: {
            "@type": "EducationalOrganization",
            name: "Maestría Latinoamericana en Circulación Pulmonar",
            member: equipoData
              .filter((m) => m.destacado)
              .map((m) => ({
                "@type": "Person",
                name: m.nombre,
                jobTitle: m.rol,
              })),
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
                Nuestro Equipo
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
                    src={heroImage}
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
                {/* Director destacado first, then rest */}
                {equipoData
                  .slice()
                  .sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
                  .map((m, i) => (
                  <motion.div
                    key={m.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                    className={`card-base card-hover overflow-hidden text-center group ${m.destacado ? "sm:col-span-2 lg:col-span-2 ring-2 ring-primary/20" : ""}`}
                  >
                    <div className={`overflow-hidden ${m.destacado ? "aspect-[3/2]" : "aspect-square"}`}>
                      <ImageLazy
                        src={m.imagen}
                        alt={m.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-1">{m.nombre}</h3>
                      <p className={`text-sm font-medium mb-2 ${m.destacado ? "text-accent" : "text-primary"}`}>{m.rol}</p>
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
                  Contenido Académico
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">Módulos Destacados</h2>
              </div>
              <div className="space-y-4">
              {modulos.map((p, i) => (
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
              {/* Source reference */}
              <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground/80">Fuente:</span>{" "}
                    Programa oficial de la Maestría Latinoamericana en Circulación Pulmonar (MAESTRIA_CP_2025.pdf).
                    Toda la información de equipo, módulos y actividades ha sido extraída del documento institucional vigente.
                  </p>
                  <a
                    href={pdfSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium mt-2 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver programa completo (PDF)
                  </a>
                </div>
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