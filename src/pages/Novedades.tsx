import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { SEO } from "@/components/common/SEO";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Search, Eye, Filter, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import ImageLazy from "@/components/common/ImageLazy";
import ReactionButton from "@/features/forum/ReactionButton";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";

interface Novedad {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  author_id: string;
  reactions_count: number;
  profiles?: {
    full_name: string;
  };
}

const Novedades = () => {
  const navigate = useNavigate();
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    loadNovedades();
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");
      
      if (error) throw error;
      setAuthors(data?.map(p => ({ id: p.id, name: p.full_name })) || []);
    } catch (error: any) {
      console.error("Error loading authors:", error);
    }
  };

  const loadNovedades = async () => {
    try {
      let query = supabase
        .from("novedades")
        .select(`
          *,
          profiles!novedades_author_id_fkey(full_name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      if (authorFilter !== "all") {
        query = query.eq("author_id", authorFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading novedades:", error);
        throw error;
      }
      
      console.log("Novedades cargadas:", data?.length || 0);
      setNovedades(data as any || []);
    } catch (error: any) {
      console.error("Error loading novedades:", error);
      toast.error("Error al cargar novedades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNovedades();
  }, [searchQuery, authorFilter]);

  const featuredNovedad = novedades[0];
  const gridNovedades = novedades.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <Navigation />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ListSkeleton items={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <SEO 
        title="Novedades - Maestría en Circulación Pulmonar 2025"
        description="Mantente al día con las últimas noticias, artículos y actualizaciones de la Maestría en Circulación Pulmonar."
        keywords="novedades, noticias, circulación pulmonar, actualizaciones, artículos médicos"
      />
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Novedades
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mantente al día con las últimas noticias y actualizaciones
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por título, contenido o extracto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 modern-input"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>

              <Select value={authorFilter} onValueChange={setAuthorFilter}>
                <SelectTrigger className="w-[200px] modern-input">
                  <SelectValue placeholder="Autor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los autores</SelectItem>
                  {authors.map(author => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {authorFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthorFilter("all")}
                  className="text-sm"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {featuredNovedad && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <Card
                  onClick={() => navigate(`/novedades/${featuredNovedad.slug}`)}
                  className="overflow-hidden modern-card pv-glass pv-glow hover:shadow-2xl cursor-pointer transition-all duration-300 group"
                >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                     {featuredNovedad.image_url && (
                       <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                         <ImageLazy
                           src={featuredNovedad.image_url}
                           alt={featuredNovedad.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         />
                         <div className="absolute top-4 left-4">
                           <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                             Destacado
                           </Badge>
                         </div>
                       </div>
                     )}
                     <div className="p-6 sm:p-8 flex flex-col justify-center">
                       <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                         {featuredNovedad.title}
                       </h2>
                       <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                         <div className="flex items-center gap-2">
                           <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                           <span>
                             {format(
                               new Date(featuredNovedad.published_at || featuredNovedad.created_at),
                               "dd 'de' MMMM, yyyy",
                               { locale: es }
                             )}
                           </span>
                         </div>
                         <div className="flex items-center gap-2">
                           <User className="w-3 sm:w-4 h-3 sm:h-4" />
                           <span>{featuredNovedad.profiles?.full_name || "Admin"}</span>
                         </div>
                       </div>
                       <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 line-clamp-3">
                         {featuredNovedad.excerpt || featuredNovedad.content.substring(0, 200)}
                       </p>
                       <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-4">
                         <ReactionButton 
                           postType="novedad" 
                           postId={featuredNovedad.id} 
                           initialCount={featuredNovedad.reactions_count || 0}
                         />
                         <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                           <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                           <span>Leer más</span>
                         </div>
                       </div>
                     </div>
                   </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {gridNovedades.map((novedad, index) => (
                <motion.div
                  key={novedad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => navigate(`/novedades/${novedad.slug}`)}
                    className="overflow-hidden modern-card pv-glass pv-glow hover:shadow-2xl cursor-pointer transition-all duration-300 h-full flex flex-col group"
                  >
                    {novedad.image_url && (
                      <div className="relative h-56 overflow-hidden">
                        <ImageLazy
                          src={novedad.image_url}
                          alt={novedad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {novedad.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(
                              new Date(novedad.published_at || novedad.created_at),
                              "dd MMM, yyyy",
                              { locale: es }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{novedad.profiles?.full_name || "Admin"}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {novedad.excerpt || novedad.content.substring(0, 150)}
                      </p>
                      <div onClick={(e) => e.stopPropagation()} className="pt-3 border-t">
                        <ReactionButton 
                          postType="novedad" 
                          postId={novedad.id} 
                          initialCount={novedad.reactions_count || 0}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {novedades.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-12 text-center modern-card pv-glass pv-glow">
                <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-2xl font-bold mb-2">No se encontraron novedades</h3>
                <p className="text-muted-foreground">
                  {searchQuery || authorFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no hay novedades publicadas"}
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Novedades;
