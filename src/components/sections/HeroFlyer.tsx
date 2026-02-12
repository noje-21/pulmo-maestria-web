import { useRef, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ExternalLink, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FlyerVideo {
  id: number;
  src: string;
  label: string;
}

const flyerVideos: FlyerVideo[] = [
  { id: 1, src: "/videos/flyer-1.mp4", label: "Experiencia académica presencial" },
  { id: 2, src: "/videos/flyer-2.mp4", label: "Formación con referentes internacionales" },
  { id: 3, src: "/videos/flyer-3.mp4", label: "Impacto clínico real" },
];

const FlyerCard = memo(function FlyerCard({
  video,
  featured,
  onPlay,
}: {
  video: FlyerVideo;
  featured?: boolean;
  onPlay: (v: FlyerVideo) => void;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 + video.id * 0.15 }}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
        "transition-all duration-500",
        featured ? "md:row-span-2" : ""
      )}
      onClick={() => onPlay(video)}
    >
      <div className={cn("relative w-full overflow-hidden", featured ? "aspect-[9/14] md:aspect-auto md:h-full" : "aspect-video")}>
        <video
          ref={vidRef}
          src={video.src}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => {
            setReady(true);
            vidRef.current?.play().catch(() => {});
          }}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
            ready ? "opacity-100" : "opacity-0"
          )}
        />

        {!ready && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 to-black/60 animate-pulse" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25",
              "shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
              "transition-all duration-400",
              featured ? "w-20 h-20" : "w-14 h-14"
            )}
          >
            <Play
              className={cn("text-white ml-1", featured ? "w-9 h-9" : "w-6 h-6")}
              fill="currentColor"
            />
          </motion.div>
        </div>

        {/* Label */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className={cn(
            "text-white/90 font-medium leading-snug",
            featured ? "text-base sm:text-lg" : "text-sm"
          )}>
            {video.label}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export const HeroFlyer = () => {
  const [activeVideo, setActiveVideo] = useState<FlyerVideo | null>(null);
  const modalRef = useRef<HTMLVideoElement>(null);

  const openVideo = useCallback((v: FlyerVideo) => {
    setActiveVideo(v);
    document.body.style.overflow = "hidden";
  }, []);

  const closeVideo = useCallback(() => {
    modalRef.current?.pause();
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero-flyer"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-[hsl(229,50%,6%)]"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
    >
      {/* Ambient decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-white/3 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/25 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-accent-light animate-pulse" />
                <span className="text-white/90">Edición 2026 · Cupos limitados</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-6 text-balance"
            >
              La experiencia que está transformando la{" "}
              <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
                circulación pulmonar
              </span>{" "}
              en Latinoamérica
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/70 text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Formación intensiva presencial + campus virtual + referentes internacionales.
              <span className="block mt-2 text-white/50 text-sm sm:text-base">
                2 al 16 de noviembre de 2026 · Buenos Aires, Argentina
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={() => scrollTo("contacto")}
                className="btn-hero group min-h-[56px]"
              >
                <span>🎓 Reservar mi lugar</span>
                <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  window.open(
                    "https://wa.me/5491159064234?text=" +
                      encodeURIComponent("Hola, quiero información sobre la Maestría en Circulación Pulmonar 2026."),
                    "_blank"
                  )
                }
                className="bg-white/5 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/15 hover:border-white/40 font-semibold px-8 py-5 rounded-full transition-all duration-400 min-h-[56px] group"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Hablar con asesor académico
              </Button>
            </motion.div>
          </div>

          {/* Right: Cinematic Video Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 h-[420px] sm:h-[480px] lg:h-[540px]"
          >
            {/* Featured (large) */}
            <FlyerCard video={flyerVideos[0]} featured onPlay={openVideo} />

            {/* Two secondary */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <FlyerCard video={flyerVideos[1]} onPlay={openVideo} />
              <FlyerCard video={flyerVideos[2]} onPlay={openVideo} />
            </div>
          </motion.div>
        </div>
      </div>

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
                ref={modalRef}
                src={activeVideo.src}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
