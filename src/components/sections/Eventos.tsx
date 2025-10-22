import { Card, CardContent } from "@/components/ui/card";

const eventos = [
  {
    fecha: "3-4 de noviembre 2025",
    titulo: "Introducción y fundamentos de la circulación pulmonar",
    descripcion: "Anatomía y fisiología de la circulación pulmonar. Bases hemodinámicas y Todos los grupos de HTP, estudios iniciales, abordaje inicial."
  },
  {
    fecha: "5-7 de noviembre 2025",
    titulo: "Talleres prácticos",
    descripcion: "Ecocardiografia, ECG, Hemodinamia y CCD, intersticiopatias, Enf Reumatológicas, Estudios de función pulmonar, etc."
  },
  {
    fecha: "8-10 de noviembre 2025",
    titulo: "Clasificación de riesgos, diagnóstico y tratamiento Pulmonar",
    descripcion: "Diagnóstico avanzado, estratificación de riesgo y manejo terapéutico."
  },
  {
    fecha: "11-13 de noviembre 2025",
    titulo: "Casos Clínicos y Talleres",
    descripcion: "Últimas novedades, avances tecnológicos, IA, bioestadistica avanzada e interpretación de Trials."
  },
  {
    fecha: "14-15 de noviembre 2025",
    titulo: "Investigación y Cierre",
    descripcion: "Simposio latinoamericano de hipertensión pulmonar: expertos nacionales e internacionales, evento certificado."
  }
];

export const Eventos = () => {
  return (
    <section id="eventos" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
          Calendario
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Programa académico del 3 al 15 de noviembre 2025
        </p>
        
        <div className="space-y-6">
          {eventos.map((evento, index) => (
            <Card key={index} className="border-l-4 border-l-accent hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-lg font-semibold">
                      {evento.fecha}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {evento.titulo}
                    </h3>
                    <p className="text-muted-foreground">
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
