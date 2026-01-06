import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navigation from "@/components/common/Navigation";
import { MessageSquare, FileText } from "lucide-react";

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
      toast.error("No pudimos cargar tu perfil. Intenta refrescar la página.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Preparando tu perfil...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Mi Perfil</h1>
                <p className="text-muted-foreground">Aquí puedes ver y gestionar tu información</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="pv-tap-scale w-full sm:w-auto">
                Cerrar Sesión
              </Button>
            </div>

            <div className="grid gap-6">
              <Card className="p-6 md:p-8 modern-card pv-glass pv-glow">
                <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
                    <p className="text-lg font-semibold">{profile?.full_name || "Aún no has agregado tu nombre"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estado de Cuenta</p>
                    <p className="text-lg font-semibold text-green-600">Activa</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 md:p-8 modern-card pv-glass pv-glow">
                <h2 className="text-2xl font-bold mb-6">Acceso Rápido</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => navigate("/foro")}
                    variant="outline"
                    className="modern-btn pv-tap-scale h-auto py-4 justify-start"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Foro Comunitario</div>
                        <div className="text-xs text-muted-foreground">Comparte ideas con colegas</div>
                      </div>
                  </Button>
                  <Button
                    onClick={() => navigate("/novedades")}
                    variant="outline"
                    className="modern-btn pv-tap-scale h-auto py-4 justify-start"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Novedades</div>
                        <div className="text-xs text-muted-foreground">Mantente al día con lo último</div>
                      </div>
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
