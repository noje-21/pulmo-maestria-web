import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollInvitationProps {
  text?: string;
  targetId?: string;
  className?: string;
}

export const ScrollInvitation = ({ 
  text = "Sigue explorando", 
  targetId,
  className = ""
}: ScrollInvitationProps) => {
  const handleClick = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`flex flex-col items-center gap-2 py-8 ${className}`}
    >
      <p className="text-muted-foreground text-sm italic">
        {text}
      </p>
      {targetId && (
        <button
          onClick={handleClick}
          className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
          aria-label="Scroll hacia abajo"
        >
          {/* CSS bounce on desktop only; mobile gets a static chevron to
              avoid keeping framer-motion's RAF loop alive off-screen. */}
          <ChevronDown className="w-5 h-5 text-primary/60 hidden md:block hero-bounce" />
          <ChevronDown className="w-5 h-5 text-primary/60 md:hidden" />
        </button>
      )}
    </motion.div>
  );
};
