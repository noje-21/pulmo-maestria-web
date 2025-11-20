import { Link } from "react-router-dom";
import { useScrollToSection } from "@/hooks/useScrollToSection";

export const Footer = () => {
  const scrollToSection = useScrollToSection();

  return (
    <footer className="bg-gradient-to-b from-primary to-primary-dark text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold">Maestría en Circulación Pulmonar</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              Formación de excelencia en enfermedades vasculares pulmonares
            </p>
          </div>

          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold">Enlaces Rápidos</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("maestria")}
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Maestría
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("expertos")}
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Expertos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Contacto
                </button>
              </li>
              <li>
                <Link
                  to="/foro"
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Foro
                </Link>
              </li>
              <li>
                <Link
                  to="/novedades"
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Novedades
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  → Panel ADM
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <p className="text-center text-black/80 text-sm">
            © 2025 Maestría Latinoamericana en Circulación Pulmonar – Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
