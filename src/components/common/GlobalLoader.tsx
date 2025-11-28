import { motion } from "framer-motion";

export default function GlobalLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="pv-spinner"></div>
    </motion.div>
  );
}