import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/common/Section";
import { Play, X, MapPin, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoTestimonio {
  id: number;
  nombre: string;
  especialidad: string;
  ubicacion: string;
  videoSrc: string;
}

const testimonios: VideoTestimonio[] = [
  {
    id: 1,
    nombre: "Testimonio 1",
    especialidad: "Cardiólogo",
    ubicacion: "Latinoamérica",
    videoSrc: "/videos/testimonio-1.mp4",
  },
  {
    id: 2,
    nombre: "Testimonio 2",
    especialidad: "Neumólogo",
    ubicacion: "Latinoamérica",
    videoSrc: "/videos/testimonio-2.mp4",
  },
  {
    id: 3,
    nombre: "Testimonio 3",
    especialidad: "Internista",
    ubicacion: "Latinoamérica",
    videoSrc: "/videos/testimonio-3.mp4",
  },
  {
    id: 4,
    nombre: "Testimonio 4",
    especialidad: "Cardiólogo",
    ubicacion: "Latinoamérica",
    videoSrc: "/videos/testimonio-4.mp4",
  },
  {
    id: 5,
    nombre: "Testimonio 5",
    especialidad: "Neumólogo",
    ubicacion: "Latinoamérica",
    videoSrc: "/videos/testimonio-5.mp4",
  },
];

const VideoCard = memo(function VideoCard({
  testimonio,
  onPlay,
}: {
  testimonio: VideoTestimonio;
  onPlay: (t: VideoTestimonio) => void;
}) {
  const [thumbnailReady, setThumbnailReady] = useState(false);
  const thumbRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: testimonio.id * 0.08 }}
      className="group"
      aria-label={`Testimonio de ${testimonio.nombre}`}
    >
      <div className="card-base card-hover h-full overflow-hidden rounded-2xl">
        {/* Video thumbnail */}
        <div
          className="relative aspect-video bg-muted/40 cursor-pointer overflow-hidden"
          onClick={() => onPlay(testimonio)}
          role="button"
          tabIndex={0}
          aria-label={`Reproducir testimonio de ${testimonio.nombre}`}
          onKeyDown={(e) => e.key === "Enter" && onPlay(testimonio)}
        >
          <video
            ref={thumbRef}
            src={testimonio.videoSrc}
            muted
            preload="metadata"
            playsInline
            onLoadedData={() => setThumbnailReady(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              thumbnailReady ? "opacity-100" : "opacity-0"
            )}
          />

          {!thumbnailReady && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 animate-pulse" />
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-shadow duration-300"
            >
              <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
            </motion.div>
          </div>

          {/* Gradient bottom */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1.5 group-hover:text-primary transition-colors">
            {testimonio.nombre}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
              {testimonio.especialidad}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {testimonio.ubicacion}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export const Testimonios = () => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonio | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openVideo = useCallback((t: VideoTestimonio) => {
    setActiveVideo(t);
    document.body.style.overflow = "hidden";
  }, []);

  const closeVideo = useCallback(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Section id="testimonios" background="default" pattern="none" padding="large">
      <SectionHeader
        badge="Voces reales"
        title="Testimonios reales de nuestros alumnos"
        subtitle="Escucha directamente de quienes ya transformaron su práctica clínica con esta formación."
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {testimonios.map((t) => (
          <VideoCard key={t.id} testimonio={t} onPlay={openVideo} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 md:mt-16 text-center"
      >
        <p className="text-lg md:text-xl font-semibold text-foreground mb-4">
          Tú puedes ser el próximo testimonio
        </p>
        <Button size="lg" onClick={scrollToContact} className="gap-2">
          Inscribirme ahora
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeVideo}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden bg-black shadow-2xl"
            >
              <button
                onClick={closeVideo}
                className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>

              <video
                ref={modalVideoRef}
                src={activeVideo.videoSrc}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video"
              />

              <div className="p-4 bg-card">
                <h3 className="font-semibold text-foreground">{activeVideo.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeVideo.especialidad} · {activeVideo.ubicacion}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
