import { z } from "zod";

export const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const ALLOWED_CV_EXTS = [".pdf", ".doc", ".docx"];

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export const COMMON_DOMAIN_TYPOS: Record<string, string> = {
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

export const detectEmailTypo = (email: string): string | null => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return COMMON_DOMAIN_TYPOS[domain]
    ? `¿Quisiste decir ${email.split("@")[0]}@${COMMON_DOMAIN_TYPOS[domain]}?`
    : null;
};

/** Permissive international phone check: optional +, 7–15 digits, common separators. */
export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export const contactSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido").max(100),
    email: z.string().email("Email inválido").max(255),
    confirmEmail: z.string().email("Confirma tu email").max(255),
    country: z.string().min(1, "El país es requerido").max(100),
    specialty: z.string().min(1, "La especialidad es requerida").max(100),
    medicalCenter: z
      .string()
      .min(2, "Ingresa el centro médico donde trabajas")
      .max(200, "El nombre del centro médico es demasiado largo (máx. 200 caracteres)"),
    phone: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .max(30, "El número de teléfono es demasiado largo")
      .refine(isValidPhone, "Número inválido. Usa solo números, espacios, guiones o paréntesis e incluye el código de país (ej: +54 9 11 1234-5678)."),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Los emails no coinciden",
    path: ["confirmEmail"],
  });

export type ContactFormData = {
  name: string;
  email: string;
  confirmEmail: string;
  country: string;
  specialty: string;
  medicalCenter: string;
  phone: string;
  message: string;
};

export interface CvFileValidationResult {
  ok: boolean;
  error?: string;
}

export function validateCvFile(file: File): CvFileValidationResult {
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  const typeOk = ALLOWED_CV_TYPES.includes(file.type) || ALLOWED_CV_EXTS.includes(ext);
  if (!typeOk) {
    return {
      ok: false,
      error: `Formato no permitido (${ext || "desconocido"}). Sube tu currículum en PDF o Word: .pdf, .doc o .docx.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, error: "El archivo está vacío (0 KB). Selecciona un currículum válido." };
  }
  if (file.size > MAX_CV_SIZE) {
    return {
      ok: false,
      error: `El archivo pesa ${formatBytes(file.size)} y supera el límite de 5 MB. Comprímelo o exporta como PDF más liviano.`,
    };
  }
  return { ok: true };
}