import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageLazyProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImageLazy({ src, alt = "", className = "" }: ImageLazyProps) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={cn(
        "transition-all duration-500",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
        className
      )}
    />
  );
}
