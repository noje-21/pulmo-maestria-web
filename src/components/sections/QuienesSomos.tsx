import logoMaestria from "@/assets/logo-maestria.jpg";

export const QuienesSomos = () => {
  return (
    <section id="quienes-somos" className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center animate-fade-in">
          Quiénes Somos
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <img 
              src={logoMaestria} 
              alt="Logo Maestría Latinoamericana en Circulación Pulmonar" 
              className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border-4 border-primary/10 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          
          <div className="space-y-8">
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Nuestra Misión
                </h3>
              </div>
              <p className="text-foreground/80 leading-relaxed pl-11">
                La Maestría Latinoamericana en Circulación Pulmonar nace con el objetivo de formar 
                especialistas de excelencia en el diagnóstico y tratamiento de enfermedades vasculares 
                pulmonares, un campo en constante evolución que requiere actualización continua y 
                conocimientos multidisciplinarios.
              </p>
            </div>
            
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Instituciones Colaboradoras
                </h3>
              </div>
              <ul className="space-y-4 text-foreground/80 pl-11">
                <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="text-accent mt-1 text-xl">✓</span>
                  <span><strong className="text-primary">Centro Gallego de Buenos Aires</strong> - Sede principal del programa</span>
                </li>
                <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="text-accent mt-1 text-xl">✓</span>
                  <span><strong className="text-primary">Sanatorio Trinidad de Quilmes</strong> - Centro de práctica clínica</span>
                </li>
                <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="text-accent mt-1 text-xl">✓</span>
                  <span><strong className="text-primary">Hospital María Ferrer</strong> - Referente en enfermedades respiratorias</span>
                </li>
                <li className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                  <span className="text-accent mt-1 text-xl">✓</span>
                  <span><strong className="text-primary">Red BASA</strong> - Red de instituciones de salud</span>
                </li>
              </ul>
            </div>
            
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Nuestro Compromiso
                </h3>
              </div>
              <p className="text-foreground/80 leading-relaxed pl-11">
                Ofrecer formación de alta calidad basada en evidencia científica actualizada, 
                combinando teoría y práctica para capacitar profesionales capaces de impactar 
                positivamente en la salud cardiovascular de la región.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};