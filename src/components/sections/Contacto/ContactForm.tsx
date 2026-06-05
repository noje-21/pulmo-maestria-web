import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CVUploader } from "./CVUploader";
import type { ContactFormApi } from "./useContactForm";

/** Presentational contact form. Wires inputs to the shared `useContactForm` hook. */
export function ContactForm({ api }: { api: ContactFormApi }) {
  const {
    formData,
    loading,
    successMsg,
    setSuccessMsg,
    emailSuggestion,
    emailMismatch,
    uploading,
    uploadProgress,
    handleChange,
    handleSubmit,
    acceptSuggestion,
  } = api;

  return (
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

          <CVUploader api={api} />

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
  );
}