import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMaestria from "@/assets/logo-maestria.webp";
import { navItems, pageNavItems } from "./navItems";
import type { NavStateApi } from "./useNavState";

/** 100dvh body-locked overlay shown on <lg viewports. */
export function MobileNav({ api }: { api: NavStateApi }) {
  const { isMenuOpen, closeMenu, handleNavClick, isAdmin, navigate, user, handleLogout } = api;

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop - Click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-[100dvh] w-[85vw] max-w-[320px] bg-background z-[101] lg:hidden shadow-2xl overflow-y-auto"
          >
            {/* Header with close button */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
              <img
                src={logoMaestria}
                alt="Logo Maestría"
                className="h-10 w-auto object-contain rounded-lg"
              />
              <button
                onClick={closeMenu}
                aria-label="Cerrar menú"
                className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 space-y-3">
              {/* CTA Principal - Maestría 2026 */}
              <motion.button
                onClick={() => handleNavClick("contacto")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full bg-accent hover:bg-accent/90 text-white py-4 px-5 rounded-xl font-bold transition-all duration-200 text-base min-h-[56px] flex items-center justify-center gap-2 shadow-lg"
              >
                🎓 Inscribirme a la Maestría 2026
              </motion.button>

              <div className="w-full h-px bg-border my-4" />

              {/* Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.section}
                    onClick={() => handleNavClick(item.section)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.05 }}
                    className="w-full text-left text-foreground hover:text-primary active:bg-muted py-4 px-5 rounded-xl font-medium transition-all duration-200 text-base min-h-[52px] flex items-center"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Links Secundarios */}
              <div className="w-full h-px bg-border my-4" />
              <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">
                Contenido adicional
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/foro"
                  className="flex items-center justify-center text-foreground hover:text-primary active:bg-muted py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border border-border bg-muted/30"
                  onClick={closeMenu}
                >
                  Foro
                </Link>

                <Link
                  to="/novedades"
                  className="flex items-center justify-center text-foreground hover:text-primary active:bg-muted py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border border-border bg-muted/30"
                  onClick={closeMenu}
                >
                  Novedades
                </Link>

                {pageNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-center text-foreground hover:text-primary active:bg-muted py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 min-h-[48px] border border-border bg-muted/30"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="w-full h-px bg-border my-4" />
                  <Button
                    onClick={() => {
                      navigate("/admin");
                      closeMenu();
                    }}
                    variant="outline"
                    className="w-full rounded-xl min-h-[48px]"
                  >
                    Panel Admin
                  </Button>
                </motion.div>
              )}

              {/* Auth Section */}
              <div className="pt-4 mt-4 border-t border-border">
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full rounded-xl min-h-[48px] text-sm"
                  >
                    Cerrar sesión
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      closeMenu();
                    }}
                    variant="outline"
                    className="w-full rounded-xl min-h-[48px] text-sm"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}