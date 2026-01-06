import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NotificationBell from "@/components/common/NotificationBell";
import logoMaestria from "@/assets/logo-maestria.jpg";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const navItems = [
  { label: "Maestría", section: "maestria" },
  { label: "Expertos", section: "expertos" },
  { label: "Eventos", section: "eventos" },
  { label: "Galería", section: "galeria" },
  { label: "Contacto", section: "contacto" }
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const scrollToSection = useScrollToSection();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNavClick = (section: string) => {
    setIsMenuOpen(false);
    if (isHomePage) {
      scrollToSection(section);
    } else {
      navigate(`/#${section}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="navigation"
      aria-label="Navegación principal"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-md border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group" 
            aria-label="Ir a página principal"
          >
            <div className="h-10 md:h-12 w-auto flex items-center">
              <img
                src={logoMaestria}
                alt="Logo Maestría en Circulación Pulmonar"
                className="h-full w-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className={`relative nav-link px-3 xl:px-4 py-2 text-sm group ${
                  isScrolled ? 'text-foreground' : 'text-white hover:text-white/80'
                }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300 rounded-full" />
              </button>
            ))}
            
            <Link
              to="/foro"
              className={`nav-link px-3 xl:px-4 py-2 text-sm ${
                isScrolled ? 'text-foreground' : 'text-white hover:text-white/80'
              }`}
            >
              Foro
            </Link>
            
            <Link
              to="/novedades"
              className={`nav-link px-3 xl:px-4 py-2 text-sm ${
                isScrolled ? 'text-foreground' : 'text-white hover:text-white/80'
              }`}
            >
              Novedades
            </Link>

            <div className="w-px h-6 bg-border/50 mx-2" />

            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                size="sm"
                className={`rounded-xl text-sm ${
                  !isScrolled && 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                Admin
              </Button>
            )}

            <NotificationBell />

            {user ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className={`rounded-xl text-sm ${
                  !isScrolled && 'text-white hover:bg-white/10'
                }`}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                size="sm"
                className="btn-accent rounded-xl text-sm px-4"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'text-foreground hover:bg-muted border border-border' 
                : 'text-white hover:bg-white/10 border border-white/20'
            }`}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 bg-card/95 backdrop-blur-xl rounded-2xl mt-2 p-4 shadow-xl border border-border/50">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.section}
                    onClick={() => handleNavClick(item.section)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full text-left text-foreground hover:text-primary hover:bg-muted py-3 px-4 rounded-xl font-medium transition-all duration-200"
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                <div className="w-full h-px bg-border my-2" />
                
                <Link
                  to="/foro"
                  className="block text-foreground hover:text-primary hover:bg-muted py-3 px-4 rounded-xl font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Foro
                </Link>
                
                <Link
                  to="/novedades"
                  className="block text-foreground hover:text-primary hover:bg-muted py-3 px-4 rounded-xl font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Novedades
                </Link>

                <div className="w-full h-px bg-border my-2" />

                {isAdmin && (
                  <Button
                    onClick={() => {
                      navigate("/admin");
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl"
                  >
                    Admin
                  </Button>
                )}

                {user ? (
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full rounded-xl mt-2"
                  >
                    Cerrar sesión
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-accent rounded-xl mt-2"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
