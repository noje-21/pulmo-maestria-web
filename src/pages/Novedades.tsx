import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedOnView from "@/components/AnimatedOnView";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ImageLazy from "@/components/ImageLazy";

interface Novedad {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  published_at: string;
  author_id: string;
  profiles?: {
    full_name: string;
  };
}

const Novedades = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNovedades();
  }, []);

  const loadNovedades = async () => {
    try {
      const { data, error } = await supabase
        .from("novedades")
        .select("*, profiles(full_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setNovedades(data as any || []);
    } catch (error: any) {
      console.error("Error loading novedades:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedOnView>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                Novedades y Actualizaciones
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mantente informado sobre las últimas noticias, eventos y actualizaciones de la maestría
              </p>
            </motion.div>
          </AnimatedOnView>

          {loading ? (
            <div className="text-center py-12">
              <div className="pv-spinner mx-auto"></div>
            </div>
          ) : novedades.length === 0 ? (
            <AnimatedOnView>
              <Card className="p-12 text-center modern-card pv-glass">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hay novedades aún</h3>
                <p className="text-muted-foreground">
                  Pronto publicaremos actualizaciones importantes
                </p>
              </Card>
            </AnimatedOnView>
          ) : (
            <>
              {/* Featured Article */}
              {novedades[0] && (
                <AnimatedOnView>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="mb-12"
                  >
                    <Card
                      className="overflow-hidden modern-card pv-glass pv-glow cursor-pointer hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 pv-tap-scale"
                      onClick={() => navigate(`/novedades/${novedades[0].slug}`)}
                    >
                      <div className="grid md:grid-cols-2 gap-0">
                        {novedades[0].image_url && (
                          <div className="relative h-64 md:h-full overflow-hidden">
                            <ImageLazy
                              src={novedades[0].image_url}
                              alt={novedades[0].title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                Destacado
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(novedades[0].published_at), "dd 'de' MMMM, yyyy", {
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{novedades[0].profiles?.full_name || "Admin"}</span>
                            </div>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:text-primary transition-colors">
                            {novedades[0].title}
                          </h2>
                          {novedades[0].excerpt && (
                            <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                              {novedades[0].excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-primary font-semibold group">
                            <span>Leer más</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatedOnView>
              )}

              {/* Grid of Articles */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {novedades.slice(1).map((novedad, index) => (
                  <AnimatedOnView key={novedad.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -6 }}
                    >
                      <Card
                        className="overflow-hidden h-full modern-card pv-glass pv-glow cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 pv-tap-scale"
                        onClick={() => navigate(`/novedades/${novedad.slug}`)}
                      >
                        {novedad.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <ImageLazy
                              src={novedad.image_url}
                              alt={novedad.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(new Date(novedad.published_at), "dd MMM yyyy", {
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{novedad.profiles?.full_name || "Admin"}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
                            {novedad.title}
                          </h3>
                          {novedad.excerpt && (
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {novedad.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm group">
                            <span>Leer más</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </AnimatedOnView>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Novedades;
