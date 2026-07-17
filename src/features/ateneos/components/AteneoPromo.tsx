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
      className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_10px_40px_-15px_rgba(30,47,107,0.4)] [container-type:inline-size]"
      style={{ aspectRatio: "850 / 1200" }}
    >
      {/* Background flyer imagery (blank — text erased) */}
      <img
        src={flyerAsset.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = "1";
            img.src = "/ateneo-flyer-blank.png";
          }
        }}
      />

      {/* Overlay — constrained to the flyer's white left column */}
      <div className="absolute inset-0 z-10">
        <h2
          className="absolute font-extrabold uppercase leading-[0.9] tracking-tight"
          style={{
            color: FLYER_NAVY,
            fontSize: "5.4cqw",
            top: "7%",
            left: "5%",
            width: "56%",
            letterSpacing: "-0.01em",
          }}
        >
          HIPERTENSIÓN
          <br />
          PULMONAR
        </h2>
        <p
          className="absolute font-extrabold uppercase text-neutral-900 leading-[1.05]"
          style={{ fontSize: "3.5cqw", top: "23%", left: "5%", width: "54%" }}
        >
          ATENEOS LATINOAMERICANOS 2026
        </p>

        <div
          className="absolute text-neutral-900"
          style={{ top: "34%", left: "6%", width: "55%", fontSize: "2.6cqw", lineHeight: 1.35 }}
        >
          <p>- Discusión de casos clínicos</p>
          <p>- Abordaje multidisciplinario</p>
          <p>- Últimas novedades</p>
          <p className="font-bold" style={{ marginTop: "0.8cqw" }}>
            ¡Te invitamos a participar!
          </p>
        </div>

        <div
          className="absolute flex flex-col"
          style={{ top: "52%", left: "8%", width: "52%", fontSize: "2.4cqw", gap: "1.4cqw" }}
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

        {/* Botón compacto tipo píldora, tamaño del flyer */}
        <a
          href={ZOOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inline-flex items-center justify-center rounded-full text-white font-bold tracking-[0.12em] shadow-md hover:shadow-xl hover:-translate-y-[0.2cqw] transition-all duration-300 whitespace-nowrap z-10"
          style={{
            top: "79%",
            left: "9%",
            width: "42cqw",
            backgroundColor: FLYER_NAVY,
            padding: "0.9cqw 1.6cqw",
            fontSize: "1.55cqw",
          }}
          aria-label="Unirme al ateneo por Zoom"
        >
          <Video
            strokeWidth={2}
            style={{ width: "1.6cqw", height: "1.6cqw", marginRight: "0.6cqw" }}
          />
          UNIRME AL ATENEO
        </a>

        <div
          className="absolute text-neutral-900 leading-[1.4] z-10"
          style={{ top: "87%", left: "9%", width: "52cqw", fontSize: "1.8cqw" }}
        >
            <p>
              <span className="font-bold">ID de reunión:</span> 852 2063 1979
            </p>
            <p>
              <span className="font-bold">Código de acceso:</span> 532924
            </p>
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
    <div className="flex items-center" style={{ gap: "1.5cqw" }}>
      <div
        className="shrink-0"
        style={{ color: FLYER_NAVY, width: "4.5cqw", height: "4.5cqw" }}
      >
        {icon}
      </div>
      <div className="leading-[1.15]">
        <div className="font-bold" style={{ color: FLYER_NAVY }}>
          {label}
        </div>
        <div className="text-neutral-900">{value}</div>
      </div>
    </div>
  );
}