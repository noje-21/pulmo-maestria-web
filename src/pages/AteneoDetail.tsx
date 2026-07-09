import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import ImageLazy from "@/components/common/ImageLazy";
import DOMPurify from "dompurify";
import {
  Calendar, ArrowLeft, Video, FileText, ExternalLink, BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useAteneo } from "@/features/ateneos/hooks/useAteneo";

const AteneoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const { ateneo, related, loading } = useAteneo(id, isPreview);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-40 mb-8" />
            <Skeleton className="w-full aspect-[21/9] rounded-2xl mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-40 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ateneo) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Ateneo no encontrado</h1>
          <Button onClick={() => navigate("/ateneos")} variant="outline">
            Volver a Ateneos
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <SEO
        title={`${ateneo.titulo} - Ateneos | Maestría en Circulación Pulmonar`}
        description={ateneo.descripcion}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: ateneo.titulo,
          description: ateneo.descripcion,
          startDate: ateneo.fecha,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          organizer: {
            "@type": "Organization",
            name: "Maestría Latinoamericana en Circulación Pulmonar",
          },
        }}
      />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {isPreview && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
              <span>👁️ Modo vista previa — este ateneo aún no está publicado.</span>
            </div>
          </div>
        )}
        <article className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={() => navigate("/ateneos")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Ateneos
            </Button>

            {ateneo.imagen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative aspect-[21/9] sm:aspect-[2/1] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10"
              >
                <ImageLazy src={ateneo.imagen} alt={ateneo.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" />
                  Ateneo
                </span>
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto">
              <header className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                >
                  {ateneo.titulo}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pb-6 border-b border-border/50"
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time>{format(new Date(ateneo.fecha), "dd 'de' MMMM, yyyy", { locale: es })}</time>
                  </div>
                </motion.div>
              </header>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="prose prose-lg dark:prose-invert max-w-none mb-10"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ateneo.contenido) }}
              />

              {ateneo.videoUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-10"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" /> Video del Ateneo
                  </h3>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50">
                    <iframe
                      src={ateneo.videoUrl}
                      title={ateneo.titulo}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}

              {ateneo.pdfUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mb-10"
                >
                  <a
                    href={ateneo.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    Descargar material (PDF)
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              )}

              {ateneo.imagenes && ateneo.imagenes.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-10"
                >
                  <h3 className="text-lg font-bold mb-4">Galería</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ateneo.imagenes.map((img, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden border border-border/50">
                        <ImageLazy src={img} alt={`${ateneo.titulo} - ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="pt-8 border-t border-border/50"
                >
                  <h3 className="text-xl font-bold mb-6">Ateneos Relacionados</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {related.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => navigate(`/ateneos/${r.id}`)}
                        className="group cursor-pointer card-base card-hover overflow-hidden"
                      >
                        <div className="aspect-[16/9] overflow-hidden">
                          <ImageLazy
                            src={r.imagen}
                            alt={r.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">
                            {format(new Date(r.fecha), "dd MMM yyyy", { locale: es })}
                          </p>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {r.titulo}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default AteneoDetail;
