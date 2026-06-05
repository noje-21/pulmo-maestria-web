import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { formatBytes } from "./validation";
import type { ContactFormApi } from "./useContactForm";

/**
 * File picker + progress bar + retry UI for the CV attachment. Pure
 * presentation — all logic lives in `useContactForm`.
 */
export function CVUploader({ api }: { api: ContactFormApi }) {
  const {
    cvFile,
    cvError,
    uploading,
    uploadProgress,
    uploadError,
    uploadedUrl,
    handleCvChange,
    retryUpload,
    clearCv,
  } = api;

  return (
    <div>
      <div
        className={`relative flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border-2 border-dashed transition-colors ${
          cvError || uploadError
            ? "border-destructive/60 bg-destructive/5"
            : uploadedUrl
              ? "border-green-500/60 bg-green-500/5"
              : "border-input hover:border-accent hover:bg-accent/5"
        } ${uploading ? "cursor-wait opacity-90" : ""}`}
      >
        <label
          htmlFor="cv-upload"
          className={`flex items-center gap-3 min-w-0 flex-1 ${uploading ? "cursor-wait" : "cursor-pointer"}`}
        >
          <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
            {uploadedUrl ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            ) : cvFile ? (
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            ) : (
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {cvFile ? cvFile.name : "Adjunta tu Currículum (opcional)"}
            </p>
            <p className="text-xs text-muted-foreground">
              {cvFile
                ? uploading
                  ? `Subiendo… ${uploadProgress}%`
                  : uploadedUrl
                    ? `${formatBytes(cvFile.size)} · Listo para enviar`
                    : `${formatBytes(cvFile.size)} · Click para cambiar`
                : "PDF o Word (.pdf, .doc, .docx) · Máx 5 MB"}
            </p>
          </div>
        </label>
        {cvFile && !uploading && (
          <button
            type="button"
            onClick={clearCv}
            aria-label="Quitar archivo"
            className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        id="cv-upload"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleCvChange}
        disabled={uploading}
        className="sr-only"
      />
      {uploading && (
        <div className="mt-2" aria-live="polite">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={uploadProgress}
            aria-label="Progreso de subida del currículum"
            className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      {cvError && (
        <p role="alert" className="mt-1.5 text-xs text-destructive flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          {cvError}
        </p>
      )}
      {uploadError && !cvError && (
        <div role="alert" className="mt-1.5 flex items-center justify-between gap-2 text-xs text-destructive">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {uploadError}
          </span>
          <button
            type="button"
            onClick={retryUpload}
            className="flex items-center gap-1 font-medium text-accent hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}