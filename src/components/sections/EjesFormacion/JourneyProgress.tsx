import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Target, Rocket, Trophy } from "lucide-react";

interface JourneyProgressProps {
  currentModule: number;
  totalModules: number;
}

export const JourneyProgress = ({ currentModule, totalModules }: JourneyProgressProps) => {
  const percentage = Math.round((currentModule / totalModules) * 100);
  
  const milestones = [
    { at: 0, icon: Target, label: "Inicio" },
    { at: 50, icon: Rocket, label: "Mitad" },
    { at: 100, icon: Trophy, label: "Experto" }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="sticky top-20 z-10 mb-8 px-4"
    >
      <div className="max-w-2xl mx-auto bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-lg">
        {/* Progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          />
          
          {/* Milestone markers */}
          {milestones.map((milestone) => (
            <div 
              key={milestone.at}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-colors",
                percentage >= milestone.at 
                  ? "bg-primary border-primary-foreground" 
                  : "bg-muted-foreground/30 border-muted"
              )}
              style={{ left: `${milestone.at}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            <span className="font-bold text-primary">{currentModule}</span> de {totalModules} módulos
          </span>
          <span className="text-muted-foreground font-medium">
            {percentage}% del programa
          </span>
        </div>
      </div>
    </motion.div>
  );
};
