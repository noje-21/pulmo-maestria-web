import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProgressionPhase } from "./types";

interface PhaseIndicatorProps {
  phase: ProgressionPhase;
}

export const PhaseIndicator = ({ phase }: PhaseIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-6"
    >
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        phase.bgColor
      )}>
        <div className={cn("w-2 h-2 rounded-full bg-current", phase.color)} />
        <span className={cn("text-sm font-semibold uppercase tracking-wider", phase.color)}>
          {phase.label}
        </span>
      </div>
      <p className="text-muted-foreground text-sm mt-2 ml-1">
        {phase.description}
      </p>
    </motion.div>
  );
};
