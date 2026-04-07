import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";

interface BlurUpImageProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
}

const showcaseEasing = [0.22, 1, 0.36, 1] as const;

/**
 * BlurUpImage — cinematic blur-up gallery card:
 * - Canvas-based blur placeholder with crossfade
 * - Framer Motion hover: scale + subtle rotateY + overlay
 * - Lazy loading + async decoding
 */
const BlurUpImage = memo(function BlurUpImage({
  src,
  alt,
  onClick,
  className = "",
}: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [blurUrl, setBlurUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const handleLoad = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 20;
        canvas.width = size;
        canvas.height = Math.round((img.naturalHeight / img.naturalWidth) * size) || size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setBlurUrl(canvas.toDataURL("image/jpeg", 0.3));
        }
      } catch {
        // CORS or canvas error — skip blur placeholder
      }
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad, { once: true });
    }

    return () => img.removeEventListener("load", handleLoad);
  }, [src]);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{
        scale: 1.04,
        rotateY: 2.5,
        transition: { duration: 0.45, ease: showcaseEasing },
      }}
      whileTap={{ scale: 0.98 }}
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
    >
      {/* Blur-up placeholder */}
      {blurUrl && !loaded && (
        <img
          src={blurUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          draggable={false}
        />
      )}

      {/* Gradient skeleton fallback */}
      {!blurUrl && !loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60 animate-pulse" />
      )}

      {/* Full image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[600ms] ${
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-sm scale-105"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        draggable={false}
      />

      {/* Elegant hover overlay — gradient vignette from bottom */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
        }}
      />

      {/* Top-edge light reflection on hover */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
});

export default BlurUpImage;