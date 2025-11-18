import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, TrendingUp, Users, MessageSquare, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  totalForumPosts: number;
  totalNovedades: number;
  totalComments: number;
  totalViews: number;
  totalReactions: number;
  activeUsers: number;
}

interface TopPost {
  id: string;
  title: string;
  views_count: number;
  reactions_count: number;
  type: "forum" | "novedad";
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalForumPosts: 0,
    totalNovedades: 0,
    totalComments: 0,
    totalViews: 0,
    totalReactions: 0,
    activeUsers: 0
  });
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadStats();
  }, []);

  const checkAdminAndLoadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: isAdminData } = await supabase.rpc('is_admin', { 
        check_user_id: session.user.id 
      });

      if (!isAdminData) {
        toast.error("No tienes permisos de administrador");
        navigate("/");
        return;
      }

      await loadStats();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

  const loadStats = async () => {
    try {
      // Obtener estadísticas del foro
      const { data: forumPosts } = await supabase
        .from("forum_posts")
        .select("id, views_count, reactions_count");

      // Obtener estadísticas de novedades
      const { data: novedades } = await supabase
        .from("novedades")
        .select("id, title")
        .eq("status", "published");

      // Obtener comentarios
      const { data: comments } = await supabase
        .from("forum_comments")
        .select("id");

      // Obtener usuarios activos
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id");

      // Obtener top posts del foro
      const { data: topForumPosts } = await supabase
        .from("forum_posts")
        .select("id, title, views_count, reactions_count")
        .order("views_count", { ascending: false })
        .limit(5);

      const totalViews = forumPosts?.reduce((acc, post) => acc + (post.views_count || 0), 0) || 0;
      const totalReactions = forumPosts?.reduce((acc, post) => acc + (post.reactions_count || 0), 0) || 0;

      setStats({
        totalForumPosts: forumPosts?.length || 0,
        totalNovedades: novedades?.length || 0,
        totalComments: comments?.length || 0,
        totalViews,
        totalReactions,
        activeUsers: profiles?.length || 0
      });

      const formattedTopPosts: TopPost[] = (topForumPosts || []).map(post => ({
        id: post.id,
        title: post.title,
        views_count: post.views_count || 0,
        reactions_count: post.reactions_count || 0,
        type: "forum" as const
      }));

      setTopPosts(formattedTopPosts);
    } catch (error: any) {
      toast.error("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-background">
      <AdminSidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/admin")} className="pv-tap-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Dashboard de Estadísticas</h1>
              <p className="text-muted-foreground mt-1">Resumen de actividad y métricas principales</p>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalForumPosts}</h3>
                <p className="text-sm text-muted-foreground">Publicaciones del Foro</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalNovedades}</h3>
                <p className="text-sm text-muted-foreground">Novedades Publicadas</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Activos</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.activeUsers}</h3>
                <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalViews}</h3>
                <p className="text-sm text-muted-foreground">Visualizaciones</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalReactions}</h3>
                <p className="text-sm text-muted-foreground">Reacciones</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stats.totalComments}</h3>
                <p className="text-sm text-muted-foreground">Comentarios</p>
              </Card>
            </motion.div>
          </div>

          {/* Top Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 modern-card pv-glass pv-glow">
              <h2 className="text-2xl font-bold mb-6">Publicaciones Más Vistas</h2>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.reactions_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {topPosts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay publicaciones aún
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
