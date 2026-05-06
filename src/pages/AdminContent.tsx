import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { SiteImageUpload } from "@/components/admin/SiteImageUpload";

interface SectionConfig {
  id: string;
  label: string;
  emoji: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "image";
  rows?: number;
  half?: boolean;
}

const sectionConfigs: SectionConfig[] = [
  {
    id: "hero",
    label: "Sección Hero",
    emoji: "🎯",
    fields: [
      { key: "title", label: "Título Principal", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "text" },
      { key: "description", label: "Descripción", type: "textarea", rows: 3 },
      { key: "dates", label: "Fechas", type: "text", half: true },
      { key: "location", label: "Ubicación", type: "text", half: true },
      { key: "warning", label: "Advertencia", type: "text" },
      { key: "image", label: "Imagen Hero", type: "image" },
    ],
  },
  {
    id: "maestria",
    label: "Sección Maestría",
    emoji: "🎓",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea", rows: 4 },
      { key: "image", label: "Imagen Maestría", type: "image" },
    ],
  },
  {
    id: "expertos",
    label: "Sección Expertos",
    emoji: "👨‍⚕️",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea", rows: 3 },
      { key: "image", label: "Imagen de sección", type: "image" },
    ],
  },
  {
    id: "eventos",
    label: "Sección Eventos",
    emoji: "📅",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea", rows: 3 },
      { key: "image", label: "Imagen de sección", type: "image" },
    ],
  },
  {
    id: "contacto",
    label: "Sección Contacto",
    emoji: "📧",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "description", label: "Descripción", type: "textarea", rows: 3 },
    ],
  },
];

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;

      const map: Record<string, any> = {};
      data?.forEach((item: { section: string; content: any }) => {
        map[item.section] = item.content;
      });
      setContent(map);
    } catch {
      toast.error("Error al cargar el contenido");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string) => {
    setSavingSection(section);
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert({ section, content: content[section] || {}, updated_at: new Date().toISOString() }, { onConflict: "section" });

      if (error) throw error;

      setDirty((prev) => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
      toast.success("¡Contenido actualizado con éxito!");
    } catch {
      toast.error("Error al guardar el contenido");
    } finally {
      setSavingSection(null);
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setDirty((prev) => new Set(prev).add(section));
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
      subtitle="Actualiza textos e imágenes de cada sección. Los cambios se previsualzan antes de guardar."
    >
      <div className="space-y-6">
        {sectionConfigs.map((sec, idx) => {
          const isSaving = savingSection === sec.id;
          const isDirty = dirty.has(sec.id);

          // Group half fields into pairs
          const rows: FieldConfig[][] = [];
          let halfBuffer: FieldConfig[] = [];
          sec.fields.forEach((f) => {
            if (f.half) {
              halfBuffer.push(f);
              if (halfBuffer.length === 2) {
                rows.push([...halfBuffer]);
                halfBuffer = [];
              }
            } else {
              if (halfBuffer.length) {
                rows.push([...halfBuffer]);
                halfBuffer = [];
              }
              rows.push([f]);
            }
          });
          if (halfBuffer.length) rows.push([...halfBuffer]);

          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card className="p-4 md:p-6 bg-card border-border/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">{sec.emoji}</span>
                  {sec.label}
                  {isDirty && (
                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded-full">
                      Sin guardar
                    </span>
                  )}
                </h2>

                <div className="grid gap-4">
                  {rows.map((row, ri) => {
                    if (row.length === 2) {
                      return (
                        <div key={ri} className="grid sm:grid-cols-2 gap-4">
                          {row.map((f) => (
                            <div key={f.key}>
                              <Label>{f.label}</Label>
                              <Input
                                value={content[sec.id]?.[f.key] || ""}
                                onChange={(e) => updateField(sec.id, f.key, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }

                    const f = row[0];

                    if (f.type === "image") {
                      return (
                        <SiteImageUpload
                          key={f.key}
                          label={f.label}
                          currentUrl={content[sec.id]?.[f.key] || ""}
                          onUrlChange={(url) => updateField(sec.id, f.key, url)}
                          folder={sec.id}
                        />
                      );
                    }

                    if (f.type === "textarea") {
                      return (
                        <div key={f.key}>
                          <Label>{f.label}</Label>
                          <Textarea
                            value={content[sec.id]?.[f.key] || ""}
                            onChange={(e) => updateField(sec.id, f.key, e.target.value)}
                            rows={f.rows || 3}
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={f.key}>
                        <Label>{f.label}</Label>
                        <Input
                          value={content[sec.id]?.[f.key] || ""}
                          onChange={(e) => updateField(sec.id, f.key, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => handleSave(sec.id)}
                  disabled={isSaving}
                  className="mt-4 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
