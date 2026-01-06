import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import ReactionButton from "@/features/forum/ReactionButton";
import { 
  Calendar, User, ArrowLeft, MessageSquare, Send, 
  Eye, Clock, Reply, ChevronDown, ChevronUp
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import DOMPurify from "dompurify";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  views_count: number;
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
  parent_id: string | null;
  profiles?: {
    full_name: string;
  };
  replies?: Comment[];
}

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(2000, "El comentario es demasiado largo (máximo 2000 caracteres)")
});

const PostSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 space-y-6">
    <Skeleton className="h-10 w-3/4" />
    <div className="flex gap-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-28" />
    </div>
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-10 w-40" />
  </div>
);

const ForoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      await supabase.rpc("increment_post_views", { post_id: id });
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
      toast.error("No encontramos esta publicación. Puede que haya sido eliminada.");
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
      
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];
      
      (data || []).forEach((comment: any) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      commentMap.forEach((comment) => {
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });
      
      setComments(rootComments);
    } catch (error: any) {
      console.error("Error loading comments:", error);
    }
  };

  const handleAddComment = async (parentId: string | null = null) => {
    if (!user) {
      toast.error("Inicia sesión para unirte a la conversación");
      navigate("/auth");
      return;
    }

    try {
      setSubmitting(true);
      const validated = commentSchema.parse({ content: newComment });

      const { error } = await supabase.from("forum_comments").insert({
        post_id: id,
        user_id: user.id,
        content: validated.content,
        parent_id: parentId,
      });

      if (error) throw error;

      toast.success(parentId ? "¡Respuesta publicada!" : "¡Gracias por tu aporte!");
      setNewComment("");
      setReplyingTo(null);
      loadComments();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Error adding comment:", error);
        toast.error("No pudimos publicar tu comentario. Intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: "General",
      clinical_questions: "Preguntas Clínicas",
      case_discussions: "Casos Clínicos",
      shared_resources: "Recursos"
    };
    return labels[category] || category;
  };

  const getCategoryStyles = (category: string) => {
    const styles: Record<string, string> = {
      general: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      clinical_questions: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      case_discussions: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      shared_resources: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    };
    return styles[category] || "bg-muted text-muted-foreground";
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={depth > 0 ? 'ml-4 sm:ml-8 mt-3' : 'mt-4'}
      >
        <div className={`
          relative bg-muted/30 rounded-xl p-4 sm:p-5 
          ${depth > 0 ? 'border-l-2 border-primary/20' : ''}
        `}>
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm">
                {getInitials(comment.profiles?.full_name || '')}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-medium text-sm sm:text-base">
                  {comment.profiles?.full_name || "Usuario"}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed mb-3">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {user && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    {replyingTo === comment.id ? "Cancelar" : "Responder"}
                  </button>
                )}
                {hasReplies && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Ocultar respuestas
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Ver {comment.replies!.length} respuesta{comment.replies!.length > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Reply Form */}
              <AnimatePresence>
                {replyingTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="¿Qué opinas sobre esto?"
                      className="min-h-[80px] resize-none rounded-xl"
                    />
                    <Button 
                      onClick={() => handleAddComment(comment.id)} 
                      size="sm" 
                      disabled={submitting || !newComment.trim()}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? "Publicando..." : "Responder"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Replies */}
        <AnimatePresence>
          {hasReplies && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {comment.replies!.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <Navigation />
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-40 mb-8" />
            <PostSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navigation />
      
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Button
              onClick={() => navigate("/foro")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Foro
            </Button>

            {/* Post Card */}
            <article className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-8">
              <div className="p-6 sm:p-8">
                {/* Category Badge */}
                <Badge 
                  variant="outline" 
                  className={`mb-4 ${getCategoryStyles(post.category)}`}
                >
                  {getCategoryLabel(post.category)}
                </Badge>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {getInitials(post.profiles?.full_name || '')}
                    </div>
                    <span className="font-medium text-foreground">
                      {post.profiles?.full_name || "Usuario"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{post.views_count} vistas</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Reactions */}
                <div className="pt-4 border-t border-border/50">
                  <ReactionButton 
                    postType="forum" 
                    postId={post.id} 
                    initialCount={post.reactions_count || 0}
                  />
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <section className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Comentarios ({comments.length})
                </h2>
              </div>

              {/* New Comment Form */}
              {user ? (
                <div className="mb-8 p-4 bg-muted/30 rounded-xl">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 hidden sm:block">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {getInitials(user.user_metadata?.full_name || user.email || '')}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Comparte tu opinión o experiencia..."
                        className="min-h-[100px] resize-none rounded-xl bg-background"
                      />
                      <Button
                        onClick={() => handleAddComment(null)}
                        disabled={submitting || !newComment.trim()}
                        className="gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {submitting ? "Publicando..." : "Compartir comentario"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-muted/50 rounded-xl text-center">
                  <p className="text-muted-foreground mb-4">
                    ¿Quieres ser parte de esta conversación? Inicia sesión para comentar.
                  </p>
                  <Button onClick={() => navigate("/auth")} variant="outline">
                    Iniciar sesión
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-2">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">
                      No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ForoDetail;
