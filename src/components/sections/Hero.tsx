import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banner.jpg";
export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Maestría en Circulación Pulmonar - Formación médica especializada en Buenos Aires" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-background/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
          Maestría Latinoamericana en
          <br />
          <span className="text-accent animate-pulse">Circulación Pulmonar 2025</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          Formación intensiva dirigida a internistas, cardiólogos, reumatólogos y neumonólogos
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8 text-lg text-white/90 animate-fade-in" style={{
        animationDelay: '0.4s'
      }}>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
            <span className="text-accent text-2xl">
          </span>
            <span className="font-semibold">3-15 de noviembre 2025</span>
          </div>
          <div className="hidden sm:block text-accent text-2xl">•</div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
            <span className="text-accent text-2xl">
          </span>
            <span className="font-semibold">Buenos Aires, Argentina</span>
          </div>
        </div>

        <div className="animate-fade-in" style={{
        animationDelay: '0.6s'
      }}>
          <Button size="lg" onClick={() => window.location.href = "https://www.maestriacp.com/"} className="text-lg px-10 py-7 bg-accent hover:bg-accent/90 text-white shadow-glow hover:scale-105 transition-all duration-300 font-bold rounded-full">Ver Campus Virtual</Button>
        </div>
      </div>
    </section>;
};