import Navigation from "@/components/common/Navigation";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { Hero } from "@/components/sections/Hero";
import { Diferenciales } from "@/components/sections/Diferenciales";
import { Maestria } from "@/components/sections/Maestria";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Expertos } from "@/components/sections/Expertos";
import { Eventos } from "@/components/sections/Eventos";
import { Testimonios } from "@/components/sections/Testimonios";
import { QuienesSomos } from "@/components/sections/QuienesSomos";
import Galeria from "@/components/sections/Galeria";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { Contacto } from "@/components/sections/Contacto";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <SkipLink />
      <Navigation />
      
      <main id="main-content">
        <Hero />
        
        <AnimatedOnView>
          <Diferenciales />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Maestria />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <ComoFunciona />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Expertos />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Eventos />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Testimonios />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <QuienesSomos />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Galeria />
        </AnimatedOnView>
        
        <CTAFinal />
        
        <AnimatedOnView>
          <Contacto />
        </AnimatedOnView>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
