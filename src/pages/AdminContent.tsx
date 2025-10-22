import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Button>
          <h1 className="text-4xl font-bold text-primary">Editar Contenido del Sitio</h1>
        </div>

        <div className="space-y-6">
          {/* Hero Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sección Hero</h2>
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
              <div className="grid grid-cols-2 gap-4">
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
              <Button onClick={() => handleSave("hero")} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </Card>

          {/* Maestría Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sección Maestría</h2>
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
                  rows={6}
                />
              </div>
              <Button onClick={() => handleSave("maestria")} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </Card>

          {/* Contacto Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sección Contacto</h2>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={content.contacto?.email || ""}
                  onChange={(e) => updateField("contacto", "email", e.target.value)}
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={content.contacto?.whatsapp || ""}
                  onChange={(e) => updateField("contacto", "whatsapp", e.target.value)}
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={content.contacto?.instagram || ""}
                  onChange={(e) => updateField("contacto", "instagram", e.target.value)}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={content.contacto?.website || ""}
                  onChange={(e) => updateField("contacto", "website", e.target.value)}
                />
              </div>
              <Button onClick={() => handleSave("contacto")} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
