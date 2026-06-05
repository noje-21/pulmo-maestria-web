import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { lazy, Suspense } from "react";
import logoMaestria from "@/assets/logo-maestria.webp";
import { DesktopNav } from "./DesktopNav";
import { useNavState } from "./useNavState";

// MobileNav keeps Framer Motion (overlay enter/exit animation), so we lazy-load
// it to keep framer-motion out of the landing's critical bundle. The component
// only renders meaningful UI when the menu is open, so a null fallback is safe.
const MobileNav = lazy(() =>
  import("./MobileNav").then((m) => ({ default: m.MobileNav })),
);

const Navigation = () => {
  const api = useNavState();
  const { isHomePage, isScrolled, isMenuOpen, toggleMenu } = api;

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className={`fixed top-0 w-full z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        isHomePage ? "nav-slide-down" : ""
      } ${
        isScrolled
          ? "bg-background/98 lg:backdrop-blur-xl shadow-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group"
            aria-label="Ir a página principal"
          >
            <div className="h-9 sm:h-10 md:h-12 w-auto flex items-center">
              <img
                src={logoMaestria}
                alt="Logo Maestría en Circulación Pulmonar"
                className="h-full w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Funnel Simplificado */}
          <DesktopNav api={api} />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isScrolled
                ? "text-foreground hover:bg-muted border border-border"
                : "text-white hover:bg-white/10 border border-white/20"
            }`}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Overlay (lazy: framer-motion only loaded on demand) */}
      <Suspense fallback={null}>
        <MobileNav api={api} />
      </Suspense>
    </nav>
  );
};

export default Navigation;