import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/features/admin/AdminLayout";
import { 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Image,
  Mail,
  Newspaper,
  ArrowRight,
  Users,
  Eye,
  Activity
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Contactos",
      description: "Gestiona los formularios recibidos",
      icon: Mail,
      action: () => navigate("/admin/contactos"),
      color: "bg-blue-500/10 text-blue-600",
      iconBg: "bg-blue-500/20"
    },
    {
      title: "Contenido",
      description: "Edita textos e imágenes del sitio",
      icon: FileText,
      action: () => navigate("/admin/content"),
      color: "bg-purple-500/10 text-purple-600",
      iconBg: "bg-purple-500/20"
    },
    {
      title: "Foro",
      description: "Modera las publicaciones del foro",
      icon: MessageSquare,
      action: () => navigate("/admin/foro"),
      color: "bg-green-500/10 text-green-600",
      iconBg: "bg-green-500/20"
    },
    {
      title: "Novedades",
      description: "Publica noticias y actualizaciones",
      icon: Newspaper,
      action: () => navigate("/admin/novedades"),
      color: "bg-orange-500/10 text-orange-600",
      iconBg: "bg-orange-500/20"
    },
    {
      title: "Estadísticas",
      description: "Visualiza métricas y analíticas",
      icon: TrendingUp,
      action: () => navigate("/admin/stats"),
      color: "bg-cyan-500/10 text-cyan-600",
      iconBg: "bg-cyan-500/20"
    },
    {
      title: "Archivos",
      description: "Gestiona PDFs y recursos",
      icon: Image,
      action: () => navigate("/admin/media"),
      color: "bg-pink-500/10 text-pink-600",
      iconBg: "bg-pink-500/20"
    }
  ];

  const statsCards = [
    { label: "Usuarios Activos", value: "124", icon: Users, trend: "+12%" },
    { label: "Visitas Hoy", value: "1,847", icon: Eye, trend: "+8%" },
    { label: "Interacciones", value: "342", icon: Activity, trend: "+24%" },
  ];

  return (
    <AdminLayout 
      title="¡Bienvenido al Command Center!" 
      subtitle="Gestiona y controla todos los aspectos de la plataforma MLCP"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 md:p-5 bg-card border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ y: -2 }}
                className="cursor-pointer"
                onClick={action.action}
              >
                <Card className="p-5 h-full bg-card border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                ¿Listo para la Maestría 2026?
              </h3>
              <p className="text-muted-foreground mt-1">
                Revisa las inscripciones y gestiona los nuevos aspirantes
              </p>
            </div>
            <Button 
              className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg shadow-accent/25 gap-2"
              onClick={() => navigate("/admin/contactos")}
            >
              Ver Inscripciones
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default Admin;
