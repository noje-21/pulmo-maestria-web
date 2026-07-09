import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { buildCommentTree, commentSchema } from "../helpers";
import type { ForumComment, ForumPost } from "../types";

export function useForumPost(id: string | undefined) {
  const navigate = useNavigate();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`*, profiles!forum_posts_user_id_fkey(full_name)`)
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error("No encontramos esta publicación. Puede que haya sido eliminada.");
        navigate("/foro");
        return;
      }
      setPost(data as any);
    } catch (error: any) {
      console.error("Error loading post:", error);
      toast.error("No encontramos esta publicación. Puede que haya sido eliminada.");
      navigate("/foro");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const loadComments = useCallback(async () => {
    if (!id) return;
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
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    })();
    loadPost();
    loadComments();
    if (id) supabase.rpc("increment_post_views", { post_id: id }).then(() => {}, () => {});
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

  return { post, comments, loading, user, submitting, addComment };
}