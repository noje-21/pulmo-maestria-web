import { useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Quote, ArrowRight, GraduationCap, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoTestimonio {
  id: number;
  nombre: string;
  especialidad: string;
  pais: string;
  cita: string;
  videoSrc: string;
  featured?: boolean;
}

const testimonios: VideoTestimonio[] = [
  {
    id: 1,
    nombre: "Testimonio Destacado",
    especialidad: "Cardiólogo Intervencionista",
    pais: "Argentina",
    cita: "Esta maestría transformó por completo mi abordaje clínico.",
    videoSrc: "/videos/testimonio-1.mp4",
    featured: true,
  },
  {
    id: 2,
    nombre: "Testimonio 2",
    especialidad: "Neumólogo",
    pais: "Colombia",
    cita: "La formación práctica marca la diferencia.",
    videoSrc: "/videos/testimonio-2.mp4",
  },
  {
    id: 3,
    nombre: "Testimonio 3",
    especialidad: "Internista",
    pais: "México",
    cita: "Apliqué lo aprendido desde el primer día.",
    videoSrc: "/videos/testimonio-3.mp4",
  },
];

const metrics = [
  { icon: GraduationCap, value: "+300", label: "médicos formados" },
  { icon: Globe, value: "+15", label: "países" },
  { icon: Sparkles, value: "100%", label: "aplicable desde el día 1" },
];

/* ─── Video Card ─── */
const VideoCard = memo(function VideoCard({
  testimonio,
  onPlay,
}: {
  testimonio: VideoTestimonio;
  onPlay: (t: VideoTestimonio) => void;
}) {
  const [thumbReady, setThumbReady] = useState(false);
  const isFeatured = testimonio.featured;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: testimonio.id * 0.1 }}
      className={cn("group relative", isFeatured && "md:col-span-2 md:row-span-2")}
      aria-label={`Testimonio de ${testimonio.nombre}`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500",
          "border border-white/10 hover:border-white/25",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.6)]",
          "group-hover:-translate-y-1"
        )}
        onClick={() => onPlay(testimonio)}
        role="button"
        tabIndex={0}
        aria-label={`Reproducir testimonio de ${testimonio.nombre}`}
        onKeyDown={(e) => e.key === "Enter" && onPlay(testimonio)}
      >
        {/* Video thumbnail */}
        <div className={cn("relative w-full overflow-hidden bg-black", isFeatured ? "aspect-[16/10]" : "aspect-video")}>
          <video
            src={testimonio.videoSrc}
            muted
            preload="metadata"
            playsInline
            onLoadedData={() => setThumbReady(true)}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
              thumbReady ? "opacity-100" : "opacity-0"
            )}
          />

          {!thumbReady && (
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(229_75%_20%)] via-[hsl(229_60%_15%)] to-[hsl(229_50%_10%)] animate-pulse" />
          )}

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-400",
                "bg-white/15 border border-white/30 group-hover:bg-white/25 group-hover:border-white/50",
                "shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]",
                isFeatured ? "w-20 h-20 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-16 sm:h-16"
              )}
            >
              <Play
                className={cn(
                  "text-white ml-1",
                  isFeatured ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6 sm:w-7 sm:h-7"
                )}
                fill="currentColor"
              />
            </motion.div>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 md:p-6">
            {/* Quote */}
            <div className="flex items-start gap-2 mb-3">
              <Quote className="w-4 h-4 text-accent shrink-0 mt-0.5" fill="currentColor" />
              <p className={cn(
                "text-white/90 italic leading-snug",
                isFeatured ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm"
              )}>
                {testimonio.cita}
              </p>
            </div>

            {/* Doctor info */}
            <div className="flex items-center gap-3">
              <div className="w-px h-8 bg-accent/60" />
              <div>
                <h3 className={cn(
                  "font-semibold text-white",
                  isFeatured ? "text-base sm:text-lg" : "text-sm"
                )}>
                  {testimonio.nombre}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm">
                  {testimonio.especialidad} · {testimonio.pais}
                </p>
              </div>
            </div>
          </div>

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/90 text-white backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Destacado
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
});

/* ─── Main Section ─── */
export const Testimonios = () => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonio | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openVideo = useCallback((t: VideoTestimonio) => {
    setActiveVideo(t);
    setCurrentIndex(testimonios.findIndex((x) => x.id === t.id));
    document.body.style.overflow = "hidden";
  }, []);

  const closeVideo = useCallback(() => {
    modalVideoRef.current?.pause();
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  const navigateVideo = useCallback((dir: 1 | -1) => {
    const next = (currentIndex + dir + testimonios.length) % testimonios.length;
    setCurrentIndex(next);
    setActiveVideo(testimonios[next]);
  }, [currentIndex]);

  const scrollToContact = useCallback(() => {
    closeVideo();
    setTimeout(() => {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, [closeVideo]);

  return (
    <section
      id="testimonios"
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(165deg, hsl(229 80% 8%) 0%, hsl(229 60% 12%) 40%, hsl(229 50% 16%) 70%, hsl(229 40% 10%) 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-white/70 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
            Voces reales
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Lo que dicen quienes ya vivieron
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70"> la experiencia</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Médicos de Latinoamérica cuentan cómo esta maestría impactó su práctica profesional.
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14 mb-14 md:mb-20"
        >
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center gap-3 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <m.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-white">{m.value}</span>
                <span className="text-xs sm:text-sm text-white/50">{m.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Cinematic Grid: featured + 2 smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Featured – full width on mobile, spans left column on desktop */}
          <VideoCard testimonio={testimonios[0]} onPlay={openVideo} />

          {/* Two smaller videos stacked */}
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {testimonios.slice(1).map((t) => (
              <VideoCard key={t.id} testimonio={t} onPlay={openVideo} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 md:mt-20 text-center"
        >
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">
            Tú puedes ser el próximo testimonio
          </p>
          <p className="text-sm sm:text-base text-white/40 mb-6">
            Únete a la próxima edición y transforma tu práctica clínica
          </p>
          <Button
            size="lg"
            onClick={scrollToContact}
            className="gap-2 bg-accent hover:bg-accent/90 text-white border-0 rounded-xl px-8 py-4 text-base font-semibold shadow-[0_8px_32px_hsl(var(--accent)/0.35)] hover:shadow-[0_12px_48px_hsl(var(--accent)/0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Quiero vivir esta experiencia
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* ─── Cinema Modal ─── */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={closeVideo}
            />

            {/* Content */}
            <motion.div
              key={activeVideo.id}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl"
            >
              {/* Close */}
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 sm:top-3 sm:right-3 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/10"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video */}
              <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/10">
                <video
                  ref={modalVideoRef}
                  src={activeVideo.videoSrc}
                  controls
                  autoPlay
                  playsInline
                  className="w-full aspect-video bg-black"
                />

                {/* Info bar */}
                <div className="bg-[hsl(229_60%_10%)] border-t border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-10 rounded-full bg-accent" />
                    <div>
                      <h3 className="font-semibold text-white text-base">{activeVideo.nombre}</h3>
                      <p className="text-sm text-white/50">
                        {activeVideo.especialidad} · {activeVideo.pais}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nav arrows */}
                    <button
                      onClick={() => navigateVideo(-1)}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Testimonio anterior"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                    <span className="text-xs text-white/40 min-w-[3rem] text-center">
                      {currentIndex + 1} / {testimonios.length}
                    </span>
                    <button
                      onClick={() => navigateVideo(1)}
                      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Siguiente testimonio"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Button
                      size="sm"
                      onClick={scrollToContact}
                      className="ml-2 gap-1.5 bg-accent hover:bg-accent/90 text-white border-0 rounded-lg text-sm font-semibold"
                    >
                      Quiero vivir esta experiencia
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
