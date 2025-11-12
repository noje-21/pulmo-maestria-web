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
    <section id="contacto" className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Contáctanos
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          ¿Tienes preguntas? Estamos aquí para ayudarte
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Card className="border-accent/20 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="text-3xl">📞</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Información de Contacto</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("mailto:magisterenhipertensionpulmonar@gmail.com")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">Email</p>
                      <p className="text-accent hover:underline text-sm">magisterenhipertensionpulmonar@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("https://wa.me/573004142568")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">WhatsApp</p>
                      <p className="text-accent hover:underline text-sm">+57 300 414 2568</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("https://www.linkedin.com/in/hipertension-pulmonar-655a43253")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">LinkedIn</p>
                      <p className="text-accent hover:underline text-sm">linkedin.com/in/hipertension-pulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("https://www.facebook.com/share/16s5MUKG3C/?mibextid=wwXIfr")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📘</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">Facebook</p>
                      <p className="text-accent hover:underline text-sm">facebook.com/hipertensionpulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("https://instagram.com/magisterenhipertensionpulmonar")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">📸</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">Instagram</p>
                      <p className="text-accent hover:underline text-sm">@magisterenhipertensionpulmonar</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 cursor-pointer group p-3 rounded-lg hover:bg-primary/5 transition-all duration-300" onClick={() => redirectTo("https://www.maestriacp.com/")}>
                    <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">Campus Virtual</p>
                      <p className="text-accent hover:underline text-sm">www.maestriacp.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-accent/20 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
              <CardContent className="pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Envíanos un Mensaje</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Tu nombre completo" 
                      required 
                      className="border-accent/20 focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="tu@email.com" 
                      required 
                      className="border-accent/20 focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Input 
                      id="country" 
                      name="country" 
                      value={formData.country} 
                      onChange={handleChange} 
                      placeholder="Tu país" 
                      required 
                      className="border-accent/20 focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Input 
                      id="specialty" 
                      name="specialty" 
                      value={formData.specialty} 
                      onChange={handleChange} 
                      placeholder="Ej: Cardiología" 
                      required 
                      className="border-accent/20 focus:border-accent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Escribe tu mensaje aquí..." 
                      rows={5} 
                      required 
                      className="border-accent/20 focus:border-accent transition-all duration-300 resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 rounded-full hover:scale-105 transition-all duration-300 shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "✉️ Enviar Mensaje"}
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
