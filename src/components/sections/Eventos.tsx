import { Card, CardContent } from "@/components/ui/card";

const eventos = [
  {
    fecha: "3-4 de noviembre 2025",
    titulo: "Introducción y fundamentos de la circulación pulmonar",
    descripcion: "Anatomía y fisiología de la circulación pulmonar. Bases hemodinámicas y Todos los grupos de HTP, estudios iniciales, abordaje inicial."
  },
  {
    fecha: "5-7 de noviembre 2025",
    titulo: "Circuito práctico",
    descripcion: "Ecocardiografía, ECG, Hemodinámica y CCD, intersticiopatías, Enfermedades Reumatológicas, Estudios de función pulmonar, etc."
  },
  {
    fecha: "8-10 de noviembre 2025",
    titulo: "Clasificación de riesgos, diagnóstico y tratamiento Pulmonar",
    descripcion: "Diagnóstico avanzado, estratificación de riesgo y manejo terapéutico."
  },
  {
    fecha: "11-13 de noviembre 2025",
    titulo: "Casos Clínicos y Talleres",
    descripcion: "Últimas novedades, avances tecnológicos, IA, bioestadística avanzada e interpretación de Trials."
  },
  {
    fecha: "14-15 de noviembre 2025",
    titulo: "Simposio Latinoamericano de Hipertensión Pulmonar",
    descripcion: "Clausura y examen final."
  }
];

export const Eventos = () => {
  return (
    <section id="eventos" className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Calendario Académico
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Programa académico del 3 al 15 de noviembre 2025
        </p>
        
        <div className="space-y-6">
          {eventos.map((evento, index) => (
            <Card 
              key={index} 
              className="border-l-4 border-l-accent hover:border-l-primary hover:shadow-2xl transition-all duration-300 hover:-translate-x-2 bg-gradient-to-r from-card to-card/50 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-56 flex-shrink-0">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-br from-accent/20 to-accent/10 text-accent px-5 py-3 rounded-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300 border-2 border-accent/20">
                      <span className="text-lg">📅</span>
                      <span>{evento.fecha}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {evento.titulo}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {evento.descripcion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};