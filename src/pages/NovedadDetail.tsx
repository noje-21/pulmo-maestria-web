import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import ReactionButton from "@/features/forum/ReactionButton";
import { Calendar, User, ArrowLeft, Clock, Share2, Sparkles } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ImageLazy from "@/components/common/ImageLazy";
import DOMPurify from "dompurify";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Novedad {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  reactions_count: number;
  author_id: string;
  profiles?: {
    full_name: string;
  };
}

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
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNovedad();
  }, [slug]);

  const loadNovedad = async () => {
    try {
      const { data, error } = await supabase
        .from("novedades")
        .select(`
          *,
          profiles!novedades_author_id_fkey(full_name)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      setNovedad(data as any);
    } catch (error: any) {
      console.error("Error loading novedad:", error);
      navigate("/novedades");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && novedad) {
      try {
        await navigator.share({
          title: novedad.title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <Navigation />
        <main className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-40 mb-8" />
            <ArticleSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (!novedad) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navigation />
      
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back Button */}
            <Button
              onClick={() => navigate("/novedades")}
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Novedades
            </Button>

            {/* Hero Image */}
            {novedad.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative aspect-[21/9] sm:aspect-[2/1] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10"
              >
                <ImageLazy
                  src={novedad.image_url}
                  alt={novedad.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Novedad
                </Badge>
              </motion.div>
            )}

            {/* Content Container */}
            <div className="max-w-3xl mx-auto">
              {/* Header */}
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
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {getInitials(novedad.profiles?.full_name || '')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {novedad.profiles?.full_name || "Admin"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time>
                      {format(new Date(novedad.published_at), "dd 'de' MMMM, yyyy", { locale: es })}
                    </time>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(novedad.published_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                </motion.div>
              </header>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="prose prose-lg dark:prose-invert max-w-none mb-10"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(novedad.content) }}
              />

              {/* Footer Actions */}
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
                
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
              </motion.footer>
            </div>
          </motion.div>
        </article>
      </main>
    </div>
  );
};

export default NovedadDetail;
