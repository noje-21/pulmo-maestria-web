import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "default" | "muted" | "primary" | "gradient";
  pattern?: "grid" | "dots" | "none";
  padding?: "default" | "large" | "small" | "none";
}

const backgroundStyles = {
  default: "bg-background",
  muted: "bg-gradient-to-b from-muted/50 to-background",
  primary: "bg-primary text-primary-foreground",
  gradient: "bg-gradient-to-b from-background to-muted/50"
};

const patternStyles = {
  grid: "bg-grid-pattern opacity-50",
  dots: "bg-dots-pattern opacity-30",
  none: ""
};

const paddingStyles = {
  default: "py-16 md:py-24 lg:py-28 xl:py-32",
  large: "py-20 md:py-28 lg:py-32 xl:py-36",
  small: "py-12 md:py-16 lg:py-20",
  none: ""
};

export const Section = ({
  id,
  children,
  className,
  containerClassName,
  background = "default",
  pattern = "none",
  padding = "default"
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        backgroundStyles[background],
        paddingStyles[padding],
        className
      )}
    >
      {pattern !== "none" && (
        <div className={cn("absolute inset-0", patternStyles[pattern])} aria-hidden="true" />
      )}
      <div className={cn("relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader = ({
  title,
  subtitle,
  badge,
  centered = true,
  className
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 md:mb-16",
        centered && "text-center",
        className
      )}
    >
      {badge && (
        <span className="brand-badge mb-4">
          {badge}
        </span>
      )}
      <h2 className={cn(
        "text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6",
        centered ? "brand-section-signature-center" : "brand-section-signature"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-lg md:text-xl text-muted-foreground mt-8", centered && "max-w-2xl mx-auto")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
