import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { GraduationCap, ArrowUpRight, Heart, Mail, Phone, MapPin, ExternalLink, Linkedin, Facebook, Instagram } from "lucide-react";

const quickLinks = [
  { label: "Inicio", section: "inicio" },
  { label: "Maestría", section: "maestria" },
  { label: "Expertos", section: "expertos" },
  { label: "Eventos", section: "eventos" },
  { label: "Galería", section: "galeria" },
  { label: "Contacto", section: "contacto" }
];

const pageLinks = [
  { label: "Foro Comunitario", to: "/foro" },
  { label: "Novedades", to: "/novedades" },
  { label: "Campus Virtual", href: "https://www.maestriacp.com/", external: true },
  { label: "Iniciar Sesión", to: "/auth" }
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/hipertension-pulmonar-655a43253", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/share/16s5MUKG3C/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/magisterenhipertensionpulmonar", label: "Instagram" }
];

export const Footer = () => {
  const scrollToSection = useScrollToSection();

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden" role="contentinfo">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <GraduationCap className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold">
                Maestría en Circulación Pulmonar
              </h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm mb-6">
              Formación de excelencia en enfermedades vasculares pulmonares. 
              Programa intensivo para profesionales de la salud de Latinoamérica.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>Buenos Aires, Argentina</span>
              </div>
              <a 
                href="mailto:magisterenhipertensionpulmonar@gmail.com" 
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">magisterenhipertensionpulmonar@gmail.com</span>
              </a>
              <a 
                href="https://wa.me/573004142568" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>+57 300 414 2568</span>
              </a>
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
            <nav aria-label="Enlaces del sitio">
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.section)}
                      className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:translate-x-1 group text-sm"
                    >
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
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
            <nav aria-label="Enlaces de la plataforma">
              <ul className="space-y-2">
                {pageLinks.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:translate-x-1 group text-sm"
                      >
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-50" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to={link.to!}
                        className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:translate-x-1 group text-sm"
                      >
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">
              Síguenos
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar ${social.label}`}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="text-sm text-primary-foreground/60 mt-6">
              Únete a nuestra comunidad y mantente actualizado con las últimas novedades.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/70 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Maestría Latinoamericana en Circulación Pulmonar. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1 text-primary-foreground/70 text-sm">
              Hecho con <Heart className="w-4 h-4 text-accent fill-accent" aria-hidden="true" /> <span className="sr-only">amor</span> en Latinoamérica
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
