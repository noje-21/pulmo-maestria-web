import { memo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-maestria.webp";
import heroImg from "@/assets/secion/maestria_2025_18.webp";
import { heroStats } from "./campaignData";

interface Props {
  whatsappHref: string;
  onPrimary: () => void;
}

export const CampaignHero = memo(function CampaignHero({ whatsappHref, onPrimary }: Props) {
  const reducedMotion = useReducedMotion();
  const reveal = (delay: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay: reducedMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <>
      <section className="relative isolate flex min-h-[720px] flex-col overflow-hidden bg-background text-foreground sm:min-h-[730px] lg:min-h-[780px]">
        <motion.img
          src={heroImg}
          alt="Participantes de una edición anterior de la Maestría Latinoamericana en Circulación Pulmonar"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center lg:object-[center_44%]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          initial={reducedMotion ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.7, ease: "easeOut" }}
        />
        <div className="campaign-photo-shade absolute inset-0 -z-10" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-12 pt-6 sm:px-8 sm:pt-9 lg:px-12 lg:pb-16">
          <motion.div {...reveal(0)} className="flex items-center justify-between gap-3">
            <Link to="/" aria-label="Ir a la página principal" className="inline-flex items-center gap-3 text-foreground transition-opacity hover:opacity-75">
              <img src={logo} alt="" className="h-11 w-11 rounded-full bg-card object-contain p-1" width={44} height={44} />
              <span className="max-w-[190px] text-[10px] font-semibold uppercase leading-snug tracking-widest sm:max-w-none sm:text-xs">Maestría Latinoamericana<br />en Circulación Pulmonar</span>
            </Link>
            <Button asChild variant="ghost" size="sm" className="shrink-0 text-xs font-semibold text-foreground hover:bg-foreground/10 hover:text-foreground sm:text-sm">
              <Link to="/">Sitio principal <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </motion.div>

          <div className="my-auto max-w-[750px] py-12 sm:py-20 lg:py-24">
            <motion.div {...reveal(0.12)} className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-foreground/85">
              <span className="h-px w-9 bg-accent-light" aria-hidden="true" /> Edición 2026 · Latinoamérica
            </motion.div>
            <motion.h1 {...reveal(0.2)} className="max-w-[720px] text-[clamp(2.7rem,6vw,5.5rem)] font-normal leading-[1.07] text-foreground">
              Maestría Latinoamericana en <em className="font-normal text-foreground">Circulación Pulmonar</em>
            </motion.h1>
            <motion.p {...reveal(0.28)} className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
              Formación intensiva en hipertensión pulmonar para cardiólogos, neumonólogos, internistas y reumatólogos. Práctica clínica y comunidad profesional en Buenos Aires.
            </motion.p>
            <motion.div {...reveal(0.34)} className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-l-2 border-accent-light pl-4 text-sm text-foreground/90 sm:text-base">
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent-light" aria-hidden="true" />2 al 16 de noviembre de 2026</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-light" aria-hidden="true" />Buenos Aires, Argentina</span>
            </motion.div>
            <motion.div {...reveal(0.4)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={onPrimary} className="h-14 w-full rounded-sm bg-accent text-base font-semibold text-accent-foreground shadow-accent hover:bg-accent-dark sm:w-auto sm:px-8">
                Solicitar información <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 w-full rounded-sm border-foreground/60 bg-transparent text-base font-semibold text-foreground hover:border-foreground hover:bg-foreground/10 hover:text-foreground sm:w-auto sm:px-7">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />Escribir por WhatsApp</a>
              </Button>
            </motion.div>
          </div>

          <a href="#programa" className="inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-widest text-foreground/80 transition-colors hover:text-foreground">
            Descubrir el programa <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="bg-background px-5 py-9 sm:px-8 sm:py-11 lg:px-12" aria-label="La Maestría en cifras">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 divide-x-0 sm:grid-cols-4 sm:divide-x sm:divide-border">
          {heroStats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-accent/70 pl-4 sm:border-l-0 sm:pl-7 first:sm:pl-0">
              <span className="block text-3xl font-semibold text-primary sm:text-4xl">{stat.value}</span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
});