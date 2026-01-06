import { LucideIcon, Inbox, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'friendly' | 'minimal';
  className?: string;
}

const friendlyMessages = [
  "¡Tu opinión puede inspirar a otros!",
  "Cada gran conversación empieza con alguien como tú",
  "Este espacio cobra vida con tu participación",
  "¿Tienes algo que compartir? Te leemos",
  "La comunidad te espera con los brazos abiertos"
];

export const EmptyState = ({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action,
  variant = 'default',
  className 
}: EmptyStateProps) => {
  const randomMessage = friendlyMessages[Math.floor(Math.random() * friendlyMessages.length)];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
        <div className="relative p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50 shadow-sm">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-2 max-w-sm leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      
      {variant === 'friendly' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-accent font-medium mb-4 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {randomMessage}
        </motion.p>
      )}
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={action.onClick}
            className="btn-accent mt-4"
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};