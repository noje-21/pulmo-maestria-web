import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { X, Mail, Phone, Linkedin, Facebook, Instagram, Globe, Send, CheckCircle, AlertTriangle, Upload, FileText, RefreshCw, CheckCircle2 } from "lucide-react";
import { uploadFileWithProgress } from "@/lib/uploadCv";

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_CV_EXTS = [".pdf", ".doc", ".docx"];

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.om": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
};

const detectEmailTypo = (email: string): string | null => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return COMMON_DOMAIN_TYPOS[domain]
    ? `¿Quisiste decir ${email.split("@")[0]}@${COMMON_DOMAIN_TYPOS[domain]}?`
    : null;
};

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido").max(255),
  confirmEmail: z.string().email("Confirma tu email").max(255),
  country: z.string().min(1, "El país es requerido").max(100),
  specialty: z.string().min(1, "La especialidad es requerida").max(100),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Los emails no coinciden",
  path: ["confirmEmail"],
});

interface ContactItem {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
}

const contactInfo: ContactItem[] = [
  {
    icon: Phone,
    label: "WhatsApp CRF",
    value: "+54 9 11 5906-4234",
    href: "https://wa.me/5491159064234",
    highlight: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "magisterenhipertensionpulmonar@gmail.com",
    href: "mailto:magisterenhipertensionpulmonar@gmail.com",
  },
  { icon: Phone, label: "WhatsApp", value: "+57 300 414 2568", href: "https://wa.me/573004142568" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Hipertensión Pulmonar",
    href: "https://www.linkedin.com/in/hipertension-pulmonar-655a43253",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "Hipertensión Pulmonar",
    href: "https://www.facebook.com/share/16s5MUKG3C/?mibextid=wwXIfr",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@magisterenhipertensionpulmonar",
    href: "https://instagram.com/magisterenhipertensionpulmonar",
  },
  { icon: Globe, label: "Campus Virtual", value: "campus.maestriacp.com", href: "https://campus.maestriacp.com/" },
];

export const Contacto = () => {
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    country: "",
    specialty: "",
    message: "",
  });

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

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
      const { data: respData, error: fnError } = await supabase.functions.invoke('submit-contact', {
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
        if (typeof fnError.message === 'string' && /429|demasiados/i.test(fnError.message)) {
          toast.error('Has enviado demasiados mensajes. Intenta nuevamente en una hora.');
        } else {
          toast.error(msg || 'No pudimos enviar tu mensaje. Intenta de nuevo.');
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
      setFormData({ name: "", email: "", confirmEmail: "", country: "", specialty: "", message: "" });
      setEmailSuggestion(null);
      setEmailMismatch(false);
      setCvFile(null);
      setCvError(null);
      setUploadedUrl(null);
      setUploadProgress(0);
      setUploadError(null);
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
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    const typeOk = ALLOWED_CV_TYPES.includes(file.type) || ALLOWED_CV_EXTS.includes(ext);
    if (!typeOk) {
      setCvError(
        `Formato no permitido (${ext || "desconocido"}). Sube tu currículum en PDF o Word: .pdf, .doc o .docx.`,
      );
      e.target.value = "";
      return;
    }
    if (file.size === 0) {
      setCvError("El archivo está vacío (0 KB). Selecciona un currículum válido.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_CV_SIZE) {
      setCvError(
        `El archivo pesa ${formatBytes(file.size)} y supera el límite de 5 MB. Comprímelo o exporta como PDF más liviano.`,
      );
      e.target.value = "";
      return;
    }
    setCvFile(file);
    // Start upload immediately so the user sees progress in real time
    void uploadCvFile(file, formData.name.trim());
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
        const confirm = name === "confirmEmail" ? value.trim().toLowerCase() : prev.confirmEmail.trim().toLowerCase();
        setEmailMismatch(confirm.length > 0 && email !== confirm);
      }
      
      return updated;
    });
  };

  const acceptSuggestion = () => {
    if (!emailSuggestion) return;
    const suggested = emailSuggestion.match(/(.+@.+)\?$/)?.[1]?.replace("¿Quisiste decir ", "") || "";
    if (suggested) {
      setFormData((prev) => ({ ...prev, email: suggested }));
      setEmailSuggestion(null);
    }
  };

  return (
    <section
      id="contacto"
      className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h2 className="section-title">Contáctanos</h2>
          <div className="section-divider" />
          <p className="section-subtitle">¿Tienes dudas? Escríbenos y te respondemos personalmente</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-base bg-card">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl flex-shrink-0">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Inscríbete sin costo</h3>
                </div>

                {/* Success Message */}
                <div aria-live="polite" className="min-h-[1rem] mb-4">
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base">
                          ¡Recibimos tu mensaje! Te contactaremos pronto.
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label="Cerrar mensaje"
                        onClick={() => setSuccessMsg(false)}
                        className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors self-end sm:self-auto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      required
                      aria-label="Nombre completo"
                      autoComplete="name"
                      className="input-modern"
                    />
                    <div>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        aria-label="Correo electrónico"
                        aria-invalid={!!emailSuggestion || undefined}
                        aria-describedby={emailSuggestion ? "email-suggestion" : undefined}
                        autoComplete="email"
                        className={`input-modern ${emailSuggestion ? "border-yellow-500 focus-visible:ring-yellow-500" : ""}`}
                      />
                      {emailSuggestion && (
                        <button
                          type="button"
                          onClick={acceptSuggestion}
                          id="email-suggestion"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400 hover:underline"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {emailSuggestion}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      name="confirmEmail"
                      type="email"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      placeholder="Confirma tu email"
                      required
                      aria-label="Confirmar correo electrónico"
                      aria-invalid={emailMismatch || undefined}
                      aria-describedby={emailMismatch ? "email-mismatch" : undefined}
                      autoComplete="email"
                      className={`input-modern ${emailMismatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {emailMismatch && (
                      <p id="email-mismatch" role="alert" className="mt-1.5 text-xs text-destructive flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" />
                        Los emails no coinciden
                      </p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="País"
                      required
                      aria-label="País"
                      autoComplete="country-name"
                      className="input-modern"
                    />
                    <Input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="Especialidad (Ej: Cardiología)"
                      required
                      aria-label="Especialidad médica"
                      className="input-modern"
                    />
                  </div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos qué te gustaría saber..."
                    rows={4}
                    required
                    aria-label="Mensaje"
                    className="input-modern resize-none"
                  />

                  {/* CV Upload */}
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
                          onClick={() => {
                            setCvFile(null);
                            setCvError(null);
                            setUploadError(null);
                            setUploadedUrl(null);
                            setUploadProgress(0);
                          }}
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

                  <Button
                    type="submit"
                    className="w-full btn-accent py-6 text-base font-semibold"
                    disabled={loading || uploading}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Subiendo currículum… {uploadProgress}%
                      </span>
                    ) : loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando tu mensaje...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Quiero más información
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-base h-full bg-card">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Información de Contacto</h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-muted/50 transition-all duration-300 group ${
                        item.highlight ? "bg-accent/5 border border-accent/20" : ""
                      }`}
                    >
                      <div
                        className={`p-2 sm:p-2.5 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 ${
                          item.highlight
                            ? "bg-accent/20 group-hover:bg-accent/30"
                            : "bg-accent/10 group-hover:bg-accent/20"
                        }`}
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="font-semibold text-foreground text-xs sm:text-sm">
                          {item.label}
                          {item.highlight && (
                            <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
                              Recomendado
                            </span>
                          )}
                        </p>
                        <p className="text-accent text-xs sm:text-sm truncate group-hover:text-accent/80 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
