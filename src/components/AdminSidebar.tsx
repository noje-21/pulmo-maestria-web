import { motion } from "framer-motion";
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
  ChevronRight
} from "lucide-react";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/stats", label: "Estadísticas", icon: TrendingUp },
  { to: "/admin/contactos", label: "Contactos", icon: Mail },
  { to: "/admin/content", label: "Contenido", icon: FileText },
  { to: "/admin/foro", label: "Foro", icon: MessageSquare },
  { to: "/admin/novedades", label: "Novedades", icon: Newspaper },
  { to: "/admin/media", label: "Archivos", icon: Image },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 260 : 84 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-white/80 dark:bg-slate-900/70 pv-glass pv-glow border-r border-border/50 sticky top-0"
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          animate={{ opacity: open ? 1 : 0 }}
        >
          {open && <span className="font-semibold text-lg text-primary">Admin Panel</span>}
        </motion.div>

        <button
          className="p-2 rounded-lg hover:bg-muted/50 transition-all pv-tap-scale"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all pv-smooth-transition pv-tap-scale",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium shadow-md shadow-primary/10" 
                      : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                  )
                }
              >
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center pv-smooth-transition">
                  <Icon className="w-5 h-5" />
                </div>
                <motion.span
                  animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <motion.div
          animate={{ opacity: open ? 1 : 0.5 }}
          className="text-xs text-muted-foreground text-center"
        >
          {open ? "Maestría CP 2025" : "©"}
        </motion.div>
      </div>
    </motion.aside>
  );
}
