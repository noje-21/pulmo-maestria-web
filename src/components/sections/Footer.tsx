import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { GraduationCap, ArrowUpRight, Heart } from "lucide-react";

const quickLinks = [
  { label: "Inicio", section: "inicio" },
  { label: "Maestría", section: "maestria" },
  { label: "Expertos", section: "expertos" },
  { label: "Eventos", section: "eventos" },
  { label: "Contacto", section: "contacto" }
];

const pageLinks = [
  { label: "Foro", to: "/foro" },
  { label: "Novedades", to: "/novedades" },
  { label: "Iniciar Sesión", to: "/auth" }
];

export const Footer = () => {
  const scrollToSection = useScrollToSection();

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">
                Maestría en Circulación Pulmonar
              </h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm mb-6">
              Formación de excelencia en enfermedades vasculares pulmonares. 
              Programa intensivo para profesionales de la salud de Latinoamérica.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <span>📍</span>
              <span>Buenos Aires, Argentina</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:translate-x-1 group text-sm"
                  >
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Page Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4">
              Plataforma
            </h3>
            <ul className="space-y-2">
              {pageLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:translate-x-1 group text-sm"
                  >
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/70 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Maestría Latinoamericana en Circulación Pulmonar
            </p>
            <p className="flex items-center gap-1 text-primary-foreground/70 text-sm">
              Hecho con <Heart className="w-4 h-4 text-accent fill-accent" /> en Latinoamérica
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
