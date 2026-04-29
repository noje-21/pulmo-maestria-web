import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CAMPUS_URL = "https://campus.maestriacp.com/";

interface CampusVirtualButtonProps {
  className?: string;
  fullWidth?: boolean;
  label?: string;
}

/**
 * Unified "Ver Campus Virtual" button.
 * Same look, size, hover and behavior across Hero and ReservarPopup.
 */
export function CampusVirtualButton({
  className,
  fullWidth = false,
  label = "Ver Campus Virtual",
}: CampusVirtualButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => (window.location.href = CAMPUS_URL)}
      className={cn(
        "bg-white/5 border-2 border-accent/40 text-white hover:bg-accent/15 hover:border-accent/60",
        "font-semibold px-6 py-3.5 rounded-full min-h-[52px] text-sm group",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        fullWidth && "w-full",
        className
      )}
    >
      <span>{label}</span>
      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
    </Button>
  );
}