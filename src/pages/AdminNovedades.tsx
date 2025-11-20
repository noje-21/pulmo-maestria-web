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
import AdminSidebar from "@/components/AdminSidebar";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    status: "published" as "draft" | "published" | "archived",
  });

  useEffect(() => {
    checkAdminAndLoadNovedades();
  }, []);

  const checkAdminAndLoadNovedades = async () => {
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

      await loadNovedades();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

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

    // Validate image URL if provided
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

      // Generar slug automáticamente si está vacío
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
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
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
                <h1 className="text-4xl font-bold text-primary">Gestión de Novedades</h1>
                <p className="text-muted-foreground mt-1">Administra las novedades y actualizaciones</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="modern-btn pv-tap-scale">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Novedad
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
                    {editingId ? "Editar Novedad" : "Crear Nueva Novedad"}
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="modern-input"
                      />
                    </div>
                    <div>
                      <Label>Slug (URL) *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                        className="modern-input"
                      />
                    </div>
                    <div>
                      <Label>Extracto</Label>
                      <Textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={2}
                        className="modern-input"
                      />
                    </div>
                    <div>
                      <Label>Contenido *</Label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={8}
                        className="modern-input"
                      />
                    </div>
                    <div>
                      <Label>URL de Imagen</Label>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="modern-input"
                      />
                    </div>
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
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSubmit} className="modern-btn pv-tap-scale">
                        <Save className="w-4 h-4 mr-2" />
                        {editingId ? "Guardar Cambios" : "Crear Novedad"}
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
            {novedades.map((novedad, index) => (
              <motion.div
                key={novedad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          novedad.status === "published" ? "bg-green-500/10 text-green-500" :
                          novedad.status === "archived" ? "bg-gray-500/10 text-gray-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        }`}>
                          {novedad.status === "published" ? "Publicado" :
                           novedad.status === "archived" ? "Archivado" : "Borrador"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{novedad.title}</h3>
                      {novedad.excerpt && (
                        <p className="text-muted-foreground text-sm mb-3">{novedad.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Autor: {novedad.profiles?.full_name || "Admin"}</span>
                        <span>{format(new Date(novedad.created_at), "dd MMM yyyy", { locale: es })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEdit(novedad)}
                        variant="outline"
                        size="sm"
                        className="pv-tap-scale"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(novedad.id)}
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

            {novedades.length === 0 && (
              <Card className="p-12 text-center modern-card pv-glass">
                <p className="text-muted-foreground">No hay novedades creadas</p>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNovedades;
