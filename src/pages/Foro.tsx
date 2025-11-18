import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import ReactionButton from "@/components/ReactionButton";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calendar, User, Eye, Plus, Search, Filter, Pin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { ListSkeleton } from "@/components/LoadingSkeleton";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
  views_count: number;
  reactions_count?: number;
  is_pinned: boolean;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

const Foro = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);

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
          profiles!forum_posts_user_id_fkey(full_name)
        `)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as any);
      }

      if (authorFilter !== "all") {
        query = query.eq("user_id", authorFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data as any || []);
    } catch (error: any) {
      console.error("Error loading posts:", error);
      toast.error("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [searchQuery, categoryFilter, authorFilter]);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: "General",
      clinical_questions: "Preguntas Clínicas",
      case_discussions: "Casos Discutidos",
      shared_resources: "Recursos Compartidos"
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      clinical_questions: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
      case_discussions: "bg-green-500/10 text-green-700 dark:text-green-300",
      shared_resources: "bg-orange-500/10 text-orange-700 dark:text-orange-300"
    };
    return colors[category] || "bg-gray-500/10 text-gray-700";
  };

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
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Foro Comunitario
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Participa en discusiones, comparte experiencias y conecta con otros profesionales
            </p>
          </motion.div>

          <div className="space-y-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar publicaciones por título o contenido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 modern-input"
                />
              </div>
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin/foro")}
                  className="modern-btn pv-tap-scale whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Publicación
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px] modern-input">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                  <SelectItem value="case_discussions">Casos Discutidos</SelectItem>
                  <SelectItem value="shared_resources">Recursos Compartidos</SelectItem>
                </SelectContent>
              </Select>

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

              {(categoryFilter !== "all" || authorFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter("all");
                    setAuthorFilter("all");
                  }}
                  className="text-sm"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => navigate(`/foro/${post.id}`)}
                    className="p-6 modern-card pv-glass pv-glow hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            {post.is_pinned && (
                              <Pin className="w-5 h-5 text-primary" />
                            )}
                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2 flex-1">
                              {post.title}
                            </h3>
                          </div>
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryLabel(post.category)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.profiles?.full_name || "Usuario"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(new Date(post.created_at), "dd MMM, yyyy", {
                                locale: es,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{post.views_count} vistas</span>
                          </div>
                        </div>

                        {post.image_url && (
                          <div className="rounded-xl overflow-hidden max-h-48">
                            <img 
                              src={post.image_url} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <p className="text-muted-foreground line-clamp-3">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-3 pt-2 border-t">
                          <div onClick={(e) => e.stopPropagation()}>
                            <ReactionButton 
                              postType="forum" 
                              postId={post.id} 
                              initialCount={post.reactions_count || 0}
                            />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            <span>Comentarios</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-12 text-center modern-card pv-glass pv-glow">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-2xl font-bold mb-2">No se encontraron publicaciones</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || categoryFilter !== "all" || authorFilter !== "all"
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "Sé el primero en iniciar una conversación"}
                    </p>
                    {isAdmin && !searchQuery && categoryFilter === "all" && authorFilter === "all" && (
                      <Button
                        onClick={() => navigate("/admin/foro")}
                        className="modern-btn pv-tap-scale"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primera Publicación
                      </Button>
                    )}
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Foro;
