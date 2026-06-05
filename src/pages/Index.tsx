import { lazy, Suspense } from "react";
import Navigation from "@/components/common/Navigation";
import AnimatedOnView from "@/components/common/AnimatedOnView";
import { SEO } from "@/components/common/SEO";
import { SkipLink } from "@/components/common/SkipLink";
import { HeroFlyer } from "@/components/sections/HeroFlyer";
import { Footer } from "@/components/sections/Footer";

// Lazy-loaded sections (below the fold)
const Hero = lazy(() => import("@/components/sections/Hero").then(m => ({ default: m.Hero })));
const Maestria = lazy(() => import("@/components/sections/Maestria").then(m => ({ default: m.Maestria })));
const EjesFormacion = lazy(() => import("@/components/sections/EjesFormacion").then(m => ({ default: m.EjesFormacion })));
const Eventos = lazy(() => import("@/components/sections/Eventos").then(m => ({ default: m.Eventos })));
const Testimonios = lazy(() => import("@/components/sections/Testimonios").then(m => ({ default: m.Testimonios })));
const Galeria = lazy(() => import("@/components/sections/Galeria"));


const Contacto = lazy(() => import("@/components/sections/Contacto").then(m => ({ default: m.Contacto })));
const ScrollInvitation = lazy(() => import("@/components/common/ScrollInvitation").then(m => ({ default: m.ScrollInvitation })));
const SectionDivider = lazy(() => import("@/components/common/SectionDivider").then(m => ({ default: m.SectionDivider })));

// Lazy-loaded floating widgets (deferred until after first paint to keep TBT/LCP low)
const MobileFunnelCTA = lazy(() => import("@/components/common/MobileFunnelCTA"));
const WhatsAppButton = lazy(() => import("@/components/common/WhatsAppButton").then(m => ({ default: m.WhatsAppButton })));
const AIAssistant = lazy(() => import("@/components/common/AIAssistant").then(m => ({ default: m.AIAssistant })));

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <SkipLink />
      <Navigation />
      
      <main id="main-content">
        {/* PASO 1: Entrada - Hero Flyer (protagonista) */}
        <HeroFlyer />
        <Hero />
        
        {/* All below-the-fold sections lazy-loaded */}
        <Suspense fallback={null}>
          {/* PASO 2: Contexto */}
          <AnimatedOnView>
            <Maestria />
          </AnimatedOnView>
          
          <SectionDivider variant="dots" className="my-4" />
          
          <AnimatedOnView>
            <EjesFormacion />
          </AnimatedOnView>
          
          <ScrollInvitation text="Conoce los eventos" targetId="eventos" />
          
          <AnimatedOnView>
            <Eventos />
          </AnimatedOnView>
          
          {/* PASO 3: Validación - Social Proof */}
          <SectionDivider variant="dots" className="my-4" />
          
          <AnimatedOnView>
            <Testimonios />
          </AnimatedOnView>


          <AnimatedOnView>
            <Galeria />
          </AnimatedOnView>
          
          
          {/* PASO 5: Acción - Contacto/Inscripción */}
          <AnimatedOnView>
            <Contacto />
          </AnimatedOnView>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* Floating widgets — non-critical, loaded after main content */}
      <Suspense fallback={null}>
        <MobileFunnelCTA />
        <WhatsAppButton />
        <AIAssistant />
      </Suspense>
    </div>
  );
};

export default Index;
