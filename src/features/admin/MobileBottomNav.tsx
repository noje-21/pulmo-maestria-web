import { motion } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Newspaper,
  GraduationCap,
  MoreHorizontal
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  TrendingUp,
  Image,
  Mail,
  FileText
} from "lucide-react";

const mainNavItems = [
  { to: "/admin", label: "Inicio", icon: LayoutDashboard, end: true },
  { to: "/admin/foro", label: "Foro", icon: MessageSquare },
  { to: "/admin/novedades", label: "Novedades", icon: Newspaper },
];

const moreNavItems = [
  { to: "/admin/stats", label: "Estadísticas", icon: TrendingUp },
  { to: "/admin/contactos", label: "Contactos", icon: Mail },
  { to: "/admin/content", label: "Contenido", icon: FileText },
  { to: "/admin/media", label: "Archivos", icon: Image },
];

export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More Menu */}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">Más</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl pb-8">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-left">Más opciones</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-4 rounded-xl transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>

        {/* CTA Maestría 2026 */}
        <Link to="/#contacto" className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-accent text-white"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] font-bold">2026</span>
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
}
