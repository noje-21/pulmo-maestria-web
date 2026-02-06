import { motion } from "framer-motion";
import { Sparkles, Play, Heart } from "lucide-react";

export const CentralMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="text-center mb-12 md:mb-16 max-w-3xl mx-auto px-4"
  >
    {/* Animated icon */}
    <motion.div 
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="flex justify-center mb-6"
    >
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-lg shadow-primary/20">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
        />
      </div>
    </motion.div>
    
    {/* Hook - The emotional punch */}
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="text-accent font-bold text-sm sm:text-base uppercase tracking-widest mb-3"
    >
      Tu transformación comienza aquí
    </motion.p>
    
    {/* Main headline */}
    <motion.h3 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.35 }}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight"
    >
      30 módulos que convierten{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        conocimiento en maestría
      </span>
    </motion.h3>
    
    {/* Subtitle with emotional connection */}
    <motion.p 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed"
    >
      Cada módulo es un paso. Cada paso, una transformación. 
      <span className="text-foreground font-medium"> Explora el camino que te llevará de médico a experto.</span>
    </motion.p>

    {/* Visual journey indicator */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.45 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50"
    >
      <Play className="w-4 h-4 text-primary" />
      <span className="text-sm text-muted-foreground font-medium">
        Desliza para explorar tu viaje formativo
      </span>
      <Sparkles className="w-4 h-4 text-accent" />
    </motion.div>
  </motion.div>
);
