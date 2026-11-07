import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/features/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/common/ImageUpload";
import AnnouncementCard from "@/features/announcements/AnnouncementCard";
import { FREQUENCY_LABELS, type AnnouncementFrequency } from "@/features/announcements/frequency";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface Ann {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  delay_seconds: number;
  frequency: AnnouncementFrequency;
  priority: number;
}

const EMPTY: Ann = {
  title: "", description: "", image_url: null, cta_label: "Ver más", cta_url: "",
  is_active: false, starts_at: null, ends_at: null, delay_seconds: 4, frequency: "daily", priority: 0,
};

// datetime-local <-> ISO
const toLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
const fromLocal = (v: string) => (v ? new Date(v).toISOString() : null);

function statusOf(a: Ann): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  const now = Date.now();
  if (!a.is_active) return { label: "Inactivo", variant: "secondary" };
  if (a.ends_at && new Date(a.ends_at).getTime() <= now) return { label: "Vencido", variant: "destructive" };
  if (a.starts_at && new Date(a.starts_at).getTime() > now) return { label: "Programado", variant: "outline" };
  return { label: "Publicado", variant: "default" };
}

export default function AdminAnuncios() {
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Ann | null>(null);
  const [preview, setPreview] = useState<Ann | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("announcements").select("*")
      .order("priority", { ascending: false }).order("created_at", { ascending: false });
    if (error) toast.error(getErrorMessage(error));
    setItems((data ?? []) as Ann[]);
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    if (editing.title.trim().length < 3) return toast.error("El título es obligatorio");
    if (!editing.cta_url.trim()) return toast.error("El enlace del botón es obligatorio");
    if (!/^(https?:\/\/|\/)/i.test(editing.cta_url.trim())) return toast.error("El enlace debe empezar con https:// o con / (página interna)");
    if (editing.starts_at && editing.ends_at && editing.ends_at <= editing.starts_at) return toast.error("El vencimiento debe ser posterior a la publicación");
    setSaving(true);
    const { id, ...rest } = editing;
    const payload = { ...rest, title: rest.title.trim(), cta_url: rest.cta_url.trim(), cta_label: rest.cta_label.trim() || "Ver más" };
    const { data: { user } } = await supabase.auth.getUser();
    const res = id
      ? await supabase.from("announcements").update(payload).eq("id", id)
      : await supabase.from("announcements").insert({ ...payload, created_by: user?.id });
    setSaving(false);
    if (res.error) return toast.error(getErrorMessage(res.error));
    toast.success("Anuncio guardado");
    setEditing(null);
    void load();
  };

  const toggle = async (a: Ann) => {
    const { error } = await supabase.from("announcements").update({ is_active: !a.is_active }).eq("id", a.id!);
    if (error) return toast.error(getErrorMessage(error));
    void load();
  };

  const remove = async (a: Ann) => {
    if (!confirm(`¿Eliminar el anuncio "${a.title}"?`)) return;
    const { error } = await supabase.from("announcements").delete().eq("id", a.id!);
    if (error) return toast.error(getErrorMessage(error));
    toast.success("Anuncio eliminado");
    void load();
  };

  const set = <K extends keyof Ann>(k: K, v: Ann[K]) => setEditing((e) => (e ? { ...e, [k]: v } : e));

  return (
    <AdminLayout title="Anuncios emergentes" subtitle="Ventanas que aparecen en la página principal del sitio público">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing({ ...EMPTY })}><Plus className="mr-2 h-4 w-4" />Nuevo anuncio</Button>
      </div>

      {loading ? <p className="text-muted-foreground">Cargando…</p> : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">Todavía no hay anuncios.</Card>
      ) : (
        <div className="grid gap-4">
          {items.map((a) => {
            const st = statusOf(a);
            return (
              <Card key={a.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {a.image_url && <img src={a.image_url} alt="" className="h-24 w-20 rounded-md object-cover" loading="lazy" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{a.title}</h3>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{a.cta_url}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {FREQUENCY_LABELS[a.frequency]} · aparece a los {a.delay_seconds} s
                    {a.starts_at && ` · desde ${new Date(a.starts_at).toLocaleString("es-AR")}`}
                    {a.ends_at && ` · hasta ${new Date(a.ends_at).toLocaleString("es-AR")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={a.is_active} onCheckedChange={() => toggle(a)} aria-label="Activar anuncio" />
                  <Button size="icon" variant="ghost" onClick={() => setPreview(a)} aria-label="Vista previa"><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditing({ ...a })} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(a)} aria-label="Eliminar"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          <DialogTitle>{editing?.id ? "Editar anuncio" : "Nuevo anuncio"}</DialogTitle>
          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-1.5"><Label>Título</Label><Input value={editing.title} maxLength={140} onChange={(e) => set("title", e.target.value)} /></div>
              <div className="grid gap-1.5"><Label>Descripción breve</Label><Textarea rows={3} maxLength={500} value={editing.description} onChange={(e) => set("description", e.target.value)} /></div>
              <div className="grid gap-1.5">
                <Label>Flyer o imagen</Label>
                <ImageUpload currentImage={editing.image_url ?? undefined} onImageUploaded={(u) => set("image_url", u)} onImageRemoved={() => set("image_url", null)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><Label>Texto del botón</Label><Input value={editing.cta_label} maxLength={40} onChange={(e) => set("cta_label", e.target.value)} /></div>
                <div className="grid gap-1.5"><Label>Enlace (https://… o /pagina)</Label><Input value={editing.cta_url} placeholder="https://campus.maestriacp.com/simposio" onChange={(e) => set("cta_url", e.target.value)} /></div>
                <div className="grid gap-1.5"><Label>Publicar desde</Label><Input type="datetime-local" value={toLocal(editing.starts_at)} onChange={(e) => set("starts_at", fromLocal(e.target.value))} /></div>
                <div className="grid gap-1.5"><Label>Vence el</Label><Input type="datetime-local" value={toLocal(editing.ends_at)} onChange={(e) => set("ends_at", fromLocal(e.target.value))} /></div>
                <div className="grid gap-1.5"><Label>Aparece a los (segundos)</Label><Input type="number" min={0} max={120} value={editing.delay_seconds} onChange={(e) => set("delay_seconds", Math.min(120, Math.max(0, Number(e.target.value) || 0)))} /></div>
                <div className="grid gap-1.5">
                  <Label>Frecuencia</Label>
                  <Select value={editing.frequency} onValueChange={(v) => set("frequency", v as AnnouncementFrequency)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(FREQUENCY_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5"><Label>Prioridad (mayor se muestra primero)</Label><Input type="number" value={editing.priority} onChange={(e) => set("priority", Number(e.target.value) || 0)} /></div>
                <div className="flex items-center gap-3 pt-6"><Switch checked={editing.is_active} onCheckedChange={(v) => set("is_active", v)} /><Label>Activo</Label></div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPreview(editing)}><Eye className="mr-2 h-4 w-4" />Vista previa</Button>
                <Button onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {preview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setPreview(null)}>
          <AnnouncementCard announcement={preview} onClose={() => setPreview(null)} onCta={() => setPreview(null)} />
        </div>
      )}
    </AdminLayout>
  );
}
