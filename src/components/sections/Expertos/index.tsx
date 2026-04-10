import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { expertos } from "./data";
import { DirectorCard } from "./DirectorCard";
import { ExpertoCard } from "./ExpertoCard";

export const Expertos = () => {
  const director = expertos.find(e => e.destacado);
  const otrosExpertos = expertos.filter(e => !e.destacado);

  return (
    <section
      id="expertos"
      className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-x-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="section-header"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Cuerpo Docente</span>
          </div>
          <h2 className="section-title brand-section-signature-center">Aprende de los mejores</h2>
          <p className="section-subtitle mt-6 max-w-2xl mx-auto">
            Referentes en circulación pulmonar que combinan excelencia clínica con vocación docente.
          </p>
        </motion.div>

        {/* Director Card */}
        {director && <DirectorCard director={director} />}

        {/* Experts Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
        >
          {otrosExpertos.map((experto) => (
            <ExpertoCard key={experto.nombre} experto={experto} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Expertos;

