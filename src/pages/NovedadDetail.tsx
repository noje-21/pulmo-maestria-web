import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ReactionButton from "@/features/forum/ReactionButton";
import { Calendar, ArrowLeft, Clock, Share2, Sparkles, Newspaper } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ImageLazy from "@/components/common/ImageLazy";
import { SEO } from "@/components/common/SEO";
import RichContent, { htmlToPlainText } from "@/components/common/RichContent";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNovedad } from "@/features/novedades/hooks/useNovedad";
import { getInitials } from "@/features/forum/helpers";

const ArticleSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
    <div className="max-w-3xl mx-auto space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);

const NovedadDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { novedad, related, loading } = useNovedad(slug);

  const handleShare = async () => {
    if (navigator.share && novedad) {
      try {
        await navigator.share({ title: novedad.title, url: window.location.href });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(novedad?.title || "")}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-40 mb-8" />
            <ArticleSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!novedad) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <SEO
        title={`${novedad.title} - Novedades | Maestría en Circulación Pulmonar`}
        description={(novedad.excerpt || htmlToPlainText(novedad.content)).slice(0, 155)}
        ogImage={novedad.image_url || undefined}
        canonicalUrl={`https://www.maestriacp.com/novedades/${slug}`}
        ogType="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: novedad.title,
          datePublished: novedad.published_at,
          author: {
            "@type": "Person",
            name: novedad.profiles?.full_name || "Maestría CP",
          },
          publisher: {
            "@type": "Organization",
            name: "Maestría Latinoamericana en Circulación Pulmonar",
            url: "https://www.maestriacp.com",
          },
          image: novedad.image_url || undefined,
          mainEntityOfPage: `https://www.maestriacp.com/novedades/${slug}`,
        }}
      />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={() => navigate("/novedades")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Novedades
            </Button>

            {novedad.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative aspect-[21/9] sm:aspect-[2/1] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10"
              >
                <ImageLazy src={novedad.image_url} alt={novedad.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Novedad
                </Badge>
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
                  {novedad.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pb-6 border-b border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {getInitials(novedad.profiles?.full_name || "")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {novedad.profiles?.full_name || "Admin"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time>{format(new Date(novedad.published_at), "dd 'de' MMMM, yyyy", { locale: es })}</time>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(novedad.published_at), { addSuffix: true, locale: es })}</span>
                  </div>
                </motion.div>
              </header>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-10"
              >
                <RichContent html={novedad.content} size="lg" />
              </motion.div>

              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/50"
              >
                <ReactionButton
                  postType="novedad"
                  postId={novedad.id}
                  initialCount={novedad.reactions_count || 0}
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareTwitter} className="gap-2 text-xs">
                    𝕏
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareLinkedIn} className="gap-2 text-xs">
                    in
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Copiar enlace
                  </Button>
                </div>
              </motion.footer>

              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="pt-10 mt-10 border-t border-border/50"
                >
                  <h3 className="text-xl font-bold mb-6">Artículos Relacionados</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {related.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => navigate(`/novedades/${r.slug}`)}
                        className="group cursor-pointer card-base card-hover overflow-hidden"
                      >
                        <div className="aspect-[16/9] overflow-hidden">
                          {r.image_url ? (
                            <ImageLazy
                              src={r.image_url}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <Newspaper className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">
                            {format(new Date(r.published_at), "dd MMM yyyy", { locale: es })}
                          </p>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {r.title}
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
    </div>
  );
};

export default NovedadDetail;
