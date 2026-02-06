import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "detailed" | "compact";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleSound?: () => void;
}

export const ViewModeToggle = ({ 
  viewMode, 
  onViewModeChange, 
  onToggleSound 
}: ViewModeToggleProps) => {
  const handleModeChange = (mode: ViewMode) => {
    if (mode !== viewMode) {
      onToggleSound?.();
      onViewModeChange(mode);
    }
  };

  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8">
      <div className={cn(
        "relative flex items-center gap-1 p-1 rounded-full",
        "bg-muted/60 border border-border/40 backdrop-blur-sm"
      )}>
        {/* Animated background indicator */}
        <motion.div
          layoutId="viewModeIndicator"
          className={cn(
            "absolute top-1 bottom-1 rounded-full",
            "bg-primary shadow-lg shadow-primary/20"
          )}
          initial={false}
          animate={{
            left: viewMode === "detailed" ? 4 : "50%",
            right: viewMode === "compact" ? 4 : "50%",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />

        <button
          onClick={() => handleModeChange("detailed")}
          className={cn(
            "relative z-10 flex items-center gap-2 px-4 py-2 rounded-full",
            "text-sm font-medium transition-colors duration-200",
            viewMode === "detailed" 
              ? "text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={viewMode === "detailed"}
          aria-label="Vista detallada"
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">Detallada</span>
        </button>

        <button
          onClick={() => handleModeChange("compact")}
          className={cn(
            "relative z-10 flex items-center gap-2 px-4 py-2 rounded-full",
            "text-sm font-medium transition-colors duration-200",
            viewMode === "compact" 
              ? "text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={viewMode === "compact"}
          aria-label="Vista compacta"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Compacta</span>
        </button>
      </div>
    </div>
  );
};
