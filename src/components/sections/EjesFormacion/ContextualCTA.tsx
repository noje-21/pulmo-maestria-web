import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ContextualCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 md:mt-16"
    >
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>30 módulos diseñados para transformar tu práctica clínica</span>
        </div>
      </div>
    </motion.div>
  );
};
