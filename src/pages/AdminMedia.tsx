import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import { CardSkeleton } from "@/components/LoadingSkeleton";
import { ArrowLeft, FileText, Image, Video, File } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminMedia = () => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndLoadFiles();
  }, []);

  const checkAdminAndLoadFiles = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: isAdminData } = await supabase.rpc('is_admin', { 
        check_user_id: session.user.id 
      });

      if (!isAdminData) {
        toast.error("No tienes permisos de administrador");
        navigate("/");
        return;
      }

      await loadFiles();
    } catch (error) {
      toast.error("Error al verificar permisos");
      navigate("/");
    }
  };

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("media_files")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast.error("Error al cargar archivos");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (fileType.startsWith("video/")) return <Video className="w-6 h-6" />;
    if (fileType.includes("pdf")) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <CardSkeleton />
            <CardSkeleton />
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/admin")} className="pv-tap-scale">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Gestión de Archivos</h1>
              <p className="text-muted-foreground mt-1">Administra imágenes, videos, PDFs y documentos</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 modern-card pv-glass pv-glow hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {getFileIcon(file.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{file.filename}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{formatFileSize(file.file_size)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(file.created_at), "dd MMM yyyy", { locale: es })}
                      </p>
                      {file.section && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary inline-block mt-2">
                          {file.section}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {files.length === 0 && (
              <Card className="col-span-full p-12 text-center modern-card pv-glass">
                <File className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hay archivos</h3>
                <p className="text-muted-foreground">
                  Los archivos subidos aparecerán aquí
                </p>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMedia;
