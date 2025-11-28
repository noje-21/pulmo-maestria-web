import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import AdminSidebar from "@/features/admin/AdminSidebar";
import { MessageSquare, FileText, FolderOpen, LogOut } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <CardSkeleton />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Envíos de Contacto",
      description: "Ver y gestionar formularios de contacto",
      icon: MessageSquare,
      action: () => navigate("/admin/contactos"),
      buttonText: "Ver Envíos"
    },
    {
      title: "Contenido del Sitio",
      description: "Editar textos e imágenes",
      icon: FileText,
      action: () => navigate("/admin/content"),
      buttonText: "Editar Contenido"
    },
    {
      title: "Documentos",
      description: "Subir nuevos PDFs y recursos",
      icon: FolderOpen,
      action: () => {},
      buttonText: "Gestionar Archivos"
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-background">
      <AdminSidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary pv-appear">Panel de Administración</h1>
              <p className="text-muted-foreground mt-2 pv-appear" style={{ animationDelay: '0.1s' }}>
                Gestiona el contenido y configuración de la maestría
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button onClick={handleLogout} variant="outline" className="pv-tap-scale">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -4 }}
                  className="pv-tap-scale"
                >
                  <Card className="p-6 h-full pv-glass pv-glow border-border/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{card.title}</h2>
                    </div>
                    <p className="text-muted-foreground mb-6">{card.description}</p>
                    <Button className="w-full pv-tap-scale" onClick={card.action}>
                      {card.buttonText}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
