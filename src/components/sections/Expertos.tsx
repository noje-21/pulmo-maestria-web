import { Card, CardContent } from "@/components/ui/card";

const expertos = [
  {
    nombre: "Dr. Adrián Lescano",
    cargo: "Director de la Maestría",
    especialidad: "Cardiólogo - Especialista en Circulación Pulmonar"
  },
  {
    nombre: "Dr. Tomás Vanegas",
    cargo: "Coordinador General",
    especialidad: "Internista - Hipertensión Pulmonar"
  },
  {
    nombre: "Dra. María Elena Soto",
    cargo: "Docente",
    especialidad: "Cardióloga - Investigadora Clínica"
  },
  {
    nombre: "Dr. Carlos Jerjes Sánchez",
    cargo: "Docente",
    especialidad: "Cardiólogo - Tromboembolia Pulmonar"
  },
  {
    nombre: "Dr. Juan Pablo Arroyo",
    cargo: "Docente",
    especialidad: "Cardiólogo - Ecocardiografía"
  },
  {
    nombre: "Dr. Julio Sandoval",
    cargo: "Docente",
    especialidad: "Cardiólogo - Hipertensión Pulmonar"
  },
  {
    nombre: "Dr. Julio Sandoval",
    cargo: "Docente",
    especialidad: "Cardiólogo - Hipertensión Pulmonar"
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
            <Card key={index} className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl text-white">👨‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold text-primary text-center mb-2">
                  {experto.nombre}
                </h3>
                <p className="text-accent font-medium text-center mb-2">
                  {experto.cargo}
                </p>
                <p className="text-sm text-muted-foreground text-center">
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
