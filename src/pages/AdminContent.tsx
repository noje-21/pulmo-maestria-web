import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, FileText, Users, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";

interface SiteContent {
  section: string;
  content: any;
}

const sections = [
  { id: "hero", label: "Sección Hero", icon: Sparkles, emoji: "🎯" },
  { id: "maestria", label: "Sección Maestría", icon: FileText, emoji: "🎓" },
  { id: "expertos", label: "Sección Expertos", icon: Users, emoji: "👨‍⚕️" },
  { id: "contacto", label: "Sección Contacto", icon: Mail, emoji: "📧" },
];

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("*");

      if (error) throw error;

      const contentMap: Record<string, any> = {};
      data?.forEach((item: SiteContent) => {
        contentMap[item.section] = item.content;
      });

      setContent(contentMap);
    } catch (error) {
      toast.error("Error al cargar el contenido");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .update({ content: content[section] })
        .eq("section", section);

      if (error) throw error;

      toast.success("¡Contenido actualizado con éxito!");
    } catch (error) {
      toast.error("Error al guardar el contenido");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <AdminLayout title="Editar Contenido" subtitle="Cargando...">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Editar Contenido del Sitio" 
      subtitle="Actualiza los textos e información de cada sección"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 md:p-6 bg-card border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Sección Hero
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>Título Principal</Label>
                <Input
                  value={content.hero?.title || ""}
                  onChange={(e) => updateField("hero", "title", e.target.value)}
                />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={content.hero?.subtitle || ""}
                  onChange={(e) => updateField("hero", "subtitle", e.target.value)}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={content.hero?.description || ""}
                  onChange={(e) => updateField("hero", "description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Fechas</Label>
                  <Input
                    value={content.hero?.dates || ""}
                    onChange={(e) => updateField("hero", "dates", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={content.hero?.location || ""}
                    onChange={(e) => updateField("hero", "location", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Advertencia</Label>
                <Input
                  value={content.hero?.warning || ""}
                  onChange={(e) => updateField("hero", "warning", e.target.value)}
                />
              </div>
            </div>
            <Button onClick={() => handleSave("hero")} disabled={saving} className="mt-4 gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Card>
        </motion.div>

        {/* Maestría Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 md:p-6 bg-card border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Sección Maestría
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={content.maestria?.title || ""}
                  onChange={(e) => updateField("maestria", "title", e.target.value)}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={content.maestria?.description || ""}
                  onChange={(e) => updateField("maestria", "description", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <Button onClick={() => handleSave("maestria")} disabled={saving} className="mt-4 gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Card>
        </motion.div>

        {/* Expertos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 md:p-6 bg-card border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">👨‍⚕️</span>
              Sección Expertos
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={content.expertos?.title || ""}
                  onChange={(e) => updateField("expertos", "title", e.target.value)}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={content.expertos?.description || ""}
                  onChange={(e) => updateField("expertos", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={() => handleSave("expertos")} disabled={saving} className="mt-4 gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Card>
        </motion.div>

        {/* Contacto Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 md:p-6 bg-card border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📧</span>
              Sección Contacto
            </h2>
            <div className="grid gap-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={content.contacto?.title || ""}
                  onChange={(e) => updateField("contacto", "title", e.target.value)}
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={content.contacto?.description || ""}
                  onChange={(e) => updateField("contacto", "description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={() => handleSave("contacto")} disabled={saving} className="mt-4 gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
