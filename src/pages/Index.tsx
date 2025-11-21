import Navigation from "@/components/Navigation";
import AnimatedOnView from "@/components/AnimatedOnView";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/Hero";
import { Maestria } from "@/components/sections/Maestria";
import { Expertos } from "@/components/sections/Expertos";
import { Eventos } from "@/components/sections/Eventos";
import { QuienesSomos } from "@/components/sections/QuienesSomos";
import Galeria from "@/components/sections/Galeria";
import { Contacto } from "@/components/sections/Contacto";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <Navigation />
      <Hero />
      <AnimatedOnView>
        <Maestria />
      </AnimatedOnView>
      <AnimatedOnView>
        <Expertos />
      </AnimatedOnView>
      <AnimatedOnView>
        <Eventos />
      </AnimatedOnView>
      <AnimatedOnView>
        <QuienesSomos />
      </AnimatedOnView>
      <AnimatedOnView>
        <Galeria />
      </AnimatedOnView>
      <AnimatedOnView>
        <Contacto />
      </AnimatedOnView>
      <Footer />
    </div>
  );
};

export default Index;
