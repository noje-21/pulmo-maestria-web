import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import ImageUpload from "@/components/common/ImageUpload";
import { Plus, Trash2, Edit, Save, X, BookOpen, Search, Video, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type AteneoCategory = "caso_clinico" | "actualizacion" | "investigacion" | "rehabilitacion" | "imaging" | "general";
type AteneoStatus = "draft" | "published" | "archived";

const categoryLabels: Record<AteneoCategory, string> = {
  caso_clinico: "Caso Clínico",
  actualizacion: "Actualización",
  investigacion: "Investigación",
  rehabilitacion: "Rehabilitación",
  imaging: "Imaging",
  general: "General",
};

const AdminAteneos = () => {
  const [loading, setLoading] = useState(true);
  const [ateneos, setAteneos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    contenido: "",
    fecha: new Date().toISOString().split("T")[0],
    categoria: "general" as AteneoCategory,
    imagen: "",
    video_url: "",
    pdf_url: "",
    status: "published" as AteneoStatus,
  });

  useEffect(() => {
    loadAteneos();
  }, []);

  const loadAteneos = async () => {
    try {
      const { data, error } = await supabase
        .from("ateneos")
        .select("*")
        .order("fecha", { ascending: false });

      if (error) throw error;
      setAteneos(data || []);
    } catch (error: any) {
      console.error("Error loading ateneos:", error);
      toast.error("Error al cargar ateneos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      contenido: "",
      fecha: new Date().toISOString().split("T")[0],
      categoria: "general",
      imagen: "",
      video_url: "",
      pdf_url: "",
      status: "published",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (ateneo: any) => {
    setFormData({
      titulo: ateneo.titulo,
      descripcion: ateneo.descripcion,
      contenido: ateneo.contenido || "",
      fecha: ateneo.fecha,
      categoria: ateneo.categoria,
      imagen: ateneo.imagen || "",
      video_url: ateneo.video_url || "",
      pdf_url: ateneo.pdf_url || "",
      status: ateneo.status,
    });
    setEditingId(ateneo.id);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descripcion) {
      toast.error("Título y descripción son obligatorios");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Debes iniciar sesión");
        return;
      }

      const dataToSave = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        contenido: formData.contenido,
        fecha: formData.fecha,
        categoria: formData.categoria,
        imagen: formData.imagen || null,
        video_url: formData.video_url || null,
        pdf_url: formData.pdf_url || null,
        status: formData.status,
        created_by: session.user.id,
      };

      if (editingId) {
        const { error } = await supabase
          .from("ateneos")
          .update(dataToSave)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Ateneo actualizado");
      } else {
        const { error } = await supabase
          .from("ateneos")
          .insert(dataToSave);
        if (error) throw error;
        toast.success("Ateneo creado");
      }

      resetForm();
      await loadAteneos();
    } catch (error: any) {
      console.error("Error saving ateneo:", error);
      toast.error("Error al guardar: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este ateneo?")) return;
    try {
      const { error } = await supabase.from("ateneos").delete().eq("id", id);
      if (error) throw error;
      toast.success("Ateneo eliminado");
      loadAteneos();
    } catch (error: any) {
      toast.error("Error al eliminar ateneo");
    }
  };

  const filteredAteneos = ateneos.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.titulo.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <AdminLayout title="Gestión de Ateneos" subtitle="Cargando...">
        <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestión de Ateneos" subtitle="Crea y administra ateneos académicos">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ateneos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Ateneo
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
                {editingId ? "Editar Ateneo" : "Crear Nuevo Ateneo"}
              </h3>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Título *</Label>
                    <Input
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Título del ateneo"
                    />
                  </div>
                  <div>
                    <Label>Fecha *</Label>
                    <Input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Categoría</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(v) => setFormData({ ...formData, categoria: v as AteneoCategory })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v as AteneoStatus })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Descripción corta *</Label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={2}
                    placeholder="Breve descripción para el listado..."
                  />
                </div>
                <div>
                  <Label>Contenido completo</Label>
                  <Textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    rows={8}
                    placeholder="Contenido HTML del ateneo..."
                  />
                </div>
                <div>
                  <Label>Imagen destacada</Label>
                  <ImageUpload
                    currentImage={formData.imagen}
                    onImageUploaded={(url) => setFormData({ ...formData, imagen: url })}
                    onImageRemoved={() => setFormData({ ...formData, imagen: "" })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> URL de Video (opcional)</Label>
                    <Input
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> URL de PDF (opcional)</Label>
                    <Input
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      placeholder="https://ejemplo.com/archivo.pdf"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleSubmit} className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingId ? "Guardar Cambios" : "Crear Ateneo"}
                  </Button>
                  <Button onClick={resetForm} variant="outline" className="gap-2">
                    <X className="w-4 h-4" /> Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-4">
        {filteredAteneos.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border/50">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? "No se encontraron ateneos" : "No hay ateneos creados"}
            </p>
          </Card>
        ) : (
          filteredAteneos.map((ateneo, index) => (
            <motion.div
              key={ateneo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 md:p-5 bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        ateneo.status === "published" ? "bg-green-500/10 text-green-600" :
                        ateneo.status === "archived" ? "bg-gray-500/10 text-gray-500" :
                        "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {ateneo.status === "published" ? "Publicado" :
                         ateneo.status === "archived" ? "Archivado" : "Borrador"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {categoryLabels[ateneo.categoria as AteneoCategory] || ateneo.categoria}
                      </span>
                      {ateneo.video_url && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                      {ateneo.pdf_url && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{ateneo.titulo}</h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{ateneo.descripcion}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(new Date(ateneo.fecha), "dd MMM yyyy", { locale: es })}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleEdit(ateneo)} variant="outline" size="sm" className="flex-1 sm:flex-none gap-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(ateneo.id)} variant="destructive" size="sm" className="flex-1 sm:flex-none gap-1">
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

export default AdminAteneos;