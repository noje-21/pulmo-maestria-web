import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProgressionPhase } from "./types";
import { phaseTransformations } from "./moduleTransformations";

interface PhaseTransitionProps {
  phase: ProgressionPhase;
  phaseKey: string;
  isFirst?: boolean;
}

export const PhaseTransition = ({ phase, phaseKey, isFirst = false }: PhaseTransitionProps) => {
  const transformation = phaseTransformations[phaseKey];
  const isAccent = phaseKey === "diagnostico" || phaseKey === "tratamiento";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative mb-8",
        !isFirst && "mt-12 pt-8"
      )}
    >
      {/* Connecting line from previous section */}
      {!isFirst && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 32 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-0.5",
              isAccent ? "bg-gradient-to-b from-primary/30 to-accent/50" : "bg-gradient-to-b from-accent/30 to-primary/50"
            )}
          />
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-center p-6 sm:p-8 rounded-3xl",
          "bg-gradient-to-br border",
          isAccent 
            ? "from-accent/10 via-accent/5 to-transparent border-accent/20" 
            : "from-primary/10 via-primary/5 to-transparent border-primary/20"
        )}
      >
        {/* Phase badge */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider",
            phase.bgColor, phase.color
          )}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {phase.label}
          </span>
        </motion.div>
        
        {/* Hook - The emotional punch */}
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className={cn(
            "text-2xl sm:text-3xl font-bold mb-2",
            isAccent ? "text-accent" : "text-primary"
          )}
        >
          {transformation?.hook}
        </motion.h3>
        
        {/* Promise */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg text-foreground/80 font-medium mb-3"
        >
          {transformation?.promise}
        </motion.p>
        
        {/* Transformation indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <span className="px-3 py-1 rounded-full bg-muted/50 font-medium">
            {transformation?.transformation}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
