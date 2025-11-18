import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, Trash2, Mail, MapPin, Briefcase } from "lucide-react";

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
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: isAdminData } = await supabase.rpc('is_admin', { 
        check_user_id: session.user.id 
      });

      if (isAdminData) {
        await loadSubmissions();
      } else {
        toast.error("No tienes permisos de administrador");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar envíos");
    } else {
      setSubmissions(data || []);
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

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <TableSkeleton rows={8} />
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary pv-appear">Envíos de Contacto</h1>
              <p className="text-muted-foreground mt-2">Gestiona las consultas recibidas</p>
            </div>
            <Button onClick={() => navigate("/admin")} variant="outline" className="pv-tap-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
          </div>

          {submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="pv-glass pv-glow">
                <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay envíos aún</p>
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
                  whileHover={{ y: -2 }}
                >
                  <Card className="border-accent/20 pv-glass pv-glow hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="font-semibold">{submission.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-semibold">{submission.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">País</p>
                            <p className="font-semibold">{submission.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Especialidad</p>
                            <p className="font-semibold">{submission.specialty}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 p-4 rounded-xl bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Mensaje</p>
                        <p className="text-foreground">{submission.message}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.created_at).toLocaleString('es-AR')}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(submission.id)}
                          className="pv-tap-scale"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContactos;
