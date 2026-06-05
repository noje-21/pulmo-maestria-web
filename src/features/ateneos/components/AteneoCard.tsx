import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageLazy from "@/components/common/ImageLazy";
import { Calendar, ArrowRight, Video, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Ateneo } from "../types";

interface Props {
  ateneo: Ateneo;
  index: number;
}

export default function AteneoCard({ ateneo, index }: Props) {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={() => navigate(`/ateneos/${ateneo.id}`)}
      className="group cursor-pointer"
    >
      <div className="h-full card-base card-hover overflow-hidden flex flex-col transition-all duration-400 relative group">
        <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 left-0 w-0.5 h-5 bg-accent rounded-br-sm z-10" />
        <div className="relative aspect-[16/9] overflow-hidden">
          <ImageLazy
            src={ateneo.imagen}
            alt={ateneo.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {ateneo.videoUrl && (
              <span className="px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full flex items-center gap-1">
                <Video className="w-3 h-3" /> Video
              </span>
            )}
            {ateneo.pdfUrl && (
              <span className="px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full flex items-center gap-1">
                <FileText className="w-3 h-3" /> PDF
              </span>
            )}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <time>{format(new Date(ateneo.fecha), "dd MMM yyyy", { locale: es })}</time>
          </div>
          <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {ateneo.titulo}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {ateneo.descripcion}
          </p>
          <span className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
            Ver más <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}