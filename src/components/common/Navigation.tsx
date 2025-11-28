import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import NotificationBell from "@/components/common/NotificationBell";
import logoMaestria from "@/assets/logo-maestria.jpg";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      role="navigation"
      aria-label="Navegación principal"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "backdrop-blur-xl bg-background/80 shadow-medium border-b border-border" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="cursor-pointer"
          >
            <Link to="/" className="flex items-center space-x-3" aria-label="Ir a página principal">
              <div className="h-12 sm:h-14 w-auto flex items-center">
                <img
                  src={logoMaestria}
                  alt="Logo Maestría en Circulación Pulmonar - Volver al inicio"
                  className="h-full w-auto object-contain rounded-lg"
                  loading="eager"
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {["maestria", "expertos", "eventos", "galeria", "contacto"].map((item, index) => (
              <motion.button
                key={item}
                onClick={() => scrollToSection(item)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group cursor-pointer"
              >
                {item
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
            <Link
              to="/foro"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Foro
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/novedades"
              className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Novedades
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={() => navigate("/admin")}
                  variant="outline"
                  size="sm"
                  className="ml-4 rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Admin
                </Button>
              </motion.div>
            )}

            <NotificationBell />

            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Cerrar sesión
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 rounded-xl text-foreground hover:bg-accent/10 transition-all duration-300 border border-border"
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div
                className="py-4 space-y-2 backdrop-blur-xl bg-card/95 rounded-2xl mt-4 p-4 sm:p-6 shadow-large border border-border"
              >
                {["maestria", "expertos", "eventos", "galeria", "contacto"].map((item, index) => (
                  <motion.button
                    key={item}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToSection(item);
                }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-accent font-medium w-full text-left cursor-pointer"
                  >
                    {item
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </motion.button>
                ))}
                <Link
                  to="/foro"
                  className="block text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-accent font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Foro
                </Link>
                <Link
                  to="/novedades"
                  className="block text-foreground hover:text-primary transition-all duration-300 py-3 px-4 rounded-xl hover:bg-accent font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Novedades
                </Link>

                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => {
                        navigate("/admin");
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl mt-2"
                    >
                      Admin
                    </Button>
                  </motion.div>
                )}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full rounded-xl mt-2">
                      Cerrar sesión
                    </Button>
                  </motion.div>
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