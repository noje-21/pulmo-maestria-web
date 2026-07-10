import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ReactionButton from "@/features/forum/ReactionButton";
import RichContent, { htmlToPlainText } from "@/components/common/RichContent";
import { SEO } from "@/components/common/SEO";
import { Calendar, ArrowLeft, MessageSquare, Send, Eye, AlertCircle, RefreshCw, SearchX } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useForumPost } from "@/features/forum/hooks/useForumPost";
import CommentItem from "@/features/forum/components/CommentItem";
import { useIsAdmin } from "@/features/forum/hooks/useForumPosts";
import { getCategoryLabel, getCategoryStyles, getInitials } from "@/features/forum/helpers";

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

const CommentSkeleton = () => (
  <div className="bg-muted/30 rounded-xl p-4 sm:p-5">
    <div className="flex items-start gap-3 sm:gap-4">
      <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

const ForoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    post,
    comments,
    loading,
    commentsLoading,
    postError,
    commentsError,
    user,
    submitting,
    addComment,
    editComment,
    deleteComment,
    reloadPost,
    reloadComments,
  } = useForumPost(id);
  const isAdmin = useIsAdmin();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  }, []);

  const handleSubmitMain = async () => {
    const ok = await addComment(newComment, null);
    if (ok) setNewComment("");
  };

  const handleSubmitReply = useCallback(
    async (parentId: string, content: string) => {
      const ok = await addComment(content, parentId);
      if (ok) setReplyingTo(null);
      return ok;
    },
    [addComment],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-40 mb-8" />
            <PostSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (postError || !post) {
    const notFound = postError === "not-found";
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={() => navigate("/foro")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Foro
            </Button>
            <div
              role="alert"
              className="bg-card rounded-2xl border border-border/50 p-8 sm:p-12 text-center"
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                notFound ? "bg-muted" : "bg-destructive/10"
              }`}>
                {notFound ? (
                  <SearchX className="w-7 h-7 text-muted-foreground" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-destructive" />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-2">
                {notFound ? "Publicación no encontrada" : "No pudimos cargar la publicación"}
              </h1>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {notFound
                  ? "Puede haber sido eliminada o el enlace es incorrecto."
                  : "Puede ser un problema temporal de conexión. Intenta nuevamente."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {!notFound && (
                  <Button onClick={() => reloadPost()} className="gap-2 rounded-xl">
                    <RefreshCw className="w-4 h-4" />
                    Reintentar
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/foro")}
                  variant={notFound ? "default" : "outline"}
                  className="rounded-xl"
                >
                  Ir al foro
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const plainContent = htmlToPlainText(post.content || "");
  const seoDescription =
    (post.excerpt?.trim() || plainContent).slice(0, 155).trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <SEO
        title={`${post.title} — Foro`}
        description={seoDescription}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "DiscussionForumPosting",
          headline: post.title,
          articleBody: plainContent.slice(0, 5000),
          datePublished: post.created_at,
          dateModified: post.updated_at ?? post.created_at,
          author: {
            "@type": "Person",
            name: post.profiles?.full_name || "Usuario",
          },
          interactionStatistic: [
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/CommentAction",
              userInteractionCount: comments.length,
            },
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/ViewAction",
              userInteractionCount: post.views_count,
            },
          ],
        }}
      />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={() => navigate("/foro")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Foro
            </Button>

            <article className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-8">
              <div className="p-6 sm:p-8">
                <Badge variant="outline" className={`mb-4 ${getCategoryStyles(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </Badge>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {getInitials(post.profiles?.full_name || "")}
                    </div>
                    <span className="font-medium text-foreground">
                      {post.profiles?.full_name || "Usuario"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.created_at), "dd 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{post.views_count} vistas</span>
                  </div>
                </div>

                <RichContent html={post.content} size="lg" className="mb-6" />

                <div className="pt-4 border-t border-border/50">
                  <ReactionButton
                    postType="forum"
                    postId={post.id}
                    initialCount={post.reactions_count || 0}
                  />
                </div>
              </div>
            </article>

            <section className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Comentarios {commentsLoading ? "" : `(${comments.length})`}
                </h2>
              </div>

              {user ? (
                <div className="mb-8 p-4 bg-muted/30 rounded-xl">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 hidden sm:block">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {getInitials(user.user_metadata?.full_name || user.email || "")}
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
                        onClick={handleSubmitMain}
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

              <div className="space-y-2">
                {commentsLoading ? (
                  <div className="space-y-3" aria-hidden="true">
                    <CommentSkeleton />
                    <CommentSkeleton />
                    <CommentSkeleton />
                  </div>
                ) : commentsError ? (
                  <div
                    role="alert"
                    className="text-center py-10 px-4 bg-destructive/5 rounded-xl border border-destructive/20"
                  >
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 text-destructive/60" />
                    <p className="text-sm text-foreground mb-4">{commentsError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reloadComments()}
                      className="gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reintentar
                    </Button>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      user={user}
                      isAdmin={isAdmin}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      expandedReplies={expandedReplies}
                      toggleReplies={toggleReplies}
                      submitting={submitting}
                      onSubmitReply={handleSubmitReply}
                      onEdit={editComment}
                      onDelete={deleteComment}
                    />
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
