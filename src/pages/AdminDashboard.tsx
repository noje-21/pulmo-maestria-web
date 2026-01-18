import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { TrendingUp, Users, MessageSquare, Eye, Heart } from "lucide-react";

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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: forumPosts } = await supabase
        .from("forum_posts")
        .select("id, views_count, reactions_count");

      const { data: novedades } = await supabase
        .from("novedades")
        .select("id, title")
        .eq("status", "published");

      const { data: comments } = await supabase
        .from("forum_comments")
        .select("id");

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id");

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
      <AdminLayout title="Dashboard de Estadísticas" subtitle="Cargando...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Publicaciones del Foro", value: stats.totalForumPosts, icon: MessageSquare },
    { label: "Novedades Publicadas", value: stats.totalNovedades, icon: TrendingUp },
    { label: "Usuarios Registrados", value: stats.activeUsers, icon: Users },
    { label: "Visualizaciones", value: stats.totalViews, icon: Eye },
    { label: "Reacciones", value: stats.totalReactions, icon: Heart },
    { label: "Comentarios", value: stats.totalComments, icon: MessageSquare },
  ];

  return (
    <AdminLayout 
      title="Dashboard de Estadísticas" 
      subtitle="Resumen de actividad y métricas principales"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5 bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Total</span>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-5 bg-card border-border/50">
          <h2 className="text-xl font-bold mb-4">Publicaciones Más Vistas</h2>
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-primary w-8">#{index + 1}</span>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
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
    </AdminLayout>
  );
};

export default AdminDashboard;
