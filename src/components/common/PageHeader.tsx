import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  actions?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  badge,
  actions,
  centered = false,
  className
}: PageHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-8 sm:mb-10", className)}
    >
      {centered ? (
        <div className="text-center mb-8">
          {badge && (
            <span className="brand-badge mb-4">
              {badge.icon && <badge.icon className="w-3.5 h-3.5" />}
              {badge.text}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 brand-section-signature-center">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            {badge && (
              <span className="brand-badge mb-3">
                {badge.icon && <badge.icon className="w-3.5 h-3.5" />}
                {badge.text}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 brand-section-signature">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground text-base sm:text-lg">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
    </motion.header>
  );
};
