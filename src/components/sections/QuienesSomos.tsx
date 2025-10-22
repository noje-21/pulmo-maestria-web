import logoMaestria from "@/assets/logo-maestria.jpg";

export const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
          Quiénes Somos
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={logoMaestria} 
              alt="Logo Maestría" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary">
              Nuestra Misión
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              La Maestría Latinoamericana en Circulación Pulmonar nace con el objetivo de formar 
              especialistas de excelencia en el diagnóstico y tratamiento de enfermedades vasculares 
              pulmonares, un campo en constante evolución que requiere actualización continua y 
              conocimientos multidisciplinarios.
            </p>
            
            <h3 className="text-2xl font-semibold text-primary">
              Instituciones Colaboradoras
            </h3>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span><strong>Centro Gallego de Buenos Aires</strong> - Sede principal del programa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span><strong>sanatorio trinidad de quilmes</strong> -</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span><strong>hospital Maria Ferrer</strong> -</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">✓</span>
                <span><strong>Red BASA</strong> -</span>
              </li>
            </ul>
            
            <h3 className="text-2xl font-semibold text-primary">
              Nuestro Compromiso
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              Ofrecer formación de alta calidad basada en evidencia científica actualizada, 
              combinando teoría y práctica para capacitar profesionales capaces de impactar 
              positivamente en la salud cardiovascular de la región.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
