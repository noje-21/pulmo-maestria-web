import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMaestria from "@/assets/logo-maestria.jpg";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [{
    name: "Inicio",
    path: "/"
  }, {
    name: "Maestría",
    path: "#maestria"
  }, {
    name: "Expertos",
    path: "#expertos"
  }, {
    name: "Eventos",
    path: "#eventos"
  }, {
    name: "Quiénes Somos",
    path: "#quienes-somos"
  }, {
    name: "Contacto",
    path: "#contacto"
  }];
  const scrollToSection = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      element?.scrollIntoView({
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex justify-between items-center h-20">

          {/* LOGO Y TEXTO */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src={logoMaestria} alt="Logo Maestría" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full flex-shrink-0" />
            <span className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl truncate text-blue-600">
              Circulación Pulmonar
            </span>
          </Link>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex items-center gap-6 flex-wrap justify-end">
            {navItems.map(item => <a key={item.name} href={item.path} onClick={e => {
            if (item.path.startsWith("#")) {
              e.preventDefault();
              scrollToSection(item.path);
            }
          }} className="text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap">
                {item.name}
              </a>)}
            <Link to="/auth">
              <Button variant="outline" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
                Admin
              </Button>
            </Link>
          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Abrir menú">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`md:hidden bg-white border-t border-accent/20 transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-4 py-4 space-y-3">
          {navItems.map(item => <a key={item.name} href={item.path} onClick={e => {
          if (item.path.startsWith("#")) {
            e.preventDefault();
            scrollToSection(item.path);
          }
        }} className="block py-2 text-foreground hover:text-primary transition-colors font-medium">
              {item.name}
            </a>)}
          <Link to="/auth" className="block">
            <Button variant="outline" size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>;
};
export default Navigation;