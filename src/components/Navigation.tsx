import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMaestria from "@/assets/logo-maestria.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Maestría", path: "#maestria" },
    { name: "Expertos", path: "#expertos" },
    { name: "Eventos", path: "#eventos" },
    { name: "Quiénes Somos", path: "#quienes-somos" },
    { name: "Contacto", path: "#contacto" },
  ];

  const scrollToSection = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logoMaestria} alt="Logo Maestría" className="h-14 w-14 object-contain rounded-full" />
            <span className="font-bold text-lg text-primary hidden md:block">Circulación Pulmonar</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  if (item.path.startsWith("#")) {
                    e.preventDefault();
                    scrollToSection(item.path);
                  }
                }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
            <Link to="/auth">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  if (item.path.startsWith("#")) {
                    e.preventDefault();
                    scrollToSection(item.path);
                  }
                }}
                className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
            <Link to="/auth" className="block">
              <Button variant="outline" size="sm" className="w-full">Admin</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
