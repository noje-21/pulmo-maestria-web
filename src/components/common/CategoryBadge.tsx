import { cn } from "@/lib/utils";
import { MessageSquare, Users, TrendingUp, Sparkles, Star, Pin } from "lucide-react";

type CategoryType = "general" | "clinical_questions" | "case_discussions" | "shared_resources" | "featured" | "pinned";

interface CategoryBadgeProps {
  category: CategoryType;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const categoryConfig: Record<CategoryType, { 
  label: string; 
  icon: typeof MessageSquare;
  className: string;
}> = {
  general: {
    label: "General",
    icon: MessageSquare,
    className: "badge-general"
  },
  clinical_questions: {
    label: "Preguntas Clínicas",
    icon: Users,
    className: "badge-clinical"
  },
  case_discussions: {
    label: "Casos Clínicos",
    icon: TrendingUp,
    className: "badge-cases"
  },
  shared_resources: {
    label: "Recursos",
    icon: Sparkles,
    className: "badge-resources"
  },
  featured: {
    label: "Destacado",
    icon: Star,
    className: "badge-featured"
  },
  pinned: {
    label: "Fijado",
    icon: Pin,
    className: "badge-pinned"
  }
};

export const CategoryBadge = ({ 
  category, 
  showIcon = true, 
  showLabel = true,
  size = "md",
  className 
}: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  if (!config) return null;

  const Icon = config.icon;
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  
  return (
    <span className={cn(
      "badge-category",
      config.className,
      size === "sm" && "px-2 py-0.5 text-[10px]",
      className
    )}>
      {showIcon && <Icon className={iconSize} />}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

// Helper function for external use
export const getCategoryLabel = (category: string): string => {
  return categoryConfig[category as CategoryType]?.label || category;
};
