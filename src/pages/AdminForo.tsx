import { useEffect, useState } from "react";
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
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { Trash2, Pin, Eye, Plus, Save, X, Edit, MessageSquare } from "lucide-react";
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
    loadPosts();
  }, []);

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
      <AdminLayout title="Gestión del Foro" subtitle="Cargando...">
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Gestión del Foro" 
      subtitle="Administra las publicaciones y discusiones"
    >
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Publicación
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 md:p-6 mb-6 bg-card border-border/50">
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Editar Publicación" : "Crear Nueva Publicación"}
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Título de la publicación"
                    />
                  </div>
                  <div>
                    <Label>Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
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
                    className="resize-none h-20"
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
                      <SelectTrigger>
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
                  <Button onClick={handleSubmit} className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingId ? "Guardar Cambios" : "Crear Publicación"}
                  </Button>
                  <Button onClick={resetForm} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border/50">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No hay publicaciones en el foro</p>
          </Card>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 md:p-5 bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {post.is_pinned && (
                        <Pin className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {post.category === "general" ? "General" :
                         post.category === "clinical_questions" ? "Preguntas Clínicas" :
                         post.category === "case_discussions" ? "Casos" : "Recursos"}
                      </span>
                      {post.featured && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{post.excerpt || post.content}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Por: {post.profiles?.full_name || "Usuario"}</span>
                      <span>{format(new Date(post.created_at), "dd MMM yyyy", { locale: es })}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views_count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => handleEdit(post)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleTogglePin(post.id, post.is_pinned)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1"
                    >
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminForo;
