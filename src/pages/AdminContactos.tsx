import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { Trash2, Mail, MapPin, Briefcase, User, Send, Loader2 } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  country: string;
  specialty: string;
  message: string;
  created_at: string;
}

const AdminContactos = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Reply error:', error);
      toast.error("Error al enviar la respuesta");
    } finally {
      setSendingReply(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Envíos de Contacto" subtitle="Cargando...">
        <TableSkeleton rows={5} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Envíos de Contacto" 
      subtitle="Gestiona las consultas e inscripciones recibidas"
    >
      {submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-card border-border/50">
            <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay envíos aún</p>
              <p className="text-sm mt-1">Las consultas aparecerán aquí</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                <CardContent className="p-4 md:p-6">
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
