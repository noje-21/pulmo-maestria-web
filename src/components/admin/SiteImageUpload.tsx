import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteImageUploadProps {
  label: string;
  currentUrl?: string;
  onUrlChange: (url: string) => void;
  folder?: string;
}

export const SiteImageUpload = ({ label, currentUrl, onUrlChange, folder = "general" }: SiteImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Solo se permiten imágenes JPEG, PNG, WEBP o GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Tamaño máximo: 5 MB");
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(path);

      onUrlChange(publicUrl);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
      toast.success("Imagen subida correctamente");
    } catch (err: any) {
      toast.error("Error al subir: " + err.message);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {displayUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden border-2 border-border group"
          >
            <img
              src={displayUrl}
              alt={`Preview: ${label}`}
              className="w-full h-40 object-cover"
            />
            {preview && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Sin guardar
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span className="ml-1 hidden sm:inline">Cambiar</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => { onUrlChange(""); setPreview(null); }}
              >
                <X className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Quitar</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-28 border-dashed border-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subiendo...
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Subir imagen</span>
                  <span className="text-xs text-muted-foreground">JPEG, PNG, WEBP (Max 5MB)</span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};