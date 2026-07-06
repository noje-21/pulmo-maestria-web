import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { Trash2, Mail, MapPin, Briefcase, User, Send, Loader2, FileText, Search } from "lucide-react";

type ContactStatus = "nuevo" | "leido" | "respondido" | "spam";

const STATUS_LABEL: Record<ContactStatus, string> = {
  nuevo: "Nuevo",
  leido: "Leído",
  respondido: "Respondido",
  spam: "Spam",
};

const STATUS_BADGE: Record<ContactStatus, string> = {
  nuevo: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  leido: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  respondido: "bg-green-500/10 text-green-600 border-green-500/30",
  spam: "bg-destructive/10 text-destructive border-destructive/30",
};

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  country: string;
  specialty: string;
  message: string;
  created_at: string;
  cv_url: string | null;
  status: ContactStatus;
  updated_at: string;
}

const AdminContactos = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);
  const [cvLoadingId, setCvLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactStatus>("all");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      toast.error("Error al cargar envíos");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactStatus) => {
    const prev = submissions;
    setSubmissions((s) => s.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (error) {
      setSubmissions(prev);
      toast.error("No se pudo actualizar el estado");
      return;
    }
    await supabase.rpc("log_audit_event", {
      _action: "contact.status_changed",
      _entity_type: "contact_submission",
      _entity_id: id,
      _metadata: { status },
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este envío?")) return;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Envío eliminado");
      await supabase.rpc("log_audit_event", {
        _action: "contact.deleted",
        _entity_type: "contact_submission",
        _entity_id: id,
        _metadata: {},
      });
      loadSubmissions();
    }
  };

  const handleReply = async (submission: ContactSubmission) => {
    const replyMessage = replyTexts[submission.id]?.trim();
    if (!replyMessage) {
      toast.error("Escribe un mensaje de respuesta");
      return;
    }

    setSendingReply(submission.id);
    try {
      const { data, error } = await supabase.functions.invoke('reply-contact', {
        body: {
          recipientEmail: submission.email,
          recipientName: submission.name,
          replyMessage,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Respuesta enviada a ${submission.email}`);
      setReplyTexts((prev) => ({ ...prev, [submission.id]: "" }));
      await updateStatus(submission.id, "respondido");
    } catch (error) {
      console.error('Reply error:', error);
      toast.error("Error al enviar la respuesta");
    } finally {
      setSendingReply(null);
    }
  };

  const handleViewCv = async (submission: ContactSubmission) => {
    if (!submission.cv_url) return;
    const cvWindow = window.open("", "_blank");
    if (cvWindow) {
      cvWindow.document.write("<p style='font-family: system-ui; padding: 24px;'>Abriendo currículum seguro…</p>");
      cvWindow.document.close();
    }
    setCvLoadingId(submission.id);
    try {
      const { data, error } = await supabase.functions.invoke('get-cv-url', {
        body: { path: submission.cv_url, expiresIn: 300 },
      });
      if (error) throw error;
      const url = (data as { url?: string } | null)?.url;
      if (!url) throw new Error('No URL');
      if (cvWindow) {
        cvWindow.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch {
      cvWindow?.close();
      toast.error('No pudimos generar el enlace al currículum.');
    } finally {
      setCvLoadingId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Envíos de Contacto" subtitle="Cargando...">
        <TableSkeleton rows={5} />
      </AdminLayout>
    );
  }

  const q = search.trim().toLowerCase();
  const filtered = submissions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.country?.toLowerCase().includes(q) ||
      s.specialty?.toLowerCase().includes(q) ||
      s.message?.toLowerCase().includes(q)
    );
  });

  const counts = submissions.reduce(
    (acc, s) => ({ ...acc, [s.status]: (acc[s.status] || 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <AdminLayout 
      title="Envíos de Contacto" 
      subtitle="Gestiona las consultas e inscripciones recibidas"
    >
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, país, mensaje…"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos ({submissions.length})</SelectItem>
            <SelectItem value="nuevo">Nuevo ({counts.nuevo || 0})</SelectItem>
            <SelectItem value="leido">Leído ({counts.leido || 0})</SelectItem>
            <SelectItem value="respondido">Respondido ({counts.respondido || 0})</SelectItem>
            <SelectItem value="spam">Spam ({counts.spam || 0})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-card border-border/50">
            <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {submissions.length === 0 ? "No hay envíos aún" : "Sin resultados"}
              </p>
              <p className="text-sm mt-1">
                {submissions.length === 0
                  ? "Las consultas aparecerán aquí"
                  : "Probá con otros términos o filtros"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filtered.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onViewportEnter={() => {
                if (submission.status === "nuevo") updateStatus(submission.id, "leido");
              }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                    <Badge variant="outline" className={STATUS_BADGE[submission.status]}>
                      {STATUS_LABEL[submission.status]}
                    </Badge>
                    <Select
                      value={submission.status}
                      onValueChange={(v) => updateStatus(submission.id, v as ContactStatus)}
                    >
                      <SelectTrigger className="h-8 w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="leido">Leído</SelectItem>
                        <SelectItem value="respondido">Respondido</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Nombre</p>
                        <p className="font-semibold truncate">{submission.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-semibold truncate">{submission.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">País</p>
                        <p className="font-semibold truncate">{submission.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Especialidad</p>
                        <p className="font-semibold truncate">{submission.specialty}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">Mensaje</p>
                    <p className="text-foreground text-sm">{submission.message}</p>
                  </div>

                  {submission.cv_url && (
                    <div className="mb-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCv(submission)}
                        disabled={cvLoadingId === submission.id}
                        className="gap-2"
                      >
                        {cvLoadingId === submission.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        Ver currículum (enlace válido 5 min)
                      </Button>
                    </div>
                  )}

                  {/* Reply section */}
                  <div className="mb-4 p-4 rounded-xl border border-border/50 bg-card">
                    <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      Responder a {submission.name}
                    </p>
                    <Textarea
                      placeholder="Escribe tu respuesta..."
                      value={replyTexts[submission.id] || ""}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [submission.id]: e.target.value,
                        }))
                      }
                      rows={3}
                      className="mb-3 resize-none"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReply(submission)}
                      disabled={sendingReply === submission.id || !replyTexts[submission.id]?.trim()}
                      className="gap-2"
                    >
                      {sendingReply === submission.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar respuesta
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString('es-AR', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(submission.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContactos;
