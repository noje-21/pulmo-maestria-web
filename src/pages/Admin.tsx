import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
    } else {
      toast.error("No tienes permisos de administrador");
      navigate("/");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Panel de Administración</h1>
          <Button onClick={handleLogout} variant="outline">Cerrar Sesión</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Envíos de Contacto</h2>
            <p className="text-muted-foreground mb-4">Ver y gestionar formularios de contacto</p>
            <Button className="w-full" onClick={() => navigate("/admin/contactos")}>
              Ver Envíos
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Contenido del Sitio</h2>
            <p className="text-muted-foreground mb-4">Editar textos e imágenes</p>
            <Button className="w-full">Editar Contenido</Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Documentos</h2>
            <p className="text-muted-foreground mb-4">Subir nuevos PDFs y recursos</p>
            <Button className="w-full">Gestionar Archivos</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
