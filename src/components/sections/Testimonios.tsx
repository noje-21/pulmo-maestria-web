import { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/common/Section";
import { Play, X, MapPin, Stethoscope, ArrowRight, Users, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoTestimonio {
  id: number;
  nombre: string;
  especialidad: string;
  ubicacion: string;
  frase: string;
  videoSrc: string;
  featured?: boolean;
}

const testimonios: VideoTestimonio[] = [
  {
    id: 1,
    nombre: "Testimonio 1",
    especialidad: "Cardiólogo",
    ubicacion: "Argentina",
    frase: "Esta maestría cambió mi forma de abordar la hipertensión pulmonar.",
    videoSrc: "/videos/testimonio-1.mp4",
    featured: true,
  },
  {
    id: 2,
    nombre: "Testimonio 2",
    especialidad: "Neumólogo",
    ubicacion: "Colombia",
    frase: "El nivel académico y la calidad de los referentes es incomparable.",
    videoSrc: "/videos/testimonio-2.mp4",
  },
  {
    id: 3,
    nombre: "Testimonio 3",
    especialidad: "Internista",
    ubicacion: "México",
    frase: "Lo que aprendí lo aplico todos los días con mis pacientes.",
    videoSrc: "/videos/testimonio-3.mp4",
  },
  {
    id: 4,
    nombre: "Testimonio 4",
    especialidad: "Cardiólogo",
    ubicacion: "Chile",
    frase: "Una formación única, con impacto clínico real e inmediato.",
    videoSrc: "/videos/testimonio-4.mp4",
  },
  {
    id: 5,
    nombre: "Testimonio 5",
    especialidad: "Neumólogo",
    ubicacion: "Perú",
    frase: "Recomiendo esta experiencia a todo profesional comprometido.",
    videoSrc: "/videos/testimonio-5.mp4",
  },
];

const metrics = [
  { icon: Users, value: "+300", label: "Médicos formados" },
  { icon: Globe, value: "+15", label: "Países representados" },
  { icon: Heart, value: "100%", label: "Impacto clínico inmediato" },
];

/* ─── Video Card ─── */
const VideoCard = memo(function VideoCard({
  testimonio,
  onPlay,
}: {
  testimonio: VideoTestimonio;
  onPlay: (t: VideoTestimonio) => void;
}) {
  const [ready, setReady] = useState(false);
  // Only start loading (preload="metadata") once card enters viewport
  const [inView, setInView] = useState(false);
  const thumbRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFeatured = testimonio.featured;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.article
      ref={containerRef}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{
        duration: 0.35,
        delay: testimonio.id * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "group relative",
        isFeatured && "md:col-span-2 md:row-span-2"
      )}
      aria-label={`Testimonio de ${testimonio.nombre}`}
    >
      <div
        className={cn(
          "h-full overflow-hidden rounded-2xl border transition-all duration-500",
          "bg-card border-border/30",
          "shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-xl)]",
          "hover:border-accent/20",
          isFeatured && "brand-accent-bar-top"
        )}
      >
        {/* Video thumbnail */}
        <div
          className={cn(
            "relative cursor-pointer overflow-hidden",
            isFeatured ? "aspect-video" : "aspect-video"
          )}
          onClick={() => onPlay(testimonio)}
          role="button"
          tabIndex={0}
          aria-label={`Reproducir testimonio de ${testimonio.nombre}`}
          onKeyDown={(e) => e.key === "Enter" && onPlay(testimonio)}
        >
          {/* Skeleton shown until video frame is ready */}
          {!ready && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 animate-pulse" />
          )}

          {/* Video only requests metadata once it enters the viewport */}
          {inView && (
            <video
              ref={thumbRef}
              src={testimonio.videoSrc}
              muted
              preload="metadata"
              playsInline
              onLoadedData={() => setReady(true)}
              className={cn(
                "w-full h-full object-cover transition-[transform,opacity] duration-500 group-hover:scale-105",
                ready ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

          {/* Play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center",
                "shadow-[var(--shadow-accent)] group-hover:shadow-[0_0_40px_hsl(var(--accent)/0.5)]",
                "transition-shadow duration-400",
                isFeatured ? "w-20 h-20" : "w-16 h-16"
              )}
            >
              <Play
                className={cn("text-white ml-1", isFeatured ? "w-9 h-9" : "w-7 h-7")}
                fill="currentColor"
              />
            </motion.div>
          </div>

          {/* Quote overlay on featured */}
          {isFeatured && (
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
              <p className="text-white/90 text-base sm:text-lg font-medium italic leading-snug drop-shadow-lg">
                "{testimonio.frase}"
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className={cn("p-4 sm:p-5", isFeatured && "sm:p-6")}>
          {!isFeatured && (
            <p className="text-muted-foreground text-sm italic mb-2 line-clamp-2">
              "{testimonio.frase}"
            </p>
          )}
          <h3 className={cn(
            "font-semibold text-foreground group-hover:text-primary transition-colors",
            isFeatured ? "text-lg sm:text-xl mb-2" : "text-base mb-1.5"
          )}>
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

/* ─── Main Section ─── */
export const Testimonios = () => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonio | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openVideo = useCallback((t: VideoTestimonio) => {
    setActiveVideo(t);
    document.body.style.overflow = "hidden";
  }, []);

  const closeVideo = useCallback(() => {
    modalVideoRef.current?.pause();
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Section id="testimonios" background="default" pattern="none" padding="large">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-16"
      >
        <div className="mb-4 flex justify-center">
          <span className="brand-badge">Voces reales</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6 brand-section-signature-center">
          Lo que dicen quienes ya vivieron la maestría
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mt-8 max-w-2xl mx-auto">
          Profesionales que hoy aplican este conocimiento en su práctica real.
        </p>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-14 md:mb-18"
      >
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-muted/40 border border-border/40"
            >
              <Icon className="w-6 h-6 text-accent" />
              <span className="text-2xl sm:text-3xl font-bold text-foreground">{m.value}</span>
              <span className="text-sm text-muted-foreground">{m.label}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Grid: featured + rest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {/* Featured card takes 2 cols */}
        {testimonios.filter((t) => t.featured).map((t) => (
          <VideoCard key={t.id} testimonio={t} onPlay={openVideo} />
        ))}
        {/* Remaining cards */}
        {testimonios.filter((t) => !t.featured).map((t) => (
          <VideoCard key={t.id} testimonio={t} onPlay={openVideo} />
        ))}
      </div>

      {/* Subtle closing line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 md:mt-16 text-center text-muted-foreground text-sm"
      >
        Más de 300 profesionales ya vivieron esta experiencia.
      </motion.p>

      {/* Cinema Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={closeVideo}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)]"
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

              <div className="p-5 sm:p-6 bg-gradient-to-b from-[hsl(229,30%,8%)] to-black">
                <p className="text-white/80 text-sm italic mb-3">"{activeVideo.frase}"</p>
                <h3 className="font-semibold text-white text-lg">{activeVideo.nombre}</h3>
                <p className="text-white/60 text-sm">
                  {activeVideo.especialidad} · {activeVideo.ubicacion}
                </p>
                <Button
                  size="lg"
                  onClick={() => {
                    closeVideo();
                    setTimeout(() => {
                      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  }}
                  className="mt-5 btn-hero gap-2 w-full sm:w-auto"
                >
                  Yo quiero ser el próximo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
