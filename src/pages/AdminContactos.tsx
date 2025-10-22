import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Envíos de Contacto</h1>
          <Button onClick={() => navigate("/admin")} variant="outline">
            Volver al Panel
          </Button>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No hay envíos aún
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="border-accent/20">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{submission.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{submission.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">País</p>
                      <p className="font-medium">{submission.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Especialidad</p>
                      <p className="font-medium">{submission.specialty}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Mensaje</p>
                    <p className="mt-1">{submission.message}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString('es-ES')}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(submission.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactos;
