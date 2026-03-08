import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle } from "lucide-react";

const instituciones = [
  { nombre: "Centro Gallego de Buenos Aires", rol: "Sede principal del programa" },
  { nombre: "Sanatorio Trinidad de Quilmes", rol: "Centro de práctica clínica" },
  { nombre: "Hospital María Ferrer", rol: "Referente en enfermedades respiratorias" },
  { nombre: "Red BASA", rol: "Red de instituciones de salud" }
];

export const InstitucionesColaboradoras = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <Card className="card-base bg-card">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">
                  Instituciones Colaboradoras
                </h3>
              </div>
              <ul className="space-y-3">
                {instituciones.map((inst, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                        {inst.nombre}
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">
                        — {inst.rol}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
