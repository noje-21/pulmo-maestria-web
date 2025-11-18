import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ReactionButton from "@/components/ReactionButton";
import { Calendar, User, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  reactions_count: number;
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
        .select(`
          *,
          profiles!forum_posts_user_id_fkey(full_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data as any);
    } catch (error: any) {
      console.error("Error loading post:", error);
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
        .select(`
          *,
          profiles!forum_comments_user_id_fkey(full_name)
        `)
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

            <Card className="p-8 md:p-12 modern-card pv-glass pv-glow mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

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

              <div className="prose prose-lg max-w-none mb-8">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              <ReactionButton 
                postType="forum" 
                postId={post.id} 
                initialCount={post.reactions_count || 0}
              />
            </Card>

            <Card className="p-8 modern-card pv-glass pv-glow">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">
                  Comentarios ({comments.length})
                </h2>
              </div>

              {user && (
                <div className="mb-8">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="modern-input min-h-[120px] mb-4"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="modern-btn pv-tap-scale"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Comentario
                  </Button>
                </div>
              )}

              {!user && (
                <div className="mb-8 p-6 bg-muted rounded-xl text-center">
                  <p className="text-muted-foreground mb-4">
                    Debes iniciar sesión para comentar
                  </p>
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="outline"
                    className="pv-tap-scale"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {comment.profiles?.full_name || "Usuario"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(comment.created_at), "dd MMM, yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
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
