import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageLazy from "@/components/common/ImageLazy";
import ReactionButton from "@/features/forum/ReactionButton";
import { User, Newspaper, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Novedad } from "../types";

interface Props {
  novedad: Novedad;
  index: number;
}

export default function NovedadCard({ novedad, index }: Props) {
  const navigate = useNavigate();
  return (
    <motion.article
      key={novedad.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={() => navigate(`/novedades/${novedad.slug}`)}
      className="group cursor-pointer"
    >
      <div className="h-full card-base card-hover overflow-hidden flex flex-col transition-all duration-400 relative group">
        <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-0 w-0.5 h-5 bg-accent rounded-br-sm z-10" />

        <div className="relative aspect-[16/9] overflow-hidden">
          {novedad.image_url ? (
            <ImageLazy
              src={novedad.image_url}
              alt={novedad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            ~3 min
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {formatDistanceToNow(new Date(novedad.published_at || novedad.created_at), { addSuffix: true, locale: es })}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-shrink-0">
            {novedad.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {novedad.excerpt || novedad.content.substring(0, 120)}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[100px]">{novedad.profiles?.full_name || "Admin"}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ReactionButton
                postType="novedad"
                postId={novedad.id}
                initialCount={novedad.reactions_count || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}