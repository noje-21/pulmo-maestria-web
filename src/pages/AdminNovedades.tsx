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
import { Plus, Trash2, Edit, Save, X, Newspaper, Search, ChevronLeft, ChevronRight, Share2, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ImageUpload from "@/components/common/ImageUpload";

const imageUrlSchema = z.string().url().refine(
  (url) => url.startsWith('http://') || url.startsWith('https://'),
  'Solo se permiten URLs HTTP(S)'
).refine(
  (url) => !url.includes('localhost') && !url.includes('127.0.0.1'),
  'No se permiten URLs internas'
).optional().or(z.literal(''));

const AdminNovedades = () => {
  const [loading, setLoading] = useState(true);
  const [novedades, setNovedades] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    status: "published" as "draft" | "published" | "archived",
  });

  useEffect(() => {
    loadNovedades();
  }, []);

  const loadNovedades = async () => {
    try {
      const { data, error } = await supabase
        .from("novedades")
        .select(`
          *,
          profiles!novedades_author_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNovedades(data || []);
    } catch (error: any) {
      console.error("Error loading novedades:", error);
      toast.error("Error al cargar novedades");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      status: "published",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (novedad: any) => {
    setFormData({
      title: novedad.title,
      slug: novedad.slug,
      excerpt: novedad.excerpt || "",
      content: novedad.content,
      image_url: novedad.image_url || "",
      status: novedad.status,
    });
    setEditingId(novedad.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
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

      const slug = formData.slug || formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const dataToSave = {
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt || formData.content.substring(0, 200),
        content: formData.content,
        image_url: formData.image_url || null,
        status: formData.status,
        author_id: session.user.id,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("novedades")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Novedad actualizada exitosamente");
      } else {
        const { error } = await supabase
          .from("novedades")
          .insert(dataToSave);

        if (error) throw error;
        toast.success("Novedad creada y publicada exitosamente");
      }

      resetForm();
      await loadNovedades();
    } catch (error: any) {
      console.error("Error saving novedad:", error);
      toast.error("Error al guardar novedad: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta novedad?")) return;

    try {
      const { error } = await supabase
        .from("novedades")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Novedad eliminada");
      loadNovedades();
    } catch (error: any) {
      toast.error("Error al eliminar novedad");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Gestión de Novedades" subtitle="Cargando...">
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Gestión de Novedades" 
      subtitle="Publica noticias y actualizaciones para la comunidad"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar novedades..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Novedad
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
                {editingId ? "Editar Novedad" : "Crear Nueva Novedad"}
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Título *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título de la novedad"
                  />
                </div>
                <div>
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    placeholder="url-de-la-novedad"
                  />
                </div>
                <div>
                  <Label>Extracto</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Breve descripción..."
                  />
                </div>
                <div>
                  <Label>Texto para compartir (extracto)</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Texto que aparece al compartir en redes sociales..."
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> Este texto se usa como preview en redes sociales
                  </p>
                </div>
                <div>
                  <Label>Contenido *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    placeholder="Contenido completo de la novedad..."
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
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleSubmit} className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingId ? "Guardar Cambios" : "Crear Novedad"}
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

      {/* Novedades List */}
      {(() => {
        const filteredNovedades = novedades.filter((n) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return n.title.toLowerCase().includes(q) || (n.excerpt || "").toLowerCase().includes(q);
        });
        const totalPages = Math.ceil(filteredNovedades.length / pageSize);
        const paged = filteredNovedades.slice((page - 1) * pageSize, page * pageSize);

        return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{filteredNovedades.length} novedad{filteredNovedades.length !== 1 ? "es" : ""}</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span>{page} / {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {paged.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border/50">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{searchQuery ? "No se encontraron novedades" : "No hay novedades creadas"}</p>
          </Card>
        ) : (
          paged.map((novedad, index) => (
            <motion.div
              key={novedad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 md:p-5 bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        novedad.status === "published" ? "bg-green-500/10 text-green-600" :
                        novedad.status === "archived" ? "bg-gray-500/10 text-gray-500" :
                        "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {novedad.status === "published" ? "Publicado" :
                         novedad.status === "archived" ? "Archivado" : "Borrador"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{novedad.title}</h3>
                    {novedad.excerpt && (
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{novedad.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Autor: {novedad.profiles?.full_name || "Admin"}</span>
                      <span>{format(new Date(novedad.created_at), "dd MMM yyyy", { locale: es })}</span>
                      {novedad.image_url && (
                        <span className="text-green-600">📷 Con imagen</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => handleEdit(novedad)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none gap-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(novedad.id)}
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
        );
      })()}
    </AdminLayout>
  );
};

export default AdminNovedades;
