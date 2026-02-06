import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { X, Mail, Phone, Linkedin, Facebook, Instagram, Globe, Send, CheckCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido").max(255),
  country: z.string().min(1, "El país es requerido").max(100),
  specialty: z.string().min(1, "La especialidad es requerida").max(100),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    setLoading(true);
    try {
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        specialty: formData.specialty.trim(),
        message: formData.message.trim(),
      };
      const validated = contactSchema.parse(trimmedData);
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: validated.name,
          email: validated.email,
          country: validated.country,
          specialty: validated.specialty,
          message: validated.message,
        },
      ]);
      if (error) throw error;

      setSuccessMsg(true);
      setFormData({ name: "", email: "", country: "", specialty: "", message: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
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

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
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
                      className="input-modern"
                    />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="input-modern"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="País"
                      required
                      className="input-modern"
                    />
                    <Input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="Especialidad (Ej: Cardiología)"
                      required
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
                    className="input-modern resize-none"
                  />
                  <Button type="submit" className="w-full btn-accent py-6 text-base font-semibold" disabled={loading}>
                    {loading ? (
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
        </div>
      </div>
    </section>
  );
};
