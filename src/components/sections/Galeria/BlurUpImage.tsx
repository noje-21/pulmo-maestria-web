import { useState, useEffect, memo } from "react";

interface BlurUpImageProps {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
}

/**
 * BlurUpImage — lightweight blur-up placeholder for gallery images:
 * - Tiny canvas-based blur placeholder generated on mount
 * - Smooth crossfade from blurred placeholder → sharp image
 * - CSS-only hover effects for desktop
 * - loading="lazy" + decoding="async" for performance
 */
const BlurUpImage = memo(function BlurUpImage({
  src,
  alt,
  onClick,
  className = "",
}: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [blurUrl, setBlurUrl] = useState<string | null>(null);

  // Generate a tiny blurred placeholder from a downscaled version
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const handleLoad = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 20; // Tiny thumbnail
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
    <div
      className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group ${className}`}
      onClick={onClick}
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

      {/* Gradient skeleton fallback when no blur data yet */}
      {!blurUrl && !loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60 animate-pulse" />
      )}

      {/* Full image with crossfade */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        }`}
        draggable={false}
      />

      {/* CSS-only overlay — zero JS cost */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 pointer-events-none">
        <p className="text-white font-semibold text-sm line-clamp-2">{alt}</p>
      </div>
    </div>
  );
});

export default BlurUpImage;
