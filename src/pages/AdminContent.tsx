import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import AdminSidebar from "@/features/admin/AdminSidebar";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";

interface SiteContent {
  section: string;
  content: any;
}

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadContent();
  }, []);

  const checkAdminAndLoadContent = async () => {
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

      await loadContent();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/admin")} className="pv-tap-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Editar Contenido del Sitio</h1>
              <p className="text-muted-foreground mt-1">Actualiza los textos e información del sitio</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              >
                <Card className="p-4 md:p-6 pv-glass pv-glow border-border/50">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  Sección Hero
                </h2>
                <div className="space-y-4">
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
                <Button onClick={() => handleSave("hero")} disabled={saving} className="mt-4 pv-tap-scale">
                  <Save className="w-4 h-4 mr-2" />
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
              <Card className="p-6 pv-glass pv-glow border-border/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎓</span>
                  Sección Maestría
                </h2>
                <div className="space-y-4">
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
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("maestria")} disabled={saving} className="mt-4 pv-tap-scale">
                  <Save className="w-4 h-4 mr-2" />
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
              <Card className="p-6 pv-glass pv-glow border-border/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">👨‍⚕️</span>
                  Sección Expertos
                </h2>
                <div className="space-y-4">
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
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("expertos")} disabled={saving} className="mt-4 pv-tap-scale">
                  <Save className="w-4 h-4 mr-2" />
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
              <Card className="p-6 pv-glass pv-glow border-border/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">📧</span>
                  Sección Contacto
                </h2>
                <div className="space-y-4">
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
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("contacto")} disabled={saving} className="mt-4 pv-tap-scale">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContent;
