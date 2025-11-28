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
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/features/admin/AdminSidebar";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { ArrowLeft, Trash2, Pin, Eye, Plus, Save, X, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ImageUpload from "@/components/common/ImageUpload";
import TagInput from "@/features/forum/TagInput";
import RichTextEditor from "@/components/common/RichTextEditor";

const imageUrlSchema = z.string().url().refine(
  (url) => url.startsWith('http://') || url.startsWith('https://'),
  'Solo se permiten URLs HTTP(S)'
).refine(
  (url) => !url.includes('localhost') && !url.includes('127.0.0.1'),
  'No se permiten URLs internas'
).optional().or(z.literal(''));

const AdminForo = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "general" as "general" | "clinical_questions" | "case_discussions" | "shared_resources",
    image_url: "",
    status: "published" as "draft" | "published",
    featured: false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      excerpt: "",
      category: "general",
      image_url: "",
      status: "published",
      featured: false,
    });
    setSelectedTags([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = async (post: any) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      category: post.category,
      image_url: post.image_url || "",
      status: post.status || "published",
      featured: post.featured || false,
    });
    
    // Cargar tags del post
    try {
      const { data: postTags } = await supabase
        .from("forum_post_tags")
        .select("tag_id")
        .eq("post_id", post.id);
      
      if (postTags) {
        setSelectedTags(postTags.map((pt: any) => pt.tag_id));
      }
    } catch (error) {
      console.error("Error loading post tags:", error);
    }
    
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    if (formData.image_url) {
      const validation = imageUrlSchema.safeParse(formData.image_url);
      if (!validation.success) {
        toast.error("URL de imagen inválida");
        return;
      }
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Debes iniciar sesión");
        return;
      }

      let postId = editingId;

      const dataToSave = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        image_url: formData.image_url || null,
        status: formData.status,
        featured: formData.featured,
        user_id: session.user.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from("forum_posts")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { data: newPost, error } = await supabase
          .from("forum_posts")
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        postId = newPost.id;
      }

      // Gestionar tags
      if (postId) {
        await supabase
          .from("forum_post_tags")
          .delete()
          .eq("post_id", postId);

        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            post_id: postId,
            tag_id: tagId,
          }));

          await supabase
            .from("forum_post_tags")
            .insert(tagInserts);
        }
      }

      toast.success(editingId ? "Publicación actualizada" : "Publicación creada");
      resetForm();
      await loadPosts();
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
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <Label>Extracto (resumen corto)</Label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Breve descripción (max 200 caracteres)"
                        className="modern-input resize-none h-20"
                        maxLength={200}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Estado</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger className="modern-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-border"
                        />
                        <Label htmlFor="featured">⭐ Marcar como destacado</Label>
                      </div>
                    </div>

                    <div>
                      <Label>Etiquetas</Label>
                      <TagInput
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                        placeholder="Agregar etiquetas..."
                      />
                    </div>

                    <div>
                      <Label>Contenido *</Label>
                      <RichTextEditor
                        content={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        placeholder="Escribe el contenido de la publicación..."
                      />
                    </div>

                    <div>
                      <Label>Imagen (opcional)</Label>
                      <ImageUpload
                        currentImage={formData.image_url}
                        onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                        onImageRemoved={() => setFormData({ ...formData, image_url: "" })}
                        generateTitle={!formData.title}
                        onTitleGenerated={(title) => {
                          if (!formData.title) {
                            setFormData({ ...formData, title });
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleSubmit} className="modern-btn pv-tap-scale w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {editingId ? "Guardar Cambios" : "Crear Publicación"}
                      </Button>
                      <Button onClick={resetForm} variant="outline" className="pv-tap-scale w-full sm:w-auto">
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
                <Card className="p-4 md:p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full sm:w-auto">
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
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-4">
                      <Button
                        onClick={() => handleEdit(post)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleTogglePin(post.id, post.is_pinned)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale flex-1 sm:flex-none"
                      >
                        <Pin className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                        className="pv-tap-scale flex-1 sm:flex-none"
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
