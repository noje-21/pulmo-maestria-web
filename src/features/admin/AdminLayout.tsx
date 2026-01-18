import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import MobileBottomNav from "./MobileBottomNav";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: isAdminData } = await supabase.rpc('is_admin', { 
        check_user_id: session.user.id 
      });

      if (isAdminData) {
        setIsAdmin(true);
      } else {
        toast.error("No tienes permisos de administrador");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 bg-card border-b border-border/50 animate-pulse" />
        <div className="flex">
          <div className="hidden md:block w-60 h-screen bg-card border-r border-border/50 animate-pulse" />
          <div className="flex-1 p-6">
            <CardSkeleton />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Mobile Header */}
      <div className="md:hidden">
        <AdminHeader 
          showMenuButton 
          onMenuToggle={() => setMobileMenuOpen(true)} 
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
          {/* Page Header */}
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 md:px-6 lg:px-8 pt-6 pb-4"
            >
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Page Content */}
          <div className="px-4 md:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
