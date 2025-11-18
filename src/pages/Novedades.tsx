import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedOnView from "@/components/AnimatedOnView";
import ReactionButton from "@/components/ReactionButton";
import { Calendar, User, Clock, Search } from "lucide-react";
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
  reactions_count: number;
  profiles?: {
    full_name: string;
  };
}

const Novedades = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadNovedades();
  }, [searchQuery]);

  const loadNovedades = async () => {
    try {
      const { data, error } = await supabase
        .from("novedades")
        .select("*, profiles(full_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      
      let filteredData = data as any || [];
      
      // Filtrar por búsqueda
      if (searchQuery) {
        filteredData = filteredData.filter((novedad: Novedad) =>
          novedad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (novedad.excerpt && novedad.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setNovedades(filteredData);
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

          {/* Barra de búsqueda */}
          <AnimatedOnView>
            <div className="mb-12 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar novedades..."
                  className="pl-12 modern-input h-14 text-lg"
                />
              </div>
            </div>
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
                          </div>
                        )}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary w-fit mb-4">
                            Destacado
                          </span>
                          <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:text-primary transition-colors">
                            {novedades[0].title}
                          </h2>
                          <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                            {novedades[0].excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(novedades[0].published_at), "dd MMM yyyy", {
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{novedades[0].profiles?.full_name || "Admin"}</span>
                            </div>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <ReactionButton 
                              postType="novedad" 
                              postId={novedades[0].id} 
                              initialCount={novedades[0].reactions_count || 0}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatedOnView>
              )}

              {/* Grid of Articles */}
              {novedades.length > 1 && (
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
                          className="overflow-hidden modern-card pv-glass pv-glow cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 pv-tap-scale h-full flex flex-col"
                          onClick={() => navigate(`/novedades/${novedad.slug}`)}
                        >
                          {novedad.image_url && (
                            <div className="relative h-48 overflow-hidden">
                              <ImageLazy
                                src={novedad.image_url}
                                alt={novedad.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors line-clamp-2">
                              {novedad.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                              {novedad.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {format(new Date(novedad.published_at), "dd MMM", {
                                    locale: es,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{novedad.profiles?.full_name || "Admin"}</span>
                              </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <ReactionButton 
                                postType="novedad" 
                                postId={novedad.id} 
                                initialCount={novedad.reactions_count || 0}
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </AnimatedOnView>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Novedades;
