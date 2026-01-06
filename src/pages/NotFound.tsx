import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";
import Navigation from "@/components/common/Navigation";
import { useEffect } from "react";
import { SEO } from "@/components/common/SEO";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <SEO 
        title="Página no encontrada - Maestría en Circulación Pulmonar"
        description="La página que buscas no existe o ha sido movida."
      />
      <Navigation />
      
      <main className="flex min-h-[80vh] items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* Decorative Element */}
          <div className="relative mb-8 mx-auto w-fit">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="relative">
              <span className="text-[120px] sm:text-[160px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-light to-accent leading-none">
                404
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            ¡Ups! Esta página no existe
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
            Parece que te perdiste en el camino. No te preocupes, 
            te ayudamos a volver al lugar correcto.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="gap-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver atrás
            </Button>
            
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="btn-accent gap-2 rounded-xl"
            >
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Buscabas alguna de estas secciones?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/foro")}
                className="text-primary hover:text-primary-dark"
              >
                Foro
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/novedades")}
                className="text-primary hover:text-primary-dark"
              >
                Novedades
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/#contacto")}
                className="text-primary hover:text-primary-dark"
              >
                Contacto
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;