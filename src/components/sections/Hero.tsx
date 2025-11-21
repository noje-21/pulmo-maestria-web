import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner.jpg";
export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Sección principal">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Maestría en Circulación Pulmonar - Formación médica especializada en Buenos Aires" 
          className="w-full h-full object-cover" 
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-background/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 animate-fade-in leading-tight">
          Maestría Latinoamericana en
          <br className="hidden sm:block" />
          <span className="text-accent">Circulación Pulmonar 2025</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 sm:mb-6 max-w-3xl mx-auto animate-fade-in px-2" style={{
        animationDelay: '0.2s'
      }}>
          Formación intensiva dirigida a internistas, cardiólogos, reumatólogos y neumonólogos
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-6 sm:mb-8 text-base sm:text-lg text-white/90 animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300" role="text" aria-label="Fecha del evento">
            <span className="text-accent text-xl sm:text-2xl" aria-hidden="true">📅</span>
            <span className="font-semibold text-sm sm:text-base">3-15 de noviembre 2025</span>
          </div>
          <div className="hidden sm:block text-accent text-2xl" aria-hidden="true">•</div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300" role="text" aria-label="Ubicación del evento">
            <span className="text-accent text-xl sm:text-2xl" aria-hidden="true">📍</span>
            <span className="font-semibold text-sm sm:text-base">Buenos Aires, Argentina</span>
          </div>
        </div>

        <div className="animate-fade-in" style={{
        animationDelay: '0.6s'
      }}>
          <Button 
            size="lg" 
            onClick={() => window.location.href = "https://www.maestriacp.com/"}
            aria-label="Acceder al Campus Virtual"
            className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 bg-accent hover:bg-accent/90 text-white shadow-large hover:scale-105 transition-all duration-300 font-bold rounded-full"
          >
            Ver Campus Virtual
          </Button>
        </div>
      </div>
    </section>;
};