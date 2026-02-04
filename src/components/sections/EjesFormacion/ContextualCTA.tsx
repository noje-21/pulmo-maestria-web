import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContextualCTA = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-12 md:mt-16"
    >
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-xl" />
        <div className="relative bg-card/60 backdrop-blur-sm border border-primary/20 rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            30 módulos, talleres prácticos y un simposio latinoamericano. Formación integral en circulación pulmonar.
          </p>
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6 sm:px-8 gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            <GraduationCap className="w-5 h-5" />
            Solicitar información
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
