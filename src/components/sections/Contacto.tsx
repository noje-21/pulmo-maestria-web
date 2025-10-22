import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre debe tener menos de 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "El email debe tener menos de 255 caracteres"),
  country: z.string().trim().min(1, "El país es requerido").max(100, "El país debe tener menos de 100 caracteres"),
  specialty: z.string().trim().min(1, "La especialidad es requerida").max(100, "La especialidad debe tener menos de 100 caracteres"),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000, "El mensaje debe tener menos de 2000 caracteres")
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
      // Validate form data
      const validated = contactSchema.parse(formData);

      const { error } = await supabase
        .from("contact_submissions")
        .insert([{
          name: validated.name,
          email: validated.email,
          country: validated.country,
          specialty: validated.specialty,
          message: validated.message
        }]);

      if (error) throw error;

      toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
      setFormData({
        name: "",
        email: "",
        country: "",
        specialty: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error("Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
          Contacto
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          ¿Tienes preguntas? Contáctanos
        </p>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold text-primary mb-6">
                  Información de Contacto
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a 
                        href="mailto:magisterenhipertensionpulmonar@gmail.com"
                        className="text-accent hover:underline"
                      >
                        magisterenhipertensionpulmonar@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-medium text-foreground">WhatsApp</p>
                      <a 
                        href="https://wa.me/573004142568"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        +57 300 414 2568
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="font-medium text-foreground">Instagram</p>
                      <a 
                        href="https://instagram.com/magisterenhipertensionpulmonar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        @magisterenhipertensionpulmonar
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <p className="font-medium text-foreground">Sitio Web</p>
                      <a 
                        href="https://www.circulacionpulmonar.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        www.circulacionpulmonar.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nombre Completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Correo Electrónico *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                      País *
                    </label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Tu país"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium mb-2">
                      Especialidad *
                    </label>
                    <Input
                      id="specialty"
                      name="specialty"
                      required
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="Ej: Cardiología, Medicina Interna..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={loading}
                  >
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
