import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminLayout from "@/features/admin/AdminLayout";
import { CardSkeleton } from "@/components/common/LoadingSkeleton";
import { FileText, Image, Video, File } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AdminMedia = () => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("media_files")
        .select(`
          *,
          profiles!media_files_uploaded_by_fkey(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error("Error loading files:", error);
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
      <AdminLayout title="Gestión de Archivos" subtitle="Cargando...">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Gestión de Archivos" 
      subtitle="Administra imágenes, videos, PDFs y documentos"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 md:p-5 bg-card border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
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
          <Card className="col-span-full p-12 text-center bg-card border-border/50">
            <File className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay archivos</h3>
            <p className="text-muted-foreground">
              Los archivos subidos aparecerán aquí
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
