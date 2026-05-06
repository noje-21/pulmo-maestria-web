import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2, Eye, Image as ImageIcon, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Responsive breakpoints for auto-generated variants ── */
const RESPONSIVE_WIDTHS = [480, 768, 1200, 1920] as const;
const COMPRESSION_QUALITY = 0.82; // WebP output quality
const MAX_DIMENSION = 2400; // cap ultra-large originals

interface ImageMeta {
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  ratio: string;
  type: string;
}

interface SiteImageUploadProps {
  label: string;
  currentUrl?: string;
  onUrlChange: (url: string) => void;
  folder?: string;
}

/* ── Helpers ── */

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const aspectLabel = (w: number, h: number): string => {
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
};

/** Resize + compress an image via OffscreenCanvas / Canvas to WebP */
const compressImage = (
  file: File,
  maxWidth: number,
  quality: number
): Promise<{ blob: Blob; width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve({ blob, width, height });
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });

/* ── Component ── */

export const SiteImageUpload = ({
  label,
  currentUrl,
  onUrlChange,
  folder = "general",
}: SiteImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const [variants, setVariants] = useState<{ width: number; size: number }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearPreview = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setMeta(null);
    setVariants([]);
  }, [preview]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Solo se permiten imágenes JPEG, PNG, WEBP o GIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Tamaño máximo: 10 MB");
      return;
    }

    // Show local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      // 1. Compress main image
      const main = await compressImage(file, MAX_DIMENSION, COMPRESSION_QUALITY);

      // Set metadata for UI
      setMeta({
        width: main.width,
        height: main.height,
        originalSize: file.size,
        optimizedSize: main.blob.size,
        ratio: aspectLabel(main.width, main.height),
        type: "image/webp",
      });

      const ts = Date.now();

      // 2. Upload main image
      const mainPath = `${folder}/${ts}.webp`;
      const { error: mainErr } = await supabase.storage
        .from("site-images")
        .upload(mainPath, main.blob, { contentType: "image/webp", upsert: true });
      if (mainErr) throw mainErr;

      // 3. Generate & upload responsive variants in parallel
      const applicableWidths = RESPONSIVE_WIDTHS.filter((w) => w < main.width);
      const variantResults: { width: number; size: number }[] = [];

      await Promise.all(
        applicableWidths.map(async (targetW) => {
          try {
            const v = await compressImage(file, targetW, COMPRESSION_QUALITY);
            const vPath = `${folder}/${ts}_w${targetW}.webp`;
            await supabase.storage
              .from("site-images")
              .upload(vPath, v.blob, { contentType: "image/webp", upsert: true });
            variantResults.push({ width: targetW, size: v.blob.size });
          } catch {
            // Non-critical: variant failed, skip
          }
        })
      );

      setVariants(variantResults.sort((a, b) => a.width - b.width));

      // 4. Get public URL of main image
      const {
        data: { publicUrl },
      } = supabase.storage.from("site-images").getPublicUrl(mainPath);

      onUrlChange(publicUrl);
      URL.revokeObjectURL(localUrl);
      setPreview(null);

      const saved = file.size - main.blob.size;
      const pct = Math.round((saved / file.size) * 100);
      toast.success(
        `Imagen optimizada: ${formatBytes(main.blob.size)} (${pct > 0 ? `-${pct}%` : "sin cambios"}) + ${variantResults.length} variantes responsivas`
      );
    } catch (err: any) {
      toast.error("Error al subir: " + err.message);
      URL.revokeObjectURL(localUrl);
      setPreview(null);
      setMeta(null);
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

            {/* Status badges */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
              {preview && (
                <span className="px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-md flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {uploading ? "Optimizando…" : "Sin guardar"}
                </span>
              )}
              {meta && !preview && (
                <span className="px-2 py-1 bg-green-600/90 text-white text-xs rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Optimizada
                </span>
              )}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="ml-1 hidden sm:inline">Cambiar</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => {
                  clearPreview();
                  onUrlChange("");
                }}
              >
                <X className="w-4 h-4" />
                <span className="ml-1 hidden sm:inline">Quitar</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
                  Optimizando y subiendo…
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Subir imagen</span>
                  <span className="text-xs text-muted-foreground">
                    JPEG, PNG, WEBP o GIF · Auto-optimización WebP
                  </span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image metadata panel ── */}
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-muted/60 border border-border p-3 text-xs space-y-2"
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              {meta.width}×{meta.height}px
            </span>
            <span>Ratio {meta.ratio}</span>
            <span>WebP</span>
          </div>

          {/* Size comparison */}
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="text-muted-foreground">
              Original: <strong className="text-foreground">{formatBytes(meta.originalSize)}</strong>
              {" → "}
              Optimizada: <strong className="text-green-600">{formatBytes(meta.optimizedSize)}</strong>
              {meta.originalSize > meta.optimizedSize && (
                <span className="ml-1 text-green-600 font-semibold">
                  ({Math.round(((meta.originalSize - meta.optimizedSize) / meta.originalSize) * 100)}% menos)
                </span>
              )}
            </span>
          </div>

          {/* Responsive variants */}
          {variants.length > 0 && (
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium">Variantes responsivas generadas:</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <span
                    key={v.width}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-medium"
                  >
                    {v.width}px · {formatBytes(v.size)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};