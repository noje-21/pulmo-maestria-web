import { memo, useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  /** Mobile-optimized source (smaller resolution) */
  srcMobile?: string;
  /** Desktop-optimized source (larger resolution) */
  srcDesktop?: string;
  /** Custom srcSet string */
  srcSet?: string;
  /** Sizes attribute for responsive loading */
  sizes?: string;
  className?: string;
  loading?: "lazy" | "eager";
  aspectRatio?: "video" | "square" | "portrait" | "wide" | "auto";
  onClick?: () => void;
  draggable?: boolean;
}

const aspectClasses: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
  auto: "",
};

/**
 * ResponsiveImage — serves different resolutions for mobile vs desktop.
 * Uses <picture> with <source media> when srcMobile/srcDesktop are provided,
 * or standard srcSet/sizes for fine-grained control.
 */
const ResponsiveImage = memo(function ResponsiveImage({
  src,
  alt,
  srcMobile,
  srcDesktop,
  srcSet,
  sizes,
  className = "",
  loading = "lazy",
  aspectRatio = "auto",
  onClick,
  draggable = false,
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  const imgProps = {
    alt,
    loading,
    decoding: "async" as const,
    draggable,
    onLoad: () => setLoaded(true),
    className: cn(
      "w-full h-full object-cover transition-opacity duration-500",
      loaded ? "opacity-100" : "opacity-0",
      className
    ),
    ...(onClick && { onClick }),
  };

  const wrapperClass = cn(
    "relative overflow-hidden bg-muted/30",
    aspectClasses[aspectRatio],
    onClick && "cursor-pointer"
  );

  // Skeleton placeholder
  const skeleton = !loaded && (
    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
  );

  // Use <picture> when mobile/desktop sources are provided
  if (srcMobile || srcDesktop) {
    return (
      <div className={wrapperClass}>
        {skeleton}
        <picture>
          {srcMobile && (
            <source media="(max-width: 640px)" srcSet={srcMobile} />
          )}
          {srcDesktop && (
            <source media="(min-width: 641px)" srcSet={srcDesktop} />
          )}
          <img src={src} {...imgProps} />
        </picture>
      </div>
    );
  }

  // Use srcSet/sizes for standard responsive
  return (
    <div className={wrapperClass}>
      {skeleton}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        {...imgProps}
      />
    </div>
  );
});

export default ResponsiveImage;
