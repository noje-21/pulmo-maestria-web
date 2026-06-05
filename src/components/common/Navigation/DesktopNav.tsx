import { Link } from "react-router-dom";
import { NavigationActions } from "./NavigationActions";
import { navItems, pageNavItems } from "./navItems";
import type { NavStateApi } from "./useNavState";

/** Inline nav items shown on lg+ viewports. */
export function DesktopNav({ api }: { api: NavStateApi }) {
  const { isScrolled, handleNavClick } = api;

  return (
    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
      {navItems.map((item) => (
        <button
          key={item.section}
          onClick={() => handleNavClick(item.section)}
          className={`relative nav-link px-3 xl:px-4 py-2 text-sm group ${
            isScrolled ? "text-foreground" : "text-white hover:text-white/80"
          }`}
        >
          {item.label}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300 rounded-full" />
        </button>
      ))}

      {/* CTA Principal - Maestría 2026 */}
      <button
        onClick={() => handleNavClick("contacto")}
        className={`relative nav-link px-3 xl:px-4 py-2 text-sm font-semibold group ${
          isScrolled ? "text-accent" : "text-accent-light hover:text-accent-light/80"
        }`}
      >
        Inscribirme
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300 rounded-full" />
      </button>

      <div className="w-px h-6 bg-border/50 mx-2" />

      {/* Links Secundarios */}
      <Link
        to="/foro"
        className={`nav-link px-2 py-2 text-xs opacity-80 hover:opacity-100 ${
          isScrolled ? "text-muted-foreground" : "text-white/70 hover:text-white/90"
        }`}
      >
        Foro
      </Link>

      <Link
        to="/novedades"
        className={`nav-link px-2 py-2 text-xs opacity-80 hover:opacity-100 ${
          isScrolled ? "text-muted-foreground" : "text-white/70 hover:text-white/90"
        }`}
      >
        Novedades
      </Link>

      {pageNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`nav-link px-2 py-2 text-xs opacity-80 hover:opacity-100 ${
            isScrolled ? "text-muted-foreground" : "text-white/70 hover:text-white/90"
          }`}
        >
          {item.label}
        </Link>
      ))}

      <div className="w-px h-6 bg-border/50 mx-2" />

      <NavigationActions api={api} />
    </div>
  );
}