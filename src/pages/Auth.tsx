import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, GraduationCap } from "lucide-react";
import logoMaestria from "@/assets/logo-maestria.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/admin");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (data.user) {
        const { data: isAdminData } = await supabase.rpc('is_admin', { 
          check_user_id: data.user.id 
        });
        
        if (isAdminData) {
          toast.success("¡Bienvenido Admin!");
          navigate("/admin");
        } else {
          toast.success("¡Inicio de sesión exitoso!");
          navigate("/foro");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="card-base backdrop-blur-xl bg-card/95 shadow-2xl border-border/50">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-30" />
                <img
                  src={logoMaestria}
                  alt="Maestría en Circulación Pulmonar"
                  className="relative w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white/20"
                />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Bienvenido
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Accede a la plataforma de la Maestría
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="pl-11 h-12 text-base rounded-xl border-border bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-11 h-12 text-base rounded-xl border-border bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-xl btn-accent gap-2 shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
