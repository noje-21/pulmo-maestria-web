import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";

export const CentralMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16 md:mb-20 max-w-3xl mx-auto px-4"
  >
    {/* Icon */}
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="flex justify-center mb-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <GraduationCap className="w-7 h-7 text-primary" />
      </div>
    </motion.div>
    
    {/* Main message */}
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
      30 módulos que transforman{" "}
      <span className="text-primary">conocimiento en criterio clínico</span>
    </h3>
    
    <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6">
      Un programa estructurado que abarca desde los fundamentos hasta las fronteras de la investigación en hipertensión pulmonar.
    </p>

    {/* Journey indicator */}
    <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground/60 flex-wrap">
      <span className="text-primary font-medium">Fundamentos</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-accent font-medium">Diagnóstico</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-primary font-medium">Clínica</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-accent font-medium">Tratamiento</span>
      <ArrowRight className="w-3 h-3" />
      <span className="text-primary font-medium">Integración</span>
    </div>
  </motion.div>
);
