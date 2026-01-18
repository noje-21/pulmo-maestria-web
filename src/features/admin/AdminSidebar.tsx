import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Image,
  Mail,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Home,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMaestria from "@/assets/logo-maestria.jpg";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/stats", label: "Estadísticas", icon: TrendingUp },
  { to: "/admin/contactos", label: "Contactos", icon: Mail },
  { to: "/admin/content", label: "Contenido", icon: FileText },
  { to: "/admin/foro", label: "Foro", icon: MessageSquare },
  { to: "/admin/novedades", label: "Novedades", icon: Newspaper },
  { to: "/admin/media", label: "Archivos", icon: Image },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-card border-r border-border/50 sticky top-0 overflow-hidden"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <img 
                  src={logoMaestria} 
                  alt="MLCP" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">MLCP</h2>
                <p className="text-[10px] text-muted-foreground">Command Center</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20 mx-auto">
            <img 
              src={logoMaestria} 
              alt="MLCP" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute top-20 -right-3 z-10 w-6 h-6 rounded-full bg-card border border-border/50 shadow-md flex items-center justify-center hover:bg-muted transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                      : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive ? "bg-white/20" : "bg-muted/50 group-hover:bg-muted"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border/30 space-y-2">
        {/* Go to Site */}
        <NavLink to="/">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <Home className="w-4 h-4" />
            {!isCollapsed && <span>Ir al Sitio</span>}
          </Button>
        </NavLink>

        {/* CTA Maestría 2026 */}
        <NavLink to="/#contacto">
          <Button 
            className={cn(
              "w-full bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/25 gap-2",
              isCollapsed && "px-0"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            {!isCollapsed && <span>Maestría 2026</span>}
          </Button>
        </NavLink>
      </div>
    </motion.aside>
  );
}
