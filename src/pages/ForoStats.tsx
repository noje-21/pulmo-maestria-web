import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Eye,
  Trophy,
  Activity,
  Calendar,
  BarChart3
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Stats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  totalUsers: number;
}

interface TopPost {
  id: string;
  title: string;
  views_count: number;
  reactions_count: number;
  profiles: { full_name: string };
}

interface TopUser {
  user_id: string;
  full_name: string;
  post_count: number;
  comment_count: number;
}

interface MonthlyData {
  month: string;
  posts: number;
  comments: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ForoStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    totalUsers: 0
  });
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    await Promise.all([
      loadGeneralStats(),
      loadTopPosts(),
      loadTopUsers(),
      loadMonthlyData(),
      loadCategoryData()
    ]);
    setLoading(false);
  };

  const loadGeneralStats = async () => {
    try {
      // Total posts
      const { count: postsCount } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true });
      
      // Total comments
      const { count: commentsCount } = await supabase
        .from("forum_comments")
        .select("*", { count: "exact", head: true });
      
      // Total views
      const { data: viewsData } = await supabase
        .from("forum_posts")
        .select("views_count");
      const totalViews = viewsData?.reduce((sum, post) => sum + post.views_count, 0) || 0;
      
      // Total active users
      const { data: usersData } = await supabase
        .from("forum_posts")
        .select("user_id");
      const uniqueUsers = new Set(usersData?.map(p => p.user_id) || []);
      
      setStats({
        totalPosts: postsCount || 0,
        totalComments: commentsCount || 0,
        totalViews,
        totalUsers: uniqueUsers.size
      });
    } catch (error) {
      console.error("Error loading general stats:", error);
    }
  };

  const loadTopPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          id,
          title,
          views_count,
          reactions_count,
          profiles!forum_posts_user_id_fkey(full_name)
        `)
        .order("views_count", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setTopPosts(data as any || []);
    } catch (error) {
      console.error("Error loading top posts:", error);
    }
  };

  const loadTopUsers = async () => {
    try {
      const { data: postsData } = await supabase
        .from("forum_posts")
        .select("user_id, profiles!forum_posts_user_id_fkey(full_name)");
      
      const { data: commentsData } = await supabase
        .from("forum_comments")
        .select("user_id");
      
      const userMap = new Map<string, TopUser>();
      
      postsData?.forEach(post => {
        const userId = post.user_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            user_id: userId,
            full_name: (post.profiles as any)?.full_name || "Usuario",
            post_count: 0,
            comment_count: 0
          });
        }
        userMap.get(userId)!.post_count++;
      });
      
      commentsData?.forEach(comment => {
        const userId = comment.user_id;
        if (userMap.has(userId)) {
          userMap.get(userId)!.comment_count++;
        }
      });
      
      const sortedUsers = Array.from(userMap.values())
        .sort((a, b) => (b.post_count + b.comment_count) - (a.post_count + a.comment_count))
        .slice(0, 5);
      
      setTopUsers(sortedUsers);
    } catch (error) {
      console.error("Error loading top users:", error);
    }
  };

  const loadMonthlyData = async () => {
    try {
      const months = eachMonthOfInterval({
        start: subMonths(new Date(), 5),
        end: new Date()
      });
      
      const monthlyStats = await Promise.all(
        months.map(async (month) => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);
          
          const { count: postsCount } = await supabase
            .from("forum_posts")
            .select("*", { count: "exact", head: true })
            .gte("created_at", start.toISOString())
            .lte("created_at", end.toISOString());
          
          const { count: commentsCount } = await supabase
            .from("forum_comments")
            .select("*", { count: "exact", head: true })
            .gte("created_at", start.toISOString())
            .lte("created_at", end.toISOString());
          
          return {
            month: format(month, "MMM", { locale: es }),
            posts: postsCount || 0,
            comments: commentsCount || 0
          };
        })
      );
      
      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error("Error loading monthly data:", error);
    }
  };

  const loadCategoryData = async () => {
    try {
      const { data } = await supabase
        .from("forum_posts")
        .select("category");
      
      const categoryMap = new Map<string, number>();
      data?.forEach(post => {
        categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
      });
      
      const categoryLabels: Record<string, string> = {
        general: "General",
        clinical_questions: "Preguntas Clínicas",
        case_discussions: "Casos Discutidos",
        shared_resources: "Recursos Compartidos"
      };
      
      const categoryStats = Array.from(categoryMap.entries()).map(([key, value]) => ({
        name: categoryLabels[key] || key,
        value
      }));
      
      setCategoryData(categoryStats);
    } catch (error) {
      console.error("Error loading category data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pv-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <BarChart3 className="inline w-12 h-12 mr-3" />
              Estadísticas del Foro
            </h1>
            <p className="text-xl text-muted-foreground">
              Análisis completo de la actividad y participación
            </p>
          </motion.div>

          {/* General Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Publicaciones</p>
                    <p className="text-3xl font-bold">{stats.totalPosts}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <Activity className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Comentarios</p>
                    <p className="text-3xl font-bold">{stats.totalComments}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Eye className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vistas</p>
                    <p className="text-3xl font-bold">{stats.totalViews}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 modern-card pv-glass pv-glow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 modern-card pv-glass pv-glow">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Actividad Mensual
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="posts" stroke="#8884d8" name="Publicaciones" />
                  <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comentarios" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 modern-card pv-glass pv-glow">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Distribución por Categoría
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Posts & Users */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6 modern-card pv-glass pv-glow">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Publicaciones Más Populares
              </h3>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="text-lg font-bold w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        por {post.profiles?.full_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views_count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 modern-card pv-glass pv-glow">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Usuarios Más Activos
              </h3>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div key={user.user_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge className="text-lg font-bold w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.post_count} publicaciones • {user.comment_count} comentarios
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForoStats;
