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
import AdminSidebar from "@/components/AdminSidebar";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, Trash2, Pin, Eye, Plus, Save, X, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminForo = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general" as "general" | "clinical_questions" | "case_discussions" | "shared_resources",
    image_url: "",
  });

  useEffect(() => {
    checkAdminAndLoadPosts();
  }, []);

  const checkAdminAndLoadPosts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: isAdminData } = await supabase.rpc('is_admin', { 
        check_user_id: session.user.id 
      });

      if (!isAdminData) {
        toast.error("No tienes permisos de administrador");
        navigate("/");
        return;
      }

      await loadPosts();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          profiles!forum_posts_user_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error("Error loading posts:", error);
      toast.error("Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      image_url: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      image_url: post.image_url || "",
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Debes iniciar sesión");
        return;
      }

      const dataToSave = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        image_url: formData.image_url || null,
        user_id: session.user.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from("forum_posts")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Publicación actualizada");
      } else {
        const { error } = await supabase
          .from("forum_posts")
          .insert(dataToSave);

        if (error) throw error;
        toast.success("Publicación creada");
      }

      resetForm();
      loadPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error("Error al guardar publicación: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta publicación?")) return;

    try {
      const { error } = await supabase
        .from("forum_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Publicación eliminada");
      loadPosts();
    } catch (error: any) {
      toast.error("Error al eliminar publicación");
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({ is_pinned: !currentPinned })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentPinned ? "Publicación desanclada" : "Publicación anclada");
      loadPosts();
    } catch (error: any) {
      toast.error("Error al actualizar publicación");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-background">
      <AdminSidebar />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/admin")} className="pv-tap-scale">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-primary">Gestión del Foro</h1>
                <p className="text-muted-foreground mt-1">Administra las publicaciones del foro</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="modern-btn pv-tap-scale">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Publicación
            </Button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-6 mb-8 modern-card pv-glass pv-glow">
                  <h3 className="text-2xl font-bold mb-4">
                    {editingId ? "Editar Publicación" : "Crear Nueva Publicación"}
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="modern-input"
                        placeholder="Título de la publicación"
                      />
                    </div>
                    <div>
                      <Label>Categoría *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="modern-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Foro General</SelectItem>
                          <SelectItem value="clinical_questions">Preguntas Clínicas</SelectItem>
                          <SelectItem value="case_discussions">Casos Discutidos</SelectItem>
                          <SelectItem value="shared_resources">Recursos Compartidos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Contenido *</Label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={8}
                        className="modern-input"
                        placeholder="Contenido de la publicación"
                      />
                    </div>
                    <div>
                      <Label>URL de Imagen (opcional)</Label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="modern-input"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSubmit} className="modern-btn pv-tap-scale">
                        <Save className="w-4 h-4 mr-2" />
                        {editingId ? "Guardar Cambios" : "Crear Publicación"}
                      </Button>
                      <Button onClick={resetForm} variant="outline" className="pv-tap-scale">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.is_pinned && (
                          <Pin className="w-4 h-4 text-primary" />
                        )}
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Por: {post.profiles?.full_name || "Usuario"}</span>
                        <span>{format(new Date(post.created_at), "dd MMM yyyy", { locale: es })}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views_count} vistas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(post)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleTogglePin(post.id, post.is_pinned)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <Card className="p-12 text-center modern-card pv-glass">
                <p className="text-muted-foreground">No hay publicaciones en el foro</p>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminForo;
