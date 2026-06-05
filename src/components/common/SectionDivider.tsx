import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

interface SectionDividerProps {
  variant?: "gradient" | "dots" | "wave";
  className?: string;
}

export const SectionDivider = ({ variant = "gradient", className }: SectionDividerProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  if (variant === "dots") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-2 py-4 transition-opacity duration-500",
          inView ? "opacity-100" : "opacity-0",
          className,
        )}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              transform: inView ? "scale(1)" : "scale(0)",
              transition: `transform 300ms ease-out ${i * 100}ms`,
            }}
            className={cn(
              "rounded-full",
              i === 2 ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-primary/30"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("overflow-hidden", className)}>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-8 md:h-12 fill-muted"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>
    );
  }

  // Default gradient
  return (
    <div
      ref={ref}
      className={cn(
        "h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent reveal-scaleX",
        inView && "is-visible",
        className
      )}
    />
  );
};
