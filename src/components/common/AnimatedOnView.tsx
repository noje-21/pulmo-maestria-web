import { memo, PropsWithChildren } from "react";
import { motion } from "framer-motion";

/**
 * Lightweight viewport-triggered animation.
 * - Uses whileInView (no controls/useAnimation overhead)
 * - once:true → never re-animates on scroll up/down
 * - will-change handled by framer-motion automatically
 */
const AnimatedOnView = memo(function AnimatedOnView({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
});

export default AnimatedOnView;