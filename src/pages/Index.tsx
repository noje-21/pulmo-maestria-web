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
import MobileFunnelCTA from "@/components/common/MobileFunnelCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <SkipLink />
      <Navigation />
      
      <main id="main-content">
        {/* PASO 1: Entrada - Hero Emocional */}
        <Hero />
        
        {/* PASO 2: Contexto - ¿Qué es y para quién? */}
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
        
        {/* PASO 3: Validación - Social Proof */}
        <AnimatedOnView>
          <Testimonios />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <QuienesSomos />
        </AnimatedOnView>
        
        <AnimatedOnView>
          <Galeria />
        </AnimatedOnView>
        
        {/* PASO 4: Decisión - CTA Final */}
        <CTAFinal />
        
        {/* PASO 5: Acción - Contacto/Inscripción */}
        <AnimatedOnView>
          <Contacto />
        </AnimatedOnView>
      </main>
      
      <Footer />
      
      {/* CTA Fijo Mobile - Funnel de Conversión */}
      <MobileFunnelCTA />
    </div>
  );
};

export default Index;
