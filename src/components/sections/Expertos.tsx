import { Card, CardContent } from "@/components/ui/card";
import Nicolas from "@/assets/nicolas.jpg";
import Fabian from "@/assets/fabiam.jpg";
import Guille from "@/assets/guillermo.jpg";
import Marce from "@/assets/marcelo.jpg";
import Adri from "@/assets/adrien.jpg";
import Alejo from "@/assets/alejandro.jpg";
import Julie from "@/assets/julieta.jpg";
import GuilleS from "@/assets/guillermina.jpg";


const expertos = [
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
    nombre: "Dr. Adrián José Lescano",
    cargo: "Directo de Maestria · Médico Cardiólogo · Magíster en Hipertensión Pulmonar · Magíster en Efectividad Clínica · Especialista en Ultrasonografía Cardiovascular",
    especialidad: "Fundación Favaloro · Instituto de Efectividad Clínica y Sanitaria (IECS)",
    imagen: Adri
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
  }
];
export const Expertos = () => {
  return (
    <section id="expertos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
          Expertos
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Docentes de reconocimiento internacional en el campo de la circulación pulmonar
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertos.map((experto, index) => (
            <Card
              key={index}
              className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg"
            >
              <CardContent className="pt-6 flex flex-col items-center text-center">
                {/* Imagen del experto */}
                {experto.imagen ? (
                  <img
                    src={experto.imagen}
                    alt={experto.nombre}
                    className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-primary/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl text-white">👨‍⚕️</span>
                  </div>
                )}

                {/* Información */}
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {experto.nombre}
                </h3>
                <p className="text-accent font-medium mb-2">{experto.cargo}</p>
                <p className="text-sm text-muted-foreground">
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