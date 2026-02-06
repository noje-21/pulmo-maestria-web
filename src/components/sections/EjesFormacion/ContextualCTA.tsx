import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContextualCTA = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-16 md:mt-20"
    >
      <div className="relative max-w-2xl mx-auto">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm border border-primary/30 rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-primary/10"
        >
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
          </motion.div>
          
          {/* Headline */}
          <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            ¿Listo para transformar tu práctica?
          </h4>
          
          <p className="text-muted-foreground mb-6 text-sm sm:text-base max-w-md mx-auto">
            30 módulos, talleres prácticos y un simposio latinoamericano. 
            <span className="text-foreground font-medium"> Tu camino al dominio de la circulación pulmonar comienza con un clic.</span>
          </p>
          
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-xl px-8 gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/30"
          >
            <GraduationCap className="w-5 h-5" />
            Quiero saber más
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
