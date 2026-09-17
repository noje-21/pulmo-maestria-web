import { memo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { equipoData } from "@/data/nosotros";
import g1 from "@/assets/secion/maestria_2025_1.webp";
import g2 from "@/assets/secion/maestria_2025_3.webp";
import g3 from "@/assets/secion/maestria_2025_7.webp";
import g4 from "@/assets/secion/maestria_2025_14.webp";
import g5 from "@/assets/secion/maestria_2025_17.webp";
import {
  audiencias,
  cronograma,
  faqs,
  instituciones,
  pasos,
  recorrido,
  valueProps,
} from "./campaignData";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45 },
};

const galeria = [
  { src: g4, alt: "Disertación sobre hipertensión pulmonar durante la Maestría" },
  { src: g2, alt: "Práctica de ecocardiografía con strain" },
  { src: g3, alt: "Monitoreo hemodinámico invasivo en sala de cateterismo" },
  { src: g1, alt: "Clase magistral sobre factores de riesgo" },
  { src: g5, alt: "Análisis de imagen diagnóstica en sesión académica" },
];

export const CampaignSections = memo(function CampaignSections({
  onPrimary,
  whatsappHref,
}: {
  onPrimary: () => void;
  whatsappHref: string;
}) {
  return (
    <>
      {/* PROPUESTA DE VALOR */}
      <section className="bg-muted/40 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Por qué esta formación
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
              Profundidad clínica que pocos programas ofrecen
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              La circulación pulmonar exige un enfoque integral. Este programa combina teoría,
              práctica hospitalaria y comunidad profesional.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((v, i) => (
              <motion.article
                key={v.title}
                {...fade}
                transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <BadgeCheck className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ ES / A QUIÉN */}
      <section className="bg-background px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Qué es la Maestría
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
              Un programa latinoamericano dedicado a la circulación pulmonar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Programa presencial intensivo con módulos teóricos y prácticos que abarcan desde la
              anatomía y fisiopatología hasta los esquemas terapéuticos en hipertensión pulmonar. Se
              desarrolla en el Centro Gallego de Buenos Aires, el Sanatorio Trinidad de Quilmes y el
              Hospital María Ferrer, con un campus virtual de apoyo.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "30 módulos y 131 horas académicas",
                "12 días presenciales del 2 al 16 de noviembre de 2026",
                "Circuito práctico en instituciones de referencia",
                "Cierre con el Simposio Latinoamericano de Hipertensión Pulmonar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fade} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              A quién está dirigida
            </p>
            <h3 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">
              Médicos que tratan pacientes con hipertensión pulmonar
            </h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {audiencias.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary"
                >
                  <Stethoscope className="h-4 w-4" aria-hidden="true" />
                  {a}
                </span>
              ))}
            </div>

            <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Dirección académica
            </h4>
            <ul className="mt-4 space-y-4">
              {equipoData.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <img
                    src={m.imagen}
                    alt={m.nombre}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{m.nombre}</span>
                    <span className="block text-xs text-muted-foreground">{m.rol}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* RECORRIDO ACADÉMICO */}
      <section className="bg-muted/40 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Experiencia académica
            </p>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
              Cinco fases, doce días, un recorrido completo
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {recorrido.map((f, i) => (
              <motion.div
                key={f.fase}
                {...fade}
                transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <span className="text-sm font-bold text-accent">0{i + 1}</span>
                <h3 className="mt-2 text-base font-bold text-foreground">{f.fase}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.detalle}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            {cronograma.map((c, i) => (
              <motion.div
                key={c.titulo}
                {...fade}
                transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.05 }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center"
              >
                <span className="inline-flex w-fit items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                  {c.fecha}
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground sm:text-lg">{c.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {c.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="bg-background py-14 sm:py-20" aria-label="Imágenes de ediciones anteriores">
        <div className="mx-auto mb-6 max-w-6xl px-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Ediciones anteriores
          </p>
          <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
            Así se vive la Maestría
          </h2>
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-6">
          {galeria.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="h-56 w-[80vw] max-w-sm shrink-0 snap-center rounded-2xl object-cover sm:h-72 sm:w-96"
            />
          ))}
        </div>
      </section>

      {/* INSTITUCIONES */}
      <section className="bg-muted/40 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fade}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Respaldo</p>
            <h2 className="mt-3 text-2xl font-bold text-foreground sm:text-4xl">
              Instituciones asociadas al programa
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {instituciones.map((inst) => (
              <div key={inst.nombre} className="rounded-2xl border border-border bg-card p-6">
                <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-bold text-foreground">{inst.nombre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{inst.rol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-background px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...fade} className="text-2xl font-bold text-foreground sm:text-4xl">
            ¿Cómo funciona la inscripción?
          </motion.h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <motion.li
                key={p.titulo}
                {...fade}
                transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.descripcion}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA INTERMEDIO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark px-5 py-14 sm:px-6 sm:py-20">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-accent/25 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary-foreground sm:text-4xl">
            Los cupos de la edición 2026 se asignan por orden de solicitud
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/85">
            Envía tus datos y el equipo académico se comunicará contigo. La solicitud no tiene costo.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={onPrimary}
              className="h-14 w-full bg-accent text-base font-semibold text-accent-foreground hover:bg-accent-dark sm:w-auto sm:px-8"
            >
              Solicitar información
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 w-full border-primary-foreground/40 bg-primary-foreground/10 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground sm:w-auto sm:px-8"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground sm:text-4xl">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
});
