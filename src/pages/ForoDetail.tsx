import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Calendar, User, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

const ForoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    checkAuth();
    loadPost();
    loadComments();
    incrementViews();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const incrementViews = async () => {
    try {
      const { data: post } = await supabase
        .from("forum_posts")
        .select("views_count")
        .eq("id", id)
        .single();
      
      if (post) {
        await supabase
          .from("forum_posts")
          .update({ views_count: post.views_count + 1 })
          .eq("id", id);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*, profiles(full_name)")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data as any);
    } catch (error: any) {
      toast.error("Error al cargar la publicación");
      navigate("/foro");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_comments")
        .select("*, profiles(full_name)")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data as any || []);
    } catch (error: any) {
      console.error("Error loading comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comentar");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }

    try {
      const { error } = await supabase.from("forum_comments").insert({
        post_id: id,
        user_id: user.id,
        content: newComment,
      });

      if (error) throw error;

      toast.success("Comentario añadido");
      setNewComment("");
      loadComments();
    } catch (error: any) {
      toast.error("Error al añadir comentario");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pv-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => navigate("/foro")}
              variant="outline"
              className="mb-8 pv-tap-scale"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Foro
            </Button>

            {/* Post Content */}
            <Card className="p-8 md:p-12 mb-8 modern-card pv-glass pv-glow">
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.profiles?.full_name || "Usuario"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(post.created_at), "dd 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-foreground">
                {post.content}
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-8 modern-card pv-glass pv-glow">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Comentarios ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <div className="mb-8">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows={4}
                  className="modern-input mb-4"
                />
                <Button onClick={handleAddComment} className="modern-btn pv-tap-scale">
                  <Send className="w-4 h-4 mr-2" />
                  Publicar Comentario
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-l-4 border-primary/20 pl-6 py-4"
                  >
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span className="font-semibold">{comment.profiles?.full_name || "Usuario"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(comment.created_at), "dd MMM yyyy, HH:mm", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground">{comment.content}</p>
                  </motion.div>
                ))}

                {comments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForoDetail;
