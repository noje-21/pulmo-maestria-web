import { PropsWithChildren } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export default function Popup({ children, isOpen, onClose }: PopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pv-glass pv-glow"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
