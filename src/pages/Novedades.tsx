import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { SEO } from "@/components/common/SEO";
import { Avatar } from "@/components/common/Avatar";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, User, Search, ArrowRight, Filter, 
  Newspaper, Clock, Sparkles
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import ImageLazy from "@/components/common/ImageLazy";
import ReactionButton from "@/features/forum/ReactionButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

const FeaturedSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-6 lg:gap-0 card-base overflow-hidden">
    <Skeleton className="aspect-[16/10] lg:aspect-auto" />
    <div className="p-6 lg:p-10 space-y-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="card-base overflow-hidden">
    <Skeleton className="aspect-[16/9]" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

const Novedades = () => {
  const navigate = useNavigate();
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      
      setNovedades(data as any || []);
    } catch (error: any) {
      console.error("Error loading novedades:", error);
      toast.error("No pudimos cargar las novedades. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNovedades();
  }, [searchQuery, authorFilter]);

  const featuredNovedad = novedades[0];
  const gridNovedades = novedades.slice(1);
  const hasActiveFilter = authorFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Novedades - Maestría en Circulación Pulmonar 2025"
        description="Mantente al día con las últimas noticias, artículos y actualizaciones de la Maestría en Circulación Pulmonar."
        keywords="novedades, noticias, circulación pulmonar, actualizaciones, artículos médicos"
      />
      <Navigation />
      
      <main className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <div className="text-center mb-8">
              <span className="brand-badge-accent mb-4 inline-flex">
                <Sparkles className="w-3.5 h-3.5" />
                Noticias y Actualizaciones
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                Novedades
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Lo más reciente en avances, eventos y contenido que puede marcar la diferencia en tu práctica clínica
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar novedades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-border/50 bg-card"
                />
              </div>

              {/* Desktop Filter */}
              <div className="hidden sm:flex items-center gap-3">
                <Select value={authorFilter} onValueChange={setAuthorFilter}>
                  <SelectTrigger className="w-[180px] h-12 rounded-xl">
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
                {hasActiveFilter && (
                  <Button variant="ghost" size="sm" onClick={() => setAuthorFilter("all")}>
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Mobile Filter */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="outline" size="lg" className="h-12 gap-2 rounded-xl relative">
                    <Filter className="w-5 h-5" />
                    Filtros
                    {hasActiveFilter && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        1
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl h-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 pb-8">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Autor</label>
                      <Select value={authorFilter} onValueChange={setAuthorFilter}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todos los autores" />
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
                    </div>
                    {hasActiveFilter && (
                      <Button variant="outline" onClick={() => setAuthorFilter("all")} className="w-full">
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.header>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <FeaturedSkeleton />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              </motion.div>
            ) : novedades.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
                  <div className="relative p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50">
                    <Newspaper className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Pronto habrá novedades</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Estamos preparando contenido valioso para ti. Mientras tanto, 
                  <span className="text-primary font-medium"> ¿por qué no exploras el foro?</span>
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 gap-2"
                  onClick={() => navigate('/foro')}
                >
                  Ir al Foro
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 sm:space-y-14"
              >
                {/* Featured Article */}
                {featuredNovedad && (
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate(`/novedades/${featuredNovedad.slug}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative card-base card-hover overflow-hidden transition-all duration-400 brand-accent-bar-top">
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                          {featuredNovedad.image_url ? (
                            <ImageLazy
                              src={featuredNovedad.image_url}
                              alt={featuredNovedad.title}
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

                        {/* Content */}
                        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <time>
                                {format(
                                  new Date(featuredNovedad.published_at || featuredNovedad.created_at),
                                  "dd 'de' MMMM, yyyy",
                                  { locale: es }
                                )}
                              </time>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5">
                              <Avatar name={featuredNovedad.profiles?.full_name || "Admin"} size="sm" />
                              <span>{featuredNovedad.profiles?.full_name || "Admin"}</span>
                            </div>
                          </div>

                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                            {featuredNovedad.title}
                          </h2>

                          <p className="text-muted-foreground text-base sm:text-lg mb-6 line-clamp-3">
                            {featuredNovedad.excerpt || featuredNovedad.content.substring(0, 200)}
                          </p>

                          <div className="flex items-center justify-between">
                            <div onClick={(e) => e.stopPropagation()}>
                              <ReactionButton 
                                postType="novedad" 
                                postId={featuredNovedad.id} 
                                initialCount={featuredNovedad.reactions_count || 0}
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
                )}

                {/* Grid of Articles */}
                {gridNovedades.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Más noticias</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gridNovedades.map((novedad, index) => (
                        <motion.article
                          key={novedad.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06, duration: 0.4 }}
                          onClick={() => navigate(`/novedades/${novedad.slug}`)}
                          className="group cursor-pointer"
                        >
                          <div className="h-full card-base card-hover overflow-hidden flex flex-col transition-all duration-400 relative group">
                            {/* Brand Corner Signature */}
                            <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none z-10" />
                            <div className="absolute top-0 left-0 w-0.5 h-5 bg-accent rounded-br-sm z-10" />
                            
                            {/* Image */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                              {novedad.image_url ? (
                                <ImageLazy
                                  src={novedad.image_url}
                                  alt={novedad.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                  <Newspaper className="w-12 h-12 text-muted-foreground/30" />
                                </div>
                              )}
                              {/* Reading time indicator */}
                              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                ~3 min
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {formatDistanceToNow(
                                    new Date(novedad.published_at || novedad.created_at),
                                    { addSuffix: true, locale: es }
                                  )}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-shrink-0">
                                {novedad.title}
                              </h3>

                              <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                                {novedad.excerpt || novedad.content.substring(0, 120)}
                              </p>

                              <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-auto">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="w-4 h-4" />
                                  <span className="truncate max-w-[100px]">
                                    {novedad.profiles?.full_name || "Admin"}
                                  </span>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <ReactionButton 
                                    postType="novedad" 
                                    postId={novedad.id} 
                                    initialCount={novedad.reactions_count || 0}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Novedades;
