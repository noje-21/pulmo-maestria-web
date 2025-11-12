import { Card, CardContent } from "@/components/ui/card";
import Nicolas from "@/assets/nicolas.jpg";
import Fabian from "@/assets/fabiam.jpg";
import Guille from "@/assets/guillermo.jpg";
import Marce from "@/assets/marcelo.jpg";
import Adri from "@/assets/adrien.jpg";
import Alejo from "@/assets/alejandro.jpg";
import Julie from "@/assets/julieta.jpg";
import GuilleS from "@/assets/guillermina.jpg";
import Dora from "@/assets/dora.jpg";


const expertos = [
  {
    nombre: "Dr. Adrián José Lescano",
    cargo: "Director de Maestría · Médico Cardiólogo · Magíster en Hipertensión Pulmonar · Magíster en Efectividad Clínica · Especialista en Ultrasonografía Cardiovascular",
    especialidad: "Fundación Favaloro · Instituto de Efectividad Clínica y Sanitaria (IECS)",
    imagen: Adri
  },
  {
    nombre: "Dr. Nicolás Caruso",
    cargo: "Especialista en Cardiología y Medicina del Deporte",
    especialidad: "Sanatorio de La Trinidad Mitre · Universidad de Buenos Aires",
    imagen: Nicolas
  },
  {
    nombre: "Dr. Fabián Caro",
    cargo: "Jefe de Sección de Enfermedades Pulmonares Intersticiales Difusas (EPID)",
    especialidad: "Hospital María Ferrer · Universidad de Buenos Aires",
    imagen: Fabian
  },
  {
    nombre: "Dr. Guillermo Bortman",
    cargo: "Ex Director de Transplantes y Unidad de Cardiología y Cirugía Cardiovascular; Jefe del Servicio de Insuficiencia Cardíaca e Hipertensión Pulmonar",
    especialidad: "Hospital de Alta Complejidad Médica Juan Domingo Perón · Sanatorio Trinidad Mitre · Sanatorio Trinidad Palermo",
    imagen: Guille
  },
  {
    nombre: "Dr. Marcelo Nahin",
    cargo: "Jefe de Cirugía Cardiovascular",
    especialidad: "Hospital de Alta Complejidad en Red 'El Cruce' · Especialista en Medicina Legal",
    imagen: Marce
  },
  {
    nombre: "Dr. Alejandro Nitsche",
    cargo: "Líder Médico y Experto en Hipertensión Pulmonar y Enfermedad Pulmonar Intersticial en Enfermedades del Tejido Conectivo",
    especialidad: "Hospital Alemán · SAPEM · Asociación Médica Argentina (AMA)",
    imagen: Alejo
  },
  {
    nombre: "Dra. Julieta Soricetti",
    cargo: "Médica Cardióloga · Magíster en Hipertensión Pulmonar · Especialista Universitaria en Insuficiencia Cardíaca",
    especialidad: "Universidad de Buenos Aires",
    imagen: Julie
  },
  {
    nombre: "Dra. Guillermina Soracio",
    cargo: "Cardióloga · Magíster en Hipertensión Pulmonar",
    especialidad: "Presidente Electa del Consejo Argentino de Insuficiencia Cardíaca e Hipertensión Pulmonar",
    imagen: GuilleS
  },
  {
    nombre: "Dra. Dora Hagg",
    cargo: "Coordinadora del Área de Insuficiencia Cardíaca-Hipertensión Pulmonar-Trasplante Cardíaco",
    especialidad: "Hospital de Pediatría 'Prof. Dr. Juan P. Garrahan'",
    imagen: Dora
  }
];
export const Expertos = () => {
  return (
    <section id="expertos" className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Nuestros Expertos
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"></div>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Docentes de reconocimiento internacional en el campo de la circulación pulmonar
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertos.map((experto, index) => (
            <Card
              key={index}
              className="border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-card/50 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                {experto.imagen ? (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <img
                      src={experto.imagen}
                      alt={experto.nombre}
                      className="relative w-32 h-32 object-cover rounded-full border-4 border-primary/30 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-3xl text-white">👨‍⚕️</span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {experto.nombre}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mb-3"></div>
                <p className="text-accent font-semibold mb-3 text-sm">{experto.cargo}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {experto.especialidad}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};