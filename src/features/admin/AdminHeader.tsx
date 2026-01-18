import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, GraduationCap, Menu, Home } from "lucide-react";
import { toast } from "sonner";
import logoMaestria from "@/assets/logo-maestria.jpg";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export default function AdminHeader({ onMenuToggle, showMenuButton = false }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <img 
                src={logoMaestria} 
                alt="MLCP Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                Command Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Panel MLCP
              </p>
            </div>
          </Link>
        </div>

        {/* Center Section - Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Home className="w-4 h-4" />
              Ir al Sitio
            </Button>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CTA Maestría 2026 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/#contacto">
              <Button 
                className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/25 gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden xs:inline">Maestría</span> 2026
              </Button>
            </Link>
          </motion.div>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
