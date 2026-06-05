import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/common/Avatar";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import ReactionButton from "@/features/forum/ReactionButton";
import { MessageSquare, User, Eye, ChevronRight, Clock, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getActivityStatus } from "../helpers";
import type { ForumPost } from "../types";

interface Props {
  post: ForumPost;
  index: number;
}

export default function ForumPostCard({ post, index }: Props) {
  const navigate = useNavigate();
  const activity = getActivityStatus(post);
  const ActivityIcon = activity.icon;
  const commentsCount = Array.isArray(post.forum_comments) ? post.forum_comments.length : 0;

  return (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => navigate(`/foro/${post.id}`)}
      className="group cursor-pointer"
      role="article"
      aria-label={`Publicación: ${post.title}`}
    >
      <div className={`
        card-base card-hover p-4 sm:p-5 md:p-6 transition-all duration-400 relative overflow-hidden
        ${post.featured ? 'ring-2 ring-accent/30 bg-gradient-to-br from-accent/[0.03] to-transparent' : ''}
        ${post.is_pinned ? 'ring-2 ring-primary/30 bg-gradient-to-br from-primary/[0.03] to-transparent' : ''}
        ${activity.status === 'hot' ? 'ring-1 ring-orange-500/30' : ''}
      `}>
        <div className="absolute top-0 left-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-0.5 sm:w-1 h-5 sm:h-6 bg-accent rounded-br-sm" />

        {activity.status === 'hot' && (
          <div className="absolute top-4 right-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {post.is_pinned && <CategoryBadge category="pinned" size="sm" />}
          {post.featured && <CategoryBadge category="featured" size="sm" />}
          <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${activity.bgColor} ${activity.color} transition-all duration-300 group-hover:scale-105`}>
            <ActivityIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">{activity.label}</span>
          </span>
          {commentsCount >= 5 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
              <TrendingUp className="w-3 h-3" />
              Popular
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 hidden sm:block">
            <Avatar name={post.profiles?.full_name || 'Usuario'} size="lg" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                {post.title}
              </h2>
              <CategoryBadge category={post.category as any} showLabel={false} className="sm:hidden" />
              <CategoryBadge category={post.category as any} className="hidden sm:inline-flex" />
            </div>

            {post.excerpt && (
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[120px]">{post.profiles?.full_name || "Usuario"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.views_count}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${commentsCount > 0 ? 'text-primary font-medium' : ''}`}>
                <MessageSquare className="w-4 h-4" />
                <span>{commentsCount} {commentsCount === 1 ? 'respuesta' : 'respuestas'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
              <div onClick={(e) => e.stopPropagation()}>
                <ReactionButton
                  postType="forum"
                  postId={post.id}
                  initialCount={post.reactions_count || 0}
                />
              </div>
              <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Ver discusión
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}