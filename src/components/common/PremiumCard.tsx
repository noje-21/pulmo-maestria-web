import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "featured" | "accent" | "glass" | "interactive";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8"
};

const variantClasses = {
  default: "card-base bg-card",
  featured: "card-base card-featured bg-card",
  accent: "card-base card-accent",
  glass: "card-glass",
  interactive: "card-base card-interactive bg-card"
};

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    variant = "default", 
    hover = true, 
    padding = "md",
    className, 
    children,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          variantClasses[variant],
          hover && "card-hover",
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";

// Sub-components for structured content
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumCardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

export const PremiumCardTitle = ({ children, className }: CardHeaderProps) => (
  <h3 className={cn("text-lg sm:text-xl font-bold text-foreground", className)}>
    {children}
  </h3>
);

export const PremiumCardDescription = ({ children, className }: CardHeaderProps) => (
  <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>
    {children}
  </p>
);

export const PremiumCardContent = ({ children, className }: CardHeaderProps) => (
  <div className={cn("flex-1", className)}>
    {children}
  </div>
);

export const PremiumCardFooter = ({ children, className }: CardHeaderProps) => (
  <div className={cn("mt-4 pt-4 border-t border-border/40", className)}>
    {children}
  </div>
);
