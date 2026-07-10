import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { buildCommentTree, commentSchema } from "../helpers";
import { useAuth } from "@/hooks/useAuth";
import type { ForumComment, ForumPost } from "../types";

export function useForumPost(id: string | undefined) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postError, setPostError] = useState<"not-found" | "network" | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setPostError(null);
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`*, profiles!forum_posts_user_id_fkey(full_name)`)
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setPostError("not-found");
        return;
      }
      setPost(data as any);
    } catch (error: any) {
      console.error("Error loading post:", error);
      setPostError("network");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    if (!id) return;
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const { data, error } = await supabase
        .from("forum_comments")
        .select(`*, profiles!forum_comments_user_id_fkey(full_name)`)
        .eq("post_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setComments(buildCommentTree(data || []));
    } catch (error: any) {
      console.error("Error loading comments:", error);
      setCommentsError("No pudimos cargar los comentarios.");
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
    loadComments();
    if (id) {
      // Dedupe view increment per session so refresh + StrictMode don't inflate counts.
      const viewKey = `forum-viewed-${id}`;
      if (!sessionStorage.getItem(viewKey)) {
        sessionStorage.setItem(viewKey, "1");
        supabase.rpc("increment_post_views", { post_id: id }).then(
          () => {},
          () => sessionStorage.removeItem(viewKey),
        );
      }
    }
  }, [id, loadPost, loadComments]);

  const addComment = async (content: string, parentId: string | null = null) => {
    if (!user) {
      toast.error("Inicia sesión para unirte a la conversación");
      navigate("/auth");
      return false;
    }
    try {
      setSubmitting(true);
      const validated = commentSchema.parse({ content });
      const { error } = await supabase.from("forum_comments").insert({
        post_id: id,
        user_id: user.id,
        content: validated.content,
        parent_id: parentId,
      });
      if (error) throw error;
      toast.success(parentId ? "¡Respuesta publicada!" : "¡Gracias por tu aporte!");
      await loadComments();
      return true;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        console.error("Error adding comment:", error);
        toast.error("No pudimos publicar tu comentario. Intenta de nuevo.");
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const editComment = async (commentId: string, content: string) => {
    if (!user) {
      toast.error("Inicia sesión para editar tu comentario");
      return false;
    }
    try {
      setSubmitting(true);
      const validated = commentSchema.parse({ content });
      const { error } = await supabase
        .from("forum_comments")
        .update({ content: validated.content })
        .eq("id", commentId)
        .eq("user_id", user.id);
      if (error) throw error;
      toast.success("Comentario actualizado");
      await loadComments();
      return true;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        console.error("Error editing comment:", error);
        toast.error("No pudimos actualizar tu comentario.");
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) {
      toast.error("Inicia sesión para eliminar tu comentario");
      return false;
    }
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("forum_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
      toast.success("Comentario eliminado");
      await loadComments();
      return true;
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast.error("No pudimos eliminar el comentario.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    reloadPost: loadPost,
    reloadComments: loadComments,
  };
}