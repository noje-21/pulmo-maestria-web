import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  generateTitle?: boolean;
  onTitleGenerated?: (title: string) => void;
}

const ImageUpload = ({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved,
  generateTitle = false,
  onTitleGenerated
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG, WEBP o GIF");
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5242880) {
      toast.error("El archivo es demasiado grande. Tamaño máximo: 5MB");
      return;
    }

    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Debes iniciar sesión para subir imágenes");
        return;
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      // Subir a storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('forum-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('forum-images')
        .getPublicUrl(fileName);

      toast.success("Imagen subida exitosamente");
      onImageUploaded(publicUrl);

      // Generar título automático si está habilitado
      if (generateTitle && onTitleGenerated) {
        await generateImageTitle(file);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir imagen: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateImageTitle = async (imageFile: File) => {
    if (!onTitleGenerated) return;
    
    setGeneratingTitle(true);
    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Llamar a edge function para generar título
        const { data, error } = await supabase.functions.invoke('generate-cardiology-title', {
          body: { image: base64Image }
        });

        if (error) throw error;

        if (data?.title) {
          toast.success("Título generado automáticamente");
          onTitleGenerated(data.title);
        }
      };
    } catch (error: any) {
      console.error("Error generating title:", error);
      // No mostrar error si falla la generación de título, es opcional
    } finally {
      setGeneratingTitle(false);
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
      toast.success("Imagen eliminada");
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

          <AnimatePresence mode="wait">
            {currentImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-xl overflow-hidden border-2 border-border group"
              >
                <img
                  src={currentImage}
                  alt="Preview"
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    size="sm"
                    disabled={uploading}
                    className="pv-tap-scale"
                  >
                    <Upload className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Cambiar</span>
                  </Button>
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    size="sm"
                    className="pv-tap-scale"
                  >
                    <X className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-32 border-dashed border-2 modern-btn pv-tap-scale"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Subiendo...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 sm:w-8 h-6 sm:h-8" />
                      <span className="font-semibold text-sm sm:text-base">Subir Imagen</span>
                      <span className="text-xs text-muted-foreground px-2">
                        JPEG, PNG, WEBP o GIF (Max 5MB)
                      </span>
                    </div>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

      {generatingTitle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generando título cardiológico automático...</span>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;