import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, Trash2, Pin, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminForo = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadPosts();
  }, []);

  const checkAdminAndLoadPosts = async () => {
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

      await loadPosts();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return;

    try {
      const { error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Publicación eliminada");
      loadPosts();
    } catch (error: any) {
      toast.error("Error al eliminar publicación");
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_pinned: !currentPinned })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentPinned ? "Publicación desanclada" : "Publicación anclada");
      loadPosts();
    } catch (error: any) {
      toast.error("Error al actualizar publicación");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
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
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/admin")} className="pv-tap-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Gestión del Foro</h1>
              <p className="text-muted-foreground mt-1">Administra las publicaciones del foro</p>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.is_pinned && (
                          <Pin className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Por: {post.profiles?.full_name || "Usuario"}</span>
                        <span>{format(new Date(post.created_at), "dd MMM yyyy", { locale: es })}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views_count} vistas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleTogglePin(post.id, post.is_pinned)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <Card className="p-12 text-center modern-card pv-glass">
                <p className="text-muted-foreground">No hay publicaciones en el foro</p>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminForo;
