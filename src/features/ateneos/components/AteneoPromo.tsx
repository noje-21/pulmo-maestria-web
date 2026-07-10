import { motion } from "framer-motion";
import { Calendar, Clock, Video, ArrowRight, Sparkles } from "lucide-react";
import flyerAsset from "@/assets/ateneo-flyer-2025.png.asset.json";

const ZOOM_URL =
  "https://us02web.zoom.us/j/85220631979?pwd=M3l1WjNqc0N3Y1h2aTVvWDNYR0crdz09";

export default function AteneoPromo() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.35)]"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Content */}
        <div className="order-2 lg:order-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-[hsl(229,80%,10%)] via-[hsl(229,70%,14%)] to-[hsl(229,60%,18%)] text-white">
          <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-accent/20 text-accent-light border border-accent/30 mb-4">
            <Sparkles className="w-3 h-3" />
            En vivo cada semana
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-2">
            Hipertensión Pulmonar
          </h2>
          <p className="text-accent-light text-base sm:text-lg font-semibold mb-5 sm:mb-6">
            Ateneos Latinoamericanos 2025
          </p>

          <ul className="space-y-1.5 text-white/85 text-sm sm:text-base mb-4">
            <li className="flex items-start gap-2">
              <span className="text-accent-light mt-1">•</span>
              <span>Discusión de casos clínicos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-light mt-1">•</span>
              <span>Abordaje multidisciplinario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-light mt-1">•</span>
              <span>Últimas novedades</span>
            </li>
          </ul>

          <p className="text-white font-semibold text-base sm:text-lg mb-6">
            ¡Te invitamos a participar!
          </p>

          {/* Info grid */}
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <InfoTile icon={<Calendar className="w-4 h-4" />} label="Día" value="Todos los lunes" />
            <InfoTile icon={<Clock className="w-4 h-4" />} label="Hora" value="13:00 hs ARG" />
            <InfoTile icon={<Video className="w-4 h-4" />} label="Plataforma" value="Zoom" />
          </div>

          {/* Zoom access */}
          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 mb-6 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="text-white/60">ID de reunión: </span>
                <span className="font-semibold text-white tracking-wide">852 2063 1979</span>
              </div>
              <div>
                <span className="text-white/60">Código: </span>
                <span className="font-semibold text-white tracking-wide">532924</span>
              </div>
            </div>
          </div>

          <a
            href={ZOOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 self-start px-6 sm:px-7 py-3.5 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm sm:text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Unirme al ateneo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Flyer */}
        <div className="order-1 lg:order-2 relative bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <img
            src={flyerAsset.url}
            alt="Flyer Ateneos Latinoamericanos de Hipertensión Pulmonar 2025"
            loading="lazy"
            className="w-full h-auto max-h-[560px] object-contain rounded-xl"
          />
        </div>
      </div>
    </motion.article>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-accent-light text-xs font-semibold uppercase tracking-wide mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-white text-sm font-medium leading-snug">{value}</div>
    </div>
  );
}