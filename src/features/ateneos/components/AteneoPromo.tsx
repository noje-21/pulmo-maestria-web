import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import flyerAsset from "@/assets/ateneo-flyer-2025.png.asset.json";

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
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-[0_10px_40px_-15px_rgba(30,47,107,0.35)]"
    >
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Content — mirrors the flyer's layout on white */}
        <div className="order-2 lg:order-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.02] tracking-tight uppercase mb-1"
            style={{ color: FLYER_NAVY }}
          >
            Hipertensión Pulmonar
          </h2>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase text-neutral-900 mb-6 sm:mb-8 leading-tight">
            Ateneos Latinoamericanos 2025
          </p>

          <ul className="space-y-1.5 text-neutral-800 text-base sm:text-lg mb-2">
            <li>- Discusión de casos clínicos</li>
            <li>- Abordaje multidisciplinario</li>
            <li>- Últimas novedades</li>
          </ul>
          <p className="text-neutral-900 font-bold text-base sm:text-lg mb-8">
            ¡Te invitamos a participar!
          </p>

          {/* Info rows — icon + label + value like the flyer */}
          <div className="space-y-4 sm:space-y-5 mb-8">
            <InfoRow
              icon={<Calendar className="w-6 h-6" strokeWidth={1.75} />}
              label="Día"
              value="Todos los lunes"
            />
            <InfoRow
              icon={<Clock className="w-6 h-6" strokeWidth={1.75} />}
              label="Hora"
              value="13:00 hs ARG"
            />
            <InfoRow
              icon={<MapPin className="w-6 h-6" strokeWidth={1.75} />}
              label="Plataforma"
              value="Zoom"
            />
          </div>

          {/* UNITE pill button */}
          <a
            href={ZOOM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center self-start px-10 sm:px-12 py-3 rounded-full text-white font-bold tracking-widest text-base sm:text-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mb-4"
            style={{ backgroundColor: FLYER_NAVY }}
            aria-label="Unirme al ateneo por Zoom"
          >
            UNIRME AL ATENEO
          </a>

          <div className="text-sm sm:text-base text-neutral-800 leading-relaxed">
            <p>
              <span className="font-bold">ID de reunión:</span> 852 2063 1979
            </p>
            <p>
              <span className="font-bold">Código de acceso:</span> 532924
            </p>
          </div>
        </div>

        {/* Flyer */}
        <div className="order-1 lg:order-2 relative bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <img
            src={flyerAsset.url}
            alt="Flyer Ateneos Latinoamericanos de Hipertensión Pulmonar 2025"
            loading="lazy"
            className="w-full h-auto max-h-[640px] object-contain rounded-xl"
          />
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
    <div className="flex items-center gap-4">
      <div className="shrink-0" style={{ color: FLYER_NAVY }}>
        {icon}
      </div>
      <div className="leading-tight">
        <div className="font-bold text-base sm:text-lg" style={{ color: FLYER_NAVY }}>
          {label}
        </div>
        <div className="text-neutral-800 text-sm sm:text-base">{value}</div>
      </div>
    </div>
  );
}