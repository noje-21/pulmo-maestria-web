import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { SiteImageUpload } from "@/components/admin/SiteImageUpload";

interface ModuloItem {
  id: string;
  titulo: string;
  autores: string;
  revista: string;
  año: string;
  url?: string;
}

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

const defaultModulos: ModuloItem[] = [
  { id: "1", titulo: "Generalidades, clasificación y epidemiología de la Hipertensión Pulmonar — Contenido del Módulo 1", autores: "Lescano AJ.", revista: "Material académico de la Maestría en Circulación Pulmonar", año: "2025" },
  { id: "2", titulo: "Enfermedad del tejido conectivo e HP: Diagnóstico, pronóstico y tratamiento — Módulo 5", autores: "Nitsche A, Lescano AJ.", revista: "Material académico de la Maestría en Circulación Pulmonar", año: "2025" },
  { id: "3", titulo: "Tromboendarterectomía pulmonar: Estrategias de intervención y seguimiento — Módulo 25", autores: "Nahim M.", revista: "Material académico de la Maestría en Circulación Pulmonar", año: "2025" },
];

const AdminContent = () => {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [modulos, setModulos] = useState<ModuloItem[]>([]);
  const [pdfSource, setPdfSource] = useState("MAESTRIA_CP_2025.pdf");
  const [modulosDirty, setModulosDirty] = useState(false);
  const [savingModulos, setSavingModulos] = useState(false);

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

      if (map["modulos_destacados"]) {
        setModulos(map["modulos_destacados"].items || defaultModulos);
        setPdfSource(map["modulos_destacados"].pdfSource || "MAESTRIA_CP_2025.pdf");
      } else {
        setModulos(defaultModulos);
      }
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

  const handleSaveModulos = async () => {
    setSavingModulos(true);
    try {
      const payload = { items: modulos, pdfSource };
      const { error } = await supabase
        .from("site_content")
        .upsert({ section: "modulos_destacados", content: payload as any, updated_at: new Date().toISOString() }, { onConflict: "section" });
      if (error) throw error;
      setModulosDirty(false);
      toast.success("Módulos Destacados actualizados");
    } catch {
      toast.error("Error al guardar los módulos");
    } finally {
      setSavingModulos(false);
    }
  };

  const addModulo = () => {
    setModulos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), titulo: "", autores: "", revista: "Material académico de la Maestría en Circulación Pulmonar", año: new Date().getFullYear().toString() },
    ]);
    setModulosDirty(true);
  };

  const removeModulo = (id: string) => {
    setModulos((prev) => prev.filter((m) => m.id !== id));
    setModulosDirty(true);
  };

  const updateModulo = (id: string, field: keyof ModuloItem, value: string) => {
    setModulos((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
    setModulosDirty(true);
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

      {/* Módulos Destacados editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * sectionConfigs.length }}
      >
        <Card className="p-4 md:p-6 bg-card border-border/50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Módulos Destacados
            {modulosDirty && (
              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded-full">
                Sin guardar
              </span>
            )}
          </h2>

          {/* PDF Source */}
          <div className="mb-6">
            <Label>Archivo PDF de referencia (ruta pública)</Label>
            <Input
              value={pdfSource}
              onChange={(e) => { setPdfSource(e.target.value); setModulosDirty(true); }}
              placeholder="/MAESTRIA_CP_2025.pdf"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se muestra como fuente de referencia debajo de los módulos.
            </p>
          </div>

          {/* Módulos list */}
          <div className="space-y-4">
            {modulos.map((m, i) => (
              <div key={m.id} className="border border-border/50 rounded-lg p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <GripVertical className="w-4 h-4" />
                    Módulo {i + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeModulo(m.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <Label>Título</Label>
                  <Input value={m.titulo} onChange={(e) => updateModulo(m.id, "titulo", e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Autores</Label>
                    <Input value={m.autores} onChange={(e) => updateModulo(m.id, "autores", e.target.value)} />
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input value={m.año} onChange={(e) => updateModulo(m.id, "año", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Fuente / Revista</Label>
                  <Input value={m.revista} onChange={(e) => updateModulo(m.id, "revista", e.target.value)} />
                </div>
                <div>
                  <Label>URL externa (opcional)</Label>
                  <Input value={m.url || ""} onChange={(e) => updateModulo(m.id, "url", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button variant="outline" onClick={addModulo} className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar módulo
            </Button>
            <Button onClick={handleSaveModulos} disabled={savingModulos} className="gap-2">
              {savingModulos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {savingModulos ? "Guardando..." : "Guardar Módulos"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminContent;
