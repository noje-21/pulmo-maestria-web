import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageLazy from "@/components/common/ImageLazy";
import { Calendar, ArrowRight, Sparkles, Video, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Ateneo } from "../types";

interface Props {
  ateneo: Ateneo;
}

export default function AteneoFeatured({ ateneo }: Props) {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/ateneos/${ateneo.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative card-base card-hover overflow-hidden transition-all duration-400 brand-accent-bar-top">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
            <ImageLazy
              src={ateneo.imagen}
              alt={ateneo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
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
                <time>{format(new Date(ateneo.fecha), "dd 'de' MMMM, yyyy", { locale: es })}</time>
              </div>
              {ateneo.videoUrl && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1 text-primary">
                    <Video className="w-3.5 h-3.5" /> Video
                  </div>
                </>
              )}
              {ateneo.pdfUrl && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-1 text-primary">
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </div>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
              {ateneo.titulo}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3">
              {ateneo.descripcion}
            </p>
            <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all self-end">
              Ver más <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}