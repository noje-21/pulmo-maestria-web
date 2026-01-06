import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { SEO } from "@/components/common/SEO";
import { Avatar } from "@/components/common/Avatar";
import { CategoryBadge, getCategoryLabel } from "@/components/common/CategoryBadge";
import ReactionButton from "@/features/forum/ReactionButton";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, User, Eye, Plus, Search, 
  Filter, Pin, Star, ChevronRight, Clock, Sparkles,
  Activity, TrendingUp, Flame, Zap
} from "lucide-react";
import { formatDistanceToNow, differenceInHours, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  views_count: number;
  reactions_count?: number;
  is_pinned: boolean;
  featured?: boolean;
  status?: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
  forum_comments?: any[];
}

// Determina el estado de actividad del post
const getActivityStatus = (post: ForumPost) => {
  const now = new Date();
  const lastActivity = post.updated_at ? new Date(post.updated_at) : new Date(post.created_at);
  const hoursAgo = differenceInHours(now, lastActivity);
  const daysAgo = differenceInDays(now, lastActivity);
  
  if (hoursAgo < 24) {
    return { status: 'hot', label: 'Activo hoy', color: 'text-orange-500', bgColor: 'bg-orange-500/10', icon: Flame };
  } else if (daysAgo <= 3) {
    return { status: 'recent', label: `Hace ${daysAgo} día${daysAgo > 1 ? 's' : ''}`, color: 'text-green-500', bgColor: 'bg-green-500/10', icon: Zap };
  } else if (daysAgo <= 7) {
    return { status: 'active', label: 'Esta semana', color: 'text-blue-500', bgColor: 'bg-blue-500/10', icon: Activity };
  }
  return { status: 'inactive', label: `Hace ${daysAgo} días`, color: 'text-muted-foreground', bgColor: 'bg-muted', icon: Clock };
};

const ForumCardSkeleton = () => (
  <div className="card-base p-5 sm:p-6 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  </div>
);

const Foro = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'commented'>('recent');
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    checkAdmin();
    loadPosts();
    loadAuthors();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      setIsAdmin(data?.role === "admin");
    }
  };

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

  const loadPosts = async () => {
    try {
      let query = supabase
        .from("forum_posts")
        .select(`
          *,
          profiles!forum_posts_user_id_fkey(full_name),
          forum_comments(count)
        `)
        .eq("status", "published");

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as any);
      }

      if (authorFilter !== "all") {
        query = query.eq("user_id", authorFilter);
      }

      if (sortBy === 'popular') {
        query = query.order("views_count", { ascending: false });
      } else if (sortBy === 'commented') {
        query = query.order("reactions_count", { ascending: false });
      } else {
        query = query.order("featured", { ascending: false })
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading posts:", error);
        throw error;
      }
      
      setPosts(data as any || []);
    } catch (error: any) {
      console.error("Error loading posts:", error);
      toast.error("No pudimos cargar las publicaciones. Intenta refrescar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [searchQuery, categoryFilter, authorFilter, sortBy]);

  const activeFiltersCount = [
    categoryFilter !== "all",
    authorFilter !== "all"
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCategoryFilter("all");
    setAuthorFilter("all");
    setSortBy("recent");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Categoría</label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
            <SelectItem value="case_discussions">Casos Clínicos</SelectItem>
            <SelectItem value="shared_resources">Recursos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Autor</label>
        <Select value={authorFilter} onValueChange={setAuthorFilter}>
          <SelectTrigger className="w-full rounded-xl">
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

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Ordenar por</label>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="popular">Más vistos</SelectItem>
            <SelectItem value="commented">Más activos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full rounded-xl">
          Limpiar filtros ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Foro Comunitario - Maestría en Circulación Pulmonar 2025"
        description="Participa en discusiones, comparte experiencias y conecta con otros profesionales de la salud en nuestro foro comunitario."
        keywords="foro, comunidad, discusiones, circulación pulmonar, profesionales de la salud"
      />
      <Navigation />
      
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with Story */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <span className="brand-badge mb-3 inline-flex">
                  <Sparkles className="w-3.5 h-3.5" />
                  Comunidad
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                  Foro Profesional
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-lg">
                  Donde las preguntas difíciles encuentran respuestas. Comparte, aprende y crece con colegas de toda Latinoamérica.
                </p>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin/foro")}
                  size="lg"
                  className="btn-accent gap-2 min-h-[48px] group"
                  aria-label="Crear nueva publicación"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Nueva Publicación
                </Button>
              )}
            </div>

            {/* Search & Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base rounded-xl border-border/50 bg-card"
                />
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px] h-12 rounded-xl">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                    <SelectItem value="case_discussions">Casos Clínicos</SelectItem>
                    <SelectItem value="shared_resources">Recursos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[160px] h-12 rounded-xl">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recientes</SelectItem>
                    <SelectItem value="popular">Más vistos</SelectItem>
                    <SelectItem value="commented">Más activos</SelectItem>
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="lg" className="h-12 gap-2 rounded-xl relative">
                    <Filter className="w-5 h-5" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl h-auto max-h-[80vh]">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>
          </motion.header>

          {/* Posts Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(4)].map((_, i) => (
                  <ForumCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : posts.length > 0 ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {posts.map((post, index) => {
                  const activity = getActivityStatus(post);
                  const ActivityIcon = activity.icon;
                  const commentsCount = Array.isArray(post.forum_comments) ? post.forum_comments.length : 0;
                  
                  return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    onClick={() => navigate(`/foro/${post.id}`)}
                    className="group cursor-pointer"
                    role="article"
                    aria-label={`Publicación: ${post.title}`}
                  >
                    <div className={`
                      card-base card-hover p-5 sm:p-6 transition-all duration-400 relative overflow-hidden
                      ${post.featured ? 'ring-2 ring-accent/30 bg-gradient-to-br from-accent/[0.03] to-transparent' : ''}
                      ${post.is_pinned ? 'ring-2 ring-primary/30 bg-gradient-to-br from-primary/[0.03] to-transparent' : ''}
                      ${activity.status === 'hot' ? 'ring-1 ring-orange-500/30' : ''}
                    `}>
                      {/* Brand Signature Corner */}
                      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
                      <div className="absolute top-0 left-0 w-1 h-6 bg-accent rounded-br-sm" />
                      
                      {/* Activity Pulse Indicator for hot posts */}
                      {activity.status === 'hot' && (
                        <div className="absolute top-4 right-4">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                          </span>
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {post.is_pinned && (
                          <CategoryBadge category="pinned" size="sm" />
                        )}
                        {post.featured && (
                          <CategoryBadge category="featured" size="sm" />
                        )}
                        {/* Activity Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${activity.bgColor} ${activity.color} transition-all duration-300 group-hover:scale-105`}>
                          <ActivityIcon className="w-3 h-3" />
                          {activity.label}
                        </span>
                        {commentsCount >= 5 && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                            <TrendingUp className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4">
                        {/* Author Avatar */}
                        <div className="flex-shrink-0 hidden sm:block">
                          <Avatar 
                            name={post.profiles?.full_name || 'Usuario'} 
                            size="lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title & Category */}
                          <div className="flex flex-wrap items-start gap-2 mb-2">
                            <h2 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                              {post.title}
                            </h2>
                            <CategoryBadge 
                              category={post.category as any} 
                              showLabel={false}
                              className="sm:hidden"
                            />
                            <CategoryBadge 
                              category={post.category as any}
                              className="hidden sm:inline-flex"
                            />
                          </div>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm sm:text-base line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User className="w-4 h-4" />
                              <span className="truncate max-w-[120px]">{post.profiles?.full_name || "Usuario"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-4 h-4" />
                              <span>{post.views_count}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${commentsCount > 0 ? 'text-primary font-medium' : ''}`}>
                              <MessageSquare className="w-4 h-4" />
                              <span>{commentsCount} {commentsCount === 1 ? 'respuesta' : 'respuestas'}</span>
                            </div>
                          </div>

                          {/* Actions Row */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                            <div onClick={(e) => e.stopPropagation()}>
                              <ReactionButton 
                                postType="forum" 
                                postId={post.id} 
                                initialCount={post.reactions_count || 0}
                              />
                            </div>
                            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                              Ver discusión
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 sm:py-20"
              >
                <div className="relative mb-6 mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl scale-150" />
                  <div className="relative p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl border border-border/50">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {searchQuery || categoryFilter !== "all" || authorFilter !== "all"
                    ? "No se encontraron publicaciones"
                    : "¡Bienvenido al Foro!"}
                </h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "all" || authorFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aquí podrás discutir casos clínicos, compartir recursos y conectar con otros profesionales."}
                </p>
                {!searchQuery && categoryFilter === "all" && authorFilter === "all" && (
                  <p className="text-sm text-accent font-medium mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    ¡Sé el primero en iniciar la conversación!
                  </p>
                )}
                {isAdmin && !searchQuery && categoryFilter === "all" && authorFilter === "all" && (
                  <Button onClick={() => navigate("/admin/foro")} size="lg" className="btn-accent gap-2 mt-4">
                    <Plus className="w-5 h-5" />
                    Crear Primera Publicación
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Foro;
