export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Maestría en Circulación Pulmonar</h3>
            <p className="text-white/80">
              Formación de excelencia en enfermedades vasculares pulmonares
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-white/80 hover:text-accent transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#maestria" className="text-white/80 hover:text-accent transition-colors">
                  Maestría
                </a>
              </li>
              <li>
                <a href="#expertos" className="text-white/80 hover:text-accent transition-colors">
                  Expertos
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-white/80 hover:text-accent transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="mailto:magisterenhipertensionpulmonar@gmail.com" className="hover:text-accent transition-colors">
                  magisterenhipertensionpulmonar@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/573004142568" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  +57 300 414 2568
                </a>
              </li>
              <li>
                <a href="https://instagram.com/magisterenhipertensionpulmonar" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  @magisterenhipertensionpulmonar
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>© 2025 Maestría Latinoamericana en Circulación Pulmonar – Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
