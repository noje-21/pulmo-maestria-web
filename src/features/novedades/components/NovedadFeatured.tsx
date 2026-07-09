import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageLazy from "@/components/common/ImageLazy";
import ReactionButton from "@/features/forum/ReactionButton";
import { Avatar } from "@/components/common/Avatar";
import { Calendar, ArrowRight, Sparkles, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Novedad } from "../types";
import { htmlToPlainText } from "@/components/common/RichContent";

interface Props {
  novedad: Novedad;
}

export default function NovedadFeatured({ novedad }: Props) {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/novedades/${novedad.slug}`)}
      className="group cursor-pointer"
    >
      <div className="relative card-base card-hover overflow-hidden transition-all duration-400 brand-accent-bar-top">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
            {novedad.image_url ? (
              <ImageLazy
                src={novedad.image_url}
                alt={novedad.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Newspaper className="w-20 h-20 text-primary/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
            <span className="absolute top-4 left-4 brand-badge-accent shadow-lg">
              <Sparkles className="w-3 h-3" />
              Destacado
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time>
                  {format(new Date(novedad.published_at || novedad.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
                </time>
              </div>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <Avatar name={novedad.profiles?.full_name || "Admin"} size="sm" />
                <span>{novedad.profiles?.full_name || "Admin"}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
              {novedad.title}
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3">
              {novedad.excerpt || htmlToPlainText(novedad.content).slice(0, 200)}
            </p>

            <div className="flex items-center justify-between">
              <div onClick={(e) => e.stopPropagation()}>
                <ReactionButton
                  postType="novedad"
                  postId={novedad.id}
                  initialCount={novedad.reactions_count || 0}
                />
              </div>
              <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Leer artículo
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}