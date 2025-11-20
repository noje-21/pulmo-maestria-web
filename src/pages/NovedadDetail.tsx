import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ReactionButton from "@/components/ReactionButton";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ImageLazy from "@/components/ImageLazy";
import DOMPurify from "dompurify";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pv-spinner"></div>
      </div>
    );
  }

  if (!novedad) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => navigate("/novedades")}
              variant="outline"
              className="mb-8 pv-tap-scale"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Novedades
            </Button>

            <Card className="overflow-hidden modern-card pv-glass pv-glow">
              {novedad.image_url && (
                <div className="relative h-96 overflow-hidden">
                  <ImageLazy
                    src={novedad.image_url}
                    alt={novedad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(novedad.published_at), "dd 'de' MMMM, yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{novedad.profiles?.full_name || "Admin"}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                  {novedad.title}
                </h1>

                <div
                  className="prose prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(novedad.content) }}
                />

                <div className="flex items-center gap-4 pt-6 border-t">
                  <ReactionButton 
                    postType="novedad" 
                    postId={novedad.id} 
                    initialCount={novedad.reactions_count || 0}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NovedadDetail;
