import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      } else {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert([{ 
            user_id: session.user.id, 
            full_name: session.user.user_metadata?.full_name || "Usuario" 
          }])
          .select()
          .single();
        
        if (newProfile) setProfile(newProfile);
      }
    } catch (error) {
      toast.error("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Mi Perfil</h1>
          <Button onClick={handleLogout} variant="outline">Cerrar Sesión</Button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="text-lg font-semibold">{profile?.full_name || "Sin nombre"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correo Electrónico</p>
              <p className="text-lg font-semibold">{profile?.user_id ? "Verificado" : "Sin verificar"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
