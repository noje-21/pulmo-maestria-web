import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import AnimatedOnView from "@/components/AnimatedOnView";
import ReactionButton from "@/components/ReactionButton";
import { MessageSquare, Plus, Pin, Eye, Calendar, User, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });

  useEffect(() => {
    checkAuth();
    loadPosts();
  }, [selectedCategory, searchQuery]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const loadPosts = async () => {
    try {
      let query = supabase
        .from("forum_posts")
        .select("*, profiles(full_name)")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let filteredData = data as any || [];
      
      // Filtrar por búsqueda
      if (searchQuery) {
        filteredData = filteredData.filter((post: ForumPost) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setPosts(filteredData);
    } catch (error: any) {
      toast.error("Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear una publicación");
      navigate("/auth");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      const { error } = await supabase.from("forum_posts").insert([{
        user_id: user.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category as any,
      }]);

      if (error) throw error;

      toast.success("Publicación creada exitosamente");
      setNewPost({ title: "", content: "", category: "general" });
      setShowNewPost(false);
      loadPosts();
    } catch (error: any) {
      toast.error("Error al crear publicación");
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      general: "General",
      clinical_questions: "Preguntas Clínicas",
      case_discussions: "Casos Discutidos",
      shared_resources: "Recursos Compartidos",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: "bg-primary/10 text-primary",
      clinical_questions: "bg-secondary/10 text-secondary",
      case_discussions: "bg-accent/10 text-accent",
      shared_resources: "bg-muted text-muted-foreground",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedOnView>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Foro de la Comunidad
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comparte conocimientos, discute casos y conecta con otros profesionales
              </p>
            </motion.div>
          </AnimatedOnView>

          {/* Filters and Create Button */}
          <AnimatedOnView>
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar publicaciones..."
                    className="pl-10 modern-input"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64 modern-input">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                    <SelectItem value="case_discussions">Casos Discutidos</SelectItem>
                    <SelectItem value="shared_resources">Recursos Compartidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setShowNewPost(!showNewPost)}
                className="modern-btn pv-tap-scale"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Publicación
              </Button>
            </div>
          </AnimatedOnView>

          {/* New Post Form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-8 modern-card pv-glass pv-glow">
                  <h3 className="text-2xl font-bold mb-4">Crear Nueva Publicación</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Título de tu publicación"
                        className="modern-input"
                      />
                    </div>
                    <div>
                      <Label>Categoría</Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                      >
                        <SelectTrigger className="modern-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                          <SelectItem value="case_discussions">Casos Discutidos</SelectItem>
                          <SelectItem value="shared_resources">Recursos Compartidos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Contenido</Label>
                      <Textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Escribe el contenido de tu publicación..."
                        rows={6}
                        className="modern-input"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleCreatePost} className="modern-btn pv-tap-scale">
                        Publicar
                      </Button>
                      <Button
                        onClick={() => setShowNewPost(false)}
                        variant="outline"
                        className="pv-tap-scale"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="pv-spinner mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <AnimatedOnView>
              <Card className="p-12 text-center modern-card pv-glass">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hay publicaciones aún</h3>
                <p className="text-muted-foreground">
                  Sé el primero en crear una publicación en el foro
                </p>
              </Card>
            </AnimatedOnView>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <AnimatedOnView key={post.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      className="p-6 modern-card pv-glass pv-glow cursor-pointer hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 pv-tap-scale"
                      onClick={() => navigate(`/foro/${post.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {post.is_pinned && (
                              <Pin className="w-5 h-5 text-primary" />
                            )}
                            <span
                              className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(
                                post.category
                              )}`}
                            >
                              {getCategoryLabel(post.category)}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{post.profiles?.full_name || "Usuario"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(post.created_at), "dd 'de' MMMM, yyyy", {
                                  locale: es,
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span>{post.views_count} vistas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              <span>0 comentarios</span>
                            </div>
                          </div>
                          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                            <ReactionButton 
                              postType="forum" 
                              postId={post.id} 
                              initialCount={post.reactions_count || 0}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatedOnView>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Foro;
