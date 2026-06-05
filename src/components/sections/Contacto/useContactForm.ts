import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { uploadFileWithProgress } from "@/lib/uploadCv";
import {
  contactSchema,
  detectEmailTypo,
  validateCvFile,
  type ContactFormData,
} from "./validation";

const EMPTY: ContactFormData = {
  name: "",
  email: "",
  confirmEmail: "",
  country: "",
  specialty: "",
  message: "",
};

/**
 * Owns all state and side-effects for the contact form: field changes, real
 * time email validation, CV upload (progress + retry) and the final submit
 * pipeline (anti-spam edge function + success state).
 */
export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(EMPTY);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const uploadCvFile = async (file: File, name: string): Promise<string | null> => {
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const safeName = (name || "cv").replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 40) || "cv";
      const path = `${Date.now()}-${safeName}.${ext}`;
      const url = await uploadFileWithProgress({
        bucket: "cvs",
        path,
        file,
        onProgress: (pct) => setUploadProgress(pct),
        maxRetries: 2,
      });
      setUploadedUrl(url);
      return url;
    } catch (err) {
      const msg =
        err instanceof Error && /network|timed out/i.test(err.message)
          ? "Falló la conexión al subir el archivo. Revisa tu internet e intenta de nuevo."
          : "No pudimos subir tu currículum. Intenta nuevamente.";
      setUploadError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const retryUpload = () => {
    if (cvFile) void uploadCvFile(cvFile, formData.name.trim());
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCvError(null);
    setUploadError(null);
    setUploadedUrl(null);
    setUploadProgress(0);
    if (!file) {
      setCvFile(null);
      return;
    }
    const result = validateCvFile(file);
    if (!result.ok) {
      setCvError(result.error ?? "Archivo inválido.");
      e.target.value = "";
      return;
    }
    setCvFile(file);
    // Start upload immediately so the user sees progress in real time
    void uploadCvFile(file, formData.name.trim());
  };

  const clearCv = () => {
    setCvFile(null);
    setCvError(null);
    setUploadError(null);
    setUploadedUrl(null);
    setUploadProgress(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Check for domain typos on email field
      if (name === "email") {
        setEmailSuggestion(detectEmailTypo(value));
      }

      // Check email mismatch
      if (name === "email" || name === "confirmEmail") {
        const email = name === "email" ? value.trim().toLowerCase() : prev.email.trim().toLowerCase();
        const confirm =
          name === "confirmEmail" ? value.trim().toLowerCase() : prev.confirmEmail.trim().toLowerCase();
        setEmailMismatch(confirm.length > 0 && email !== confirm);
      }

      return updated;
    });
  };

  const acceptSuggestion = () => {
    if (!emailSuggestion) return;
    const suggested =
      emailSuggestion.match(/(.+@.+)\?$/)?.[1]?.replace("¿Quisiste decir ", "") || "";
    if (suggested) {
      setFormData((prev) => ({ ...prev, email: suggested }));
      setEmailSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setLoading(true);
    try {
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        confirmEmail: formData.confirmEmail.trim().toLowerCase(),
        country: formData.country.trim(),
        specialty: formData.specialty.trim(),
        message: formData.message.trim(),
      };
      const validated = contactSchema.parse(trimmedData);

      // Upload CV if provided (with progress + retries). Stores the *path* only.
      let cvPath: string | null = uploadedUrl;
      if (cvFile && !cvPath) {
        cvPath = await uploadCvFile(cvFile, validated.name);
        if (!cvPath) {
          setLoading(false);
          return; // upload failed; user can retry from the UI
        }
      }

      // Go through the edge function: anti-spam + rate-limit + insert + email.
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: respData, error: fnError } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: validated.name,
          email: validated.email,
          country: validated.country,
          specialty: validated.specialty,
          message: validated.message,
          cvPath,
        },
      });
      if (fnError) {
        const msg = (respData as { error?: string } | null)?.error;
        if (typeof fnError.message === "string" && /429|demasiados/i.test(fnError.message)) {
          toast.error("Has enviado demasiados mensajes. Intenta nuevamente en una hora.");
        } else {
          toast.error(msg || "No pudimos enviar tu mensaje. Intenta de nuevo.");
        }
        setLoading(false);
        return;
      }
      if (respData && (respData as { error?: string }).error) {
        toast.error((respData as { error: string }).error);
        setLoading(false);
        return;
      }

      setSuccessMsg(true);
      setFormData(EMPTY);
      setEmailSuggestion(null);
      setEmailMismatch(false);
      clearCv();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("No pudimos enviar tu mensaje. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    // form state
    formData,
    loading,
    successMsg,
    setSuccessMsg,
    emailSuggestion,
    emailMismatch,
    // cv state
    cvFile,
    cvError,
    uploading,
    uploadProgress,
    uploadError,
    uploadedUrl,
    // handlers
    handleChange,
    handleSubmit,
    handleCvChange,
    retryUpload,
    clearCv,
    acceptSuggestion,
  };
}

export type ContactFormApi = ReturnType<typeof useContactForm>;