import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  variant?: "gradient" | "dots" | "wave";
  className?: string;
}

export const SectionDivider = ({ variant = "gradient", className }: SectionDividerProps) => {
  if (variant === "dots") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={cn("flex items-center justify-center gap-2 py-4", className)}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-full",
              i === 2 ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-primary/30"
            )}
          />
        ))}
      </motion.div>
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
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent",
        className
      )}
    />
  );
};
