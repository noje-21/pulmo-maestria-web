import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import flyerAsset from "@/assets/ateneo-flyer-blank.png.asset.json";

const ZOOM_URL =
  "https://us02web.zoom.us/j/85220631979?pwd=M3l1WjNqc0N3Y1h2aTVvWDNYR0crdz09";

// Navy tone matching the flyer's institutional blue.
const FLYER_NAVY = "#1e2f6b";

export default function AteneoPromo() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_10px_40px_-15px_rgba(30,47,107,0.4)]"
      style={{ aspectRatio: "850 / 1200" }}
    >
      {/* Background flyer imagery (blank — text erased) */}
      <img
        src={flyerAsset.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />

      {/* Overlaid content — mirrors the flyer's layout */}
      <div className="relative z-10 w-full h-full flex flex-col px-[5%] py-[4%]">
        {/* Titles */}
        <div className="text-left">
          <h2
            className="font-extrabold uppercase tracking-tight leading-[1]"
            style={{
              color: FLYER_NAVY,
              fontSize: "clamp(1.4rem, 4.6vw, 3rem)",
            }}
          >
            Hipertensión Pulmonar
          </h2>
          <p
            className="font-extrabold uppercase text-neutral-900 leading-tight mt-1"
            style={{ fontSize: "clamp(1rem, 3.2vw, 2rem)" }}
          >
            Ateneos Latinoamericanos 2025
          </p>
        </div>

        {/* Bullet list */}
        <div
          className="mt-[5%] text-neutral-900"
          style={{ fontSize: "clamp(0.75rem, 1.9vw, 1.15rem)" }}
        >
          <ul className="space-y-1">
            <li>- Discusión de casos clínicos</li>
            <li>- Abordaje multidisciplinario</li>
            <li>- Últimas novedades</li>
          </ul>
          <p className="font-bold mt-2">¡Te invitamos a participar!</p>
        </div>

        {/* Info rows */}
        <div
          className="mt-[6%] space-y-[2.5%] max-w-[55%]"
          style={{ fontSize: "clamp(0.7rem, 1.7vw, 1.05rem)" }}
        >
          <InfoRow
            icon={<Calendar strokeWidth={1.75} className="w-full h-full" />}
            label="Día"
            value="Todos los lunes"
          />
          <InfoRow
            icon={<Clock strokeWidth={1.75} className="w-full h-full" />}
            label="Hora"
            value="13:00 hs ARG"
          />
          <InfoRow
            icon={<MapPin strokeWidth={1.75} className="w-full h-full" />}
            label="Plataforma"
            value="Zoom"
          />
        </div>

        {/* Zoom CTA + credentials at bottom-left, avoiding the right-side echocardiogram */}
        <div className="mt-auto pt-[6%] max-w-[62%]">
          <a
            href={ZOOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-white font-bold tracking-[0.15em] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{
              backgroundColor: FLYER_NAVY,
              fontSize: "clamp(0.7rem, 1.55vw, 0.95rem)",
            }}
            aria-label="Unirme al ateneo por Zoom"
          >
            <Video className="w-4 h-4" strokeWidth={2} />
            UNIRME AL ATENEO
          </a>

          <div
            className="mt-3 text-neutral-900 leading-snug"
            style={{ fontSize: "clamp(0.65rem, 1.4vw, 0.9rem)" }}
          >
            <p>
              <span className="font-bold">ID de reunión:</span> 852 2063 1979
            </p>
            <p>
              <span className="font-bold">Código de acceso:</span> 532924
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="shrink-0 w-[clamp(1.25rem,3vw,2rem)] h-[clamp(1.25rem,3vw,2rem)]"
        style={{ color: FLYER_NAVY }}
      >
        {icon}
      </div>
      <div className="leading-tight">
        <div className="font-bold" style={{ color: FLYER_NAVY }}>
          {label}
        </div>
        <div className="text-neutral-900">{value}</div>
      </div>
    </div>
  );
}