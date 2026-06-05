import { Flame, Zap, Activity, Clock } from "lucide-react";
import { differenceInDays, differenceInHours } from "date-fns";
import { z } from "zod";
import type { ForumPost, ForumComment } from "./types";

export const getActivityStatus = (post: ForumPost) => {
  const now = new Date();
  const lastActivity = post.updated_at ? new Date(post.updated_at) : new Date(post.created_at);
  const hoursAgo = differenceInHours(now, lastActivity);
  const daysAgo = differenceInDays(now, lastActivity);

  if (hoursAgo < 24) {
    return { status: "hot", label: "Activo hoy", color: "text-orange-500", bgColor: "bg-orange-500/10", icon: Flame };
  } else if (daysAgo <= 3) {
    return { status: "recent", label: `Hace ${daysAgo} día${daysAgo > 1 ? "s" : ""}`, color: "text-green-500", bgColor: "bg-green-500/10", icon: Zap };
  } else if (daysAgo <= 7) {
    return { status: "active", label: "Esta semana", color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Activity };
  }
  return { status: "inactive", label: `Hace ${daysAgo} días`, color: "text-muted-foreground", bgColor: "bg-muted", icon: Clock };
};

export const getInitials = (name: string) => {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
};

export const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    general: "General",
    clinical_questions: "Preguntas Clínicas",
    case_discussions: "Casos Clínicos",
    shared_resources: "Recursos",
  };
  return labels[category] || category;
};

export const getCategoryStyles = (category: string) => {
  const styles: Record<string, string> = {
    general: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    clinical_questions: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    case_discussions: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    shared_resources: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };
  return styles[category] || "bg-muted text-muted-foreground";
};

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(2000, "El comentario es demasiado largo (máximo 2000 caracteres)"),
});

export const buildCommentTree = (rows: any[]): ForumComment[] => {
  const commentMap = new Map<string, ForumComment>();
  const rootComments: ForumComment[] = [];

  rows.forEach((comment: any) => {
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

  return rootComments;
};