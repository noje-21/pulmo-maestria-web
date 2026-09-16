import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-maestria.webp";
import heroImg from "@/assets/secion/maestria_2025_13.webp";
import { heroStats } from "./campaignData";

interface Props {
  whatsappHref: string;
  onPrimary: () => void;
}

export const CampaignHero = memo(function CampaignHero({ whatsappHref, onPrimary }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(229,80%,8%)] via-[hsl(229,65%,14%)] to-[hsl(229,60%,18%)]">
      {/* Imagen de fondo real de la edición anterior */}
      <img
        src={heroImg}
        alt="Sesión académica de la Maestría Latinoamericana en Circulación Pulmonar"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(229,80%,8%)]/90 via-[hsl(229,75%,12%)]/90 to-[hsl(229,70%,16%)]/95" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Logo Maestría Latinoamericana en Circulación Pulmonar"
            className="h-12 w-12 rounded-full bg-white object-contain p-1 sm:h-14 sm:w-14"
            width={56}
            height={56}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-sm">
            Edición 2026 · Latinoamérica
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 text-balance text-3xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
        >
          Maestría Latinoamericana en{" "}
          <span className="block text-accent-light">Circulación Pulmonar</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Formación intensiva en hipertensión pulmonar para{" "}
          <strong className="font-semibold text-white">
            cardiólogos, neumonólogos, internistas y reumatólogos
          </strong>
          : 12 días presenciales en Buenos Aires, 30 módulos y campus virtual de apoyo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 flex flex-col gap-3 text-sm text-white/85 sm:flex-row sm:items-center sm:gap-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
            <Calendar className="h-4 w-4 text-accent-light" aria-hidden="true" />2 al 16 de noviembre de 2026
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
            <MapPin className="h-4 w-4 text-accent-light" aria-hidden="true" />Buenos Aires, Argentina
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={onPrimary}
            className="h-14 w-full bg-accent text-base font-semibold text-accent-foreground shadow-accent hover:bg-accent-dark sm:w-auto sm:px-8"
          >
            Solicitar información
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 w-full border-white/40 bg-white/10 text-base font-semibold text-white hover:bg-white/20 hover:text-white sm:w-auto sm:px-8"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Escribir por WhatsApp
            </a>
          </Button>
        </motion.div>

        <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-2xl font-bold text-white sm:text-3xl">{s.value}</span>
                <span className="mt-1 block text-xs font-medium text-white/75 sm:text-sm">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
});
