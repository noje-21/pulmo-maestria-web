import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido").max(255),
  country: z.string().min(1, "El país es requerido").max(100),
  specialty: z.string().min(1, "La especialidad es requerida").max(100),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000)
});

export const Contacto = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    specialty: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Trim values before validation
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        specialty: formData.specialty.trim(),
        message: formData.message.trim()
      };
      
      const validated = contactSchema.parse(trimmedData);
      const { error } = await supabase.from("contact_submissions").insert([{
        name: validated.name,
        email: validated.email,
        country: validated.country,
        specialty: validated.specialty,
        message: validated.message
      }]);
      if (error) throw error;

      toast.success("¡Mensaje enviado con éxito!");
      setFormData({ name: "", email: "", country: "", specialty: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Hubo un error al enviar el mensaje. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔗 Función para redirigir directamente fuera del sitio
  const redirectTo = (url: string) => {
    window.location.href = url;
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">Contacto</h2>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          ¿Tienes preguntas? Contáctanos
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold text-primary mb-6">Información de Contacto</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("mailto:magisterenhipertensionpulmonar@gmail.com")}>
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-accent hover:underline">magisterenhipertensionpulmonar@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("https://wa.me/573004142568")}>
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-medium text-foreground">WhatsApp</p>
                      <p className="text-accent hover:underline">+57 300 414 2568</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("https://www.linkedin.com/in/hipertension-pulmonar-655a43253")}>
                    <span className="text-2xl">🔗</span>
                    <div>
                      <p className="font-medium text-foreground">LinkedIn</p>
                      <p className="text-accent hover:underline">linkedin.com/in/hipertension-pulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("https://www.facebook.com/share/16s5MUKG3C/?mibextid=wwXIfr")}>
                    <span className="text-2xl">📘</span>
                    <div>
                      <p className="font-medium text-foreground">Facebook</p>
                      <p className="text-accent hover:underline">facebook.com/hipertensionpulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("https://instagram.com/magisterenhipertensionpulmonar")}>
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="font-medium text-foreground">Instagram</p>
                      <p className="text-accent hover:underline">@magisterenhipertensionpulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => redirectTo("https://www.maestriacp.com/")}>
                    <span className="text-2xl">🌐</span>
                    <div>
                      <p className="font-medium text-foreground">Sitio Web</p>
                      <p className="text-accent hover:underline">www.maestriacp.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de contacto */}
          <div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre completo" required />
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" required />
                  <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Tu país" required />
                  <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Ej: Cardiología" required />
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Escribe tu mensaje aquí..." rows={4} required />
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
